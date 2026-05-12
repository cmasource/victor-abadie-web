"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  parseInstagramPropertyCopy,
  type InstagramPropertyDraft,
} from "@/lib/instagramPropertyParser";
import type { Operation, PropertyType } from "@/types/property";

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
const currencies = ["", "U$S", "ARS", "Consultar"];
const areaUnits = ["m²", "ha", "lote", "otro"];

const exampleCopy = `🏢 COMPLEJO RESIDENCIAL EN VENTA
📍 Barrio Jardín - Zona Norte, San Luis
✅ 600 m² de terreno
✅ 150 m² cubiertos
✅ 4 departamentos
💰 Valor de venta: U$S 250.000.-`;

export function InstagramImportTool() {
  const router = useRouter();
  const [copy, setCopy] = useState("");
  const [draft, setDraft] = useState<InstagramPropertyDraft | null>(null);
  const [message, setMessage] = useState("");

  function analyze() {
    setMessage("");
    if (!copy.trim()) {
      setMessage("Pegá el copy de Instagram antes de analizar.");
      return;
    }
    setDraft(parseInstagramPropertyCopy(copy));
  }

  function updateDraft<K extends keyof InstagramPropertyDraft>(
    key: K,
    value: InstagramPropertyDraft[K],
  ) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  async function copyJson() {
    if (!draft) return;
    await navigator.clipboard.writeText(JSON.stringify(draft, null, 2));
    setMessage("JSON copiado.");
  }

  async function copyDescription() {
    if (!draft) return;
    await navigator.clipboard.writeText(draft.description);
    setMessage("Descripción limpia copiada.");
  }

  function clearAll() {
    setCopy("");
    setDraft(null);
    setMessage("");
    sessionStorage.removeItem("pendingInstagramPropertyDraft");
  }

  function sendToPropertyForm() {
    if (!draft) return;
    sessionStorage.setItem("pendingInstagramPropertyDraft", JSON.stringify(draft));
    router.push("/admin/propiedades/nueva?from=instagram");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <section className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
        <label className="grid gap-2 text-sm font-semibold text-[#111111]">
          Copy de Instagram
          <textarea
            value={copy}
            onChange={(event) => setCopy(event.target.value)}
            rows={16}
            placeholder={exampleCopy}
            className="min-h-[360px] resize-y rounded-md border border-black/10 px-4 py-3 text-sm leading-6 outline-none focus:border-brand"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={analyze}
            className="rounded-md bg-brand px-5 py-3 text-sm font-black text-white transition hover:bg-brand-dark"
          >
            Analizar publicación
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="rounded-md border border-black/10 px-5 py-3 text-sm font-black text-[#111111]"
          >
            Limpiar formulario
          </button>
        </div>
        {message ? (
          <p className="mt-4 rounded-md bg-surface px-4 py-3 text-sm font-bold text-muted">
            {message}
          </p>
        ) : null}
      </section>

      <section className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-[#111111]">Resultado editable</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Revisá y corregí los campos antes de llevarlos al formulario de carga.
        </p>

        {!draft ? (
          <div className="mt-6 rounded-lg border border-dashed border-black/10 bg-surface p-6 text-sm font-semibold text-muted">
            Todavía no hay resultado. Pegá un copy y presioná “Analizar publicación”.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              <SelectField label="Operación" value={draft.operation} options={operations} onChange={(value) => updateDraft("operation", value as Operation)} />
              <SelectField label="Tipo" value={draft.type} options={types} onChange={(value) => updateDraft("type", value as PropertyType)} />
              <SelectField label="Moneda" value={draft.currency} options={currencies} onChange={(value) => updateDraft("currency", value)} />
            </div>
            <InputField label="Título" value={draft.title} onChange={(value) => updateDraft("title", value)} />
            <div className="grid gap-4 md:grid-cols-3">
              <InputField label="Localidad" value={draft.city} onChange={(value) => updateDraft("city", value)} />
              <InputField label="Barrio/Zona" value={draft.neighborhood} onChange={(value) => updateDraft("neighborhood", value)} />
              <InputField label="Ubicación completa" value={draft.location} onChange={(value) => updateDraft("location", value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <InputField label="Precio visible" value={draft.price} onChange={(value) => updateDraft("price", value)} />
              <InputField label="Precio numérico" value={draft.numericPrice?.toString() || ""} inputMode="numeric" onChange={(value) => updateDraft("numericPrice", value ? Number(value) : null)} />
              <InputField label="Slug sugerido" value={draft.suggestedSlug} onChange={(value) => updateDraft("suggestedSlug", value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <InputField label="Dormitorios" value={draft.bedrooms?.toString() || ""} inputMode="numeric" onChange={(value) => updateDraft("bedrooms", value ? Number(value) : null)} />
              <InputField label="Baños" value={draft.bathrooms?.toString() || ""} inputMode="numeric" onChange={(value) => updateDraft("bathrooms", value ? Number(value) : null)} />
              <InputField label="Ambientes" value={draft.rooms?.toString() || ""} inputMode="numeric" onChange={(value) => updateDraft("rooms", value ? Number(value) : null)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <AreaDraftField label="Sup. cubierta" value={draft.area} unit={draft.areaUnit} onValueChange={(value) => updateDraft("area", value)} onUnitChange={(value) => updateDraft("areaUnit", value)} />
              <AreaDraftField label="Sup. total / terreno" value={draft.lotArea} unit={draft.lotAreaUnit} onValueChange={(value) => updateDraft("lotArea", value)} onUnitChange={(value) => updateDraft("lotAreaUnit", value)} />
            </div>
            <label className="flex items-center gap-3 rounded-md border border-black/10 px-4 py-3 text-sm font-semibold text-[#111111]">
              <input
                type="checkbox"
                checked={draft.garage}
                onChange={(event) => updateDraft("garage", event.target.checked)}
                className="h-4 w-4 accent-brand"
              />
              Cochera / garage
            </label>
            <TextareaField label="Descripción web" value={draft.description} onChange={(value) => updateDraft("description", value)} />
            <TextareaField label="Características" value={draft.features.join(", ")} rows={4} onChange={(value) => updateDraft("features", value.split(",").map((item) => item.trim()).filter(Boolean))} />

            <div className="flex flex-wrap gap-3 pt-2">
              <button type="button" onClick={sendToPropertyForm} className="rounded-md bg-brand px-5 py-3 text-sm font-black text-white transition hover:bg-brand-dark">
                Crear propiedad con estos datos
              </button>
              <button type="button" onClick={copyJson} className="rounded-md border border-black/10 px-5 py-3 text-sm font-black text-[#111111]">
                Copiar JSON
              </button>
              <button type="button" onClick={copyDescription} className="rounded-md border border-black/10 px-5 py-3 text-sm font-black text-[#111111]">
                Copiar descripción limpia
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: "numeric" | "decimal";
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#111111]">
      {label}
      <input
        value={value}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 rounded-md border border-black/10 px-4 py-3 outline-none focus:border-brand"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#111111]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 rounded-md border border-black/10 bg-white px-4 py-3 outline-none focus:border-brand"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option || "Consultar"}
          </option>
        ))}
      </select>
    </label>
  );
}

function AreaDraftField({
  label,
  value,
  unit,
  onValueChange,
  onUnitChange,
}: {
  label: string;
  value: string;
  unit: string;
  onValueChange: (value: string) => void;
  onUnitChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#111111]">
      {label}
      <div className="grid grid-cols-[minmax(0,1fr)_96px] gap-2">
        <input
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          className="min-h-12 rounded-md border border-black/10 px-4 py-3 outline-none focus:border-brand"
        />
        <select
          value={unit}
          onChange={(event) => onUnitChange(event.target.value)}
          className="min-h-12 rounded-md border border-black/10 bg-white px-4 py-3 outline-none focus:border-brand"
        >
          {areaUnits.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  rows = 6,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#111111]">
      {label}
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-black/10 px-4 py-3 outline-none focus:border-brand"
      />
    </label>
  );
}
