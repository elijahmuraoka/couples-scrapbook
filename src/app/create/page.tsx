import { ScrapbookForm } from './components/scrapbook-form';

export default function CreatePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
                <ScrapbookForm />
            </div>
        </div>
    );
}
