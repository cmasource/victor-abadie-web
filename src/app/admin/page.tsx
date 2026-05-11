import Link from "next/link";
import { AdminPropertyCard } from "@/components/admin/AdminPropertyCard";
import { AdminShell } from "@/components/admin/AdminShell";
import { NotAuthorized } from "@/components/admin/NotAuthorized";
import { requireAdmin } from "@/lib/adminAuth";
import { getProperties } from "@/lib/propertiesRepository";

export default async function AdminDashboardPage() {
  const access = await requireAdmin();
  if (!access.configured) {
    return <NotAuthorized reason="not-configured" />;
  }
  if (!access.authorized) {
    return (
      <AdminShell email={access.email} role={null}>
        <NotAuthorized />
      </AdminShell>
    );
  }

  const properties = await getProperties();
  const published = properties.filter((property) => property.published).length;
  const featured = properties.filter((property) => property.featured).length;
  const unpublished = properties.length - published;
  const latestProperties = properties.slice(0, 5);

  return (
    <AdminShell email={access.email} role={access.admin?.role}>
      <div className="flex flex-col gap-4 rounded-lg border border-black/5 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-black text-[#111111]">
            Panel administrativo
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Revisá el estado general de la cartera y accedé rápido a las últimas
            propiedades cargadas.
          </p>
        </div>
        <Link
          href="/admin/propiedades/nueva"
          className="rounded-md bg-brand px-5 py-3 text-center text-sm font-black text-white transition hover:bg-brand-dark"
        >
          Cargar nueva propiedad
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ["Total", properties.length, "Cartera cargada"],
          ["Publicadas", published, "Visibles en la web"],
          ["No publicadas", unpublished, "Ocultas o borrador"],
          ["Destacadas", featured, "Con prioridad comercial"],
        ].map(([label, value, detail]) => (
          <div
            key={label}
            className="rounded-lg border border-black/5 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-bold text-muted">{label}</p>
            <p className="mt-3 text-4xl font-black text-[#111111]">{value}</p>
            <p className="mt-2 text-xs font-semibold text-muted">{detail}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#111111]">Últimas propiedades</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Acceso rápido a las publicaciones más recientes.
            </p>
          </div>
          <Link
            href="/admin/propiedades"
            className="text-sm font-black text-brand-dark hover:text-brand"
          >
            Ver todas
          </Link>
        </div>

        {latestProperties.length === 0 ? (
          <div className="mt-5 rounded-lg border border-dashed border-black/10 bg-white p-8 text-center shadow-sm">
            <h3 className="text-xl font-black text-[#111111]">
              Todavía no hay propiedades cargadas.
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
              Cargá la primera propiedad para verla publicada en el panel y en el sitio.
            </p>
            <Link
              href="/admin/propiedades/nueva"
              className="mt-5 inline-flex rounded-md bg-brand px-5 py-3 text-sm font-black text-white transition hover:bg-brand-dark"
            >
              Cargar primera propiedad
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-4">
            {latestProperties.map((property) => (
              <AdminPropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
