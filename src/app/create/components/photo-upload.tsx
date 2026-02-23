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
import { useScrapbookStore, generatePhotoId } from '@/store/useScrapbookStore';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

interface PhotoUploadProps {
    selectedFiles: File[];
    previews: string[];
    metadata: Array<{ location?: string; takenAt?: Date }>;
    captions: string[];
    setSelectedFiles: (files: File[]) => void;
    setPreviews: (urls: string[]) => void;
    setMetadata: (meta: Array<{ location?: string; takenAt?: Date }>) => void;
    setCaptions: (captions: string[]) => void;
}

export function PhotoUpload({
    selectedFiles,
    previews,
    metadata,
    captions,
    setSelectedFiles,
    setPreviews,
    setMetadata,
    setCaptions,
}: PhotoUploadProps) {
    const { photoIds, setPhotoIds } = useScrapbookStore();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        // Filter out files larger than 10MB
        const validFiles = files.filter((file) => {
            if (file.size > MAX_FILE_SIZE) {
                toast.error(
                    `${file.name} is too large (max ${MAX_FILE_SIZE / (1024 * 1024)}MB)`
                );
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        if (selectedFiles.length + validFiles.length > 10) {
            toast.error('You can only upload up to 10 photos');
            return;
        }

        // Create object URLs for previews
        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

        // Generate stable unique IDs for each new photo
        const newIds = validFiles.map(() => generatePhotoId());

        // Extract metadata and update state
        const photosWithMetadata = await Promise.all(
            validFiles.map(async (file) => {
                const metadata = await extractMetadata(file);
                return { file, metadata };
            })
        );

        setSelectedFiles([
            ...selectedFiles,
            ...photosWithMetadata.map((p) => p.file),
        ]);
        setPreviews([...previews, ...newPreviews]);
        setMetadata([
            ...metadata,
            ...photosWithMetadata.map((p) => p.metadata),
        ]);
        setCaptions([...captions, ...Array(validFiles.length).fill('')]);
        setPhotoIds([...photoIds, ...newIds]);

        // Reset input
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
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-50 rounded-lg">
                        <ImagePlus className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                        <CardTitle className="text-xl text-gray-800">
                            Upload Photos
                        </CardTitle>
                        <CardDescription>
                            Add up to 10 of your favorite moments
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
                <label
                    htmlFor="file-upload"
                    className="group relative block cursor-pointer transition-all duration-200 bg-gradient-to-b from-pink-50/50 hover:from-pink-100/50"
                >
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
