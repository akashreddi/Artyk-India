import type { MetadataRoute } from "next";
import { brands } from "@/data/brands";
import { org } from "@/data/org";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = ["", "/about", "/brands", "/consulting", "/contact"];
  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${org.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${org.url}/brands/${b.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...brandRoutes];
}
