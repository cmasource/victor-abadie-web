import Link from "next/link";
import { sellPropertyWhatsAppLink } from "@/lib/whatsapp";

export function SellPropertySection() {
  return (
    <section className="bg-[#111111] text-white">
      <div className="container-page grid gap-8 py-14 md:grid-cols-[1fr_0.8fr] md:items-center">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Tasá o vendé tu propiedad
          </p>
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">
            Convirtamos tu propiedad en una oportunidad visible
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 md:text-lg">
            Te ayudamos a ordenar la información, definir una estrategia de
            publicación y recibir consultas con atención directa.
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 text-[#111111]">
          <p className="text-2xl font-black">Asesoramiento inmobiliario local</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            Ideal para propietarios que quieren vender en San Luis, Juana
            Koslay, La Punta y zonas cercanas con acompañamiento comercial.
          </p>
          <Link
            href={sellPropertyWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-md bg-brand px-5 py-3 text-sm font-extrabold text-white hover:bg-brand-dark"
          >
            Quiero vender mi propiedad
          </Link>
        </div>
      </div>
    </section>
  );
}
