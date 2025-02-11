import { Heart } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6 flex items-center justify-center">
            <div className="max-w-md mx-auto text-center space-y-6 animate-bounce">
                <Heart className="w-12 h-12 text-pink-500 mx-auto animate-pulse" />
                <h2 className="text-2xl font-serif italic text-gray-900">
                    Loading...
                </h2>
            </div>
        </div>
    );
}
