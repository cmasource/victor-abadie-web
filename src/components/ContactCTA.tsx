import Link from "next/link";
import { TrackedWhatsAppLink } from "@/components/TrackedLinks";
import { generalWhatsAppLink, phoneHref } from "@/lib/whatsapp";

type ContactCTAProps = {
  title?: string;
  description?: string;
};

export function ContactCTA({
  title = "¿Buscás comprar, vender o invertir en San Luis?",
  description = "Escribinos y recibí atención directa para avanzar con una consulta clara.",
}: ContactCTAProps) {
  return (
    <section className="bg-brand">
      <div className="container-page grid gap-6 py-10 text-white md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="text-2xl font-black md:text-3xl">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
            {description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/propiedades"
            className="rounded-md bg-[#111111] px-5 py-3 text-center text-sm font-extrabold text-white"
          >
            Ver propiedades
          </Link>
          <TrackedWhatsAppLink
            href={generalWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            source="site_cta"
            className="rounded-md bg-white px-5 py-3 text-center text-sm font-extrabold text-[#111111]"
          >
            Hablar por WhatsApp
          </TrackedWhatsAppLink>
          <Link
            href={phoneHref()}
            className="rounded-md border border-white/45 px-5 py-3 text-center text-sm font-extrabold text-white"
          >
            Llamar
          </Link>
        </div>
      </div>
    </section>
  );
}
