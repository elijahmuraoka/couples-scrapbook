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
import EXIF from 'exif-js';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

interface PhotoUploadProps {
    selectedFiles: File[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>;
    setMetadata: React.Dispatch<React.SetStateAction<any[]>>;
    setCaptions: React.Dispatch<React.SetStateAction<string[]>>;
}

export function PhotoUpload({
    selectedFiles,
    setSelectedFiles,
    setPreviews,
    setMetadata,
    setCaptions,
}: PhotoUploadProps) {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const invalidFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
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

        // Extract metadata and create previews
        const photosWithMetadata = await Promise.all(
            files.map(async (file) => {
                const metadata = await extractMetadata(file);
                const preview = URL.createObjectURL(file);
                return { file, preview, metadata };
            })
        );

        // Add new files and metadata
        setSelectedFiles((prev: File[]) => [
            ...prev,
            ...photosWithMetadata.map((p) => p.file),
        ]);
        setPreviews((prev: string[]) => [
            ...prev,
            ...photosWithMetadata.map((p) => p.preview),
        ]);
        setMetadata((prev: any[]) => [
            ...prev,
            ...photosWithMetadata.map((p) => p.metadata),
        ]);
        setCaptions((prev: string[]) => [
            ...prev,
            ...Array(files.length).fill(''),
        ]);

        // Reset input value to allow selecting the same file again
        if (e.target) {
            e.target.value = '';
        }
    };

    const extractMetadata = async (file: File) => {
        return new Promise<{ location?: string; takenAt?: Date }>((resolve) => {
            EXIF.getData(file as any, function (this: any) {
                const exifData = EXIF.getAllTags(this);

                // Parse the date properly from EXIF
                let takenAt: Date | undefined;
                if (exifData?.DateTimeOriginal) {
                    // EXIF date format is "YYYY:MM:DD HH:MM:SS"
                    const [date, time] = exifData.DateTimeOriginal.split(' ');
                    const [year, month, day] = date.split(':');
                    const [hour, minute, second] = time.split(':');
                    takenAt = new Date(
                        year,
                        month - 1,
                        day,
                        hour,
                        minute,
                        second
                    );
                } else if (file.lastModified) {
                    // Fallback to file's last modified date
                    takenAt = new Date(file.lastModified);
                }

                resolve({
                    location: exifData?.GPSLatitude
                        ? `${exifData.GPSLatitude}, ${exifData.GPSLongitude}`
                        : undefined,
                    takenAt:
                        takenAt && !isNaN(takenAt.getTime())
                            ? takenAt
                            : undefined,
                });
            });
        });
    };

    return (
        <Card className="border-pink-100 shadow-md overflow-hidden">
            <CardHeader>
                <CardTitle className="text-gray-800">Upload Photos</CardTitle>
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
