import { seoConfig } from "@/config/seo";
import { buildCanonicalUrl, buildPropertySeo } from "@/lib/seo";
import { DISPLAY_PHONE, DISPLAY_WHATSAPP } from "@/lib/whatsapp";
import type { Property } from "@/types/property";

export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: seoConfig.businessName,
    legalName: seoConfig.businessLegalName,
    description:
      "Inmobiliaria en San Luis especializada en casas, terrenos, departamentos, inversiones y oportunidades inmobiliarias.",
    url: seoConfig.siteUrl,
    image: buildCanonicalUrl("/brand/logo-horizontal.jpg"),
    telephone: "+54 266 4572176",
    areaServed: seoConfig.serviceAreas.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: seoConfig.city,
      addressRegion: seoConfig.province,
      addressCountry: seoConfig.country,
    },
    identifier: seoConfig.businessLicense,
    sameAs: seoConfig.socialLinks,
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
  const seo = buildPropertySeo(property);
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.title,
    description: seo.description,
    image: property.images.map((image) =>
      image.startsWith("http") ? image : buildCanonicalUrl(image),
    ),
    url: seo.canonical,
    category: property.type,
    brand: {
      "@type": "Brand",
      name: seoConfig.businessName,
    },
  };

  if (property.numericPrice && property.numericPrice > 0) {
    jsonLd.offers = {
      "@type": "Offer",
      availability:
        property.status === "Disponible"
          ? "https://schema.org/InStock"
          : "https://schema.org/LimitedAvailability",
      price: property.numericPrice,
      priceCurrency: property.currency === "U$S" ? "USD" : property.currency || "ARS",
      url: seo.canonical,
    };
  }

  return jsonLd;
}
