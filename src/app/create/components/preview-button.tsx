import { Button } from '@/components/ui/button';

interface PreviewButtonProps {
    onClick: () => Promise<void>;
    isLoading: boolean;
}

// Phase 2: Replaced raw <button> with shared <Button> component.
// Removed hover:scale-105/active:scale-95 (no other button in the app does this).
// Uses same gradient pattern as Publish & Share buttons for consistency.
export function PreviewButton({ onClick, isLoading }: PreviewButtonProps) {
    return (
        <div className="flex justify-center pt-4">
            <Button
                onClick={onClick}
                disabled={isLoading}
                size="lg"
                className="px-10 py-3 h-auto text-base bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
            >
                {isLoading ? 'Loading Preview...' : 'Preview Scrapbook'}
            </Button>
        </div>
    );
}
