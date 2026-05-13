import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import {
  TrackedInstagramLink,
  TrackedWhatsAppLink,
} from "@/components/TrackedLinks";
import { buildCanonicalUrl } from "@/lib/seo";
import { FACEBOOK_URL, INSTAGRAM_URL, SERVICE_AREAS } from "@/lib/site";
import {
  DISPLAY_PHONE,
  DISPLAY_WHATSAPP,
  generalWhatsAppLink,
  phoneHref,
} from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: {
    absolute: "Contacto | Víctor Abadie Inmobiliaria",
  },
  description:
    "Contactá a Víctor Abadie Inmobiliaria para consultar por propiedades, ventas, alquileres o tasaciones en San Luis.",
  alternates: {
    canonical: buildCanonicalUrl("/contacto"),
  },
};

const contactCards = [
  ["WhatsApp", DISPLAY_WHATSAPP, generalWhatsAppLink()],
  ["Teléfono / llamadas", DISPLAY_PHONE, phoneHref()],
  ["Instagram", "@victorabadieinmo", INSTAGRAM_URL],
  ["Facebook", "Víctor Abadie Inmobiliaria", FACEBOOK_URL],
];

export default function ContactPage() {
  return (
    <section className="container-page py-12 md:py-16">
      <div className="grid gap-10 md:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
            Contacto
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-[#111111] md:text-5xl">
            Contacto
          </h1>
          <p className="mt-5 text-base leading-8 text-muted">
            Consultá por casas, terrenos, departamentos, locales o por la venta
            de tu propiedad en San Luis. Atendemos San Luis Capital, Juana
            Koslay, La Punta, El Volcán, Trapiche, Nogolí, Potrero de los
            Funes y zonas cercanas.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {contactCards.map(([label, value, href]) => {
              const className =
                "rounded-lg border border-black/5 bg-surface p-5 transition hover:border-brand hover:bg-white hover:shadow-md";

              if (label === "WhatsApp") {
                return (
                  <TrackedWhatsAppLink
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    source="contact_page"
                    className={className}
                  >
                    <p className="text-sm font-bold text-muted">{label}</p>
                    <p className="mt-2 text-lg font-black text-[#111111]">{value}</p>
                  </TrackedWhatsAppLink>
                );
              }

              if (label === "Instagram") {
                return (
                  <TrackedInstagramLink
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    source="contact_page"
                    className={className}
                  >
                    <p className="text-sm font-bold text-muted">{label}</p>
                    <p className="mt-2 text-lg font-black text-[#111111]">{value}</p>
                  </TrackedInstagramLink>
                );
              }

              return (
                <Link
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={className}
                >
                  <p className="text-sm font-bold text-muted">{label}</p>
                  <p className="mt-2 text-lg font-black text-[#111111]">{value}</p>
                </Link>
              );
            })}
          </div>

          <TrackedWhatsAppLink
            href={generalWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            source="contact_page"
            className="mt-6 inline-flex rounded-md bg-brand px-5 py-3 text-sm font-extrabold text-white hover:bg-brand-dark"
          >
            Hacer consulta por WhatsApp
          </TrackedWhatsAppLink>
        </div>

        <div>
          <div className="mb-4 rounded-lg bg-[#111111] p-5 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
              Consulta general
            </p>
            <p className="mt-3 text-2xl font-black">
              Dejanos tus datos y abrimos WhatsApp con el mensaje armado.
            </p>
          </div>
          <LeadForm mode="contact" />
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-black/5 bg-surface p-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
            Zonas de atención
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {SERVICE_AREAS.map((area) => (
              <span
                key={area}
                className="rounded-md bg-white px-4 py-3 text-sm font-bold text-[#111111]"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-black/5 bg-[#111111] p-6 text-white">
          <p className="text-sm font-bold uppercase tracking-wide text-brand">
            Mapa
          </p>
          <p className="mt-3 text-2xl font-black">
            Atención inmobiliaria en San Luis y zonas cercanas
          </p>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Esta primera versión no usa API de mapas para evitar dependencias.
            El bloque queda preparado para sumar ubicación cuando se defina el
            domicilio público.
          </p>
        </div>
      </div>
    </section>
  );
}
