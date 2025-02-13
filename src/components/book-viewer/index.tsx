'use client';

import { useState, useEffect } from 'react';
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
import { usePathname, useRouter } from 'next/navigation';

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
    const [orientations, setOrientations] = useState<
        Array<'vertical' | 'horizontal'>
    >(new Array(photos.length).fill('horizontal'));
    const router = useRouter();
    const pathname = usePathname();
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Only redirect if we're not in preview and have no photos
    useEffect(() => {
        const isPreviewPage = pathname === '/preview';
        if (!isPreviewPage && (!photos || photos.length === 0)) {
            router.push('/');
        }
    }, [photos, router, pathname]);

    useEffect(() => {
        console.log('imagesLoaded: ', imagesLoaded);
        console.log('photos.length: ', photos.length);
        if (imagesLoaded === photos.length) {
            setIsLoading(false);
        }
    }, [imagesLoaded, photos.length]);

    useEffect(() => {
        const imagePromises = photos.map((photo) => {
            return new Promise((resolve, reject) => {
                const img = document.createElement('img');
                img.onload = () => {
                    console.log(`Image loaded: ${photo.url}`);
                    setImagesLoaded((prev) => prev + 1);
                    resolve(img);
                };
                img.onerror = reject;
                img.src = photo.url;
            });
        });

        Promise.all(imagePromises)
            .then(() => {
                console.log('All images preloaded');
            })
            .catch((error) => {
                console.error('Error preloading images:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [photos.length]);

    // Return null instead of loading state
    if (!photos || photos.length === 0) {
        return null;
    }

    const pages = [
        // Enhanced Front Cover
        <div
            key="cover"
            className="relative bg-[#1B2C4C] p-12 flex flex-col items-center justify-center text-white overflow-hidden"
        >
            {/* Leather texture */}
            <div className="absolute inset-0 bg-[url('/leather.png')] opacity-20" />

            {/* Gold frame */}
            <div className="absolute inset-8">
                {/* Main border */}
                <div className="absolute inset-0 border-[2px] border-[#E5C87D]/60" />

                {/* Corner decorations */}
                <div className="absolute top-[-2px] left-[-2px] w-12 h-12 border-t-2 border-l-2 border-[#E5C87D]" />
                <div className="absolute top-[-2px] right-[-2px] w-12 h-12 border-t-2 border-r-2 border-[#E5C87D]" />
                <div className="absolute bottom-[-2px] left-[-2px] w-12 h-12 border-b-2 border-l-2 border-[#E5C87D]" />
                <div className="absolute bottom-[-2px] right-[-2px] w-12 h-12 border-b-2 border-r-2 border-[#E5C87D]" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-lg mx-auto">
                <Heart className="md:w-16 md:h-16 w-8 h-8 text-[#E5C87D] drop-shadow-lg" />
                <h1 className="lg:text-5xl md:text-4xl text-2xl font-serif italic text-center m-12 tracking-wide text-[#E5C87D] drop-shadow-sm whitespace-pre-wrap">
                    {title}
                </h1>
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#E5C87D]/60 to-transparent mx-auto my-4" />
                <p className="font-handwriting md:text-xl text-sm [#E5C87D]/80 md:mt-8 mt-4">
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
                        <div className="absolute md:-top-4 -top-2 left-1/2 -translate-x-1/2 w-32 md:h-8 h-6 bg-washi-tape rotate-2" />
                        <p className="font-handwriting md:text-lg text-xs leading-relaxed text-gray-800 p-8 bg-white shadow-sm whitespace-pre-wrap">
                            {note}
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <Heart className="md:w-8 md:h-8 w-6 h-6 text-pink-300 opacity-50" />
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
                <div className="relative flex flex-col h-full w-full">
                    {/* Photo with washi tapes */}
                    <div className="relative bg-white p-4  shadow-lg rotate-[-1deg] hover:rotate-0 transition-all duration-500 group max-h-[45vh]">
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
                                    const newOrientations = [...orientations];
                                    newOrientations[index] = isVertical
                                        ? 'vertical'
                                        : 'horizontal';
                                    setOrientations(newOrientations);
                                }}
                            />
                        </div>
                    </div>
                    {/* Caption with decorative elements */}
                    {photo.caption && (
                        <div
                            className={cn(
                                'transition-all duration-300',
                                orientations[index] === 'vertical'
                                    ? 'absolute -bottom-6 -left-4 -right-4 z-10'
                                    : 'relative mt-8 w-full'
                            )}
                        >
                            <div
                                className="rounded-2xl p-3.5"
                                style={{
                                    boxShadow:
                                        '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
                                    background:
                                        'linear-gradient(180deg, rgba(255,255,255) 0%, rgba(255,253,253,0.98) 100%)',
                                }}
                            >
                                <div className="relative max-w-lg mx-auto">
                                    <p className="font-handwriting md:text-base text-sm leading-relaxed text-gray-800 text-center whitespace-pre-wrap">
                                        {photo.caption}
                                    </p>

                                    {photo.taken_at && (
                                        <div className="mt-2 mb-1 text-center relative">
                                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-200/50 to-transparent" />
                                            <span className="font-handwriting text-xs md:text-sm text-gray-500 relative top-2">
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
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                                        <Heart className="md:w-4 md:h-4 w-3 h-3 text-pink-400/80 drop-shadow-sm rotate-[-15deg] hover:scale-110 transition-transform" />
                                        <Heart className="md:w-4 md:h-4 w-3 h-3 text-pink-400/80 drop-shadow-sm hover:scale-110 transition-transform" />
                                        <Heart className="md:w-4 md:h-4 w-3 h-3 text-pink-400/80 drop-shadow-sm rotate-[15deg] hover:scale-110 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )),

        // Enhanced Closing Cover
        <div
            key="closing"
            className="relative bg-[#1B2C4C] p-12 flex flex-col items-center justify-center text-white overflow-hidden"
        >
            <div className="absolute inset-0 bg-[url('/leather.png')] opacity-20" />

            {/* Gold frame (same as front cover) */}
            <div className="absolute inset-8">
                <div className="absolute inset-0 border-[2px] border-[#E5C87D]/60" />
                <div className="absolute top-[-2px] left-[-2px] w-12 h-12 border-t-2 border-l-2 border-[#E5C87D]" />
                <div className="absolute top-[-2px] right-[-2px] w-12 h-12 border-t-2 border-r-2 border-[#E5C87D]" />
                <div className="absolute bottom-[-2px] left-[-2px] w-12 h-12 border-b-2 border-l-2 border-[#E5C87D]" />
                <div className="absolute bottom-[-2px] right-[-2px] w-12 h-12 border-b-2 border-r-2 border-[#E5C87D]" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-lg">
                <Heart className="md:w-16 md:h-16 w-8 h-8 text-[#E5C87D] drop-shadow-lg" />
                <h2 className="font-serif md:text-3xl text-xl italic text-[#E5C87D] mb-4">
                    The End
                </h2>
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#E5C87D]/60 to-transparent mx-auto my-4" />
                <p className="font-handwriting md:text-xl text-sm text-[#E5C87D]/80">
                    ...but our story continues
                </p>
            </div>
        </div>,
    ].filter(Boolean);

    return (
        <div className="pb-8">
            <div className="md:aspect-[3/2] relative bg-white rounded-lg shadow-xl overflow-hidden min-h-[300px] md:min-h-[600px]">
                {isLoading && (
                    <div className="absolute inset-0 z-50 bg-white flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <div className="w-12 h-12 border-4 border-pink-100 border-t-pink-400 rounded-full animate-spin mx-auto" />
                            <p className="font-handwriting text-gray-500">
                                Loading your memories...
                            </p>
                        </div>
                    </div>
                )}
                <HTMLFlipBook
                    width={600}
                    height={800}
                    size="stretch"
                    minWidth={280}
                    maxWidth={1000}
                    minHeight={300}
                    maxHeight={1000}
                    showCover={true}
                    onFlip={(e) => setCurrentPage(e.data)}
                    startZIndex={0}
                    maxShadowOpacity={0.5}
                    showPageCorners={true}
                    disableFlipByClick={false}
                    className="mx-auto"
                    style={{
                        position: 'relative',
                        touchAction: 'none',
                    }}
                    startPage={0}
                    drawShadow={true}
                    flippingTime={1000}
                    usePortrait={true}
                    autoSize={true}
                    mobileScrollSupport={true}
                    swipeDistance={30}
                    clickEventForward={true}
                    useMouseEvents={true}
                    renderOnlyPageLengthChange={false}
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
