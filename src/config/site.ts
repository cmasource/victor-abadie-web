export const siteConfig = {
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://victor-abadie-web.vercel.app",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "",
  instagramUrl: "https://www.instagram.com/victorabadieinmo",
  facebookUrl: "https://www.facebook.com/victorabadieinmobiliariasanluis",
  whatsappNumber: "542664572176",
  phoneNumber: "2664215382",
  brandName: "Víctor Abadie Inmobiliaria",
  businessLicense: "Mat. N°488",
  defaultSeoTitle: "Víctor Abadie Inmobiliaria | Propiedades en San Luis",
  defaultSeoDescription:
    "Casas, terrenos, departamentos y oportunidades inmobiliarias en San Luis, Juana Koslay, La Punta, El Volcán, Trapiche y zonas cercanas.",
};

export const hasSupabaseConfig = Boolean(
  siteConfig.supabaseUrl && siteConfig.supabaseKey,
);

export const serviceAreas = [
  "San Luis Capital",
  "Juana Koslay",
  "La Punta",
  "El Volcán",
  "Trapiche",
  "Nogolí",
  "Potrero de los Funes",
];
