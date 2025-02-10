'use client';

import { useState } from 'react';
import { ScrapbookDetails } from './scrapbook-details';
import { PhotoUpload } from './photo-upload';
import { SelectedPhotos } from './selected-photos';
import { SubmitButton } from './submit-button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { MusicSelector } from './music-selector';

export function ScrapbookForm() {
    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [musicFile, setMusicFile] = useState<File | null>(null);
    const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
    const [captions, setCaptions] = useState<string[]>([]);
    const [metadata, setMetadata] = useState<Array<{
        location?: string;
        takenAt?: Date;
    }>>([]);
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title, 
                    note,
                    music_id: selectedSongId,
                    is_published: false // Save as draft
                }),
            });

            const scrapbook = await response.json();
            if (!response.ok) throw new Error(scrapbook.error);

            // Upload photos with captions
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
                        caption: captions[i]
                    }]);

                if (dbError) throw dbError;
            }

            // Redirect to preview instead of final page
            router.push(`/scrapbook/preview/${scrapbook.code}`);
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

    const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('audio/')) {
            toast.error('Please upload an audio file');
            return;
        }
        
        // Validate file size (e.g., 10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Audio file must be less than 10MB');
            return;
        }
        
        setMusicFile(file);
    };

    const handlePhotoSelect = (files: FileList) => {
        // ... existing file handling code ...
        setCaptions(prev => [...prev, ...Array(files.length).fill('')]);
    };

    return (
        <div className="space-y-6">
            <ScrapbookDetails
                title={title}
                setTitle={setTitle}
                note={note}
                setNote={setNote}
            />
            <MusicSelector
                selectedSongId={selectedSongId}
                onSelect={setSelectedSongId}
            />
            <PhotoUpload
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                setPreviews={setPreviews}
                setMetadata={setMetadata}
                setCaptions={setCaptions}
            />
            {selectedFiles.length > 0 && (
                <SelectedPhotos
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                    previews={previews}
                    setPreviews={setPreviews}
                    captions={captions}
                    setCaptions={setCaptions}
                    metadata={metadata}
                    setMetadata={setMetadata}
                />
            )}
            <SubmitButton
                onClick={handleSubmit}
                isLoading={isLoading}
            />
        </div>
    );
} 