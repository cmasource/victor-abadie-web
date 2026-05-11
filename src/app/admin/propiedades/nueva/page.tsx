import { AdminShell } from "@/components/admin/AdminShell";
import { NotAuthorized } from "@/components/admin/NotAuthorized";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { requireAdmin } from "@/lib/adminAuth";

export default async function NewPropertyPage() {
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

  return (
    <AdminShell email={access.email}>
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-dark">
          Nueva propiedad
        </p>
        <h1 className="mt-2 text-3xl font-black text-[#111111] md:text-4xl">
          Cargar propiedad
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted md:text-base">
          Completá los datos principales, subí imágenes y publicá la propiedad
          en la web.
        </p>
      </div>
      <div className="mt-8">
        <PropertyForm />
      </div>
    </AdminShell>
  );
}
