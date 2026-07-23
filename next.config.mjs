/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.pollinations.ai" }, // AI course banners
      { protocol: "https", hostname: "res.cloudinary.com" }, // uploaded banners
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatars
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
