export interface ScrapbookDraft {
    title: string;
    note: string | null;
    senderName: string | null;
    selectedFiles: File[];
    previews: string[];
    captions: string[];
    metadata: Array<{ location?: string; takenAt?: Date }>;
    selectedSongId: string | null;
}

// Scrapbook Type
export interface Scrapbook {
    id: string; // UUID
    code: string; // Unique URL code
    title: string; // Required
    note?: string; // Optional
    sender_name?: string; // Optional
    music_id?: string; // Optional
    is_published: boolean; // Defaults to false
    created_at: Date; // Auto-generated
    photos: Photo[]; // One-to-many relation
}

// Helper function to check if data is a Scrapbook
export function isScrapbook(data: any): data is Scrapbook {
    return (
        typeof data === 'object' &&
        data !== null &&
        'id' in data &&
        'title' in data &&
        'photos' in data &&
        'code' in data &&
        'created_at' in data &&
        Array.isArray(data.photos) &&
        data.photos.every(
            (photo: any) =>
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
