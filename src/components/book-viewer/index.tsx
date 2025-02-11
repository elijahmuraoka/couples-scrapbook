'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import {
    ScrapbookDraft,
    Scrapbook,
    Photo,
    isScrapbook,
} from '@/types/scrapbook';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface BookViewerProps {
    data: ScrapbookDraft | Scrapbook;
    showNavigation?: boolean;
}

interface NormalizedBookData {
    title: string;
    note: string | null;
    photos: Omit<Photo, 'id' | 'scrapbook_id' | 'created_at'>[];
}

// Helper to normalize data structure
function normalizeBookData(
    data: ScrapbookDraft | Scrapbook
): NormalizedBookData {
    if (isScrapbook(data)) {
        return {
            title: data.title,
            note: data.note || null,
            photos: data.photos.map((photo) => ({
                url: photo.url,
                caption: photo.caption,
                location: photo.location,
                taken_at: photo.taken_at,
                order: photo.order,
            })),
        };
    } else {
        return {
            title: data.title,
            note: data.note || null,
            photos: data.previews.map((url, i) => ({
                url,
                caption: data.captions[i],
                location: data.metadata[i]?.location,
                taken_at: data.metadata[i]?.takenAt,
                order: i,
            })),
        };
    }
}

export function BookViewer({ data, showNavigation = true }: BookViewerProps) {
    const { title, note, photos } = normalizeBookData(data);
    const [currentPage, setCurrentPage] = useState(0);
    const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>(
        'horizontal'
    );
    const router = useRouter();

    if (!photos || ('length' in photos && photos.length === 0)) {
        router.push('/');
    }

    const pages = [
        // Cover page
        <div
            key="cover"
            className="relative bg-[#1B2C4C] p-12 flex flex-col items-center justify-center text-white overflow-hidden"
        >
            <div className="absolute inset-0 bg-[url('/leather.png')] opacity-20" />
            <div className="absolute inset-8">
                <div className="absolute inset-0 border-[2px] border-[#E5C87D]/60" />
                <div className="absolute top-[-2px] left-[-2px] w-8 h-8 border-t-2 border-l-2 border-[#E5C87D]" />
                <div className="absolute top-[-2px] right-[-2px] w-8 h-8 border-t-2 border-r-2 border-[#E5C87D]" />
                <div className="absolute bottom-[-2px] left-[-2px] w-8 h-8 border-b-2 border-l-2 border-[#E5C87D]" />
                <div className="absolute bottom-[-2px] right-[-2px] w-8 h-8 border-b-2 border-r-2 border-[#E5C87D]" />
            </div>
            <div className="relative z-10 text-center max-w-lg">
                <Heart className="w-16 h-16 mb-8 text-[#E5C87D] drop-shadow-lg" />
                <h1 className="text-5xl font-serif italic text-center mb-6 tracking-wide text-[#E5C87D]">
                    {title}
                </h1>
                <p className="font-handwriting text-xl text-[#E5C87D]/80 mt-8">
                    Open to view our story
                </p>
            </div>
        </div>,

        // Note page (if exists)
        note && (
            <div
                key="note"
                className="relative bg-cream-paper p-12 flex flex-col items-center justify-center"
            >
                <div className="absolute inset-0 bg-[url('/handmade-paper.png')] opacity-20" />
                <div className="max-w-md w-full space-y-6 relative">
                    <div className="relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-washi-tape rotate-2" />
                        <p className="font-handwriting text-xl leading-relaxed text-gray-600 p-8 bg-white/80 shadow-sm">
                            {note}
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <Heart className="w-8 h-8 text-pink-300 opacity-50" />
                    </div>
                </div>
            </div>
        ),

        // Photo pages
        ...photos.map((photo, index) => (
            <div
                key={`photo-${index}`}
                className="relative bg-cream-paper p-12"
            >
                <div className="absolute inset-0 bg-[url('/handmade-paper.png')] opacity-20" />
                <div className="relative flex flex-col h-full">
                    {/* Photo with washi tapes */}
                    <div className="relative bg-white p-4 shadow-lg rotate-[-1deg] hover:rotate-0 transition-all duration-500 group">
                        {/* Washi tapes */}
                        <div
                            className="absolute -top-3 left-6 w-24 h-5 bg-gradient-to-r from-pink-200/70 to-pink-300/70 rotate-12 shadow-sm group-hover:rotate-6 transition-transform duration-500"
                            style={{
                                maskImage:
                                    'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)',
                            }}
                        />
                        <div
                            className="absolute -top-4 right-8 w-16 h-5 bg-gradient-to-r from-rose-200/60 to-pink-200/60 -rotate-6 shadow-sm group-hover:-rotate-3 transition-transform duration-500"
                            style={{
                                maskImage:
                                    'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)',
                            }}
                        />

                        {/* Photo container without any overlay effects */}
                        <div className="relative h-full">
                            <Image
                                src={photo.url}
                                alt={photo.caption || `Photo ${index + 1}`}
                                width={600}
                                height={800}
                                className="w-full h-full object-contain"
                                onLoad={(e) => {
                                    const img = e.target as HTMLImageElement;
                                    const isVertical =
                                        img.naturalHeight > img.naturalWidth;
                                    setOrientation(
                                        isVertical ? 'vertical' : 'horizontal'
                                    );
                                }}
                            />
                        </div>
                    </div>

                    {/* Caption with decorative elements */}
                    {photo.caption && (
                        <div
                            className={cn(
                                'transition-all duration-300',
                                orientation === 'vertical'
                                    ? 'absolute bottom-8 left-8 right-8'
                                    : 'relative mt-8 px-8'
                            )}
                        >
                            <div
                                className="rounded-2xl p-5 shadow-md"
                                style={{
                                    boxShadow:
                                        '0 4px 30px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
                                    background:
                                        'linear-gradient(180deg, rgba(255,255,255) 0%, rgba(255,255,255,0.98) 100%)',
                                }}
                            >
                                <div className="relative max-w-lg mx-auto">
                                    <p className="font-handwriting text-xl leading-relaxed text-gray-600 text-center">
                                        {photo.caption}
                                    </p>

                                    {photo.taken_at && (
                                        <div className="mt-2 mb-1 text-center relative">
                                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-200/50 to-transparent" />
                                            <span className="font-handwriting text-sm text-gray-400 relative top-2">
                                                {new Date(
                                                    photo.taken_at!
                                                ).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    )}

                                    {/* Enhanced decorative hearts */}
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                                        <Heart className="w-4 h-4 text-pink-400/80 drop-shadow-sm rotate-[-15deg] hover:scale-110 transition-transform" />
                                        <Heart className="w-4 h-4 text-pink-400/80 drop-shadow-sm hover:scale-110 transition-transform" />
                                        <Heart className="w-4 h-4 text-pink-400/80 drop-shadow-sm rotate-[15deg] hover:scale-110 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )),

        // Closing page
        <div
            key="closing"
            className="relative bg-[#1B2C4C] p-12 flex flex-col items-center justify-center text-white overflow-hidden"
        >
            <div className="absolute inset-0 bg-[url('/leather.png')] opacity-20" />
            <div className="relative z-10 text-center max-w-lg">
                <Heart className="w-16 h-16 mb-8 text-[#E5C87D] drop-shadow-lg" />
                <h2 className="font-serif text-3xl italic text-[#E5C87D] mb-4">
                    The End
                </h2>
                <p className="font-handwriting text-xl text-[#E5C87D]/80">
                    ...but our story continues
                </p>
            </div>
        </div>,
    ].filter(Boolean);

    return (
        <div>
            <div className="aspect-[3/2] relative bg-white rounded-lg shadow-xl overflow-hidden min-h-[600px]">
                {/* @ts-ignore - HTMLFlipBook types are not perfect */}
                <HTMLFlipBook
                    width={600}
                    height={800}
                    size="stretch"
                    minWidth={300}
                    maxWidth={1000}
                    minHeight={400}
                    maxHeight={1000}
                    showCover={true}
                    onFlip={(e) => setCurrentPage(e.data)}
                    className="mx-auto"
                    style={{
                        position: 'relative',
                        touchAction: 'none', // Prevent touch scrolling issues
                    }}
                    startPage={0}
                    drawShadow={true}
                    flippingTime={1000}
                    usePortrait={true}
                    startZIndex={0}
                    autoSize={true}
                    maxShadowOpacity={0.5}
                    showPageCorners={true}
                    disableFlipByClick={false}
                    useMouseEvents={true}
                    swipeDistance={0}
                    clickEventForward={true}
                    mobileScrollSupport={true}
                >
                    {pages}
                </HTMLFlipBook>
            </div>

            {showNavigation && (
                <div className="text-center mt-6 text-gray-500">
                    Page{' '}
                    {currentPage === 0
                        ? 1
                        : Math.ceil((currentPage + 1) / 2) + 1}{' '}
                    of {Math.ceil((photos.length + (note ? 4 : 3)) / 2)}
                </div>
            )}
        </div>
    );
}
