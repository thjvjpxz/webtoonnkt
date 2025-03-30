import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "placehold.co",
      "img.otruyenapi.com",
      "dynamic-media-cdn.tripadvisor.com",
      "lh3.googleusercontent.com"
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
