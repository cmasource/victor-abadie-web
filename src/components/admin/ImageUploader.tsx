"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  setMainPropertyImage,
  uploadPropertyImages,
} from "@/lib/adminPropertiesClient";
import type { PropertyImage } from "@/types/property";

type ImageUploaderProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  propertyId?: string;
  slug: string;
  existingImages?: PropertyImage[];
  disabled?: boolean;
  className?: string;
};

const maxFileSize = 5 * 1024 * 1024;
const acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function ImageUploader({
  files,
  onFilesChange,
  propertyId,
  slug,
  existingImages = [],
  disabled = false,
  className = "",
}: ImageUploaderProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(propertyId);

  function handleFiles(fileList: FileList | null) {
    setError("");
    if (!fileList) {
      return;
    }

    const nextFiles = Array.from(fileList);
    const invalid = nextFiles.find(
      (file) => !acceptedTypes.includes(file.type) || file.size > maxFileSize,
    );

    if (invalid) {
      setError("Aceptamos JPG, PNG o WEBP de hasta 5 MB por archivo.");
      return;
    }

    onFilesChange(nextFiles);
  }

  async function uploadNow() {
    if (!propertyId) {
      setError("Primero guardá la propiedad para subir imágenes.");
      return;
    }
    if (files.length === 0) {
      setError("Seleccioná una o más imágenes.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // TODO: sumar compresión/redimensionado antes del upload para fotos pesadas.
      await uploadPropertyImages(propertyId, slug, files);
      onFilesChange([]);
      router.refresh();
    } catch (exception) {
      const message = exception instanceof Error ? exception.message : "No se pudo subir.";
      setError(`No se pudo subir la imagen: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  async function markMain(imageId?: string) {
    if (!propertyId || !imageId) {
      return;
    }

    try {
      await setMainPropertyImage(propertyId, imageId);
      router.refresh();
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "No se pudo marcar como principal.",
      );
    }
  }

  async function removeImage(image: PropertyImage) {
    if (!image.id || !propertyId) {
      return;
    }
    if (!window.confirm("¿Eliminar esta imagen?")) {
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (image.path) {
      await supabase.storage.from("property-images").remove([image.path]);
    }
    const { error: deleteError } = await supabase
      .from("property_images")
      .delete()
      .eq("id", image.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    router.refresh();
  }

  return (
    <section
      className={`w-full max-w-full min-w-0 overflow-hidden rounded-lg border border-black/5 bg-white p-5 shadow-sm ${className}`}
    >
      <h2 className="text-xl font-black text-[#111111]">Imágenes</h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Seleccioná imágenes JPG, PNG o WEBP.{" "}
        {isEditMode
          ? "Podés subirlas ahora o al guardar cambios."
          : "Las imágenes se subirán automáticamente al guardar la propiedad."}
      </p>

      <div className="mt-5 grid min-w-0 gap-4">
        <label className="flex min-h-12 w-full max-w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-brand/60 bg-brand/10 px-4 py-3 text-center text-sm font-black text-brand-dark transition hover:bg-brand/15">
          Seleccionar imágenes
          <input
            type="file"
            multiple
            disabled={disabled}
            accept=".jpg,.jpeg,.png,.webp"
            onChange={(event) => handleFiles(event.target.files)}
            className="sr-only"
          />
        </label>

        <p className="truncate text-sm font-medium text-muted">
          {files.length > 0
            ? `${files.length} imagen${files.length === 1 ? "" : "es"} seleccionada${files.length === 1 ? "" : "s"}`
            : "Sin imágenes seleccionadas"}
        </p>

        {files.length > 0 ? (
          <div className="grid min-w-0 gap-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="min-w-0 truncate rounded-md bg-surface px-3 py-2 text-xs font-semibold text-[#111111]"
                title={file.name}
              >
                {file.name}
              </div>
            ))}
          </div>
        ) : null}

        {error ? (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </p>
        ) : null}

        {isEditMode ? (
          <button
            type="button"
            onClick={uploadNow}
            disabled={loading || disabled || files.length === 0}
            className="w-full rounded-md bg-brand px-5 py-3 text-sm font-black text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "Subiendo..." : "Subir imágenes"}
          </button>
        ) : (
          <p className="rounded-md bg-surface px-4 py-3 text-sm font-semibold text-muted">
            Las imágenes se subirán automáticamente al guardar la propiedad.
          </p>
        )}
      </div>

      {existingImages.length > 0 ? (
        <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {existingImages.map((image) => (
            <div
              key={image.id || image.url}
              className="min-w-0 rounded-lg border border-black/5 p-3"
            >
              <div className="relative aspect-square overflow-hidden rounded-md bg-[#f1f5ef]">
                <Image
                  src={image.url}
                  alt={image.alt || "Imagen"}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  onClick={() => markMain(image.id)}
                  className="rounded-md border border-black/10 px-3 py-2 text-xs font-black"
                >
                  {image.isMain ? "Principal" : "Marcar principal"}
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(image)}
                  className="rounded-md border border-red-200 px-3 py-2 text-xs font-black text-red-700"
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
