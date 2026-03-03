'use client';

import { useState, useEffect, type ChangeEvent } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MUSIC_LIBRARY } from '@/lib/music-library';

interface MusicSelectorProps {
    selectedSongId: string | null;
    customMusicFile: File | null;
    onSelect: (songId: string | null) => void;
    onCustomFile: (file: File | null) => void;
}

export function MusicSelector({
    selectedSongId,
    customMusicFile,
    onSelect,
    onCustomFile,
}: MusicSelectorProps) {
    const [playingSongId, setPlayingSongId] = useState<string | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        setAudio(new Audio());
    }, []);

    const handlePlay = (songId: string) => {
        if (!audio) return;

        if (playingSongId === songId) {
            audio.pause();
            setPlayingSongId(null);
            return;
        }

        if (playingSongId) {
            audio.pause();
        }

        audio.src = `/music/${songId}.mp3`;
        audio.play();
        setPlayingSongId(songId);
    };

    const handleCustomFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) {
            onCustomFile(null);
            return;
        }

        onSelect(null);
        onCustomFile(file);
    };

    useEffect(() => {
        return () => {
            if (audio) {
                audio.pause();
                audio.src = '';
            }
        };
    }, [audio]);

    return (
        <Card className="border-pink-100 shadow-md">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-50 rounded-lg">
                        <Music2 className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                        <CardTitle className="text-xl text-gray-800">
                            Choose Background Music
                        </CardTitle>
                        <CardDescription>
                            Select a song to accompany your memories
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                {MUSIC_LIBRARY.map((song) => (
                    <div
                        key={song.id}
                        className={cn(
                            'flex items-center justify-between p-3 rounded-lg transition-all',
                            'hover:bg-pink-50/50 cursor-pointer',
                            selectedSongId === song.id &&
                                'bg-pink-50 ring-1 ring-pink-200',
                            playingSongId === song.id && 'bg-pink-50/80'
                        )}
                        onClick={() => {
                            onCustomFile(null);
                            onSelect(song.id);
                        }}
                    >
                        <div className="flex items-center gap-4">
                            <Button
                                size="icon"
                                variant="ghost"
                                className={cn(
                                    'h-8 w-8 rounded-full',
                                    playingSongId === song.id &&
                                        'text-pink-600 bg-white shadow-sm'
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlay(song.id);
                                }}
                            >
                                {playingSongId === song.id ? (
                                    <Pause className="h-4 w-4" />
                                ) : (
                                    <Play className="h-4 w-4 ml-0.5" />
                                )}
                            </Button>
                            <div>
                                <div className="font-medium text-gray-700">
                                    {song.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {song.category}
                                </div>
                            </div>
                        </div>
                        {selectedSongId === song.id && (
                            <div className="text-sm font-medium text-pink-600">
                                Selected
                            </div>
                        )}
                    </div>
                ))}

                <div className="mt-4 border-2 border-dashed border-pink-200 rounded-lg p-4 bg-pink-50/30">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                        <Upload className="h-4 w-4 text-pink-500" />
                        Or upload your own
                    </div>
                    <input
                        type="file"
                        accept="audio/mpeg,audio/mp3"
                        onChange={handleCustomFileChange}
                        className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-pink-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-pink-700 hover:file:bg-pink-200"
                    />
                    {customMusicFile && (
                        <p className="mt-2 text-xs text-pink-700">
                            Selected: {customMusicFile.name}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
