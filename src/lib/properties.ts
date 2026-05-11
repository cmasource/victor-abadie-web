import type {
  Operation,
  Property,
  PropertyStatus,
  PropertyType,
} from "@/types/property";

export const propertyTypes: Array<"Todos" | PropertyType> = [
  "Todos",
  "Casa",
  "Departamento",
  "Terreno",
  "Local",
  "Campo",
  "Inversión",
  "Desarrollo",
];

export const propertyCities = [
  "Todas",
  "San Luis",
  "Juana Koslay",
  "La Punta",
  "El Volcán",
  "Trapiche",
  "Nogolí",
] as const;

export const propertyOperations: Array<"Todas" | Operation> = [
  "Todas",
  "Venta",
  "Alquiler",
  "Oportunidad",
];

export const propertyStatuses: Array<"Todos" | PropertyStatus> = [
  "Todos",
  "Disponible",
  "Reservado",
  "Vendido",
  "Alquilado",
];

export const bedroomOptions = ["Todos", "1+", "2+", "3+"] as const;

export type PropertySort = "recent" | "price-asc" | "price-desc";

export const propertySorts: Array<{ label: string; value: PropertySort }> = [
  { label: "Más recientes", value: "recent" },
  { label: "Precio menor a mayor", value: "price-asc" },
  { label: "Precio mayor a menor", value: "price-desc" },
];

export function sortProperties(items: Property[], sort: PropertySort) {
  return [...items].sort((a, b) => {
    if (sort === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    const aPrice = a.numericPrice;
    const bPrice = b.numericPrice;

    if (aPrice === null && bPrice === null) {
      return 0;
    }
    if (aPrice === null) {
      return 1;
    }
    if (bPrice === null) {
      return -1;
    }

    return sort === "price-asc" ? aPrice - bPrice : bPrice - aPrice;
  });
}
