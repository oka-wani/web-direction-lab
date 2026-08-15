import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? "https://www.wani-san.com",
  output: "static",
  adapter: cloudflare({ imageService: "compile", prerenderEnvironment: "node" }),
  integrations: [react(), sitemap()],
  redirects: {
    "/services/small-site-production": "/services/web-production",
    "/services/editable-site-production": "/services/web-production",
    "/services/website-improvement": "/services/seo-support",
    "/services/website-operation-support": "/services/web-operation",
    "/services/business-efficiency-tools": "/services/automation-tools",
    "/services/web-ai-consulting": "/services/ai-business-improvement",
    "/guide": "/knowledge",
    "/pricing": "/services",
    "/roadmap": "/knowledge",
    "/articles": "/knowledge",
  },
});
