import { Heart } from 'lucide-react';

export function HomeHero() {
    return (
        <div className="text-center space-y-4 animate-float">
            <div className="flex justify-center">
                <Heart className="w-12 h-12 text-pink-500 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text">
                Digital Scrapbook
            </h1>
            <p className="text-gray-500">
                Capture your love story, one memory at a time
            </p>
        </div>
    );
} 