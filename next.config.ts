import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Removed experimental appDir as it's no longer needed in Next.js 13+
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to bundle Node.js modules in the browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        os: false,
        path: false,
        url: false,
        zlib: false,
      };
    }
    
    return config;
  },
}

export default nextConfig;