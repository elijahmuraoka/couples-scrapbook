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
import { Heart, ArrowLeft, ImagePlus } from 'lucide-react';

export default function CreateScrapbook() {
    return (
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
                            <CardDescription>
                                Add up to 10 of your favorite moments
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
                                                    or drag and drop your files
                                                    here
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
                                />
                            </label>
                        </CardContent>
                    </Card>

                    <div className="flex justify-center pt-4">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all duration-300 px-8"
                        >
                            Create Scrapbook
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
