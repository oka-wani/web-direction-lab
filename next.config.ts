import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/services/small-site-production", destination: "/services/web-production", permanent: true },
      { source: "/services/editable-site-production", destination: "/services/web-production", permanent: true },
      { source: "/services/website-improvement", destination: "/services/seo-support", permanent: true },
      { source: "/services/website-operation-support", destination: "/services/web-operation", permanent: true },
      { source: "/services/business-efficiency-tools", destination: "/services/automation-tools", permanent: true },
      { source: "/services/web-ai-consulting", destination: "/services/ai-business-improvement", permanent: true },
    ];
  },
};

export default nextConfig;
