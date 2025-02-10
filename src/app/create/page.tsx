'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import Link from 'next/link';
import { Heart, ArrowLeft, ImagePlus, ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const isValidFileSize = (file: File) => {
    return file.size <= MAX_FILE_SIZE;
};

export default function CreateScrapbook() {
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const totalFiles = selectedFiles.length + files.length;

        // Check total number of files
        if (totalFiles > 10) {
            toast.error('You can only upload up to 10 photos', {
                style: {
                    backgroundColor: '#FEE2E2', // red-100
                    border: '1px solid #FCA5A5', // red-300
                    color: '#991B1B', // red-800
                },
            });
            return;
        }

        // Validate file sizes
        const invalidFiles = files.filter((file) => !isValidFileSize(file));
        if (invalidFiles.length > 0) {
            toast.error(
                `Some files exceed the 10MB limit: ${invalidFiles
                    .map((f) => f.name)
                    .join(', ')}`,
                {
                    style: {
                        backgroundColor: '#FEE2E2',
                        border: '1px solid #FCA5A5',
                        color: '#991B1B',
                    },
                }
            );
            return;
        }

        // Add new files to existing ones
        setSelectedFiles((prev) => [...prev, ...files]);

        // Generate and add new previews
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newPreviews]);

        // Reset input value to allow selecting the same file again
        if (e.target) {
            e.target.value = '';
        }
    };

    // Cleanup previews on unmount
    useEffect(() => {
        return () => {
            previews.forEach(URL.revokeObjectURL);
        };
    }, [previews]);

    const handleSubmit = async () => {
        // Validation
        if (!title.trim()) {
            toast.error('Please enter a title for your scrapbook', {
                style: {
                    backgroundColor: '#FEE2E2',
                    border: '1px solid #FCA5A5',
                    color: '#991B1B',
                },
            });
            return;
        }

        if (selectedFiles.length === 0) {
            toast.error('Please select at least one photo', {
                style: {
                    backgroundColor: '#FEE2E2',
                    border: '1px solid #FCA5A5',
                    color: '#991B1B',
                },
            });
            return;
        }

        setIsLoading(true);
        try {
            // 1. Create scrapbook
            const response = await fetch('/api/scrapbooks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title }),
            });

            const scrapbook = await response.json();

            if (!response.ok) throw new Error(scrapbook.error);

            // 2. Upload photos if any
            if (selectedFiles.length > 0) {
                for (let i = 0; i < selectedFiles.length; i++) {
                    setUploadProgress(
                        Math.round((i / selectedFiles.length) * 100)
                    );
                    const file = selectedFiles[i];
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${
                        scrapbook.id
                    }/${Math.random()}.${fileExt}`;

                    // Upload to Supabase Storage
                    const { error: uploadError } = await supabase.storage
                        .from('photos')
                        .upload(fileName, file);

                    if (uploadError) throw uploadError;

                    // Get public URL
                    const {
                        data: { publicUrl },
                    } = supabase.storage.from('photos').getPublicUrl(fileName);

                    // Save photo reference in database
                    const { error: dbError } = await supabase
                        .from('photos')
                        .insert([
                            {
                                scrapbook_id: scrapbook.id,
                                url: publicUrl,
                                order: i,
                            },
                        ]);

                    if (dbError) throw dbError;
                }
            }

            router.push(`/scrapbook/${scrapbook.code}`);
        } catch (error) {
            console.error('Error:', error);
            // Add error handling here
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <>
            <div className="min-h-screen w-full p-6 flex items-center justify-center">
                <div className="max-w-[800px] w-[90vw] space-y-8">
                    {/* Header */}
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

                    {/* Main Content */}
                    <div className="space-y-6">
                        <Card className="border-pink-100 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-gray-800">
                                    Scrapbook Details
                                </CardTitle>
                                <CardDescription>
                                    Give your love story a title
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        type="text"
                                        placeholder="Enter a romantic title"
                                        className="border-pink-200 focus-visible:ring-pink-500"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-pink-100 shadow-md overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-gray-800">
                                    Upload Photos
                                </CardTitle>
                                <CardDescription className="flex flex-col items-center">
                                    <span>
                                        Add up to 10 of your favorite moments
                                    </span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <label
                                    htmlFor="file-upload"
                                    className="group relative block cursor-pointer"
                                >
                                    <div className="p-8 transition-all duration-200 bg-gradient-to-b from-pink-50/50 hover:from-pink-100/50">
                                        <div className="border-2 border-dashed border-pink-200 rounded-lg p-8 transition-colors group-hover:border-pink-400">
                                            <div className="text-center">
                                                <div className="mx-auto h-16 w-16 text-pink-400 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                    <ImagePlus className="w-8 h-8" />
                                                </div>
                                                <div className="mt-4 space-y-2">
                                                    <p className="text-sm font-medium text-pink-600">
                                                        Click to upload photos
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        or drag and drop your
                                                        files here
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        PNG, JPG, GIF up to 10MB
                                                        each
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </CardContent>
                        </Card>

                        {selectedFiles.length > 0 && (
                            <Card className="border-pink-100 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <CardHeader>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-gray-800">
                                                    Selected Photos
                                                </CardTitle>
                                                <CardDescription>
                                                    {selectedFiles.length}/10
                                                    photos selected
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Progress
                                            value={
                                                (selectedFiles.length / 10) *
                                                100
                                            }
                                            className={`
                                                h-2 bg-pink-100/50 
                                                [&>div]:bg-gradient-to-r [&>div]:from-pink-500 [&>div]:to-rose-400 
                                                [&>div]:transition-all [&>div]:duration-500 [&>div]:ease-spring
                                                ${
                                                    selectedFiles.length > 0
                                                        ? '[&>div]:scale-x-100'
                                                        : '[&>div]:scale-x-0'
                                                }
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
                                                    animationDelay: `${
                                                        index * 100
                                                    }ms`,
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
                                                        const newFiles =
                                                            selectedFiles.filter(
                                                                (_, i) =>
                                                                    i !== index
                                                            );
                                                        const newPreviews =
                                                            previews.filter(
                                                                (_, i) =>
                                                                    i !== index
                                                            );
                                                        setSelectedFiles(
                                                            newFiles
                                                        );
                                                        setPreviews(
                                                            newPreviews
                                                        );
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
                        )}

                        <div className="flex justify-center pt-4">
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                size="lg"
                                className={`
                                    bg-gradient-to-r from-pink-500 to-rose-500 
                                    hover:from-pink-600 hover:to-rose-600 
                                    transition-all duration-300 px-8
                                    hover:scale-105 active:scale-95
                                    ${isLoading ? 'animate-pulse' : ''}
                                `}
                            >
                                {isLoading ? 'Creating...' : 'Create Scrapbook'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
