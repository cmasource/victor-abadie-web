import Link from "next/link";
import { BUSINESS_LICENSE } from "@/lib/site";
import { WhatsAppButton } from "./WhatsAppButton";

const trustBadges = [
  BUSINESS_LICENSE,
  "San Luis y zonas cercanas",
  "Atención directa por WhatsApp",
];

export function Hero() {
  return (
    <section className="bg-surface">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.08fr_0.92fr] md:py-20">
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.18em] text-brand-dark">
            Inmobiliaria local en San Luis
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-[#111111] md:text-6xl">
            Propiedades en San Luis con atención personalizada
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Casas, terrenos, departamentos y oportunidades inmobiliarias en San
            Luis, Juana Koslay, El Volcán, La Punta y zonas cercanas.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/propiedades"
              className="inline-flex items-center justify-center rounded-md bg-[#111111] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-black"
            >
              Ver propiedades
            </Link>
            <WhatsAppButton message="Hola, quiero hacer una consulta desde la web de Víctor Abadie Inmobiliaria." />
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 card-shadow">
          <div className="rounded-md bg-[#111111] p-6 text-white md:p-8">
            <p className="text-sm font-bold text-brand">Nuevos ingresos</p>
            <p className="mt-4 text-3xl font-black leading-tight">
              Casas, lotes y oportunidades para consultar hoy
            </p>
            <p className="mt-4 text-sm leading-6 text-white/75">
              Una demo preparada para mostrar catálogo, contacto directo,
              publicación comercial y flujo real de consulta.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            {["San Luis", "Juana Koslay", "La Punta", "El Volcán"].map((city) => (
              <div key={city} className="rounded-md border border-black/5 bg-surface p-4">
                <p className="text-xs font-bold uppercase text-brand-dark">Zona</p>
                <p className="mt-2 font-extrabold text-[#111111]">{city}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-y border-black/5 bg-white">
        <div className="container-page grid gap-3 py-4 text-sm font-extrabold text-[#111111] md:grid-cols-3">
          {trustBadges.map((badge) => (
            <div key={badge} className="rounded-md bg-surface px-4 py-3 text-center">
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
