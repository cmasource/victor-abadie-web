import type { Property } from "@/types/property";

const numberFormatter = new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 0,
});

export function formatPrice(property: Pick<Property, "currency" | "numericPrice" | "price">) {
  const currency = property.currency?.trim();
  const visiblePrice = property.price?.trim();

  if (
    currency === "Consultar" ||
    (!property.numericPrice && visiblePrice?.toLowerCase().includes("consultar"))
  ) {
    return visiblePrice || "Consultar precio";
  }

  if (typeof property.numericPrice === "number" && Number.isFinite(property.numericPrice)) {
    const formatted = numberFormatter.format(property.numericPrice);
    if (currency === "U$S" || currency === "USD") {
      return `U$S ${formatted}`;
    }
    if (currency === "ARS" || currency === "$") {
      return `$ ${formatted}`;
    }
  }

  return visiblePrice || "Consultar precio";
}

export function formatArea(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const text = String(value).trim();
  if (!text) {
    return "";
  }

  if (/m\s*(²|2)/i.test(text)) {
    return text.replace(/m2/i, "m²");
  }

  return `${text} m²`;
}
