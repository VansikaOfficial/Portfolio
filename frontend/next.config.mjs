/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**.onrender.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  compiler: {
    emotion: true,
  },
};

export default nextConfig;
