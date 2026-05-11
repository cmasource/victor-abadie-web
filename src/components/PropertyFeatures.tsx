import { formatArea } from "@/lib/formatters";
import type { Property } from "@/types/property";

type PropertyFeaturesProps = {
  property: Property;
};

export function PropertyFeatures({ property }: PropertyFeaturesProps) {
  const facts = [
    ["Tipo", property.type],
    ["Operación", property.operation],
    ["Dormitorios", property.bedrooms ? `${property.bedrooms}` : "No aplica"],
    ["Baños", property.bathrooms ? `${property.bathrooms}` : "Consultar"],
    ["Sup. cubierta", formatArea(property.area)],
    ["Sup. total", formatArea(property.lotArea)],
    ["Localidad", property.city],
    ["Barrio / zona", property.neighborhood],
    ["Estado", property.status],
  ].filter(([, value]) => Boolean(value));

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {facts.map(([label, value]) => (
        <div key={label} className="rounded-lg border border-black/5 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
          <p className="mt-2 font-black text-[#111111]">{value}</p>
        </div>
      ))}
    </div>
  );
}
