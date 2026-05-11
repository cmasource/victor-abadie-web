export type Operation = "Venta" | "Alquiler" | "Oportunidad";
export type PropertyType =
  | "Casa"
  | "Departamento"
  | "Terreno"
  | "Local"
  | "Campo"
  | "Inversión"
  | "Desarrollo";
export type PropertyStatus =
  | "Disponible"
  | "Reservada"
  | "Reservado"
  | "Vendida"
  | "Vendido"
  | "Alquilada"
  | "Alquilado";

export type PropertyImage = {
  id?: string;
  propertyId?: string;
  url: string;
  path?: string | null;
  alt?: string | null;
  sortOrder?: number;
  isMain?: boolean;
  createdAt?: string;
};

export type Property = {
  id: string;
  slug: string;
  operation: Operation;
  type: PropertyType;
  title: string;
  description: string;
  excerpt?: string | null;
  location: string;
  city: string;
  neighborhood: string;
  status: PropertyStatus;
  price: string;
  numericPrice: number | null;
  currency: string;
  area: string;
  lotArea?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  rooms?: number | null;
  garage?: boolean;
  featured: boolean;
  published: boolean;
  mainImage: string;
  mainImageUrl?: string | null;
  images: string[];
  imageRecords?: PropertyImage[];
  features: string[];
  tags: string[];
  createdAt: string;
  updatedAt?: string | null;
};

export type SupabasePropertyRow = {
  id: string;
  slug: string;
  operation: string;
  type: string;
  title: string;
  description: string | null;
  excerpt: string | null;
  location: string | null;
  city: string | null;
  neighborhood: string | null;
  status: string | null;
  price: string | null;
  numeric_price: number | null;
  currency: string | null;
  area: string | null;
  lot_area: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  rooms: number | null;
  garage: boolean | null;
  featured: boolean | null;
  published: boolean | null;
  main_image_url: string | null;
  features: string[] | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string | null;
  property_images?: SupabasePropertyImageRow[];
};

export type SupabasePropertyImageRow = {
  id: string;
  property_id: string;
  url: string;
  path: string | null;
  alt: string | null;
  sort_order: number | null;
  is_main: boolean | null;
  created_at: string;
};

export type PropertyInput = {
  slug: string;
  operation: Operation;
  type: PropertyType;
  title: string;
  description?: string;
  excerpt?: string;
  location?: string;
  city?: string;
  neighborhood?: string;
  status?: PropertyStatus;
  price?: string;
  numericPrice?: number | null;
  currency?: string;
  area?: string;
  lotArea?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  rooms?: number | null;
  garage?: boolean;
  featured?: boolean;
  published?: boolean;
  mainImageUrl?: string | null;
  features?: string[];
  tags?: string[];
};
