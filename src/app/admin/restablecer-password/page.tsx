import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";

export default function ResetPasswordPage() {
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
              src="/brand/logo-horizontal.jpg"
              alt="Víctor Abadie Inmobiliaria"
              width={260}
              height={68}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
            Panel privado
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#111111]">
            Restablecer contraseña
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Definí una nueva contraseña para volver a ingresar al panel.
          </p>
          <div className="mt-8">
            <Suspense
              fallback={
                <p className="rounded-md bg-surface px-4 py-3 text-sm font-bold text-muted">
                  Preparando recuperación...
                </p>
              }
            >
              <ResetPasswordForm />
            </Suspense>
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
