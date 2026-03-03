import {
    Heart,
    Mail,
    LinkedinIcon,
    InstagramIcon,
    TwitterIcon,
} from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full py-12 mt-auto">
            <div className="max-w-4xl mx-auto px-4">
                <div className="relative flex flex-col items-center">
                    {/* Social Links - Centered */}
                    <div className="flex gap-4 mb-6">
                        <Link
                            href="https://linkedin.com/in/elijahmuraoka"
                            target="_blank"
                            className="text-gray-600 hover:text-pink-500 transition-colors"
                        >
                            <LinkedinIcon className="w-6 h-6" />
                        </Link>
                        <Link
                            href="https://instagram.com/elijah.muraoka"
                            target="_blank"
                            className="text-gray-600 hover:text-pink-500 transition-colors"
                        >
                            <InstagramIcon className="w-6 h-6" />
                        </Link>
                        <Link
                            href="mailto:elijahmuraoka.services@gmail.com"
                            className="text-gray-600 hover:text-pink-500 transition-colors"
                        >
                            <Mail className="w-6 h-6" />
                        </Link>
                        <Link
                            href="https://twitter.com/elijah_muraoka_"
                            target="_blank"
                            className="text-gray-600 hover:text-pink-500 transition-colors"
                        >
                            <TwitterIcon className="w-6 h-6" />
                        </Link>
                    </div>

                    {/* Copyright + Venmo */}
                    <div className="text-center text-xs text-gray-400 space-y-1">
                        <p>
                            © {new Date().getFullYear()} Creadev. All rights
                            reserved.
                        </p>
                        <Link
                            href="https://venmo.com/?txn=pay&audience=friends&recipients=elijahmuraoka"
                            target="_blank"
                            className="inline-flex items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors"
                        >
                            <Heart className="w-3 h-3" />
                            <span>Support this project</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
