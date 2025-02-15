'use client';

import Image from 'next/image';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    X,
    GripVertical,
    Calendar,
    MapPin,
    Maximize2,
    Images,
    Trash2,
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface SelectedPhotosProps {
    selectedFiles: File[];
    setSelectedFiles: (files: File[]) => void;
    previews: string[];
    setPreviews: (urls: string[]) => void;
    captions: string[];
    setCaptions: (captions: string[]) => void;
    metadata: Array<{ location?: string; takenAt?: Date }>;
    setMetadata: (meta: Array<{ location?: string; takenAt?: Date }>) => void;
}

interface SortablePhotoItemProps {
    id: string;
    index: number;
    preview: string;
    caption: string;
    onRemove: () => void;
    onCaptionChange: (caption: string) => void;
    metadata?: {
        location?: string;
        takenAt?: Date;
    };
}

function SortablePhotoItem({
    id,
    index,
    preview,
    caption,
    onRemove,
    onCaptionChange,
    metadata,
}: SortablePhotoItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
        zIndex: isDragging ? 50 : 0,
    };

    const maxCaptionLength = 50;
    const [showFullscreen, setShowFullscreen] = useState(false);

    return (
        <>
            <motion.div
                ref={setNodeRef}
                style={style}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex flex-col lg:flex-row gap-4 bg-white rounded-lg shadow-sm p-4 
                    ${
                        isDragging
                            ? 'shadow-xl ring-2 ring-pink-200'
                            : 'hover:bg-gray-50'
                    }
                    transition-shadow duration-200`}
            >
                {/* Top Bar with Drag Handle & Trash */}
                <div className="flex items-center justify-between w-full lg:w-auto gap-2">
                    <div className="flex items-center gap-2">
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing hover:text-pink-500 transition-colors"
                        >
                            <GripVertical className="w-5 h-5" />
                        </div>
                        <motion.span
                            layout
                            className="text-sm font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
                        >
                            {index + 1}
                        </motion.span>
                    </div>

                    {/* Trash Button - Visible on mobile, hidden on lg */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onRemove}
                        className="lg:hidden text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50/80 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </motion.button>
                </div>

                {/* Rest of content */}
                <div className="relative w-full lg:w-48 h-32 rounded-md overflow-hidden flex-shrink-0 group">
                    <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Metadata & Actions Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Fullscreen button */}
                        <button
                            onClick={() => setShowFullscreen(true)}
                            className="absolute top-2 right-2 p-1.5 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>

                        {/* Metadata */}
                        {(metadata?.location || metadata?.takenAt) && (
                            <div className="absolute bottom-0 left-0 right-0 p-2 space-y-1 text-white text-xs">
                                {metadata.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate">
                                            {metadata.location}
                                        </span>
                                    </div>
                                )}
                                {metadata.takenAt && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>
                                            {new Date(
                                                metadata.takenAt
                                            ).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-grow space-y-1">
                    <Textarea
                        id={`caption-${id}`}
                        value={caption}
                        onChange={(e) => onCaptionChange(e.target.value)}
                        placeholder="Add a caption to this photo..."
                        className="w-full resize-none h-24 text-xs sm:text-sm transition-colors focus:border-pink-300"
                        maxLength={maxCaptionLength}
                    />
                    <div className="sm:text-sm text-xs text-gray-500 text-right">
                        {caption.length}/{maxCaptionLength} characters
                    </div>
                </div>

                {/* Trash Button - Hidden on mobile, visible on lg */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRemove}
                    className="hidden lg:block self-start text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50/80 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </motion.button>
            </motion.div>

            {/* Fullscreen Preview Dialog */}
            <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95">
                    <DialogTitle className="sr-only">Photo Preview</DialogTitle>
                    <div className="relative aspect-[3/2] w-full">
                        <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-contain"
                            priority
                        />

                        {/* Metadata overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-4 text-white">
                            {caption && (
                                <p className="text-lg mb-2">{caption}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-white/80">
                                {metadata?.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{metadata.location}</span>
                                    </div>
                                )}
                                {metadata?.takenAt && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            {new Date(
                                                metadata.takenAt
                                            ).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setShowFullscreen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export function SelectedPhotos({
    selectedFiles,
    setSelectedFiles,
    previews,
    setPreviews,
    captions,
    setCaptions,
    metadata,
    setMetadata,
}: SelectedPhotosProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [activeId, setActiveId] = useState<string | null>(null);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        setActiveId(null);
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = parseInt(active.id.split('-')[1]);
            const newIndex = parseInt(over.id.split('-')[1]);

            const newFiles = arrayMove([...selectedFiles], oldIndex, newIndex);
            const newPreviews = arrayMove([...previews], oldIndex, newIndex);
            const newCaptions = arrayMove([...captions], oldIndex, newIndex);
            const newMetadata = arrayMove([...metadata], oldIndex, newIndex);

            setSelectedFiles(newFiles);
            setPreviews(newPreviews);
            setCaptions(newCaptions);
            setMetadata(newMetadata);
        }
    };

    const handleRemove = (index: number) => {
        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(previews[index]);

        const newFiles = [...selectedFiles];
        const newPreviews = [...previews];
        const newCaptions = [...captions];
        const newMetadata = [...metadata];

        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        newCaptions.splice(index, 1);
        newMetadata.splice(index, 1);

        setSelectedFiles(newFiles);
        setPreviews(newPreviews);
        setCaptions(newCaptions);
        setMetadata(newMetadata);
    };

    return (
        <Card className="border-pink-100 shadow-md">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-50 rounded-lg">
                        <Images className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                        <CardTitle className="text-xl text-gray-800">
                            Arrange Your Photos
                        </CardTitle>
                        <CardDescription>
                            Drag to reorder • {selectedFiles.length}/10 photos
                        </CardDescription>
                    </div>
                </div>
                <Progress
                    value={(selectedFiles.length / 10) * 100}
                    className="h-2 bg-pink-100/50 mt-4"
                />
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto px-4 pb-4">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={previews.map((_, i) => `photo-${i}`)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {previews.map((preview, index) => (
                                <SortablePhotoItem
                                    key={`photo-${index}`}
                                    id={`photo-${index}`}
                                    index={index}
                                    preview={preview}
                                    caption={captions[index] || ''}
                                    onRemove={() => handleRemove(index)}
                                    onCaptionChange={(newCaption) => {
                                        const newCaptions = [...captions];
                                        newCaptions[index] = newCaption;
                                        setCaptions(newCaptions);
                                    }}
                                    metadata={metadata[index]}
                                />
                            ))}
                        </div>
                    </SortableContext>

                    <DragOverlay>
                        {activeId ? (
                            <div className="bg-white rounded-lg shadow-xl ring-2 ring-pink-200 opacity-80">
                                <SortablePhotoItem
                                    id={activeId}
                                    index={parseInt(activeId.split('-')[1])}
                                    preview={
                                        previews[
                                            parseInt(activeId.split('-')[1])
                                        ]
                                    }
                                    caption={
                                        captions[
                                            parseInt(activeId.split('-')[1])
                                        ] || ''
                                    }
                                    onRemove={() => {}}
                                    onCaptionChange={() => {}}
                                    metadata={
                                        metadata[
                                            parseInt(activeId.split('-')[1])
                                        ]
                                    }
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </CardContent>
        </Card>
    );
}
