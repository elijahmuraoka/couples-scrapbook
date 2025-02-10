'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ScrapbookView from '../../[code]/page';

export default function ScrapbookPreview({ params }: { params: { code: string } }) {
    const router = useRouter();

    const handlePublish = async () => {
        const response = await fetch(`/api/scrapbooks/${params.code}/publish`, {
            method: 'POST'
        });
        
        if (response.ok) {
            router.push(`/scrapbook/${params.code}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
            {/* Preview Header */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="flex justify-between items-center">
                    <Link href={`/create?code=${params.code}`}>
                        <Button variant="ghost">
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Back to Edit
                        </Button>
                    </Link>
                    <Button 
                        onClick={handlePublish}
                        className="bg-pink-600 hover:bg-pink-700 text-white"
                    >
                        Publish Scrapbook
                    </Button>
                </div>
                <div className="text-center text-gray-500 mt-4">
                    Preview Mode - Make changes before publishing
                </div>
            </div>

            {/* Reuse existing scrapbook view */}
            <ScrapbookView params={Promise.resolve(params)} />
        </div>
    );
} 