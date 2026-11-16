import type { NextConfig } from "next";

// Static site: every page is built ahead of time into the `out/` folder.
// No server and no database are needed to host it.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // GitHub Pages serves the site under /<repo-name>/. Empty everywhere else (localhost, Vercel).
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
