import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

// Rate limiting handled by Vercel/infrastructure layer

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
        customMusicUrl: string | null;
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

    // customMusicUrl — optional string URL, max 1000 chars
    const customMusicUrl =
        b.customMusicUrl === null || b.customMusicUrl === undefined
            ? null
            : b.customMusicUrl;
    if (customMusicUrl !== null && typeof customMusicUrl !== 'string') {
        return { ok: false, error: 'Custom music URL must be a string or null' };
    }
    if (typeof customMusicUrl === 'string' && customMusicUrl.length > 1000) {
        return { ok: false, error: 'Custom music URL too long' };
    }

    return {
        ok: true,
        data: {
            title: String(b.title),
            note: note !== null ? String(note) : null,
            senderName: senderName !== null ? String(senderName) : null,
            selectedSongId: selectedSongId !== null ? String(selectedSongId) : null,
            customMusicUrl: customMusicUrl !== null ? String(customMusicUrl) : null,
        },
    };
}

// ---------------------------------------------------------------------------
// POST /api/scrapbooks — Create a new scrapbook
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
    try {
        // Parse & validate
        const body = await req.json();
        const validation = validateBody(body);

        if (!validation.ok) {
            return Response.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        const { title, note, senderName, selectedSongId, customMusicUrl } = validation.data!;

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
                custom_music_url: customMusicUrl,
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

// ---------------------------------------------------------------------------
// DELETE /api/scrapbooks — Delete a scrapbook by code (rollback cleanup)
// ---------------------------------------------------------------------------
export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const code = url.searchParams.get('code');
        if (!code) {
            return Response.json({ error: 'Code required' }, { status: 400 });
        }

        const supabase = await createClient();

        const { data: scrapbook } = await supabase
            .from('scrapbooks')
            .select('id')
            .eq('code', code)
            .single();

        if (!scrapbook) {
            return Response.json({ ok: true }); // Already gone, that's fine
        }

        // Delete photos first (FK constraint), then scrapbook
        await supabase.from('photos').delete().eq('scrapbook_id', scrapbook.id);
        await supabase.from('scrapbooks').delete().eq('id', scrapbook.id);

        return Response.json({ ok: true });
    } catch (error) {
        console.error('Delete error:', error);
        return Response.json({ error: 'Failed to delete scrapbook' }, { status: 500 });
    }
}
