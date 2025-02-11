export interface ScrapbookDraft {
    title: string;
    note: string | null;
    selectedFiles: File[];
    previews: string[];
    captions: string[];
    metadata: Array<{ location?: string; takenAt?: Date }>;
    selectedSongId: string | null;
}
