'use client';
import { Scrapbook } from '@/types/scrapbook';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MusicPlayer } from '@/components/music-player';
import { BookViewer } from '@/components/book-viewer';
import { toast } from 'sonner';

export default function ScrapbookMain({ scrapbook }: { scrapbook: Scrapbook }) {
    const handleShare = async () => {
        const url = window.location.href;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard!');
            } else {
                const input = document.createElement('input');
                input.value = url;
                input.style.position = 'fixed';
                input.style.opacity = '0';
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
                toast.success('Link copied to clipboard!');
            }
        } catch {
            toast.error('Could not copy link. Please copy the URL manually.');
        }
    };

    return (
        <div className="flex flex-col w-full items-center justify-center space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-4 pb-6 border-b w-full">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-serif italic text-gray-900">
                            {scrapbook.title}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            View and share this scrapbook
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {(scrapbook.music_id || scrapbook.custom_music_url) && (
                        <MusicPlayer
                            songId={scrapbook.music_id}
                            src={scrapbook.custom_music_url}
                            autoPlay={false}
                        />
                    )}
                    <Button
                        onClick={handleShare}
                        aria-label="Share scrapbook link"
                        className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 w-full md:w-auto"
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                </div>
            </div>

            <BookViewer data={scrapbook} />
        </div>
    );
}
