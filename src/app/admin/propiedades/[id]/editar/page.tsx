import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { NotAuthorized } from "@/components/admin/NotAuthorized";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { requireAdmin } from "@/lib/adminAuth";
import { getProperties } from "@/lib/propertiesRepository";

type EditPropertyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
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

  const { id } = await params;
  const properties = await getProperties();
  const property = properties.find((item) => item.id === id);

  if (!property) {
    notFound();
  }

  return (
    <AdminShell email={access.email}>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
        Editar propiedad
      </p>
      <h1 className="mt-2 text-3xl font-black text-[#111111]">{property.title}</h1>
      <div className="mt-8">
        <PropertyForm property={property} />
      </div>
    </AdminShell>
  );
}
