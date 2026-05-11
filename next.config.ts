import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow HMR/dev assets when the page origin is 127.0.0.1 (e.g. bookmark vs localhost).
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    swcPlugins: [["@lingui/swc-plugin", {}]],
  },
  turbopack: {
    rules: {
      "*.po": {
        loaders: ["@lingui/loader"],
        as: "*.js",
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({ test: /\.po$/, use: "@lingui/loader" });
    return config;
  },
};

export default nextConfig;
