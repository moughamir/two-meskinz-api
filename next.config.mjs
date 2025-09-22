/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'benchmarktooling.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'overstock.com',
        port: '',
        pathname: '/**',
      },
      // Add other potential domains from your product sources here
    ],
  },
};

export default nextConfig;
