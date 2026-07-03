import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

const buildId =
  process.env.NODE_ENV === "development"
    ? "dev"
    : process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ??
      Date.now().toString(36);

fs.writeFileSync(
  path.join(__dirname, "public/version.json"),
  JSON.stringify({ buildId })
);

const monorepoRoot = path.resolve(__dirname, "../..");

const nextConfig: NextConfig = {
  transpilePackages: [
    '@haedda/types',
    '@haedda/constants',
    '@haedda/utils',
    '@haedda/domain',
    '@haedda/storage',
  ],
  env: {
    NEXT_PUBLIC_BUILD_ID: buildId,
  },
  turbopack: {
    root: monorepoRoot,
  },
  outputFileTracingRoot: monorepoRoot,
  async headers() {
    return [
      {
        source: "/version.json",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
