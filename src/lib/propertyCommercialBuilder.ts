function titleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function unique(values: string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.trim().toLowerCase();
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function cleanLine(line: string) {
  return line.replace(/^[-•*\d.)\s]+/, "").trim();
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function splitList(value: string) {
  return unique(
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

export function mergeFeatureLists(...lists: string[][]) {
  return unique(lists.flat().map((item) => item.trim()).filter(Boolean));
}

export function buildPropertyTitle(notes: string, type: string, city: string) {
  const cleanType = type || "Propiedad";
  const cleanCity = city || "San Luis";
  const bedroomMatch = notes.match(/(\d+)\s*(dorm|dormitorios|habitaciones)/i);
  const unitMatch = notes.match(/(\d+)\s*(departamentos|unidades|locales)/i);

  if (unitMatch && /inversi[oó]n|renta|desarrollo|unidades/i.test(notes)) {
    return `${cleanType} con ${unitMatch[1]} ${unitMatch[2].toLowerCase()} en ${titleCase(cleanCity)}`;
  }

  const bedroomText = bedroomMatch ? ` de ${bedroomMatch[1]} dormitorios` : "";
  return `${cleanType}${bedroomText} en ${titleCase(cleanCity)}`;
}

export function extractFeaturesFromNotes(notes: string) {
  const cleanedLines = notes
    .split(/\n|;/)
    .map(cleanLine)
    .filter((line) => line.length >= 3 && line.length <= 90);

  const lineFeatures = cleanedLines.filter((line) =>
    /(\d+\s*m|m²|m2|dorm|bañ|bano|departamento|unidad|renta|cochera|patio|churrasquera|port[oó]n|escritura|expansi[oó]n|amueblado|cubiertos|terreno|local|premium)/i.test(
      line,
    ),
  );

  const featureMap = [
    ["cochera", "Cocheras individuales"],
    ["garage", "Cochera"],
    ["patio", "Patio"],
    ["parrilla", "Parrilla"],
    ["churrasquera", "Churrasqueras iluminadas"],
    ["pileta", "Pileta"],
    ["jardín", "Jardín"],
    ["jardin", "Jardín"],
    ["terraza", "Terraza"],
    ["luminos", "Ambientes luminosos"],
    ["centro", "Ubicación céntrica"],
    ["sierras", "Vista a sierras"],
    ["servicios", "Servicios cercanos"],
    ["portón", "Portón automatizado"],
    ["porton", "Portón automatizado"],
    ["escritura", "Escritura al día"],
    ["renta", "Unidades con renta estable"],
    ["amueblado", "Unidad amueblada"],
    ["expansión", "Potencial de expansión"],
    ["expansion", "Potencial de expansión"],
  ];

  const lower = notes.toLowerCase();
  const mappedFeatures = featureMap
    .filter(([token]) => lower.includes(token))
    .map(([, feature]) => feature);

  return mergeFeatureLists(lineFeatures, mappedFeatures);
}

function normalizeRichDescription(text: string, type: string, city: string) {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const intro = `${type || "Propiedad"} en ${city || "San Luis"} con información comercial relevante para evaluar ubicación, características y potencial.`;
  const body = lines
    .map((line) => cleanLine(line))
    .filter(Boolean)
    .join(". ")
    .replace(/\.\s*\./g, ".");

  if (!body) {
    return intro;
  }

  return `${intro} ${body}${body.endsWith(".") ? "" : "."} Consultá disponibilidad y condiciones con Víctor Abadie Inmobiliaria.`;
}

export function buildCommercialDescription(notes: string, type: string, city: string) {
  const clean = notes.trim();
  const features = extractFeaturesFromNotes(clean);

  if (clean.length > 180 || clean.split(/\n/).length >= 4) {
    return normalizeRichDescription(clean, type, city);
  }

  const details =
    features.length > 0
      ? ` Se destacan: ${features.join(", ").toLowerCase()}.`
      : "";

  return `${type || "Propiedad"} ubicada en ${city || "San Luis"}, con una propuesta funcional para vivienda, inversión o consulta comercial.${details} Consultá disponibilidad y condiciones con Víctor Abadie Inmobiliaria.`;
}

export function buildExcerpt(description: string) {
  return description.replace(/\s+/g, " ").trim().slice(0, 170);
}

export function buildInstagramCaption(title: string, city: string, price: string, features: string[] = []) {
  const featureText =
    features.length > 0 ? `\n\nCaracterísticas:\n- ${features.slice(0, 6).join("\n- ")}` : "";

  return `${title}\n\nUbicación: ${city || "San Luis"}\nPrecio: ${price || "Consultar precio"}${featureText}\n\nConsultas por WhatsApp con Víctor Abadie Inmobiliaria.\n#SanLuis #Inmobiliaria #Propiedades`;
}
