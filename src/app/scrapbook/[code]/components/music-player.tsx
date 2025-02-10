'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
    musicUrl: string;
}

export function MusicPlayer({ musicUrl }: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg p-3 flex items-center gap-2">
            <button
                onClick={togglePlay}
                className="p-2 hover:bg-pink-50 rounded-full transition-colors"
            >
                {isPlaying ? (
                    <Pause className="w-5 h-5 text-pink-600" />
                ) : (
                    <Play className="w-5 h-5 text-pink-600" />
                )}
            </button>
            <button
                onClick={toggleMute}
                className="p-2 hover:bg-pink-50 rounded-full transition-colors"
            >
                {isMuted ? (
                    <VolumeX className="w-5 h-5 text-pink-600" />
                ) : (
                    <Volume2 className="w-5 h-5 text-pink-600" />
                )}
            </button>
            <audio ref={audioRef} src={musicUrl} loop className="hidden" />
        </div>
    );
}
