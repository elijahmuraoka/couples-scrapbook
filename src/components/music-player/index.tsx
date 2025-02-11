'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MusicPlayerProps {
    songId: string;
    className?: string;
    autoPlay?: boolean;
}

export function MusicPlayer({
    songId,
    className,
    autoPlay = false,
}: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio(`/music/${songId}.mp3`);

        if (autoPlay) {
            // Small delay to ensure audio is loaded
            const timer = setTimeout(() => {
                audioRef.current?.play();
                setIsPlaying(true);
            }, 500);

            return () => {
                clearTimeout(timer);
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current = null;
                }
            };
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [songId, autoPlay]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Handle song end
    useEffect(() => {
        if (!audioRef.current) return;

        const handleEnded = () => setIsPlaying(false);
        audioRef.current.addEventListener('ended', handleEnded);

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('ended', handleEnded);
            }
        };
    }, []);

    return (
        <Button
            onClick={togglePlay}
            variant="outline"
            size="icon"
            className={cn(
                'h-9 w-9 rounded-full border-pink-100 hover:bg-red-100/50 hover:shadow-sm',
                'transition-all duration-200',
                isPlaying && 'bg-pink-50 border-pink-200',
                className
            )}
        >
            {isPlaying ? (
                <Pause className="h-4 w-4 text-pink-500" />
            ) : (
                <Play className="h-4 w-4 text-pink-500 ml-0.5" />
            )}
        </Button>
    );
}
