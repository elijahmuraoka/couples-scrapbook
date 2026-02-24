'use client';

import { useState, useEffect } from 'react';
import { useScrapbookStore } from '@/store/useScrapbookStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { BookViewer } from '@/components/book-viewer';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { MusicPlayer } from '@/components/music-player';
import { ScrapbookDraft } from '@/types/scrapbook';
import { createClient } from '@/lib/supabase/client';
import confetti from 'canvas-confetti';

async function uploadPhotos(scrapbookId: string, draft: ScrapbookDraft) {
    const supabase = createClient();
    const photoPromises = draft.previews.map(async (blobUrl, index) => {
        // Convert blob URL to base64
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const base64Data = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
                const base64 = base64String.split(',')[1];
                resolve(base64);
            };
            reader.readAsDataURL(blob);
        });

        const fileData = Buffer.from(base64Data, 'base64');
        const fileName = `${scrapbookId}/${Date.now()}-${index}.jpg`;

        const { error: uploadError } = await supabase.storage
            .from('photos')
            .upload(fileName, fileData, {
                contentType: 'image/jpeg',
                cacheControl: '3600',
            });

        if (uploadError) throw uploadError;

        const {
            data: { publicUrl },
        } = supabase.storage.from('photos').getPublicUrl(fileName);

        return supabase.from('photos').insert({
            scrapbook_id: scrapbookId,
            url: publicUrl,
            order: index,
            caption: draft.captions[index],
            taken_at: draft.metadata[index]?.takenAt?.toISOString() ?? null,
            location: draft.metadata[index]?.location,
        });
    });

    await Promise.all(photoPromises);
}

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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { previews, selectedFiles, ...publishData } = draft;

            // Start both operations
            const scrapbookPromise = fetch('/api/scrapbooks', {
                method: 'POST',
                body: JSON.stringify(publishData),
            });

            // Wait for scrapbook creation first
            const response = await scrapbookPromise;
            if (!response.ok)
                throw new Error('Failed to create scrapbook in database');

            const { scrapbookId, code } = await response.json();

            try {
                // Try to upload photos
                await uploadPhotos(scrapbookId, draft);
            } catch (uploadError) {
                // If photo upload fails, delete the scrapbook
                await fetch(`/api/scrapbooks?code=${code}`, {
                    method: 'DELETE',
                });
                throw new Error('Failed to upload photos: ' + uploadError);
            }

            // If we get here, both operations succeeded
            router.replace(`/scrapbook/${code}`);
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Fire confetti!
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ec4899', '#f43f5e', '#fb7185'], // pink shades
            });

            toast.success('Scrapbook published successfully!');
            setTimeout(() => clearDraft(), 0);
        } catch (error) {
            console.error('Error publishing:', error);
            toast.error('Failed to publish scrapbook');
            setIsPublishing(false);
        }
    };

    if (!draft.selectedFiles || draft.selectedFiles.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white px-4 pt-14 pb-8 md:p-12">
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
                <div className="space-y-6 w-full">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center md:justify-between pb-6 border-b w-full">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-4xl font-serif italic text-gray-900">
                                    Preview Your Scrapbook
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Review your scrapbook before publishing
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {draft.selectedSongId && (
                                <MusicPlayer
                                    songId={draft.selectedSongId}
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
