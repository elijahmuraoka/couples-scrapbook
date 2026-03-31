'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MusicPlayerProps {
    songId?: string;
    src?: string;
    className?: string;
    autoPlay?: boolean;
}

export function MusicPlayer({
    songId,
    src,
    className,
    autoPlay = false,
}: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audioSrc = src || (songId ? `/music/${songId}.mp3` : null);

        if (!audioSrc) {
            audioRef.current = null;
            setIsPlaying(false);
            return;
        }

        const audio = new Audio(audioSrc);
        audio.loop = true;
        audioRef.current = audio;

        if (autoPlay) {
            const timer = setTimeout(() => {
                audioRef.current
                    ?.play()
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false));
            }, 500);

            return () => {
                clearTimeout(timer);
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current = null;
                }
                setIsPlaying(false);
            };
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            setIsPlaying(false);
        };
    }, [songId, src, autoPlay]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }

        audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
    };

    if (!songId && !src) {
        return null;
    }

    return (
        <Button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
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
