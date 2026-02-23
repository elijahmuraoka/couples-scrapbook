import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';
import { headers } from 'next/headers';

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter (per-IP, resets each window)
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // max 5 creates per IP per hour

const ipHits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = ipHits.get(ip);

    if (!entry || now > entry.resetAt) {
        ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }

    entry.count += 1;
    return entry.count > RATE_LIMIT_MAX;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
function validateBody(body: unknown): {
    ok: boolean;
    error?: string;
    data?: {
        title: string;
        note: string | null;
        senderName: string | null;
        selectedSongId: string | null;
    };
} {
    if (typeof body !== 'object' || body === null) {
        return { ok: false, error: 'Invalid request body' };
    }

    const b = body as Record<string, unknown>;

    // title — required, non-empty string, max 100 chars
    if (typeof b.title !== 'string' || b.title.trim().length === 0) {
        return { ok: false, error: 'Title is required' };
    }
    if (b.title.length > 100) {
        return { ok: false, error: 'Title must be 100 characters or less' };
    }

    // note — optional string, max 1000 chars
    const note =
        b.note === null || b.note === undefined ? null : b.note;
    if (note !== null && typeof note !== 'string') {
        return { ok: false, error: 'Note must be a string or null' };
    }
    if (typeof note === 'string' && note.length > 1000) {
        return { ok: false, error: 'Note must be 1000 characters or less' };
    }

    // senderName — optional string, max 50 chars
    const senderName =
        b.senderName === null || b.senderName === undefined
            ? null
            : b.senderName;
    if (senderName !== null && typeof senderName !== 'string') {
        return { ok: false, error: 'Sender name must be a string or null' };
    }
    if (typeof senderName === 'string' && senderName.length > 50) {
        return {
            ok: false,
            error: 'Sender name must be 50 characters or less',
        };
    }

    // selectedSongId — optional string, max 100 chars
    const selectedSongId =
        b.selectedSongId === null || b.selectedSongId === undefined
            ? null
            : b.selectedSongId;
    if (selectedSongId !== null && typeof selectedSongId !== 'string') {
        return { ok: false, error: 'Song ID must be a string or null' };
    }
    if (typeof selectedSongId === 'string' && selectedSongId.length > 100) {
        return { ok: false, error: 'Song ID too long' };
    }

    return {
        ok: true,
        data: {
            title: b.title as string,
            note: note as string | null,
            senderName: senderName as string | null,
            selectedSongId: selectedSongId as string | null,
        },
    };
}

// ---------------------------------------------------------------------------
// POST /api/scrapbooks — Create a new scrapbook
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
    try {
        // Rate limit by IP
        const hdrs = await headers();
        const ip =
            hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ??
            hdrs.get('x-real-ip') ??
            'unknown';

        if (isRateLimited(ip)) {
            return Response.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Parse & validate
        const body = await req.json();
        const validation = validateBody(body);

        if (!validation.ok) {
            return Response.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        const { title, note, senderName, selectedSongId } = validation.data!;

        const supabase = await createClient();
        const code = nanoid(10);

        const { data: scrapbook, error: scrapbookError } = await supabase
            .from('scrapbooks')
            .insert({
                title,
                note,
                sender_name: senderName,
                code,
                music_id: selectedSongId,
                is_published: true,
            })
            .select()
            .single();

        if (scrapbookError) throw scrapbookError;

        return Response.json({
            scrapbookId: scrapbook.id,
            code: scrapbook.code,
        });
    } catch (error) {
        console.error('Publishing error:', error);
        return Response.json(
            { error: 'Failed to publish scrapbook' },
            { status: 500 }
        );
    }
}
