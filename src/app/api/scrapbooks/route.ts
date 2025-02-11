import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

// Add this helper function
const fileToBuffer = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
};

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const data = await req.json();
        const code = nanoid(10); // Generate unique code for sharing

        // Upload photos to storage
        const uploadPromises = data.photos.map(
            async (photo: any, index: number) => {
                const fileName = `${code}-${index}.jpg`;
                const { data: uploadData, error: uploadError } =
                    await supabase.storage
                        .from('photos')
                        .upload(fileName, photo.file);

                if (uploadError) throw uploadError;

                const {
                    data: { publicUrl },
                } = supabase.storage.from('photos').getPublicUrl(fileName);

                return {
                    url: publicUrl,
                    caption: photo.caption,
                    metadata: photo.metadata,
                    order: index,
                };
            }
        );

        const uploadedPhotos = await Promise.all(uploadPromises);

        // Save to database
        const { data: scrapbook, error } = await supabase
            .from('scrapbooks')
            .insert({
                code,
                title: data.title,
                note: data.note,
                photos: uploadedPhotos,
                song_id: data.songId,
                is_published: true,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ code });
    } catch (error) {
        console.error('Error creating scrapbook:', error);
        return NextResponse.json(
            { error: 'Failed to create scrapbook' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('scrapbooks')
            .select('*, photos(*)');

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
