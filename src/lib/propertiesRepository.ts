import { hasSupabaseConfig } from "@/config/site";
import jsonPropertiesData from "@/data/properties.json";
import { mapJsonProperty, mapSupabaseProperty } from "@/lib/propertyMappers";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Property, SupabasePropertyRow } from "@/types/property";

const jsonProperties = (jsonPropertiesData as Property[]).map(mapJsonProperty);
const isDevelopment = process.env.NODE_ENV === "development";

function sortRecent(properties: Property[]) {
  return [...properties].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function developmentFallbackProperties(reason: string) {
  if (!isDevelopment) {
    throw new Error(reason);
  }

  console.warn(`${reason} Usando fallback JSON solo en development.`);
  return sortRecent(jsonProperties.filter((property) => property.published !== false));
}

function selectWithImages() {
  return `
    *,
    property_images (
      id,
      property_id,
      url,
      path,
      alt,
      sort_order,
      is_main,
      created_at
    )
  `;
}

function mapRows(rows: unknown[] | null) {
  return ((rows || []) as unknown as SupabasePropertyRow[]).map(mapSupabaseProperty);
}

export async function getProperties() {
  if (!hasSupabaseConfig) {
    return developmentFallbackProperties("Supabase no está configurado para getProperties.");
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("properties")
      .select(selectWithImages())
      .order("created_at", { ascending: false });

    if (error) {
      return developmentFallbackProperties(`Supabase getProperties error: ${error.message}`);
    }

    return mapRows(data);
  } catch (error) {
    return developmentFallbackProperties(`Supabase getProperties exception: ${String(error)}`);
  }
}

export async function getPublishedProperties() {
  if (!hasSupabaseConfig) {
    return developmentFallbackProperties(
      "Supabase no está configurado para getPublishedProperties.",
    );
  }

  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("properties")
      .select(selectWithImages())
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      return developmentFallbackProperties(
        `Supabase getPublishedProperties error: ${error.message}`,
      );
    }

    const properties = mapRows(data);
    if (isDevelopment) {
      console.info(
        `[propertiesRepository] Supabase publicadas: ${properties.length}`,
      );
    }
    return properties;
  } catch (error) {
    return developmentFallbackProperties(
      `Supabase getPublishedProperties exception: ${String(error)}`,
    );
  }
}

export async function getFeaturedProperties(limit = 6) {
  const properties = await getPublishedProperties();
  return properties.filter((property) => property.featured).slice(0, limit);
}

export async function getRecentProperties(limit = 6) {
  const properties = await getPublishedProperties();
  return sortRecent(properties).slice(0, limit);
}

export async function getPropertyBySlug(slug: string) {
  if (!hasSupabaseConfig) {
    return developmentFallbackProperties(
      "Supabase no está configurado para getPropertyBySlug.",
    ).find((property) => property.slug === slug);
  }

  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("properties")
      .select(selectWithImages())
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) {
      return developmentFallbackProperties(
        `Supabase getPropertyBySlug error: ${error.message}`,
      ).find((property) => property.slug === slug);
    }

    return data
      ? mapSupabaseProperty(data as unknown as SupabasePropertyRow)
      : undefined;
  } catch (error) {
    return developmentFallbackProperties(
      `Supabase getPropertyBySlug exception: ${String(error)}`,
    ).find((property) => property.slug === slug);
  }
}

export async function getRelatedProperties(property: Property, limit = 3) {
  const properties = await getPublishedProperties();
  return properties
    .filter(
      (item) =>
        item.id !== property.id &&
        (item.city === property.city ||
          item.type === property.type ||
          item.operation === property.operation),
    )
    .slice(0, limit);
}
