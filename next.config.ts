import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo>/ unless the repo is <user>.github.io.
// The deploy workflow sets NEXT_PUBLIC_BASE_PATH accordingly; local dev leaves it empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
