import type { Operation, PropertyType } from "@/types/property";

export type InstagramPropertyDraft = {
  operation: Operation;
  type: PropertyType;
  title: string;
  location: string;
  city: string;
  neighborhood: string;
  price: string;
  numericPrice: number | null;
  currency: string;
  area: string;
  areaUnit: string;
  lotArea: string;
  lotAreaUnit: string;
  bedrooms: number | null;
  bathrooms: number | null;
  rooms: number | null;
  garage: boolean;
  features: string[];
  description: string;
  excerpt: string;
  suggestedSlug: string;
  instagramCaption: string;
};

const defaultDraft: InstagramPropertyDraft = {
  operation: "Venta",
  type: "Casa",
  title: "",
  location: "",
  city: "San Luis",
  neighborhood: "",
  price: "Consultar precio",
  numericPrice: null,
  currency: "",
  area: "",
  areaUnit: "m²",
  lotArea: "",
  lotAreaUnit: "m²",
  bedrooms: null,
  bathrooms: null,
  rooms: null,
  garage: false,
  features: [],
  description: "",
  excerpt: "",
  suggestedSlug: "",
  instagramCaption: "",
};

export function normalizeWhitespace(text: string) {
  return text.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export function stripEmojis(text: string) {
  return text
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/[✅📍💰🏡🏠🏢📐🚗🛏️🛁⭐👉]/g, "");
}

export function cleanCommercialText(text: string) {
  return normalizeWhitespace(
    stripEmojis(text)
      .split("\n")
      .map((line) => line.replace(/^[-•*.\s]+/, "").trim())
      .filter(Boolean)
      .join("\n"),
  );
}

