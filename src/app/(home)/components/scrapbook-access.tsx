'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export function ScrapbookAccess() {
    const [password, setPassword] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) return;

        setIsChecking(true);
        try {
            const { data, error } = await supabase
                .from('scrapbooks')
                .select('code')
                .eq('code', password.toUpperCase())
                .single();

            if (error || !data) {
                toast.error("This scrapbook doesn't exist", {
                    style: {
                        backgroundColor: '#FEE2E2',
                        border: '1px solid #FCA5A5',
                        color: '#991B1B',
                    },
                    duration: 3000,
                });
                return;
            }

            router.push(`/scrapbook/${data.code}`);
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <Card className="border-pink-100 shadow-lg shadow-pink-100/50">
            <CardHeader>
                <CardTitle className="text-center text-gray-800 text-lg font-medium">
                    Enter Your Love Story
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <Input
                            type="text"
                            placeholder="Enter your password"
                            className="text-center border-pink-200 focus-visible:ring-pink-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
                            disabled={isChecking}
                        >
                            {isChecking ? 'Checking...' : 'View Scrapbook'}
                        </Button>
                    </form>
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
    );
} 