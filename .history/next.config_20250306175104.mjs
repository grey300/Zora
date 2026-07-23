/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "img.clerk.com"],
  },
  // Remove the following line:
  // experimental: {
  //   forceSwcTransforms: true,
  // },
  async redirects() {
    return [
      {
        source: "/some-source",
        destination: "/some-destination",
        permanent: false,
      },
    ];
  },
  headers() {
    return [
      {
        source: "/api/game",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:3000", // replace with your actual origin if needed
          },
        ],
      },
    ];
  },
};

export default nextConfig;
