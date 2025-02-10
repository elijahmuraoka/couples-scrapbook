// Server Component
import { CreateHeader } from './components/create-header';
import { ScrapbookForm } from './components/scrapbook-form';

export default function CreateScrapbook() {
    return (
        <div className="min-h-screen w-full mt-12 mb-24 flex items-center justify-center">
            <div className="max-w-[800px] w-[90vw] space-y-8">
                <CreateHeader />
                <ScrapbookForm />
            </div>
        </div>
    );
}
