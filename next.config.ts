import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
        return [
          {
            source: "/api/:path*", 
            headers: [
              { key: "Access-Control-Allow-Credentials", value: "true" },
              { key: "Access-Control-Allow-Origin", value: "https://two-meskinz.vercel.app" },

              { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
              { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
            ],
          },
        ];
      },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "benchmarktooling.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "overstock.com",
        port: "",
        pathname: "/**",
      },
      // Add other potential domains from your product sources here
    ],
  },
};

export default nextConfig;
