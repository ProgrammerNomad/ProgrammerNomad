import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Scope tracing to site/ (dual lockfiles at repo root + site); do not use repo parent on Netlify.
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
