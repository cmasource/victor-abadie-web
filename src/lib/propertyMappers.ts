import type {
  Operation,
  Property,
  PropertyImage,
  PropertyInput,
  PropertyStatus,
  PropertyType,
  SupabasePropertyImageRow,
  SupabasePropertyRow,
} from "@/types/property";

const fallbackImage = "/properties/placeholder-1.svg";

export function mapSupabaseImage(row: SupabasePropertyImageRow): PropertyImage {
  return {
    id: row.id,
    propertyId: row.property_id,
    url: row.url,
    path: row.path,
    alt: row.alt,
    sortOrder: row.sort_order ?? 0,
    isMain: row.is_main ?? false,
    createdAt: row.created_at,
  };
}

export function mapSupabaseProperty(row: SupabasePropertyRow): Property {
  const imageRecords = (row.property_images || [])
    .map(mapSupabaseImage)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const images = imageRecords.map((image) => image.url);
  const mainImage =
    row.main_image_url ||
    imageRecords.find((image) => image.isMain)?.url ||
    images[0] ||
    fallbackImage;

  return {
    id: row.id,
    slug: row.slug,
    operation: row.operation as Operation,
    type: row.type as PropertyType,
    title: row.title,
    description: row.description || "",
    excerpt: row.excerpt,
    location: row.location || "",
    city: row.city || "",
    neighborhood: row.neighborhood || "",
    status: (row.status || "Disponible") as PropertyStatus,
    price: row.price || "Consultar precio",
    numericPrice: row.numeric_price,
    currency: row.currency || "",
    area: row.area || "",
    lotArea: row.lot_area,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    rooms: row.rooms,
    garage: row.garage ?? false,
    featured: row.featured ?? false,
    published: row.published ?? true,
    mainImage,
    mainImageUrl: row.main_image_url,
    images: images.length > 0 ? images : [mainImage],
    imageRecords,
    features: row.features || [],
    tags: row.tags || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapJsonProperty(property: Property): Property {
  return {
    ...property,
    description: property.description || "",
    excerpt: property.excerpt || property.description?.slice(0, 150) || "",
    status: property.status || "Disponible",
    published: property.published ?? true,
    garage: property.garage ?? false,
    mainImage: property.mainImageUrl || property.mainImage || fallbackImage,
    images:
      property.images?.length > 0
        ? property.images
        : [property.mainImageUrl || property.mainImage || fallbackImage],
  };
}

export function propertyInputToSupabase(input: PropertyInput) {
  return {
    slug: input.slug,
    operation: input.operation,
    type: input.type,
    title: input.title,
    description: input.description || "",
    excerpt: input.excerpt || "",
    location: input.location || "",
    city: input.city || "",
    neighborhood: input.neighborhood || "",
    status: input.status || "Disponible",
    price: input.price || "Consultar precio",
    numeric_price: input.numericPrice ?? null,
    currency: input.currency || "",
    area: input.area || "",
    lot_area: input.lotArea || "",
    bedrooms: input.bedrooms ?? null,
    bathrooms: input.bathrooms ?? null,
    rooms: input.rooms ?? null,
    garage: input.garage ?? false,
    featured: input.featured ?? false,
    published: input.published ?? true,
    main_image_url: input.mainImageUrl || null,
    features: input.features || [],
    tags: input.tags || [],
  };
}
