"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AdminPropertyActionsProps = {
  id: string;
  published: boolean;
  featured: boolean;
};

export function AdminPropertyActions({
  id,
  published,
  featured,
}: AdminPropertyActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateFlags(values: { published?: boolean; featured?: boolean }) {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("properties").update(values).eq("id", id);
    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }
    router.refresh();
    setLoading(false);
  }

  async function remove() {
    if (!window.confirm("¿Eliminar esta propiedad? Esta acción no se puede deshacer.")) {
      return;
    }

    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
      <button
        type="button"
        onClick={() => updateFlags({ published: !published })}
        disabled={loading}
        className="rounded-md border border-black/10 bg-white px-3 py-2 text-xs font-black text-[#111111] transition hover:border-brand hover:text-brand-dark disabled:opacity-60"
      >
        {published ? "Ocultar" : "Publicar"}
      </button>
      <button
        type="button"
        onClick={() => updateFlags({ featured: !featured })}
        disabled={loading}
        className="rounded-md border border-black/10 bg-white px-3 py-2 text-xs font-black text-[#111111] transition hover:border-brand hover:text-brand-dark disabled:opacity-60"
      >
        {featured ? "Quitar destacado" : "Destacar"}
      </button>
      <button
        type="button"
        onClick={remove}
        disabled={loading}
        className="rounded-md border border-red-200 bg-red-50/50 px-3 py-2 text-xs font-black text-red-700 transition hover:bg-red-50 disabled:opacity-60 sm:col-span-2 lg:col-span-1"
      >
        Eliminar
      </button>
    </div>
  );
}
