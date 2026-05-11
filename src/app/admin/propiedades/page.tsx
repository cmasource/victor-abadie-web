import Link from "next/link";
import { AdminPropertyCard } from "@/components/admin/AdminPropertyCard";
import { AdminShell } from "@/components/admin/AdminShell";
import { NotAuthorized } from "@/components/admin/NotAuthorized";
import { requireAdmin } from "@/lib/adminAuth";
import { getProperties } from "@/lib/propertiesRepository";

export default async function AdminPropertiesPage() {
  const access = await requireAdmin();
  if (!access.configured) {
    return <NotAuthorized reason="not-configured" />;
  }
  if (!access.authorized) {
    return (
      <AdminShell email={access.email}>
        <NotAuthorized />
      </AdminShell>
    );
  }

  const properties = await getProperties();

  return (
    <AdminShell email={access.email}>
      <div className="flex flex-col gap-4 rounded-lg border border-black/5 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
            {properties.length}{" "}
            {properties.length === 1 ? "propiedad cargada" : "propiedades cargadas"}
          </p>
          <h1 className="mt-2 text-3xl font-black text-[#111111]">
            Propiedades cargadas
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Administrá las propiedades publicadas en la web.
          </p>
        </div>
        <Link
          href="/admin/propiedades/nueva"
          className="rounded-md bg-brand px-5 py-3 text-center text-sm font-black text-white transition hover:bg-brand-dark"
        >
          Nueva propiedad
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-black/10 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-black text-[#111111]">
            Todavía no hay propiedades cargadas.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
            Cuando cargues la primera propiedad, va a aparecer acá para editarla,
            publicarla y verla en el sitio.
          </p>
          <Link
            href="/admin/propiedades/nueva"
            className="mt-5 inline-flex rounded-md bg-brand px-5 py-3 text-sm font-black text-white transition hover:bg-brand-dark"
          >
            Cargar primera propiedad
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {properties.map((property) => (
            <AdminPropertyCard key={property.id} property={property} showActions />
          ))}
        </div>
      )}
    </AdminShell>
  );
}
