import {
  BUSINESS_LICENSE,
  BUSINESS_NAME,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  SERVICE_AREAS,
  SITE_URL,
} from "@/lib/site";
import { DISPLAY_PHONE, DISPLAY_WHATSAPP } from "@/lib/whatsapp";
import type { Property } from "@/types/property";

export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: BUSINESS_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/brand/logo-horizontal.jpg`,
    telephone: `+54 ${DISPLAY_PHONE}`,
    areaServed: SERVICE_AREAS.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Luis",
      addressCountry: "AR",
    },
    identifier: BUSINESS_LICENSE,
    sameAs: [INSTAGRAM_URL, FACEBOOK_URL],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: `+54 ${DISPLAY_WHATSAPP}`,
        contactType: "WhatsApp",
        areaServed: "San Luis, Argentina",
        availableLanguage: "Spanish",
      },
      {
        "@type": "ContactPoint",
        telephone: `+54 ${DISPLAY_PHONE}`,
        contactType: "sales",
        areaServed: "San Luis, Argentina",
        availableLanguage: "Spanish",
      },
    ],
  };
}

export function propertyJsonLd(property: Property) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.title,
    description: `${property.type} en ${property.location}. Consultá por esta propiedad en Víctor Abadie Inmobiliaria, San Luis.`,
    image: property.images.map((image) => `${SITE_URL}${image}`),
    url: `${SITE_URL}/propiedades/${property.slug}`,
    category: property.type,
    brand: {
      "@type": "Brand",
      name: BUSINESS_NAME,
    },
    offers: {
      "@type": "Offer",
      availability:
        property.status === "Disponible"
          ? "https://schema.org/InStock"
          : "https://schema.org/LimitedAvailability",
      price: property.numericPrice ?? 0,
      priceCurrency: property.currency === "U$S" ? "USD" : property.currency || "ARS",
      url: `${SITE_URL}/propiedades/${property.slug}`,
    },
  };
}
