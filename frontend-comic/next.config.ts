import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "placehold.co",
      "img.otruyenapi.com",
      "dynamic-media-cdn.tripadvisor.com",
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