export function generateSlug(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseInstagramPropertyCopy(text: string): InstagramPropertyDraft {
  const original = normalizeWhitespace(text);
  const clean = cleanCommercialText(original);
  const upper = stripEmojis(original).toUpperCase();
  const lines = clean.split("\n").map((line) => line.trim()).filter(Boolean);
  const operation = detectOperation(upper);
  const type = detectType(upper);
  const priceInfo = detectPrice(original);
  const location = detectLocation(lines);
  const city = detectCity(location || clean);
  const neighborhood = detectNeighborhood(location);
  const areaInfo = detectAreas(clean);
  const features = extractFeatures(original);
  const bedrooms = detectNumber(clean, /(dormitorios?|dorm\.?|habitaciones?)\s*:?\s*(\d+)|(\d+)\s*(dormitorios?|dorm\.?|habitaciones?)/i);
  const bathrooms = detectNumber(clean, /(baños?|banos?)\s*:?\s*(\d+)|(\d+)\s*(baños?|banos?)/i);
  const rooms = detectNumber(clean, /(ambientes?)\s*:?\s*(\d+)|(\d+)\s*(ambientes?)/i);
  const garage = /cochera|garage|garaje/i.test(clean);
  const title = detectTitle(lines, type, operation, neighborhood || city);
  const description = buildDescription({
    type,
    operation,
    title,
    location,
    city,
    features,
    clean,
  });
  const excerpt = description.replace(/\s+/g, " ").slice(0, 170);

  return {
    ...defaultDraft,
    operation,
    type,
    title,
    location,
    city,
    neighborhood,
    price: priceInfo.price,
    numericPrice: priceInfo.numericPrice,
    currency: priceInfo.currency,
    area: areaInfo.area,
    areaUnit: areaInfo.areaUnit,
    lotArea: areaInfo.lotArea,
    lotAreaUnit: areaInfo.lotAreaUnit,
    bedrooms,
    bathrooms,
    rooms,
    garage,
    features,
    description,
    excerpt,
    suggestedSlug: generateSlug(title),
    instagramCaption: original,
  };
}

function detectOperation(upper: string): Operation {
  if (/ALQUILER|SE ALQUILA/.test(upper)) return "Alquiler";
  if (/OPORTUNIDAD/.test(upper)) return "Oportunidad";
  return "Venta";
}

function detectType(upper: string): PropertyType {
  if (/DESARROLLO|APTO DESARROLLO|POTENCIAL DE EXPANSI/.test(upper)) return "Desarrollo";
  if (/COMPLEJO|RENTA|INVERSI/.test(upper) || /UNIDADES|DEPARTAMENTOS CON RENTA/.test(upper)) return "Inversión";
  if (/CAMPO|HECT[ÁA]REAS|HAS\b|\bHA\b/.test(upper)) return "Campo";
  if (/LOCAL/.test(upper)) return "Local";
  if (/TERRENO|LOTE/.test(upper)) return "Terreno";
  if (/DEPARTAMENTO|DPTO/.test(upper)) return "Departamento";
  return "Casa";
}

function detectPrice(text: string) {
  const usd = text.match(/(?:U\$S|US\$|USD)\s*([\d.,]+)/i);
  if (usd) {
    const numericPrice = toNumber(usd[1]);
    return {
      currency: "U$S",
      numericPrice,
      price: numericPrice ? `U$S ${formatNumber(numericPrice)}` : `U$S ${usd[1]}`,
    };
  }
  const ars = text.match(/(?:ARS|\$)\s*([\d.,]+)/i);
  if (ars) {
    const numericPrice = toNumber(ars[1]);
    return {
      currency: "ARS",
      numericPrice,
      price: numericPrice ? `$ ${formatNumber(numericPrice)}` : `$ ${ars[1]}`,
    };
  }
  return { currency: "", numericPrice: null, price: "Consultar precio" };
}

function detectLocation(lines: string[]) {
  const locationLine =
    lines.find((line) => /📍|ubicaci[oó]n|barrio|zona|san luis|juana koslay|la punta|potrero|trapiche|nogol/i.test(line)) ||
    "";
  return locationLine.replace(/^ubicaci[oó]n\s*:?\s*/i, "").trim();
}

function detectCity(text: string) {
  const cities = ["Juana Koslay", "La Punta", "El Volcán", "Trapiche", "Nogolí", "Potrero de los Funes", "San Luis"];
  return cities.find((city) => new RegExp(city, "i").test(text)) || "San Luis";
}

function detectNeighborhood(location: string) {
  if (!location) return "";
  return location.split(/,|-|–/)[0]?.trim() || "";
}

function detectAreas(text: string) {
  const matches = [...text.matchAll(/(\d+(?:[.,]\d+)?)\s*(m²|m2|mts2|mts|metros cuadrados|ha|has|hect[aá]reas)/gi)];
  const empty = { area: "", areaUnit: "m²", lotArea: "", lotAreaUnit: "m²" };
  if (matches.length === 0) return empty;

  const mapped = matches.map((match) => ({
    value: match[1].replace(",", "."),
    unit: normalizeAreaUnit(match[2]),
    raw: match[0],
  }));
  const lot = mapped.find((item) => /terreno|lote|total|hect/i.test(contextAround(text, item.raw))) || mapped[0];
  const covered = mapped.find((item) => /cubiert|edificad|constru/i.test(contextAround(text, item.raw)));

  return {
    area: covered?.value || "",
    areaUnit: covered?.unit || "m²",
    lotArea: lot?.value || "",
    lotAreaUnit: lot?.unit || "m²",
  };
}

function normalizeAreaUnit(unit: string) {
  if (/ha|has|hect/i.test(unit)) return "ha";
  return "m²";
}

function contextAround(text: string, token: string) {
  const index = text.indexOf(token);
  if (index < 0) return token;
  return text.slice(Math.max(0, index - 45), index + token.length + 45);
}

function extractFeatures(text: string) {
  const cleaned = stripEmojis(text);
  const featureLines = cleaned
    .split(/\n|;/)
    .map((line) => line.replace(/^[-•*✅\s]+/, "").trim())
    .filter((line) => line.length >= 3 && line.length <= 95)
    .filter((line) => /m²|m2|mts|ha|dorm|habitaci|bañ|bano|cochera|garage|patio|renta|departamento|unidad|escritura|port[oó]n|churrasquera|expansi[oó]n|servicios|lote|terreno|cubiert/i.test(line));

  return Array.from(new Set(featureLines));
}

function detectNumber(text: string, regex: RegExp) {
  const match = text.match(regex);
  if (!match) return null;
  const value = match[2] || match[3];
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function detectTitle(lines: string[], type: PropertyType, operation: Operation, place: string) {
  const firstUsefulLine = lines.find((line) => !/valor|precio|whatsapp|consulta|tel/i.test(line));
  const cleanFirst = firstUsefulLine
    ? titleCase(firstUsefulLine.replace(/^(en venta|venta|se vende|alquiler|se alquila)\s*:?\s*/i, ""))
    : "";

  if (cleanFirst && cleanFirst.length <= 80) {
    return cleanFirst;
  }

  const operationText = operation === "Alquiler" ? "en alquiler" : "en venta";
  return `${type} ${operationText}${place ? ` en ${titleCase(place)}` : ""}`;
}

function buildDescription(input: {
  type: PropertyType;
  operation: Operation;
  title: string;
  location: string;
  city: string;
  features: string[];
  clean: string;
}) {
  const locationText = input.location || input.city || "San Luis";
  const investmentText =
    input.type === "Inversión" || input.type === "Desarrollo"
      ? " Una oportunidad orientada a inversión, renta o desarrollo comercial."
      : "";
  const featureText =
    input.features.length > 0
      ? ` Se destacan: ${input.features.slice(0, 6).join(", ").toLowerCase()}.`
      : "";

  return normalizeWhitespace(
    `${input.title || input.type} ${input.operation.toLowerCase()} ubicado en ${locationText}.${investmentText}${featureText} Consultá disponibilidad y condiciones con Víctor Abadie Inmobiliaria.`,
  );
}

function toNumber(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(value);
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
