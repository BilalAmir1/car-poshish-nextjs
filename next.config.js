/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  // Drops the `X-Powered-By: Next.js` response header — a few bytes off
  // every response and one less thing revealing the stack to scanners.
  poweredByHeader: false,
  images: {
    // Lets next/image load media uploaded in the Strapi CMS (product
    // photos, gallery before/after shots) once you start using them.
    // Add your production CMS domain here too once you've deployed it.
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "1337" },
      { protocol: "https", hostname: "**.strapiapp.com" },
    ],
  },
};

module.exports = nextConfig;
