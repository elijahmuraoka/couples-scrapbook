import { ScrapbookDraft } from '@/types/scrapbook';
import { create } from 'zustand';

interface ScrapbookStore {
    draft: ScrapbookDraft;
    /** Stable unique IDs for each photo (parallel to previews/captions/etc) */
    photoIds: string[];
    updateDraft: (updates: Partial<ScrapbookDraft>) => void;
    setPhotoIds: (ids: string[]) => void;
    clearDraft: () => void;
}

const initialState: ScrapbookDraft = {
    title: '',
    note: null,
    senderName: null,
    selectedFiles: [],
    previews: [],
    captions: [],
    metadata: [],
    selectedSongId: null,
};

let _idCounter = 0;
/** Generate a lightweight unique id (no crypto dependency needed). */
export function generatePhotoId(): string {
    return `photo-${Date.now()}-${++_idCounter}`;
}

export const useScrapbookStore = create<ScrapbookStore>()((set) => ({
    draft: initialState,
    photoIds: [],
    updateDraft: (updates) =>
        set((state) => ({
            draft: { ...state.draft, ...updates },
        })),
    setPhotoIds: (ids) => set({ photoIds: ids }),
    clearDraft: () => {
        // Clean up any existing blob URLs
        set((state) => {
            state.draft.previews.forEach((url) => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
            return { draft: initialState, photoIds: [] };
        });
    },
}));
