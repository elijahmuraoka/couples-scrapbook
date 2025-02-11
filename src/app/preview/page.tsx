'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useScrapbookStore } from '@/store/useScrapbookStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { BookViewer } from '@/components/book-viewer';
import { toast } from 'sonner';
import { ArrowLeft, Eye } from 'lucide-react';
import { MusicPlayer } from '@/components/music-player';

export default function PreviewPage() {
    const router = useRouter();
    const { draft, clearDraft } = useScrapbookStore();
    const [isPublishing, setIsPublishing] = useState(false);

    useEffect(() => {
        if (
            !isPublishing &&
            (!draft.title || draft.selectedFiles.length === 0)
        ) {
            router.replace('/create');
            toast.error('Please select photos before previewing');
        }
    }, [draft.title, draft.selectedFiles.length, router, isPublishing]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!isPublishing) {
                // Don't show warning if we're publishing
                e.preventDefault();
                e.returnValue = ''; // Required for Chrome
                return ''; // Required for other browsers
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () =>
            window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isPublishing]);

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            const filePromises = draft.selectedFiles.map(
                async (file, index) => {
                    const response = await fetch(draft.previews[index]);
                    const blob = await response.blob();
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                }
            );

            const base64Files = await Promise.all(filePromises);
            const publishData = {
                ...draft,
                previews: base64Files,
            };

            const response = await fetch('/api/scrapbooks', {
                method: 'POST',
                body: JSON.stringify(publishData),
            });

            if (!response.ok) throw new Error('Failed to publish');

            const { code } = await response.json();

            // Disable the empty files check completely
            setIsPublishing(true);

            // Use router.replace instead of push to prevent back navigation
            router.replace(`/scrapbook/${code}`);
            toast.success('Scrapbook published successfully!');
            clearDraft();
        } catch (error) {
            console.error('Error publishing:', error);
            toast.error('Failed to publish scrapbook');
            setIsPublishing(false); // Only reset on error
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Top Navigation */}
                <Button
                    variant="ghost"
                    className="-ml-2 text-gray-600 hover:text-gray-900"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Editor
                </Button>

                {/* Content Area */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between pb-6 border-b">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-pink-50 rounded-xl">
                                <Eye className="w-8 h-8 text-pink-500" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-serif italic text-gray-900">
                                    Preview Your Scrapbook
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Review your scrapbook before publishing
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {draft.selectedSongId && (
                                <MusicPlayer
                                    songId={draft.selectedSongId}
                                    className="bg-white shadow-sm border border-pink-100 rounded-lg"
                                    autoPlay={true}
                                />
                            )}
                            <Button
                                onClick={handlePublish}
                                disabled={isPublishing}
                                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                            >
                                {isPublishing
                                    ? 'Publishing...'
                                    : 'Publish & Share'}
                            </Button>
                        </div>
                    </div>

                    <BookViewer data={draft} />
                </div>
            </div>
        </div>
    );
}
