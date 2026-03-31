export interface ScrapbookDraft {
    title: string;
    note: string | null;
    senderName: string | null;
    selectedFiles: File[];
    previews: string[];
    captions: string[];
    metadata: Array<{ location?: string; takenAt?: Date }>;
    selectedSongId: string | null;
    customMusicFile: File | null;
}

// Scrapbook Type
export interface Scrapbook {
    id: string; // UUID
    code: string; // Unique URL code
    title: string; // Required
    note?: string; // Optional
    sender_name?: string; // Optional
    music_id?: string; // Optional
    custom_music_url?: string; // Optional
    is_published: boolean; // Defaults to false
    created_at: Date; // Auto-generated
    photos: Photo[]; // One-to-many relation
}

// Helper function to check if data is a Scrapbook
export function isScrapbook(data: unknown): data is Scrapbook {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;
    return (
        'id' in obj &&
        'title' in obj &&
        'photos' in obj &&
        'code' in obj &&
        'created_at' in obj &&
        Array.isArray(obj.photos) &&
        obj.photos.every(
            (photo: unknown) =>
                typeof photo === 'object' &&
                photo !== null &&
                'id' in photo &&
                'url' in photo &&
                'scrapbook_id' in photo &&
                'created_at' in photo
        )
    );
}

// Photo Type
export interface Photo {
    id: string; // UUID
    scrapbook_id: string; // Foreign key
    url: string; // Required, storage URL
    order: number; // Required, position in book
    caption?: string; // Optional
    location?: string; // Optional
    taken_at?: Date; // Optional
    created_at: Date; // Auto-generated
}
