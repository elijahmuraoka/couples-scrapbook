import { ScrapbookForm } from './components/scrapbook-form';

export default function CreatePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
            <div className="max-w-4xl mx-auto pt-12 pb-24">
                <ScrapbookForm />
            </div>
        </div>
    );
}
