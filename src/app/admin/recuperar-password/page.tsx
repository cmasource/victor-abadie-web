import Image from "next/image";
import Link from "next/link";
import { RecoverPasswordForm } from "@/components/admin/RecoverPasswordForm";

export default function RecoverPasswordPage() {
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
          <h1 className="mt-3 text-3xl font-black text-[#111111]">
            Recuperar contraseña
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Ingresá tu email y te enviaremos un enlace para restablecer el acceso.
          </p>
          <div className="mt-8">
            <RecoverPasswordForm />
          </div>
          <Link
            href="/admin/login"
            className="mt-5 inline-flex text-sm font-black text-brand-dark hover:text-brand"
          >
            Volver al login
          </Link>
        </div>
      </div>
    </main>
  );
}
