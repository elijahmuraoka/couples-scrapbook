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

interface ScrapbookData {
    id: string;
    title: string;
    note?: string;
    code: string;
    photos: {
        id: string;
        url: string;
        order: number;
    }[];
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
                        <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-8 flex flex-col items-center justify-center text-white">
                            <Heart className="w-16 h-16 mb-4" />
                            <h1 className="text-4xl font-bold text-center mb-4">
                                {book.title}
                            </h1>
                            <p className="text-pink-100">
                                Open to view our story
                            </p>
                        </div>

                        {/* Note Page */}
                        {book?.note && (
                            <div className="bg-white p-8 flex flex-col items-center justify-center">
                                <div className="max-w-md text-center">
                                    <h2 className="text-2xl font-serif italic text-gray-600 mb-4">
                                        Note
                                    </h2>
                                    <p className="text-gray-700 font-serif leading-relaxed">
                                        {book.note}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Photo Pages */}
                        {book.photos.map((photo, index) => (
                            <div key={photo.id} className="bg-white p-8">
                                <Image
                                    src={photo.url}
                                    alt={`Photo ${index + 1}`}
                                    width={600}
                                    height={800}
                                    className="w-full h-auto"
                                />
                            </div>
                        ))}
                    </HTMLFlipBook>
                </div>

                {/* Page Navigation */}
                <div className="text-center mt-6 text-gray-500">
                    Page {Math.floor(currentPage / 2) + 1} of{' '}
                    {Math.ceil(book.photos.length / 2)}
                </div>
            </div>
        </div>
    );
}
