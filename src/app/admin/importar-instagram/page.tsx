import { AdminShell } from "@/components/admin/AdminShell";
import { InstagramImportTool } from "@/components/admin/InstagramImportTool";
import { NotAuthorized } from "@/components/admin/NotAuthorized";
import { requireAdmin } from "@/lib/adminAuth";

export default async function ImportInstagramPage() {
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

  return (
    <AdminShell email={access.email} role={access.admin?.role}>
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
          Importador
        </p>
        <h1 className="mt-2 text-3xl font-black text-[#111111] md:text-4xl">
          Importar desde copy de Instagram
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted md:text-base">
          Pegá el texto de una publicación y el sistema intentará ordenar los datos
          para cargar la propiedad más rápido.
        </p>
      </div>
      <div className="mt-8">
        <InstagramImportTool />
      </div>
    </AdminShell>
  );
}
