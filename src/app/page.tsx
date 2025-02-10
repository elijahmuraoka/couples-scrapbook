import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-4 animate-float">
                    <div className="flex justify-center">
                        <Heart className="w-12 h-12 text-pink-500 animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text">
                        Digital Scrapbook
                    </h1>
                    <p className="text-gray-500">
                        Capture your love story, one memory at a time
                    </p>
                </div>

                <Card className="border-pink-100 shadow-lg shadow-pink-100/50">
                    <CardHeader>
                        <CardTitle className="text-center text-gray-800 text-lg font-medium">
                            Enter Your Love Story
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="Enter your password"
                                    className="text-center border-pink-200 focus-visible:ring-pink-500"
                                />
                                <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all duration-300">
                                    View Scrapbook
                                </Button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-pink-100" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-pink-400">
                                        or
                                    </span>
                                </div>
                            </div>
                            <Link href="/create" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full border-pink-200 text-pink-600 hover:bg-pink-50"
                                >
                                    Create New Scrapbook
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
