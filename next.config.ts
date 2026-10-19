import type { NextConfig } from "next";

const isCloudflare =
  process.env.CF_PAGES === "1" ||
  process.env.CLOUDFLARE_PAGES === "true" ||
  process.env.DEPLOY_TARGET === "cloudflare" ||
  process.env.npm_lifecycle_event?.includes("cf");

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}` : "";

let basePath = "";
if (isCloudflare) {
  basePath = "";
} else if (process.env.NEXT_PUBLIC_BASE_PATH !== undefined) {
  basePath = process.env.NEXT_PUBLIC_BASE_PATH;
} else if (isGithubPages && repoName) {
  basePath = repoName;
}

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
