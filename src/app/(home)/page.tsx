// Server Component
import { HomeHero } from './components/home-hero';
import { ScrapbookAccess } from './components/scrapbook-access';
import { Footer } from './components/footer';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 md:p-12">
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8">
                    <HomeHero />
                    <ScrapbookAccess />
                </div>
            </div>
            <div className="flex flex-col items-center justify-center">
                <Footer />
                {/* Bio Card - Subtle, doesn't compete with main CTA */}
                <p className="mt-6 max-w-xs text-center text-xs text-gray-400 italic leading-relaxed">
                    Built by Elijah for his 1-year anniversary 💖
                </p>
            </div>
        </div>
    );
}
