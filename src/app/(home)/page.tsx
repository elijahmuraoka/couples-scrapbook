// Server Component
import { HomeHero } from './components/home-hero';
import { ScrapbookAccess } from './components/scrapbook-access';
import { Footer } from './components/footer';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8">
                    <HomeHero />
                    <ScrapbookAccess />
                </div>
            </div>
            <Footer />
            {/* Bio Card - Positioned in Corner */}
            <div className="absolute bottom-6 right-6 max-w-[250px] bg-white rounded-lg shadow-md p-4 bg-gradient-to-r from-pink-50 to-rose-50">
                <p className="text-sm text-gray-600 italic">
                    Hey, I&apos;m Elijah! 👋
                    <br />I built this because my 1-year anniversary is coming
                    up, and I couldn&apos;t think of a good gift for my
                    girlfriend. I hope some of you can use this too and make
                    your partner happy seeing all your memories together. 😁💖
                </p>
            </div>
        </div>
    );
}
