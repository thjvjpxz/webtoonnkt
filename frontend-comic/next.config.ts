import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "sv1.otruyencdn.com",
      "img.otruyen.xyz"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "example.com",
        pathname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
