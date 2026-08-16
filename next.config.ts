import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    ...(isGithubPages
      ? {
          loader: "custom" as const,
          loaderFile: "./src/lib/image-loader.ts",
        }
      : {}),
  },
  poweredByHeader: false,
  ...(isGithubPages
    ? {
        output: "export" as const,
        trailingSlash: true,
        ...(basePath ? { basePath } : {}),
      }
    : {}),
};

export default nextConfig;
