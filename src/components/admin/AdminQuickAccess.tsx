"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminQuickAccess() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAdminAccess() {
      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return;
        }

        const { data, error } = await supabase
          .from("admin_users")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!isMounted) {
          return;
        }

        setIsAdmin(Boolean(data && !error));
      } catch {
        if (isMounted) {
          setIsAdmin(false);
        }
      }
    }

    void checkAdminAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <Link
      href="/admin"
      aria-label="Volver al panel administrador"
      className="fixed bottom-24 left-4 z-[80] inline-flex items-center gap-2 rounded-full bg-[#173b2f] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white shadow-xl transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#173b2f] sm:bottom-6 sm:left-6 sm:text-sm"
    >
      <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] leading-none">
        ADMIN
      </span>
      <span>Panel admin</span>
    </Link>
  );
}
