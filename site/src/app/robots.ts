import type { MetadataRoute } from "next";
import { shouldAllowIndexing, siteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const indexable = shouldAllowIndexing();
  return {
    rules: indexable
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: indexable ? `${siteUrl}/sitemap.xml` : undefined,
  };
}
