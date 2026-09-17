/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['192.168.18.39:3000', 'localhost:3000'],
    },
  },
};

export default nextConfig;
