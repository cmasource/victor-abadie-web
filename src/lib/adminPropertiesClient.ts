import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { mapSupabaseProperty, propertyInputToSupabase } from "@/lib/propertyMappers";
import type {
  PropertyInput,
  SupabasePropertyRow,
} from "@/types/property";

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

export async function createProperty(input: PropertyInput) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("properties")
    .insert(propertyInputToSupabase(input))
    .select(selectWithImages())
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapSupabaseProperty(data as unknown as SupabasePropertyRow);
}

export async function updateProperty(id: string, input: PropertyInput) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("properties")
    .update(propertyInputToSupabase(input))
    .eq("id", id)
    .select(selectWithImages())
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapSupabaseProperty(data as unknown as SupabasePropertyRow);
}

export async function uploadPropertyImages(
  propertyId: string,
  slug: string,
  files: File[],
) {
  if (!propertyId) {
    throw new Error("Falta el ID de la propiedad para subir imágenes.");
  }

  if (files.length === 0) {
    throw new Error("No hay imágenes seleccionadas para subir.");
  }

  const supabase = createSupabaseBrowserClient();
  const uploaded: unknown[] = [];
  const { data: existingImages, error: existingImagesError } = await supabase
    .from("property_images")
    .select("id,is_main")
    .eq("property_id", propertyId);

  if (existingImagesError) {
    console.error("Error leyendo imágenes existentes de la propiedad.", {
      propertyId,
      error: existingImagesError,
    });
    throw new Error(existingImagesError.message);
  }

  const { data: propertyData, error: propertyReadError } = await supabase
    .from("properties")
    .select("main_image_url")
    .eq("id", propertyId)
    .single();

  if (propertyReadError) {
    console.error("Error leyendo main_image_url de la propiedad.", {
      propertyId,
      error: propertyReadError,
    });
    throw new Error(propertyReadError.message);
  }

  const hasMainImage = Boolean(
    propertyData?.main_image_url ||
      existingImages?.some((image) => Boolean(image.is_main)),
  );
  const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-") || propertyId;
  const timestamp = Date.now();

  for (const [index, file] of files.entries()) {
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `properties/${safeSlug}/${timestamp}-${index}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error subiendo imagen a Supabase Storage.", {
        propertyId,
        path,
        fileName: file.name,
        error: uploadError,
      });
      throw new Error(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("property-images")
      .getPublicUrl(path);
    const publicUrl = publicUrlData.publicUrl;

    if (!publicUrl) {
      console.error("Supabase Storage no devolvió publicUrl.", {
        propertyId,
        path,
        publicUrlData,
      });
      throw new Error("No se pudo obtener la URL pública de la imagen.");
    }

    const shouldBeMain = !hasMainImage && index === 0;
    const { data: imageData, error } = await supabase
      .from("property_images")
      .insert({
        property_id: propertyId,
        url: publicUrl,
        path,
        alt: slug,
        sort_order: (existingImages?.length || 0) + uploaded.length,
        is_main: shouldBeMain,
      })
      .select()
      .single();

    if (error) {
      console.error("Error insertando registro en property_images.", {
        propertyId,
        path,
        url: publicUrl,
        error,
      });
      throw new Error(error.message);
    }

    uploaded.push(imageData);

    if (shouldBeMain) {
      const { error: updatePropertyError } = await supabase
        .from("properties")
        .update({ main_image_url: publicUrl })
        .eq("id", propertyId);

      if (updatePropertyError) {
        console.error("Error actualizando main_image_url de la propiedad.", {
          propertyId,
          url: publicUrl,
          error: updatePropertyError,
        });
        throw new Error(updatePropertyError.message);
      }
    }
  }

  return uploaded;
}

export async function setMainPropertyImage(propertyId: string, imageId: string) {
  const supabase = createSupabaseBrowserClient();
  const { data: images, error: imageError } = await supabase
    .from("property_images")
    .select("id,url")
    .eq("property_id", propertyId);

  if (imageError) {
    throw new Error(imageError.message);
  }

  const mainImage = images?.find((image) => image.id === imageId);
  if (!mainImage) {
    throw new Error("Imagen principal no encontrada.");
  }

  const { error: resetError } = await supabase
    .from("property_images")
    .update({ is_main: false })
    .eq("property_id", propertyId);

  if (resetError) {
    throw new Error(resetError.message);
  }

  const { error: updateImageError } = await supabase
    .from("property_images")
    .update({ is_main: true })
    .eq("id", imageId);

  if (updateImageError) {
    throw new Error(updateImageError.message);
  }

  const { error: propertyError } = await supabase
    .from("properties")
    .update({ main_image_url: mainImage.url })
    .eq("id", propertyId);

  if (propertyError) {
    throw new Error(propertyError.message);
  }
}
