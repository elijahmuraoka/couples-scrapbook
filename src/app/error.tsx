'use client';

import { Button } from '@/components/ui/button';
import { Heart, Link } from 'lucide-react';

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
                <Heart className="w-12 h-12 text-pink-500 mx-auto" />
                <h2 className="text-2xl font-serif italic text-gray-900">
                    Something went wrong
                </h2>
                <p className="text-gray-500">{error.message}</p>
                <Button onClick={reset}>Try again</Button>
                <Link href="/">
                    <Button>Return Home</Button>
                </Link>
            </div>
        </div>
    );
}
