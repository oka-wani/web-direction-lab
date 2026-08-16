import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

const hiddenFromSitemap = [
  "/knowledge",
  "/guide",
  "/articles",
  "/learn",
  "/tools",
  "/modules",
  "/preview",
  "/mv-preview",
];

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? "https://www.wani-san.com",
  output: "static",
  adapter: cloudflare({ imageService: "compile", prerenderEnvironment: "node" }),
  integrations: [
    react(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/\/$/, "") || "/";
        return !hiddenFromSitemap.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
      },
    }),
  ],
  redirects: {
    "/services/small-site-production": "/services/web-production",
    "/services/editable-site-production": "/services/web-production",
    "/services/website-improvement": "/services/web-improvement",
    "/services/website-operation-support": "/services/web-production",
    "/services/business-efficiency-tools": "/services",
    "/services/web-ai-consulting": "/services",
    "/services/seo-support": "/services/web-improvement",
    "/services/instagram-support": "/services",
    "/services/automation-tools": "/services",
    "/services/ai-business-improvement": "/services",
    "/services/web-operation": "/services/web-production",
    "/guide": "/knowledge",
    "/pricing": "/services",
    "/roadmap": "/knowledge",
    "/articles": "/knowledge",
  },
});
