'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SelectedPhotosProps {
    selectedFiles: File[];
    setSelectedFiles: (files: File[]) => void;
    previews: string[];
    setPreviews: (urls: string[]) => void;
}

export function SelectedPhotos({
    selectedFiles,
    setSelectedFiles,
    previews,
    setPreviews,
}: SelectedPhotosProps) {
    return (
        <Card className="border-pink-100 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CardHeader>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-gray-800">
                                Selected Photos
                            </CardTitle>
                            <CardDescription>
                                {selectedFiles.length}/10 photos selected
                            </CardDescription>
                        </div>
                    </div>
                    <Progress
                        value={(selectedFiles.length / 10) * 100}
                        className={`
                            h-2 bg-pink-100/50 
                            [&>div]:bg-gradient-to-r [&>div]:from-pink-500 [&>div]:to-rose-400 
                            [&>div]:transition-all [&>div]:duration-500 [&>div]:ease-spring
                            ${selectedFiles.length > 0 ? '[&>div]:scale-x-100' : '[&>div]:scale-x-0'}
                        `}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previews.map((preview, index) => (
                        <div
                            key={preview}
                            className="relative aspect-square rounded-lg overflow-hidden group animate-in fade-in duration-500"
                            style={{
                                animationDelay: `${index * 100}ms`,
                            }}
                        >
                            <Image
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const newFiles = selectedFiles.filter(
                                        (_, i) => i !== index
                                    );
                                    const newPreviews = previews.filter(
                                        (_, i) => i !== index
                                    );
                                    setSelectedFiles(newFiles);
                                    setPreviews(newPreviews);
                                }}
                            >
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-white hover:text-red-400 hover:scale-110 transition-all duration-300"
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 