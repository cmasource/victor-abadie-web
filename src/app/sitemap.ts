import type { MetadataRoute } from "next";
import { getPublishedProperties } from "@/lib/propertiesRepository";
import { buildCanonicalUrl } from "@/lib/seo";

const now = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getPublishedProperties();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: buildCanonicalUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: buildCanonicalUrl("/propiedades"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: buildCanonicalUrl("/vende-tu-propiedad"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: buildCanonicalUrl("/contacto"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((property) => ({
    url: buildCanonicalUrl(`/propiedades/${property.slug}`),
    lastModified: new Date(property.updatedAt || property.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
