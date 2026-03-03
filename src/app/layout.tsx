import './globals.css';
import type { Metadata } from 'next';
import { Inter, Petit_Formal_Script } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });
const petitFormal = Petit_Formal_Script({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-handwriting',
});

export const metadata: Metadata = {
    title: 'A Gift From Your Broke But Loving Partner',
    description:
        'A beautiful easily shareable scrapbook for couples and a gift for those without funds.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={petitFormal.variable}>
            <body className={inter.className}>
                <main className="min-h-screen">{children}</main>
                <Toaster position="top-center" />
            </body>
        </html>
    );
}
