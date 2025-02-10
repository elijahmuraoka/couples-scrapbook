interface SubmitButtonProps {
    onClick: () => Promise<void>;
    isLoading: boolean;
}

export function SubmitButton({ onClick, isLoading }: SubmitButtonProps) {
    return (
        <div className="flex justify-center pt-4">
            <button
                onClick={onClick}
                disabled={isLoading}
                className={`
                    px-8 py-2 rounded-md text-white font-medium
                    bg-gradient-to-r from-pink-500 to-rose-500 
                    hover:from-pink-600 hover:to-rose-600 
                    transition-all duration-300
                    hover:scale-105 active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isLoading ? 'animate-pulse' : ''}
                `}
            >
                {isLoading ? 'Creating...' : 'Create Scrapbook'}
            </button>
        </div>
    );
} 