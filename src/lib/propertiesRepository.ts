import { hasSupabaseConfig } from "@/config/site";
import jsonPropertiesData from "@/data/properties.json";
import {
  mapJsonProperty,
  mapSupabaseProperty,
} from "@/lib/propertyMappers";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Property,
  SupabasePropertyRow,
} from "@/types/property";

const jsonProperties = (jsonPropertiesData as Property[]).map(mapJsonProperty);

function sortRecent(properties: Property[]) {
  return [...properties].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function fallbackProperties() {
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

export async function getProperties() {
  if (!hasSupabaseConfig) {
    return fallbackProperties();
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("properties")
      .select(selectWithImages())
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase getProperties fallback:", error.message);
      return fallbackProperties();
    }

    return ((data || []) as unknown as SupabasePropertyRow[]).map(
      mapSupabaseProperty,
    );
  } catch (error) {
    console.warn("Supabase getProperties fallback:", error);
    return fallbackProperties();
  }
}

export async function getPublishedProperties() {
  if (!hasSupabaseConfig) {
    return fallbackProperties();
  }

  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("properties")
      .select(selectWithImages())
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn("Supabase getPublishedProperties fallback:", error.message);
      }
      return fallbackProperties();
    }

    return (data as unknown as SupabasePropertyRow[]).map(mapSupabaseProperty);
  } catch (error) {
    console.warn("Supabase getPublishedProperties fallback:", error);
    return fallbackProperties();
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
    return fallbackProperties().find((property) => property.slug === slug);
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
      console.warn("Supabase getPropertyBySlug fallback:", error.message);
      return fallbackProperties().find((property) => property.slug === slug);
    }

    return data
      ? mapSupabaseProperty(data as unknown as SupabasePropertyRow)
      : undefined;
  } catch (error) {
    console.warn("Supabase getPropertyBySlug fallback:", error);
    return fallbackProperties().find((property) => property.slug === slug);
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
