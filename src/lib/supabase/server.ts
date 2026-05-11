import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { siteConfig } from "@/config/site";

export async function createSupabaseServerClient() {
  if (!siteConfig.supabaseUrl || !siteConfig.supabaseKey) {
    throw new Error("Supabase no está configurado.");
  }

  const cookieStore = await cookies();

  return createServerClient(siteConfig.supabaseUrl, siteConfig.supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies; middleware refreshes sessions.
        }
      },
    },
  });
}
