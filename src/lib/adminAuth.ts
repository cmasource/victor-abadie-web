import { redirect } from "next/navigation";
import { hasSupabaseConfig } from "@/config/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminRole = "owner" | "editor";

export type CurrentAdminUser = {
  userId: string;
  email: string | null;
  role: AdminRole;
};

export type AdminAccess =
  | { configured: false; authorized: false; user: null; email: null; admin: null }
  | { configured: true; authorized: false; user: null; email: null; admin: null }
  | {
      configured: true;
      authorized: false;
      user: { id: string };
      email: string | null;
      admin: null;
    }
  | {
      configured: true;
      authorized: true;
      user: { id: string };
      email: string | null;
      admin: CurrentAdminUser;
    };

export function isOwner(role?: string | null) {
  return normalizeAdminRole(role) === "owner";
}

export function isEditor(role?: string | null) {
  return normalizeAdminRole(role) === "editor";
}

function normalizeAdminRole(role?: string | null): AdminRole {
  if (role === "editor") {
    return "editor";
  }

  return "owner";
}

export async function getAdminAccess(): Promise<AdminAccess> {
  if (!hasSupabaseConfig) {
    return { configured: false, authorized: false, user: null, email: null, admin: null };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { configured: true, authorized: false, user: null, email: null, admin: null };
  }

  const { data } = await supabase
    .from("admin_users")
    .select("user_id,email,role")
    .eq("user_id", user.id)
    .maybeSingle();

  const email = user.email || data?.email || null;

  return {
    configured: true,
    authorized: Boolean(data),
    user: { id: user.id },
    email,
    admin: data
      ? {
          userId: data.user_id,
          email,
          role: normalizeAdminRole(data.role),
        }
      : null,
  } as AdminAccess;
}

export async function getCurrentAdminUser() {
  const access = await getAdminAccess();
  return access.authorized ? access.admin : null;
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

export async function requireOwner() {
  const access = await requireAdmin();

  if (!access.configured || !access.authorized || !access.admin || !isOwner(access.admin.role)) {
    return access;
  }

  return access;
}
