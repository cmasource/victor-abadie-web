"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  bedroomOptions,
  propertyCities,
  propertyOperations,
  propertySorts,
  propertyStatuses,
  propertyTypes,
  sortProperties,
  type PropertySort,
} from "@/lib/properties";
import type {
  Operation,
  Property,
  PropertyStatus,
  PropertyType,
} from "@/types/property";
import { PropertyGrid } from "./PropertyGrid";

type CityFilter = (typeof propertyCities)[number];
type BedroomFilter = (typeof bedroomOptions)[number];
type OperationFilter = "Todas" | Operation;
type StatusFilter = "Todos" | PropertyStatus;
type TypeFilter = "Todos" | PropertyType;

type PropertyFiltersProps = {
  properties: Property[];
};

const defaults = {
  tipo: "Todos",
  localidad: "Todas",
  operacion: "Todas",
  dormitorios: "Todos",
  estado: "Todos",
  orden: "recent",
};

export function PropertyFilters({ properties }: PropertyFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const type = (searchParams.get("tipo") || defaults.tipo) as TypeFilter;
  const city = (searchParams.get("localidad") || defaults.localidad) as CityFilter;
  const operation = (searchParams.get("operacion") ||
    defaults.operacion) as OperationFilter;
  const bedrooms = (searchParams.get("dormitorios") ||
    defaults.dormitorios) as BedroomFilter;
  const status = (searchParams.get("estado") || defaults.estado) as StatusFilter;
  const sort = (searchParams.get("orden") || defaults.orden) as PropertySort;

  function updateFilter(key: keyof typeof defaults, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === defaults[key]) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function clearFilters() {
    router.replace(pathname, { scroll: false });
  }

  const filteredProperties = useMemo(() => {
    const filtered = properties.filter((property) => {
      const matchesType = type === "Todos" || property.type === type;
      const matchesCity = city === "Todas" || property.city === city;
      const matchesOperation =
        operation === "Todas" || property.operation === operation;
      const matchesStatus = status === "Todos" || property.status === status;
      const bedroomMinimum =
        bedrooms === "Todos" ? 0 : Number.parseInt(bedrooms, 10);
      const matchesBedrooms =
        bedroomMinimum === 0 || (property.bedrooms || 0) >= bedroomMinimum;

      return (
        matchesType &&
        matchesCity &&
        matchesOperation &&
        matchesStatus &&
        matchesBedrooms
      );
    });

    return sortProperties(filtered, sort);
  }, [bedrooms, city, operation, properties, sort, status, type]);

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-black/5 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <FilterSelect
            label="Tipo"
            value={type}
            options={propertyTypes}
            onChange={(value) => updateFilter("tipo", value)}
          />
          <FilterSelect
            label="Localidad"
            value={city}
            options={propertyCities}
            onChange={(value) => updateFilter("localidad", value)}
          />
          <FilterSelect
            label="Operación"
            value={operation}
            options={propertyOperations}
            onChange={(value) => updateFilter("operacion", value)}
          />
          <FilterSelect
            label="Dormitorios"
            value={bedrooms}
            options={bedroomOptions}
            onChange={(value) => updateFilter("dormitorios", value)}
          />
          <FilterSelect
            label="Estado"
            value={status}
            options={propertyStatuses}
            onChange={(value) => updateFilter("estado", value)}
          />
          <FilterSelect
            label="Orden"
            value={sort}
            options={propertySorts.map((item) => item.value)}
            labels={Object.fromEntries(
              propertySorts.map((item) => [item.value, item.label]),
            )}
            onChange={(value) => updateFilter("orden", value)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t border-black/5 pt-4 text-sm font-bold text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {filteredProperties.length} resultado
            {filteredProperties.length === 1 ? "" : "s"} encontrado
            {filteredProperties.length === 1 ? "" : "s"}
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-md border border-black/10 px-4 py-2 text-[#111111] transition hover:border-brand hover:text-brand-dark"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
      <PropertyGrid properties={filteredProperties} />
    </div>
  );
}

type FilterSelectProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  labels?: Record<string, string>;
  onChange: (value: T) => void;
};

function FilterSelect<T extends string>({
  label,
  value,
  options,
  labels,
  onChange,
}: FilterSelectProps<T>) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#111111]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="min-h-12 rounded-md border border-black/10 bg-white px-3 py-3 text-sm text-muted outline-none focus:border-brand"
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {labels?.[item] || item}
          </option>
        ))}
      </select>
    </label>
  );
}
