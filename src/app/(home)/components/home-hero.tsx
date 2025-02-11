import { Heart } from 'lucide-react';

export function HomeHero() {
    return (
        <div className="text-center space-y-4">
            <div className="flex justify-center">
                <Heart className="w-12 h-12 text-pink-500 animate-pulse animate-float" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text p-2">
                A Gift From Your Broke But Loving Partner
            </h1>
            <p className="text-gray-600 lg:text-lg italic">
                "I have no money, but at least I love you."
            </p>
        </div>
    );
}
