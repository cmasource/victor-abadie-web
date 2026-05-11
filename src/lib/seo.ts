import type { Metadata } from "next";
import { BUSINESS_NAME, SITE_URL } from "@/lib/site";
import type { Property } from "@/types/property";

export function propertyMetadata(property: Property): Metadata {
  const description = `${property.type} en ${property.location}. Consultá por esta propiedad en Víctor Abadie Inmobiliaria, San Luis.`;

  return {
    title: `${property.title} | ${BUSINESS_NAME}`,
    description,
    openGraph: {
      title: `${property.title} | ${BUSINESS_NAME}`,
      description,
      type: "article",
      url: `${SITE_URL}/propiedades/${property.slug}`,
      images: [
        {
          url: property.mainImage,
          width: 1200,
          height: 900,
          alt: property.title,
        },
      ],
    },
  };
}
