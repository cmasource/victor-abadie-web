import { seoConfig } from "@/config/seo";

export const siteConfig = {
  siteUrl: seoConfig.siteUrl,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "",
  instagramUrl: seoConfig.socialLinks[0],
  facebookUrl: seoConfig.socialLinks[1],
  whatsappNumber: "542664572176",
  phoneNumber: "2664215382",
  brandName: seoConfig.businessName,
  businessLicense: seoConfig.businessLicense,
  defaultSeoTitle: seoConfig.defaultTitle,
  defaultSeoDescription: seoConfig.defaultDescription,
};

export const hasSupabaseConfig = Boolean(
  siteConfig.supabaseUrl && siteConfig.supabaseKey,
);

export const serviceAreas = [...seoConfig.serviceAreas, "Nogolí"];
