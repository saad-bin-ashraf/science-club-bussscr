import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl().toString().replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/admin/", "/api/auth/", "/api/upload", "/api/apply", "/api/contact", "/profile", "/login"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
