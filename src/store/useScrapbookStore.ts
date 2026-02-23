import { ScrapbookDraft } from '@/types/scrapbook';
import { create } from 'zustand';

interface ScrapbookStore {
    draft: ScrapbookDraft;
    updateDraft: (updates: Partial<ScrapbookDraft>) => void;
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

export const useScrapbookStore = create<ScrapbookStore>()((set) => ({
    draft: initialState,
    updateDraft: (updates) =>
        set((state) => ({
            draft: { ...state.draft, ...updates },
        })),
    clearDraft: () => {
        // Clean up any existing blob URLs
        set((state) => {
            state.draft.previews.forEach((url) => {
                if (url.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
            return { draft: initialState };
        });
    },
}));
