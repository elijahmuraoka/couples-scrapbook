import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'npleumqkgcfqoomfkfkv.supabase.co',
            },
        ],
    },
};

export default nextConfig;
