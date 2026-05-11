import { createBrowserClient } from "@supabase/ssr";
import { siteConfig } from "@/config/site";

export function createSupabaseBrowserClient() {
  if (!siteConfig.supabaseUrl || !siteConfig.supabaseKey) {
    throw new Error("Supabase no está configurado.");
  }

  return createBrowserClient(siteConfig.supabaseUrl, siteConfig.supabaseKey);
}
