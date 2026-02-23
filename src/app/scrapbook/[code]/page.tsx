import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Scrapbook, Photo } from '@/types/scrapbook';
import ScrapbookMain from './components/scrapbook-main';
import { createClient } from '@/lib/supabase/server';

async function fetchScrapbook(code: string): Promise<{
    success: boolean;
    scrapbook: Scrapbook | null;
}> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('scrapbooks')
            .select('*, photos(*)')
            .eq('code', code)
            .single();

        if (error) throw error;

        // Map DB rows to app types (taken_at/created_at come back as strings from Supabase)
        const scrapbook: Scrapbook = {
            id: data.id,
            code: data.code,
            title: data.title,
            note: data.note ?? undefined,
            sender_name: data.sender_name ?? undefined,
            music_id: data.music_id ?? undefined,
            is_published: data.is_published,
            created_at: new Date(data.created_at),
            photos: ((data as Record<string, unknown>).photos as Array<Record<string, unknown>>)
                .map((p): Photo => ({
                    id: p.id as string,
                    scrapbook_id: p.scrapbook_id as string,
                    url: p.url as string,
                    order: p.order as number,
                    caption: (p.caption as string) ?? undefined,
                    location: (p.location as string) ?? undefined,
                    taken_at: p.taken_at ? new Date(p.taken_at as string) : undefined,
                    created_at: new Date(p.created_at as string),
                }))
                .sort((a, b) => a.order - b.order),
        };
        return { success: true, scrapbook };
    } catch (error) {
        console.error('Error fetching scrapbook:', error);
        return { success: false, scrapbook: null };
    }
}

export default async function ScrapbookPage({
    params,
}: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;
    const { success, scrapbook } = await fetchScrapbook(code);

    if (!success || !scrapbook) {
        throw new Error('Failed to fetch scrapbook');
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-8 md:p-12 w-full">
            <div className="max-w-5xl w-full mx-auto">
                {/* Back to Home Button */}
                <Link href="/">
                    <Button
                        variant="ghost"
                        className="-ml-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </Link>
                {/* Scrapbook Main */}
                <ScrapbookMain scrapbook={scrapbook} />
            </div>
        </div>
    );
}
