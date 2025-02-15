import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React Strict Mode (optional, but recommended)
  reactStrictMode: true,

  // Tell Next.js which external domains are allowed for images
  images: {
    domains: [
      'wyespxlrszeqfcotudwy.supabase.co', // <-- Your Supabase domain
    ],
  },

  // Add environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
