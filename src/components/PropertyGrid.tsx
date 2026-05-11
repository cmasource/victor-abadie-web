import type { Property } from "@/types/property";
import { PropertyCard } from "./PropertyCard";

type PropertyGridProps = {
  properties: Property[];
};

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="rounded-lg bg-surface p-8 text-center text-muted">
        No encontramos propiedades con esos filtros.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
