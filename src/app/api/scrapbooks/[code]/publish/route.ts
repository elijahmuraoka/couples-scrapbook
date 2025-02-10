import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: { code: string } }
) {
    try {
        const { error } = await supabase
            .from('scrapbooks')
            .update({ is_published: true })
            .eq('code', params.code);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to publish scrapbook' },
            { status: 500 }
        );
    }
} 