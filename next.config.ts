import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    const serverOrigin = new URL(process.env.GRAPHQL_SERVER_URL ?? "http://localhost:4000/graphql").origin;
    return [{ source: "/tenant-assets/:path*", destination: `${serverOrigin}/storage/:path*` }];
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
