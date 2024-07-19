/** @type {import('next').NextConfig} */
import withVideos from "next-videos";

const nextConfig = {
  reactStrictMode: false,
  output: "export",
  trailingSlash: true,
  images: {
    domains: ["i0.wp.com", "*"],
    unoptimized: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default withVideos(nextConfig);
