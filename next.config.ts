import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/blog/careers',
                destination: '/careers',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;

