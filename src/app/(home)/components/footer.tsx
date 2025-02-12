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
                    <div className="flex gap-4 mb-8">
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

                    {/* Venmo Section */}
                    <div className="text-center mb-8">
                        <Link
                            href="https://venmo.com/?txn=pay&audience=friends&recipients=elijahmuraoka"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-rose-500/10 text-pink-600 hover:from-pink-500/20 hover:to-rose-500/20 transition-colors hover:cursor-pointer"
                        >
                            <Heart className="w-6 h-6 md:w-4 md:h-4" />
                            <span className="text-sm">
                                Please support me so I can buy my girlfriend a
                                real gift
                            </span>
                        </Link>
                    </div>

                    {/* Copyright */}
                    <div className="text-center text-xs text-gray-500">
                        <p>
                            © {new Date().getFullYear()} Creadev. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
