import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ScrapbookDraft } from '@/types/scrapbook';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const draft: ScrapbookDraft = body;

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

        // Upload photos and create photo records
        const photoPromises = draft.previews.map(async (preview, index) => {
            const base64Data = preview.split(',')[1];
            const fileData = Buffer.from(base64Data, 'base64');

            const fileName = `${scrapbook.id}/${Date.now()}-${index}.jpg`;

            const { data: uploadData, error: uploadError } =
                await supabase.storage
                    .from('photos')
                    .upload(fileName, fileData, {
                        contentType: 'image/jpeg',
                        cacheControl: '3600',
                    });

            if (uploadError) throw uploadError;

            // Get public URL
            const {
                data: { publicUrl },
            } = supabase.storage.from('photos').getPublicUrl(fileName);

            // Create photo record
            return supabase.from('photos').insert({
                scrapbook_id: scrapbook.id,
                url: publicUrl,
                order: index,
                caption: draft.captions[index],
                taken_at: draft.metadata[index]?.takenAt,
                location: draft.metadata[index]?.location,
            });
        });

        await Promise.all(photoPromises);

        return Response.json({ code: scrapbook.code });
    } catch (error) {
        console.error('Publishing error:', error);
        return Response.json(
            { error: 'Failed to publish scrapbook' },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const url = new URL(req.url);
        const code = url.searchParams.get('code');

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
