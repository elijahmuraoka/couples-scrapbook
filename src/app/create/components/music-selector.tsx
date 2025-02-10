'use client';

import { useState, useRef } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Play, Pause, Check } from 'lucide-react';
import { MUSIC_LIBRARY } from '@/lib/music-library';

interface MusicSelectorProps {
    selectedSongId: string | null;
    onSelect: (songId: string) => void;
}

export function MusicSelector({
    selectedSongId,
    onSelect,
}: MusicSelectorProps) {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlay = (songId: string, url: string) => {
        if (playingId === songId) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(url);
            audioRef.current.play();
            setPlayingId(songId);
        }
    };

    return (
        <Card className="border-pink-100 shadow-md">
            <CardHeader>
                <CardTitle className="text-gray-800">
                    Choose Background Music
                </CardTitle>
                <CardDescription>
                    Select a song to accompany your memories
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {MUSIC_LIBRARY.map((song) => (
                    <div
                        key={song.id}
                        className={`
                            p-4 rounded-lg border transition-all flex items-center justify-between
                            ${
                                selectedSongId === song.id
                                    ? 'border-pink-300 bg-pink-50'
                                    : 'border-gray-100 hover:border-pink-200'
                            }
                        `}
                    >
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handlePlay(song.id, song.url)}
                                className="p-2 hover:bg-pink-100 rounded-full transition-colors"
                            >
                                {playingId === song.id ? (
                                    <Pause className="w-5 h-5 text-pink-600" />
                                ) : (
                                    <Play className="w-5 h-5 text-pink-600" />
                                )}
                            </button>
                            <div>
                                <div className="font-medium text-gray-700">
                                    {song.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {song.category}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onSelect(song.id)}
                            className={`
                                p-2 rounded-full transition-colors
                                ${
                                    selectedSongId === song.id
                                        ? 'bg-pink-100'
                                        : 'hover:bg-pink-50'
                                }
                            `}
                        >
                            {selectedSongId === song.id && (
                                <Check className="w-5 h-5 text-pink-600" />
                            )}
                        </button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
