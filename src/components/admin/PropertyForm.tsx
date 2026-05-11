"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminField, adminInputClassName } from "@/components/admin/AdminField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  buildCommercialDescription,
  buildExcerpt,
  buildInstagramCaption,
  buildPropertyTitle,
  extractFeaturesFromNotes,
  mergeFeatureLists,
  slugify,
  splitList,
} from "@/lib/propertyCommercialBuilder";
import {
  createProperty,
  updateProperty,
  uploadPropertyImages,
} from "@/lib/adminPropertiesClient";
import type {
  Operation,
  Property,
  PropertyInput,
  PropertyStatus,
  PropertyType,
} from "@/types/property";

type PropertyFormProps = {
  property?: Property;
};

const operations: Operation[] = ["Venta", "Alquiler", "Oportunidad"];
const types: PropertyType[] = [
  "Casa",
  "Departamento",
  "Terreno",
  "Local",
  "Campo",
  "Inversión",
  "Desarrollo",
];
const statuses: PropertyStatus[] = [
  "Disponible",
  "Reservado",
  "Vendido",
  "Alquilado",
];
const currencies = ["Consultar", "U$S", "ARS"];
const areaUnits = ["m²", "ha", "lote", "otro"] as const;
type AreaUnit = (typeof areaUnits)[number];

function parseAreaValue(value?: string | null): {
  value: string;
  unit: AreaUnit;
  customUnit: string;
} {
  const text = value?.trim() || "";
  if (!text) {
    return { value: "", unit: "m²", customUnit: "" };
  }

  const normalized = text.replace(/\s+/g, " ");
  const knownUnitMatch = normalized.match(/^(.*?)\s*(m²|m2|ha|lote)$/i);

  if (knownUnitMatch) {
    const unitText = knownUnitMatch[2].toLowerCase();
    return {
      value: knownUnitMatch[1].trim(),
      unit: unitText === "m2" ? "m²" : (unitText as AreaUnit),
      customUnit: "",
    };
  }

  const customMatch = normalized.match(/^(.*?)\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ.]+)$/);
  if (customMatch && /\d/.test(customMatch[1])) {
    return {
      value: customMatch[1].trim(),
      unit: "otro",
      customUnit: customMatch[2].trim(),
    };
  }

  return { value: normalized, unit: "m²", customUnit: "" };
}

function buildAreaValue(value: string, unit: AreaUnit, customUnit: string) {
  const cleanValue = value.trim();
  if (!cleanValue) {
    return "";
  }

  if (unit === "otro") {
    const cleanCustomUnit = customUnit.trim();
    return cleanCustomUnit ? `${cleanValue} ${cleanCustomUnit}` : cleanValue;
  }

  return `${cleanValue} ${unit}`;
}

