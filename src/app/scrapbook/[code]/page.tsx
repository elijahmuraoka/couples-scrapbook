import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Scrapbook } from '@/types/scrapbook';
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

        const scrapbook = data as unknown as Scrapbook;
        scrapbook.photos = scrapbook.photos.sort((a, b) => a.order - b.order);
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
