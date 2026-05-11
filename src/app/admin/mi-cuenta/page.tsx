import { AdminShell } from "@/components/admin/AdminShell";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { NotAuthorized } from "@/components/admin/NotAuthorized";
import { requireAdmin } from "@/lib/adminAuth";

export default async function MyAccountPage() {
  const access = await requireAdmin();
  if (!access.configured) {
    return <NotAuthorized reason="not-configured" />;
  }
  if (!access.authorized || !access.admin) {
    return (
      <AdminShell email={access.email} role={null}>
        <NotAuthorized />
      </AdminShell>
    );
  }

  return (
    <AdminShell email={access.email} role={access.admin.role}>
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <section className="rounded-lg border border-black/5 bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
            Mi cuenta
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#111111]">Mi cuenta</h1>
          <div className="mt-6 grid gap-3 text-sm">
            <p>
              <span className="font-black text-[#111111]">Email:</span>{" "}
              <span className="text-muted">{access.admin.email}</span>
            </p>
            <p>
              <span className="font-black text-[#111111]">Rol:</span>{" "}
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-black uppercase text-brand-dark">
                {access.admin.role}
              </span>
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-[#111111]">Cambiar contraseña</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Actualizá tu contraseña de acceso al panel privado.
          </p>
          <div className="mt-6">
            <ChangePasswordForm />
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
