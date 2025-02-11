'use client';

import { Button } from '@/components/ui/button';
import { HeartCrack } from 'lucide-react';
import Link from 'next/link';
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6 flex items-center justify-center">
            <div className="max-w-md mx-auto text-center space-y-6">
                <HeartCrack className="w-12 h-12 text-pink-500 mx-auto" />
                <h2 className="text-2xl font-semibold font-serif italic text-gray-900">
                    Something went wrong
                </h2>
                <p className="text-gray-600 text-sm border border-gray-200 rounded-md shadow-md p-6">
                    {error.message}
                </p>
                <div className="flex md:flex-row flex-col items-center justify-center gap-4">
                    <Button className="w-full" onClick={reset}>
                        Try again
                    </Button>
                    <Link href="/" className="w-full">
                        <Button className="w-full">Return Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
