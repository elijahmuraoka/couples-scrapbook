'use client';

import { useState } from 'react';
import { ScrapbookDetails } from './scrapbook-details';
import { PhotoUpload } from './photo-upload';
import { SelectedPhotos } from './selected-photos';
import { SubmitButton } from './submit-button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export function ScrapbookForm() {
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const router = useRouter();

    const handleSubmit = async () => {
        // Form validation
        if (!title.trim()) {
            toast.error('Please enter a title for your scrapbook', {
                style: {
                    backgroundColor: '#FEE2E2',
                    border: '1px solid #FCA5A5',
                    color: '#991B1B',
                },
                duration: 3000,
            });
            return;
        }

        if (selectedFiles.length === 0) {
            toast.error('Please select at least one photo', {
                style: {
                    backgroundColor: '#FEE2E2',
                    border: '1px solid #FCA5A5',
                    color: '#991B1B',
                },
                duration: 3000,
            });
            return;
        }

        setIsLoading(true);
        try {
            // Create scrapbook
            const response = await fetch('/api/scrapbooks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, note }),
            });

            const scrapbook = await response.json();
            if (!response.ok) throw new Error(scrapbook.error);

            // Upload photos
            for (let i = 0; i < selectedFiles.length; i++) {
                setUploadProgress(Math.round((i / selectedFiles.length) * 100));
                const file = selectedFiles[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${scrapbook.id}/${Math.random()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('photos')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('photos')
                    .getPublicUrl(fileName);

                const { error: dbError } = await supabase
                    .from('photos')
                    .insert([{
                        scrapbook_id: scrapbook.id,
                        url: publicUrl,
                        order: i,
                    }]);

                if (dbError) throw dbError;
            }

            router.push(`/scrapbook/${scrapbook.code}`);
        } catch (error) {
            toast.error('Something went wrong. Please try again.', {
                style: {
                    backgroundColor: '#FEE2E2',
                    border: '1px solid #FCA5A5',
                    color: '#991B1B',
                },
                duration: 3000,
            });
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="space-y-6">
            <ScrapbookDetails
                title={title}
                setTitle={setTitle}
                note={note}
                setNote={setNote}
            />
            <PhotoUpload
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                setPreviews={setPreviews}
            />
            {selectedFiles.length > 0 && (
                <SelectedPhotos
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                    previews={previews}
                    setPreviews={setPreviews}
                />
            )}
            <SubmitButton
                onClick={handleSubmit}
                isLoading={isLoading}
            />
        </div>
    );
} 