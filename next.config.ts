import type { NextConfig } from "next";

const hostname = process.env.NEXT_PUBLIC_API_BASE_URL?.split("://")[1] || "";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname,
      }
    ]
  }
};

export default nextConfig;