export function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter();
  const parsedArea = useMemo(() => parseAreaValue(property?.area), [property?.area]);
  const parsedLotArea = useMemo(
    () => parseAreaValue(property?.lotArea),
    [property?.lotArea],
  );
  const [operation, setOperation] = useState<Operation>(property?.operation || "Venta");
  const [type, setType] = useState<PropertyType>(property?.type || "Casa");
  const [title, setTitle] = useState(property?.title || "");
  const [slug, setSlug] = useState(property?.slug || "");
  const [city, setCity] = useState(property?.city || "");
  const [neighborhood, setNeighborhood] = useState(property?.neighborhood || "");
  const [location, setLocation] = useState(property?.location || "");
  const [status, setStatus] = useState<PropertyStatus>(property?.status || "Disponible");
  const [price, setPrice] = useState(property?.price || "Consultar precio");
  const [numericPrice, setNumericPrice] = useState(property?.numericPrice?.toString() || "");
  const [currency, setCurrency] = useState(property?.currency || "Consultar");
  const [bedrooms, setBedrooms] = useState(property?.bedrooms?.toString() || "");
  const [bathrooms, setBathrooms] = useState(property?.bathrooms?.toString() || "");
  const [rooms, setRooms] = useState(property?.rooms?.toString() || "");
  const [areaValue, setAreaValue] = useState(parsedArea.value);
  const [areaUnit, setAreaUnit] = useState<AreaUnit>(parsedArea.unit);
  const [areaCustomUnit, setAreaCustomUnit] = useState(parsedArea.customUnit);
  const [lotAreaValue, setLotAreaValue] = useState(parsedLotArea.value);
  const [lotAreaUnit, setLotAreaUnit] = useState<AreaUnit>(parsedLotArea.unit);
  const [lotAreaCustomUnit, setLotAreaCustomUnit] = useState(
    parsedLotArea.customUnit,
  );
  const [garage, setGarage] = useState(property?.garage || false);
  const [published, setPublished] = useState(property?.published ?? true);
  const [featured, setFeatured] = useState(property?.featured || false);
  const [description, setDescription] = useState(property?.description || "");
  const [excerpt, setExcerpt] = useState(property?.excerpt || "");
  const [features, setFeatures] = useState(property?.features.join(", ") || "");
  const [tags, setTags] = useState(property?.tags.join(", ") || "");
  const [internalNotes, setInternalNotes] = useState("");
  const [instagramCaption, setInstagramCaption] = useState("");
  const [titleSuggestion, setTitleSuggestion] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const currentSlug = useMemo(() => slug || slugify(title), [slug, title]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!property && (!slug || slug === slugify(title))) {
      setSlug(slugify(value));
    }
  }

  function numberOrNull(value: string) {
    if (!value.trim()) {
      return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function buildInput(): PropertyInput {
    return {
      slug: currentSlug,
      operation,
      type,
      title,
      description,
      excerpt,
      location,
      city,
      neighborhood,
      status,
      price,
      numericPrice: numberOrNull(numericPrice),
      currency: currency === "Consultar" ? "" : currency,
      area: buildAreaValue(areaValue, areaUnit, areaCustomUnit),
      lotArea: buildAreaValue(lotAreaValue, lotAreaUnit, lotAreaCustomUnit),
      bedrooms: numberOrNull(bedrooms),
      bathrooms: numberOrNull(bathrooms),
      rooms: numberOrNull(rooms),
      garage,
      featured,
      published,
      mainImageUrl: property?.mainImageUrl || null,
      features: splitList(features),
      tags: splitList(tags),
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !currentSlug.trim()) {
      setError("Título y slug son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const input = buildInput();
      const saved = property
        ? await updateProperty(property.id, input)
        : await createProperty(input);

      if (selectedImages.length > 0) {
        try {
          // TODO: sumar compresión/redimensionado antes del upload para fotos pesadas.
          await uploadPropertyImages(saved.id, saved.slug, selectedImages);
          setSelectedImages([]);
        } catch (uploadException) {
          const uploadMessage =
            uploadException instanceof Error
              ? uploadException.message
              : "Error desconocido al subir imágenes.";
          setError(
            `La propiedad se guardó, pero no se pudieron subir las imágenes: ${uploadMessage}. Podés reintentar desde /admin/propiedades/${saved.id}/editar.`,
          );
          return;
        }
      }

      setSuccess(
        property
          ? "Propiedad actualizada correctamente."
          : "Propiedad guardada e imágenes subidas correctamente.",
      );
      window.setTimeout(() => {
        router.replace(`/admin/propiedades/${saved.id}/editar`);
        router.refresh();
      }, 700);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "No se pudo guardar.");
    } finally {
      setLoading(false);
    }
  }

  function orderCommercialSheet() {
    const sourceText = [description, internalNotes].filter(Boolean).join("\n");
    const suggestedTitle = buildPropertyTitle(sourceText, type, city);
    const suggestedDescription = buildCommercialDescription(sourceText, type, city);
    const suggestedFeatures = mergeFeatureLists(
      splitList(features),
      extractFeaturesFromNotes(sourceText),
    );

    setTitleSuggestion(suggestedTitle);
    if (!title) {
      setTitle(suggestedTitle);
      setSlug(slugify(suggestedTitle));
    }
    setDescription(suggestedDescription);
    setExcerpt(buildExcerpt(suggestedDescription));
    if (suggestedFeatures.length > 0) {
      setFeatures(suggestedFeatures.join(", "));
    }
    setInstagramCaption(
      buildInstagramCaption(title || suggestedTitle, city, price, suggestedFeatures),
    );
  }

  return (
    <div className="grid w-full max-w-full grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="grid min-w-0 gap-5 rounded-lg border border-black/5 bg-white p-5 shadow-sm lg:col-span-8"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Select label="Operación" value={operation} options={operations} onChange={setOperation} />
          <Select label="Tipo" value={type} options={types} onChange={setType} />
          <Select label="Estado" value={status} options={statuses} onChange={setStatus} />
        </div>

        <Field label="Título" value={title} onChange={handleTitleChange} required />
        <Field label="Slug" value={currentSlug} onChange={setSlug} required />

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Localidad" value={city} onChange={setCity} />
          <Field label="Barrio / zona" value={neighborhood} onChange={setNeighborhood} />
          <Field label="Ubicación completa" value={location} onChange={setLocation} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Precio visible" value={price} onChange={setPrice} />
          <Field label="Precio numérico" value={numericPrice} onChange={setNumericPrice} type="number" />
          <Select label="Moneda" value={currency} options={currencies} onChange={setCurrency} />
        </div>

        <section className="rounded-lg border border-black/5 bg-surface/60 p-4">
          <h2 className="text-base font-black text-[#111111]">Datos técnicos</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Field
              label="Dormitorios"
              value={bedrooms}
              onChange={setBedrooms}
              type="text"
              inputMode="numeric"
            />
            <Field
              label="Baños"
              value={bathrooms}
              onChange={setBathrooms}
              type="text"
              inputMode="numeric"
            />
            <Field
              label="Ambientes"
              value={rooms}
              onChange={setRooms}
              type="text"
              inputMode="numeric"
            />
            <AreaField
              label="Sup. cubierta"
              value={areaValue}
              onValueChange={setAreaValue}
              unit={areaUnit}
              onUnitChange={setAreaUnit}
              customUnit={areaCustomUnit}
              onCustomUnitChange={setAreaCustomUnit}
              placeholder="Ej: 150"
            />
            <AreaField
              label="Sup. total / terreno"
              value={lotAreaValue}
              onValueChange={setLotAreaValue}
              unit={lotAreaUnit}
              onUnitChange={setLotAreaUnit}
              customUnit={lotAreaCustomUnit}
              onCustomUnitChange={setLotAreaCustomUnit}
              placeholder="Ej: 604"
            />
          </div>

          <div className="mt-4">
            <Checkbox label="Cochera" checked={garage} onChange={setGarage} />
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <Checkbox label="Publicada" checked={published} onChange={setPublished} />
          <Checkbox label="Destacada" checked={featured} onChange={setFeatured} />
        </div>

        <Textarea label="Descripción" value={description} onChange={setDescription} />
        <Textarea label="Extracto corto" value={excerpt || ""} onChange={setExcerpt} rows={3} />
        <Field label="Características separadas por coma" value={features} onChange={setFeatures} />
        <Field label="Tags separados por coma" value={tags} onChange={setTags} />

        <div className="rounded-lg bg-surface p-4">
          <Textarea
            label="Notas internas / descripción desordenada"
            value={internalNotes}
            onChange={setInternalNotes}
            rows={4}
          />
          <button
            type="button"
            onClick={orderCommercialSheet}
            className="mt-3 rounded-md bg-[#111111] px-4 py-3 text-sm font-black text-white"
          >
            Ordenar ficha comercial
          </button>
          {titleSuggestion || instagramCaption ? (
            <div className="mt-4 rounded-md bg-white p-4 text-sm leading-6 text-muted">
              {titleSuggestion ? (
                <>
                  <p className="font-black text-[#111111]">Título sugerido</p>
                  <p className="mt-1">{titleSuggestion}</p>
                </>
              ) : null}
              {instagramCaption ? (
                <>
                  <p className="mt-4 font-black text-[#111111]">Caption de Instagram sugerido</p>
                  <pre className="mt-2 whitespace-pre-wrap font-sans">{instagramCaption}</pre>
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        {error ? (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="rounded-md bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-brand px-5 py-3 text-sm font-black text-white disabled:opacity-60"
        >
          {loading
            ? "Guardando..."
            : property
              ? selectedImages.length > 0
                ? "Guardar cambios y subir imágenes"
                : "Guardar cambios"
              : "Guardar propiedad y subir imágenes"}
        </button>
      </form>

      <ImageUploader
        files={selectedImages}
        onFilesChange={setSelectedImages}
        propertyId={property?.id}
        slug={currentSlug}
        existingImages={property?.imageRecords || []}
        disabled={loading}
        className="lg:col-span-4"
      />
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  placeholder?: string;
  required?: boolean;
};

type AreaFieldProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  unit: AreaUnit;
  onUnitChange: (value: AreaUnit) => void;
  customUnit: string;
  onCustomUnitChange: (value: string) => void;
  placeholder: string;
};

function AreaField({
  label,
  value,
  onValueChange,
  unit,
  onUnitChange,
  customUnit,
  onCustomUnitChange,
  placeholder,
}: AreaFieldProps) {
  return (
    <AdminField label={label}>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_92px] gap-2">
        <input
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          className={adminInputClassName}
        />
        <select
          value={unit}
          onChange={(event) => onUnitChange(event.target.value as AreaUnit)}
          className={adminInputClassName}
          aria-label={`${label}: unidad`}
        >
          {areaUnits.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {unit === "otro" ? (
        <input
          type="text"
          placeholder="Unidad personalizada"
          value={customUnit}
          onChange={(event) => onCustomUnitChange(event.target.value)}
          className={adminInputClassName}
        />
      ) : null}
    </AdminField>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  placeholder,
  required,
}: FieldProps) {
  return (
    <AdminField label={label}>
      <input
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className={adminInputClassName}
      />
    </AdminField>
  );
}

type TextareaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
};

function Textarea({ label, value, onChange, rows = 6 }: TextareaProps) {
  return (
    <AdminField label={label}>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className={`${adminInputClassName} resize-none`}
      />
    </AdminField>
  );
}

type SelectProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

function Select<T extends string>({ label, value, options, onChange }: SelectProps<T>) {
  return (
    <AdminField label={label}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={adminInputClassName}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </AdminField>
  );
}

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex min-h-12 w-full items-center gap-3 rounded-md border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-[#111111] transition hover:border-brand/40">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-brand"
      />
      {label}
    </label>
  );
}
