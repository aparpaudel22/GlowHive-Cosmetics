/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper client-side navigation
  reactStrictMode: true,
  
  // Turbopack configuration (empty config to silence the error)
  turbopack: {
    // Empty config to let Turbopack use defaults
  },
  
  // Images configuration
  images: {
    domains: ['images.unsplash.com', 'localhost'],
    unoptimized: true,
  },
};

export default nextConfig;