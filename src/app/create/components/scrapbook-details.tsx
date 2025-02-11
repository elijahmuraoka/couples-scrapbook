'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Book } from 'lucide-react';

interface ScrapbookDetailsProps {
    title: string;
    setTitle: (title: string) => void;
    note: string;
    setNote: (note: string) => void;
}

const MAX_TITLE_LENGTH = 50;

export function ScrapbookDetails({
    title,
    setTitle,
    note,
    setNote,
}: ScrapbookDetailsProps) {
    const maxNoteLength = 1000; // Longer limit for the note
    const noteCharCount = note.length;

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        if (newTitle.length <= MAX_TITLE_LENGTH) {
            setTitle(newTitle);
        }
    };

    return (
        <Card className="border-pink-100 shadow-md">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-50 rounded-lg">
                        <Book className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                        <CardTitle className="text-xl text-gray-800">
                            Scrapbook Details
                        </CardTitle>
                        <CardDescription>
                            Give your scrapbook a title and add a personal note
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label htmlFor="title" className="text-gray-600">
                            Title
                        </Label>
                        <span className="text-sm text-gray-400">
                            {title.length}/{MAX_TITLE_LENGTH}
                        </span>
                    </div>
                    <Input
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Enter a title for your scrapbook"
                        className="w-full border-pink-200 focus-visible:ring-pink-500"
                        maxLength={MAX_TITLE_LENGTH}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="note" className="text-sm font-medium text-gray-700">
                        Note (Optional)
                    </label>
                    <Textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Write a note to accompany your photos..."
                        className="min-h-[150px] resize-none"
                        maxLength={maxNoteLength}
                    />
                    <div className="text-sm text-gray-500 text-right">
                        {noteCharCount}/{maxNoteLength} characters
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 