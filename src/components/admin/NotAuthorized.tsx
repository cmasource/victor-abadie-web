import Link from "next/link";

type NotAuthorizedProps = {
  reason?: "not-configured" | "not-admin";
};

export function NotAuthorized({ reason = "not-admin" }: NotAuthorizedProps) {
  return (
    <div className="rounded-lg border border-black/5 bg-white p-8 shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
        Panel administrativo
      </p>
      <h1 className="mt-3 text-3xl font-black text-[#111111]">
        {reason === "not-configured" ? "Supabase no está configurado" : "No autorizado"}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
        {reason === "not-configured"
          ? "Agregá las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local para habilitar el panel."
          : "Tu usuario inició sesión, pero no está incluido en la tabla admin_users. Agregalo desde Supabase para administrar propiedades."}
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-md bg-brand px-5 py-3 text-sm font-black text-white"
      >
        Volver al sitio
      </Link>
    </div>
  );
}
