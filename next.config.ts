import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'fdlvpabtxiofluuqrnle.supabase.co' },
    ],
  },
};

export default nextConfig;
