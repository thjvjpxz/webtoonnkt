import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "sv1.otruyencdn.com",
      "img.otruyen.xyz",
      "img.otruyenapi.com"
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
      {
        protocol: "https",
        hostname: "sv1.otruyencdn.com",
        pathname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
