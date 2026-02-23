import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';
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
                sender_name: draft.senderName,
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
