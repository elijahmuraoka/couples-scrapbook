'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import Image from 'next/image';

interface CaptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    photoUrl: string;
    initialCaption?: string;
    onSave: (caption: string) => void;
}

export function CaptionModal({
    isOpen,
    onClose,
    photoUrl,
    initialCaption = '',
    onSave,
}: CaptionModalProps) {
    const [caption, setCaption] = useState(initialCaption);
    const [charCount, setCharCount] = useState(initialCaption.length);

    const handleSave = () => {
        onSave(caption);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Photo Caption</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6">
                    {/* Photo Preview */}
                    <div className="relative aspect-[3/2] rounded-lg overflow-hidden">
                        <Image
                            src={photoUrl}
                            alt="Photo preview"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Caption Input */}
                    <div className="space-y-2">
                        <Textarea
                            value={caption}
                            onChange={(e) => {
                                setCaption(e.target.value);
                                setCharCount(e.target.value.length);
                            }}
                            placeholder="Add a caption to this photo..."
                            className="min-h-[100px]"
                            maxLength={200}
                        />
                        <div className="text-sm text-gray-500 text-right">
                            {charCount}/200 characters
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Caption</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
