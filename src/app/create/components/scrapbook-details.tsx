import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ScrapbookDetailsProps {
    title: string;
    setTitle: (value: string) => void;
    note: string;
    setNote: (value: string) => void;
}

export function ScrapbookDetails({
    title,
    setTitle,
    note,
    setNote,
}: ScrapbookDetailsProps) {
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
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        placeholder="Enter a romantic title"
                        className="border-pink-200 focus-visible:ring-pink-500"
                    />
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Write a sweet note... (optional)"
                        className="w-full h-24 px-3 py-2 rounded-md border border-pink-200 focus-visible:ring-pink-500 focus:outline-none focus:ring-2 resize-none"
                    />
                </div>
            </CardContent>
        </Card>
    );
} 