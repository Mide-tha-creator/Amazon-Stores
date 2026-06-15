import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/amazon",
        destination: "/business-reports/sales-dashboard",
        permanent: false,
      },
      {
        source: "/amazon/dashboard/sales",
        destination: "/business-reports/sales-dashboard",
        permanent: false,
      },
      {
        source: "/amazon/reports/:slug",
        destination:
          "/business-reports/accounts/chokebody/reports/:slug",
        permanent: false,
      },
      {
        source: "/store/amazon-chokebody/dashboard/sales",
        destination: "/business-reports/accounts/chokebody/sales-dashboard",
        permanent: false,
      },
      {
        source: "/store/amazon-apex/dashboard/sales",
        destination: "/business-reports/accounts/sanabul/sales-dashboard",
        permanent: false,
      },
      {
        source: "/store/amazon-nova/dashboard/sales",
        destination: "/business-reports/accounts/kursat/sales-dashboard",
        permanent: false,
      },
      {
        source: "/store/amazon-chokebody/reports/:slug",
        destination: "/business-reports/accounts/chokebody/reports/:slug",
        permanent: false,
      },
      {
        source: "/store/amazon-apex/reports/:slug",
        destination: "/business-reports/accounts/sanabul/reports/:slug",
        permanent: false,
      },
      {
        source: "/store/amazon-nova/reports/:slug",
        destination: "/business-reports/accounts/kursat/reports/:slug",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
