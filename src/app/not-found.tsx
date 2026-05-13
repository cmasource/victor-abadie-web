import Link from "next/link";
import { TrackedWhatsAppLink } from "@/components/TrackedLinks";
import { generalWhatsAppLink } from "@/lib/whatsapp";

export default function NotFound() {
  return (
    <main className="bg-surface">
      <section className="container-page flex min-h-[70vh] items-center py-16">
        <div className="mx-auto max-w-2xl rounded-lg border border-black/5 bg-white p-8 text-center shadow-sm md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
            Error 404
          </p>
          <h1 className="mt-3 text-4xl font-black text-[#111111] md:text-5xl">
            Página no encontrada
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted">
            No encontramos la página que estás buscando. Podés volver al inicio,
            revisar las propiedades publicadas o escribirnos por WhatsApp.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-md bg-brand px-5 py-3 text-sm font-black text-white transition hover:bg-brand-dark"
            >
              Volver al inicio
            </Link>
            <Link
              href="/propiedades"
              className="rounded-md border border-black/10 px-5 py-3 text-sm font-black text-[#111111] transition hover:border-brand hover:text-brand-dark"
            >
              Ver propiedades
            </Link>
            <TrackedWhatsAppLink
              href={generalWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              source="site_cta"
              className="rounded-md border border-black/10 px-5 py-3 text-sm font-black text-[#111111] transition hover:border-brand hover:text-brand-dark"
            >
              Consultar por WhatsApp
            </TrackedWhatsAppLink>
          </div>
        </div>
      </section>
    </main>
  );
}
