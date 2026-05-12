import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { NotAuthorized } from "@/components/admin/NotAuthorized";
import { getAdminAccess } from "@/lib/adminAuth";

export default async function AdminLoginPage() {
  const access = await getAdminAccess();

  if (!access.configured) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="container-page py-16">
          <NotAuthorized reason="not-configured" />
        </div>
      </main>
    );
  }

  if (access.authorized) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-surface">
      <div className="container-page flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md rounded-lg border border-black/5 bg-white p-8 shadow-xl">
          <Link
            href="/"
            aria-label="Volver al inicio"
            className="mx-auto mb-8 inline-flex justify-center"
          >
            <Image
              src="/brand/logo-horizontal-transparente.png"
              alt="Víctor Abadie Inmobiliaria"
              width={260}
              height={68}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
            Panel privado
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#111111]">Ingresar</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Acceso exclusivo para usuarios autorizados en Supabase.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
