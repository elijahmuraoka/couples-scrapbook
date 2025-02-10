import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CreateHeader() {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text flex items-center gap-2">
                    <Heart className="w-8 h-8 text-pink-500" />
                    Create Your Story
                </h1>
                <p className="text-gray-500 mt-2">
                    Design your perfect digital memory book
                </p>
            </div>
            <Link href="/">
                <Button
                    variant="ghost"
                    className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </Link>
        </div>
    );
} 