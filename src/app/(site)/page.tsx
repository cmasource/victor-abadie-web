import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { ContactCTA } from "@/components/ContactCTA";
import { Hero } from "@/components/Hero";
import { InstagramFeedSection } from "@/components/InstagramFeedSection";
import { JsonLd } from "@/components/JsonLd";
import { PropertyGrid } from "@/components/PropertyGrid";
import { SectionTitle } from "@/components/SectionTitle";
import { SellPropertySection } from "@/components/SellPropertySection";
import { businessJsonLd } from "@/lib/jsonLd";
import { buildCanonicalUrl } from "@/lib/seo";
import {
  getFeaturedProperties,
  getRecentProperties,
} from "@/lib/propertiesRepository";
import { generalWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: {
    absolute: "Víctor Abadie Inmobiliaria | Propiedades en San Luis",
  },
  description:
    "Inmobiliaria en San Luis. Casas, terrenos, departamentos, inversiones y oportunidades en San Luis, Juana Koslay, La Punta, El Volcán y zonas cercanas.",
  alternates: {
    canonical: buildCanonicalUrl("/"),
  },
};

const categories = [
  ["Casas", "Viviendas familiares en San Luis, Juana Koslay y zonas cercanas."],
  ["Terrenos", "Lotes para construir, invertir o proyectar en zonas de crecimiento."],
  ["Departamentos", "Opciones funcionales para vivir, alquilar o generar renta."],
  ["Oportunidades", "Ingresos seleccionados con perfil comercial e inversión."],
];

const benefits = [
  ["Atención personalizada", "Consultas directas, trato cercano y seguimiento claro."],
  ["Experiencia local", "Conocimiento de San Luis Capital y localidades cercanas."],
  ["Difusión en redes", "Propiedades preparadas para verse bien y generar consultas."],
  ["Acompañamiento comercial", "Orientación desde la primera consulta hasta la gestión."],
];

export default async function Home() {
  const featuredProperties = await getFeaturedProperties(6);
  const recentProperties = await getRecentProperties(3);

  return (
    <>
      <JsonLd data={businessJsonLd()} />
      <Hero />

      <section className="container-page py-14">
        <SectionTitle
          eyebrow="Buscar por categoría"
          title="Encontrá el tipo de propiedad que necesitás"
          description="Una navegación rápida para orientar la consulta y llegar antes a la propiedad correcta."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(([title, description]) => (
            <CategoryCard key={title} title={title} description={description} />
          ))}
        </div>
      </section>

      <section className="bg-surface">
        <div className="container-page py-14">
          <SectionTitle
            eyebrow="Últimos ingresos"
            title="Propiedades recientes para consultar"
            description="Una selección ordenada por fecha de publicación desde el archivo JSON local."
          />
          <div className="mt-8">
            <PropertyGrid properties={recentProperties} />
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <SectionTitle
          eyebrow="Propiedades destacadas"
          title="Ingresos seleccionados en San Luis"
          description="Casas, terrenos, departamentos y oportunidades con contacto directo por WhatsApp."
        />
        <div className="mt-8">
          <PropertyGrid properties={featuredProperties} />
        </div>
      </section>

      <section className="bg-surface">
        <div className="container-page py-14">
          <SectionTitle
            eyebrow="Por qué elegirnos"
            title="Una inmobiliaria local, clara y cercana"
            align="center"
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(([title, description]) => (
              <div
                key={title}
                className="rounded-lg border border-black/5 bg-white p-6 shadow-sm"
              >
                <p className="text-lg font-black text-[#111111]">{title}</p>
                <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SellPropertySection />
      <InstagramFeedSection />

      <section className="container-page py-14">
        <div className="rounded-lg bg-[#111111] p-8 text-white md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
              Consulta rápida
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              ¿Buscás comprar, vender o invertir en San Luis?
            </h2>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-0">
            <Link
              href="/propiedades"
              className="rounded-md bg-white px-5 py-3 text-center text-sm font-extrabold text-[#111111]"
            >
              Ver propiedades
            </Link>
            <Link
              href={generalWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-brand px-5 py-3 text-center text-sm font-extrabold text-white"
            >
              Hablar por WhatsApp
            </Link>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
