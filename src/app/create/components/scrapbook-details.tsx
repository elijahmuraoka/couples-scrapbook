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

interface ScrapbookDetailsProps {
    title: string;
    setTitle: (title: string) => void;
    note: string;
    setNote: (note: string) => void;
}

export function ScrapbookDetails({
    title,
    setTitle,
    note,
    setNote,
}: ScrapbookDetailsProps) {
    const maxNoteLength = 1000; // Longer limit for the note
    const noteCharCount = note.length;

    return (
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
                    <label htmlFor="title" className="text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a title for your scrapbook"
                        className="w-full"
                        maxLength={100}
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