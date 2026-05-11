import type { Metadata } from "next";
import { ContactCTA } from "@/components/ContactCTA";
import { LeadForm } from "@/components/LeadForm";
import { SectionTitle } from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Vendé tu propiedad en San Luis | Víctor Abadie Inmobiliaria",
  description:
    "Tasación, difusión comercial y seguimiento personalizado para vender propiedades en San Luis y zonas cercanas.",
};

const benefits = [
  "Tasación y asesoramiento",
  "Publicación en redes",
  "Difusión comercial",
  "Contacto directo con interesados",
  "Seguimiento personalizado",
];

const steps = [
  "Nos contás sobre tu propiedad",
  "Evaluamos ubicación y características",
  "Definimos estrategia de publicación",
  "Te acompañamos en la gestión comercial",
];

export default function SellPropertyPage() {
  return (
    <>
      <section className="bg-surface">
        <div className="container-page grid gap-10 py-12 md:grid-cols-[1fr_0.78fr] md:py-16">
          <div>
            <SectionTitle
              eyebrow="Para propietarios"
              title="Vendé tu propiedad en San Luis con Víctor Abadie Inmobiliaria"
              description="Una presentación comercial clara, atención directa y acompañamiento local para que tu propiedad llegue mejor a compradores e interesados."
            />
            <div className="mt-8 grid gap-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-md border border-black/5 bg-white px-5 py-4 text-sm font-extrabold text-[#111111]"
                >
                  {benefit}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-4 rounded-lg bg-[#111111] p-5 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
                Consulta por WhatsApp
              </p>
              <p className="mt-3 text-2xl font-black">
                Completá tus datos y armamos el mensaje automáticamente.
              </p>
            </div>
            <LeadForm mode="sell" />
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <SectionTitle
          eyebrow="Proceso"
          title="Cómo trabajamos tu propiedad"
          description="Un recorrido simple para ordenar la información, publicar mejor y atender interesados con claridad."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step} className="rounded-lg border border-black/5 bg-white p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand text-sm font-black text-white">
                {index + 1}
              </span>
              <p className="mt-5 text-lg font-black text-[#111111]">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <ContactCTA
        title="Recibí una primera orientación por WhatsApp"
        description="Contanos qué propiedad querés vender y en qué zona está. Te respondemos de forma directa."
      />
    </>
  );
}
