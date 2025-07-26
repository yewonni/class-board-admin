import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    scrollRestoration: true,
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias["@sentry/node"] = "@sentry/browser";
    }

    return config;
  },
};

export default bundleAnalyzer(nextConfig);
