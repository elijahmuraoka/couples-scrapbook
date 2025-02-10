'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ChevronLeft, Share2 } from 'lucide-react';
import HTMLFlipBook from 'react-pageflip';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { use } from 'react';
import { MusicPlayer } from './components/music-player';

interface ScrapbookData {
    id: string;
    title: string;
    note?: string;
    code: string;
    photos: {
        id: string;
        url: string;
        order: number;
        caption?: string;
    }[];
    music_url?: string;
}

export default function ScrapbookView({
    params,
}: {
    params: Promise<{ code: string }>;
}) {
    const { code } = use(params);
    const [book, setBook] = useState<ScrapbookData | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        async function fetchScrapbook() {
            const { data, error } = await supabase
                .from('scrapbooks')
                .select('*, photos(*)')
                .eq('code', code)
                .single();

            if (error) {
                console.error('Error fetching scrapbook:', error);
                return;
            }

            setBook(data);
        }

        fetchScrapbook();
    }, [code]);

    if (!book) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <Link href="/">
                        <Button variant="ghost" className="text-pink-600">
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <Button variant="ghost" className="text-pink-600">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                </div>

                {/* Book */}
                <div className="aspect-[3/2] relative bg-white rounded-lg shadow-xl overflow-hidden">
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
                        style={{}}
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
                        {/* Cover */}
                        <div className="relative bg-[#1B2C4C] p-12 flex flex-col items-center justify-center text-white overflow-hidden">
                            {/* Base texture */}
                            <div className="absolute inset-0 bg-[url('/leather.png')] opacity-20" />

                            {/* Decorative frame */}
                            <div className="absolute inset-8">
                                {/* Main border */}
                                <div className="absolute inset-0 border-[2px] border-[#E5C87D]/60" />

                                {/* Simple corner accents */}
                                <div className="absolute top-[-2px] left-[-2px] w-8 h-8 border-t-2 border-l-2 border-[#E5C87D]" />
                                <div className="absolute top-[-2px] right-[-2px] w-8 h-8 border-t-2 border-r-2 border-[#E5C87D]" />
                                <div className="absolute bottom-[-2px] left-[-2px] w-8 h-8 border-b-2 border-l-2 border-[#E5C87D]" />
                                <div className="absolute bottom-[-2px] right-[-2px] w-8 h-8 border-b-2 border-r-2 border-[#E5C87D]" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 text-center max-w-lg">
                                <div className="mb-8 text-[#E5C87D] font-serif text-sm tracking-[0.3em] uppercase relative">
                                    Our Story
                                    {/* Decorative line with dots - only under "Our Story" */}
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-[#E5C87D]/60" />
                                        <div className="flex-1 h-[1px] bg-[#E5C87D]/30 mx-2" />
                                        <div className="w-2 h-2 rounded-full bg-[#E5C87D]/60" />
                                    </div>
                                </div>
                                <Heart className="w-16 h-16 mb-8 text-[#E5C87D] drop-shadow-lg" />
                                <h1 className="text-5xl font-serif italic text-center mb-6 tracking-wide text-[#E5C87D]">
                                    {book.title}
                                </h1>
                                <p className="font-handwriting text-xl text-[#E5C87D]/80 mt-8">
                                    Open to view our story
                                </p>
                            </div>
                        </div>

                        {/* Note Page */}
                        {book?.note && (
                            <div className="relative bg-cream-paper p-12 flex flex-col items-center justify-center">
                                {/* Paper texture */}
                                <div className="absolute inset-0 bg-[url('/vintage-paper.png')] opacity-20" />

                                <div className="max-w-md w-full space-y-6 relative">
                                    <h2 className="font-handwriting text-3xl text-gray-700 text-center mb-8">
                                        A Note from the Heart
                                    </h2>
                                    <div className="relative">
                                        {/* Decorative tape */}
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-washi-tape rotate-2" />

                                        <p className="font-handwriting text-xl leading-relaxed text-gray-600 p-8 bg-white/80 shadow-sm">
                                            {book.note}
                                        </p>
                                    </div>
                                    <div className="flex justify-center mt-8">
                                        <Heart className="w-8 h-8 text-pink-300 opacity-50" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Photo Pages */}
                        {book.photos.map((photo, index) => (
                            <div
                                key={photo.id}
                                className="relative bg-cream-paper p-12"
                            >
                                {/* Paper texture */}
                                <div className="absolute inset-0 bg-[url('/vintage-paper.png')] opacity-20" />

                                <div className="relative">
                                    {/* Polaroid effect */}
                                    <div className="relative bg-white p-4 shadow-lg rotate-[-1deg] hover:rotate-0 transition-transform duration-500">
                                        {/* Decorative tape */}
                                        <div className="absolute -top-4 left-6 w-24 h-6 bg-washi-tape rotate-12" />

                                        <Image
                                            src={photo.url}
                                            alt={`Photo ${index + 1}`}
                                            width={600}
                                            height={800}
                                            className="w-full h-auto"
                                        />

                                        {/* Optional caption space */}
                                        <div className="mt-4 font-handwriting text-gray-600 text-center">
                                            {photo.caption || ''}
                                        </div>
                                    </div>

                                    {/* Decorative elements */}
                                    <div className="absolute -bottom-4 right-4 w-24 h-24 bg-[url('/flower-doodle.png')] opacity-20" />
                                </div>
                            </div>
                        ))}

                        {/* Closing Page */}
                        <div className="relative bg-[#1B2C4C] p-12 flex flex-col items-center justify-center text-white overflow-hidden">
                            {/* Base texture */}
                            <div className="absolute inset-0 bg-[url('/leather.png')] opacity-20" />

                            {/* Decorative frame - matching cover */}
                            <div className="absolute inset-8">
                                <div className="absolute inset-0 border-[2px] border-[#E5C87D]/60" />

                                {/* Simple corner accents */}
                                <div className="absolute top-[-2px] left-[-2px] w-8 h-8 border-t-2 border-l-2 border-[#E5C87D]" />
                                <div className="absolute top-[-2px] right-[-2px] w-8 h-8 border-t-2 border-r-2 border-[#E5C87D]" />
                                <div className="absolute bottom-[-2px] left-[-2px] w-8 h-8 border-b-2 border-l-2 border-[#E5C87D]" />
                                <div className="absolute bottom-[-2px] right-[-2px] w-8 h-8 border-b-2 border-r-2 border-[#E5C87D]" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 text-center max-w-lg">
                                <Heart className="w-16 h-16 mb-8 text-[#E5C87D] drop-shadow-lg" />
                                <h2 className="font-serif text-3xl italic text-[#E5C87D] mb-4">
                                    The End
                                </h2>
                                <p className="font-handwriting text-xl text-[#E5C87D]/80">
                                    ...but our story continues
                                </p>
                            </div>
                        </div>
                    </HTMLFlipBook>
                </div>

                {/* Page Navigation */}
                <div className="text-center mt-6 text-gray-500">
                    Page {Math.floor(currentPage / 2) + 1} of{' '}
                    {Math.ceil(book.photos.length / 2)}
                </div>

                {book.music_url && <MusicPlayer musicUrl={book.music_url} />}
            </div>
        </div>
    );
}
