import { createClient } from "@supabase/supabase-js";
import { siteConfig } from "@/config/site";

export function createSupabasePublicClient() {
  if (!siteConfig.supabaseUrl || !siteConfig.supabaseKey) {
    throw new Error("Supabase no está configurado.");
  }

  return createClient(siteConfig.supabaseUrl, siteConfig.supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
