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
        {reason === "not-configured" ? "Panel no disponible" : "No autorizado"}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
        {reason === "not-configured"
          ? "El panel administrativo no está disponible en este momento. Contactá al responsable técnico para revisar la configuración."
          : "Tu usuario inició sesión, pero no tiene permisos para administrar propiedades. Contactá al responsable del sitio para solicitar acceso."}
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
