// Server Component
import { HomeHero } from './components/home-hero';
import { ScrapbookAccess } from './components/scrapbook-access';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <HomeHero />
                <ScrapbookAccess />
            </div>
        </div>
    );
}
