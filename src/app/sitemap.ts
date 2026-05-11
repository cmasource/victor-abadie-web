import type { MetadataRoute } from "next";
import { getPublishedProperties } from "@/lib/propertiesRepository";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getPublishedProperties();
  const staticRoutes = ["", "/propiedades", "/vende-tu-propiedad", "/contacto"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const propertyRoutes = properties.map((property) => ({
    url: `${SITE_URL}/propiedades/${property.slug}`,
    lastModified: new Date(property.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
