import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';
import { ScrapbookDraft } from '@/types/scrapbook';

// Create a new scrapbook
export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const draft: Omit<ScrapbookDraft, 'previews' | 'selectedFiles'> = body;

        // Generate unique code
        const code = nanoid(10);

        // Create scrapbook record
        const { data: scrapbook, error: scrapbookError } = await supabase
            .from('scrapbooks')
            .insert({
                title: draft.title,
                note: draft.note,
                code,
                music_id: draft.selectedSongId,
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

// Get a scrapbook by code
export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const url = new URL(req.url);
        const code = url.searchParams.get('code');

        if (!code) {
            return NextResponse.json(
                { error: 'Missing code parameter' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('scrapbooks')
            .select('*, photos(*)')
            .eq('code', code)
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching scrapbooks:', error);
        return NextResponse.json(
            { error: 'Error fetching scrapbooks' },
            { status: 500 }
        );
    }
}

// Delete a scrapbook by code
export async function DELETE(req: Request) {
    try {
        const supabase = await createClient();
        const url = new URL(req.url);
        const code = url.searchParams.get('code');

        if (!code) {
            return NextResponse.json(
                { error: 'Missing code parameter' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('scrapbooks')
            .delete()
            .eq('code', code);

        if (error) throw error;

        return NextResponse.json({ message: 'Scrapbook deleted' });
    } catch (error) {
        console.error('Error deleting scrapbook:', error);
        return NextResponse.json(
            { error: 'Error deleting scrapbook' },
            { status: 500 }
        );
    }
}
