import type { Metadata } from "next";
import { seoConfig } from "@/config/seo";
import type { Property } from "@/types/property";

const fallbackPropertyDescription =
  "Consultá por esta propiedad en Víctor Abadie Inmobiliaria, San Luis.";

export function normalizeSeoText(text?: string | null) {
  return (text || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

export function buildCanonicalUrl(path: string) {
  const baseUrl = seoConfig.siteUrl.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`.replace(/([^:]\/)\/+/g, "$1");
}

export function buildPropertyImageAlt(property: Pick<Property, "title" | "type" | "location" | "city">) {
  const place = property.location || property.city || "San Luis";
  const title = property.title || `${property.type || "Propiedad"} en ${place}`;
  return `${title} - Víctor Abadie Inmobiliaria`;
}

export function buildPropertySeo(property: Property) {
  const canonical = buildCanonicalUrl(`/propiedades/${property.slug}`);
  const description = normalizeSeoText(
    `${property.type} en ${property.location || property.city || "San Luis"}. ${fallbackPropertyDescription}`,
  );
  const image = property.mainImage || property.images[0] || "/brand/logo-horizontal.jpg";

  return {
    title: `${property.title} | ${seoConfig.businessName}`,
    description,
    canonical,
    image,
    imageAlt: buildPropertyImageAlt(property),
  };
}

export function propertyMetadata(property: Property): Metadata {
  const seo = buildPropertySeo(property);

  return {
    title: {
      absolute: seo.title,
    },
    description: seo.description,
    alternates: {
      canonical: seo.canonical,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "article",
      url: seo.canonical,
      siteName: seoConfig.siteName,
      locale: seoConfig.locale,
      images: [
        {
          url: seo.image,
          width: 1200,
          height: 900,
          alt: seo.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.image],
    },
  };
}
