'use client';

import { ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

interface PhotoUploadProps {
    selectedFiles: File[];
    setSelectedFiles: (files: File[]) => void;
    setPreviews: (urls: string[]) => void;
}

export function PhotoUpload({
    selectedFiles,
    setSelectedFiles,
    setPreviews,
}: PhotoUploadProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const totalFiles = selectedFiles.length + files.length;

        // Check total number of files
        if (totalFiles > 10) {
            toast.error('You can only upload up to 10 photos', {
                style: {
                    backgroundColor: '#FEE2E2',
                    border: '1px solid #FCA5A5',
                    color: '#991B1B',
                },
                duration: 3000,
            });
            return;
        }

        // Validate file sizes
        const invalidFiles = files.filter(
            (file) => file.size > MAX_FILE_SIZE
        );
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
                    duration: 3000,
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

    return (
        <Card className="border-pink-100 shadow-md overflow-hidden">
            <CardHeader>
                <CardTitle className="text-gray-800">
                    Upload Photos
                </CardTitle>
                <CardDescription className="flex flex-col items-center">
                    <span>Add up to 10 of your favorite moments</span>
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
                                        or drag and drop your files here
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        PNG, JPG, GIF up to 10MB each
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
    );
} 