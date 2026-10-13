import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// Windows junctions (C:\xampp\...\site → D:\Websites\...\site): Next resolves the app
// via realpath while process.cwd() can stay on the junction path, breaking path.join.
// scripts/next-cli.cjs chdirs before invoking Next; this covers direct `npx next` too.
const projectDir = fs.realpathSync.native
  ? fs.realpathSync.native(process.cwd())
  : fs.realpathSync(process.cwd());
if (projectDir !== process.cwd()) {
  process.chdir(projectDir);
}

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(projectDir, ".."),
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
