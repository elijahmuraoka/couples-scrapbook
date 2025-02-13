'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useScrapbookStore } from '@/store/useScrapbookStore';
import { ScrapbookDetails } from './scrapbook-details';
import { PhotoUpload } from './photo-upload';
import { SelectedPhotos } from './selected-photos';
import { PreviewButton } from './preview-button';
import { MusicSelector } from './music-selector';
import { Button } from '@/components/ui/button';
import { Trash2, BookOpen, ArrowLeft } from 'lucide-react';

export function ScrapbookForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { draft, updateDraft, clearDraft } = useScrapbookStore();

    const handleClear = () => {
        if (
            confirm(
                'Are you sure you want to clear everything and start fresh?'
            )
        ) {
            clearDraft();
            toast.success('Everything cleared! Start fresh.');
        }
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Form validation
            if (!draft.title.trim()) {
                throw new Error('Please enter a title for your scrapbook');
            }

            if (draft.selectedFiles.length === 0) {
                throw new Error('Please select at least one photo');
            }
            // Instead of creating in database, we'll redirect to preview
            router.push(`/preview`);
        } catch (error) {
            console.error('Error:', error);
            toast.error(
                (error as Error).message ??
                    'Something went wrong. Please try again.'
            );
            setIsLoading(false);
        }
    };

    // Add beforeunload handler
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (draft.selectedFiles.length > 0) {
                e.preventDefault();
                e.returnValue = ''; // Required for Chrome
                return ''; // Required for other browsers
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () =>
            window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [draft.selectedFiles.length]);

    return (
        <div className="space-y-6">
            {/* Top Navigation */}
            <div className="flex justify-between items-center">
                <Button
                    variant="ghost"
                    className="-ml-2 text-gray-600 hover:text-gray-900"
                    onClick={() => router.push('/')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>
            </div>

            {/* Content Area */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-6 border-b">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-pink-50 rounded-xl">
                            <BookOpen className="w-8 h-8 text-pink-500" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-serif italic text-gray-900">
                                Create Your Scrapbook
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Add photos, write captions, and share your
                                memories
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={handleClear}
                        variant="outline"
                        size="sm"
                        className="w-full md:w-auto text-red-500 border-red-200 hover:bg-red-100/50 hover:text-red-600 hover:border-red-300 transition-colors max-w-[400px]"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All
                    </Button>
                </div>

                <ScrapbookDetails
                    title={draft.title}
                    setTitle={(title) => updateDraft({ title })}
                    note={draft.note || ''}
                    setNote={(note) => updateDraft({ note })}
                />
                <MusicSelector
                    selectedSongId={draft.selectedSongId}
                    onSelect={(songId) =>
                        updateDraft({ selectedSongId: songId })
                    }
                />
                <PhotoUpload
                    selectedFiles={draft.selectedFiles}
                    previews={draft.previews}
                    metadata={draft.metadata}
                    captions={draft.captions}
                    setSelectedFiles={(files) =>
                        updateDraft({ selectedFiles: files })
                    }
                    setPreviews={(urls) => updateDraft({ previews: urls })}
                    setMetadata={(meta) => updateDraft({ metadata: meta })}
                    setCaptions={(caps) => updateDraft({ captions: caps })}
                />
                {draft.selectedFiles.length > 0 && (
                    <SelectedPhotos
                        selectedFiles={draft.selectedFiles}
                        setSelectedFiles={(files) =>
                            updateDraft({ selectedFiles: files })
                        }
                        previews={draft.previews}
                        setPreviews={(urls) => updateDraft({ previews: urls })}
                        captions={draft.captions}
                        setCaptions={(caps) => updateDraft({ captions: caps })}
                        metadata={draft.metadata}
                        setMetadata={(meta) => updateDraft({ metadata: meta })}
                    />
                )}
                <PreviewButton onClick={handleSubmit} isLoading={isLoading} />
            </div>
        </div>
    );
}
