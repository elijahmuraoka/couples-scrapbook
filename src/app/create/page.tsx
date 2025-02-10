// Server Component
import { CreateHeader } from './components/create-header';
import { ScrapbookForm } from './components/scrapbook-form';

export default function CreatePage({
    searchParams,
}: {
    searchParams: { code?: string };
}) {
    // If code exists, we're editing an existing draft
    const isEditing = !!searchParams.code;

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-serif text-gray-800 mb-8">
                    {isEditing
                        ? 'Edit Your Scrapbook'
                        : 'Create Your Scrapbook'}
                </h1>
                <ScrapbookForm editCode={searchParams.code} />
            </div>
        </div>
    );
}
