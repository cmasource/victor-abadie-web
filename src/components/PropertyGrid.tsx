import type { Property } from "@/types/property";
import { PropertyCard } from "./PropertyCard";

type PropertyGridProps = {
  properties: Property[];
  trackingSource?: "home" | "properties_page" | "property_card";
};

export function PropertyGrid({
  properties,
  trackingSource = "property_card",
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="rounded-lg bg-surface p-8 text-center text-muted">
        Todavía no hay propiedades publicadas para mostrar con esos filtros.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          trackingSource={trackingSource}
        />
      ))}
    </div>
  );
}
