/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static export — every page is SSG, no server runtime needed.
  // Renders as a free, CDN-served Render Static Site.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  transpilePackages: ["@excalidraw/excalidraw"],
};

export default nextConfig;
