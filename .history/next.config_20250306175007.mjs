module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "img.clerk.com"],
  },
  experimental: {
    forceSwcTransforms: true, // for better support with cookies
  },
  async redirects() {
    return [
      {
        source: "/some-source",
        destination: "/some-destination",
        permanent: false,
      },
    ];
  },
  // Add the following
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
