import { redirect } from "next/navigation";
import { hasSupabaseConfig } from "@/config/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminAccess =
  | { configured: false; authorized: false; user: null; email: null }
  | { configured: true; authorized: false; user: null; email: null }
  | { configured: true; authorized: false; user: { id: string }; email: string | null }
  | { configured: true; authorized: true; user: { id: string }; email: string | null };

export async function getAdminAccess(): Promise<AdminAccess> {
  if (!hasSupabaseConfig) {
    return { configured: false, authorized: false, user: null, email: null };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { configured: true, authorized: false, user: null, email: null };
  }

  const { data } = await supabase
    .from("admin_users")
    .select("user_id,email")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    configured: true,
    authorized: Boolean(data),
    user: { id: user.id },
    email: user.email || data?.email || null,
  };
}

export async function requireAdmin() {
  const access = await getAdminAccess();

  if (!access.configured) {
    return access;
  }

  if (!access.user) {
    redirect("/admin/login");
  }

  return access;
}
