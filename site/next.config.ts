import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do not set outputFileTracingRoot to repo parent on Netlify: only site/node_modules
  // is installed there; tracing the monorepo root fails during "Collecting build traces".
  images: {
    dangerouslyAllowSVG: true,
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
