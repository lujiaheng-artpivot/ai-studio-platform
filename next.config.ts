import type { NextConfig } from "next";

const configuredCanonicalHost = (process.env.NEXT_PUBLIC_CANONICAL_HOST || '')
  .trim()
  .replace(/^https?:\/\//i, '')
  .replace(/\/+$/, '')
  .toLowerCase();
const canonicalHost = configuredCanonicalHost || 'artpivot.top';

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: `www.${canonicalHost}`,
          },
        ],
        destination: `https://${canonicalHost}/:path*`,
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: `app.${canonicalHost}`,
          },
        ],
        destination: `https://${canonicalHost}/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
