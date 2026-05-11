import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactCTA } from "@/components/ContactCTA";
import { PropertyFilters } from "@/components/PropertyFilters";
import { SectionTitle } from "@/components/SectionTitle";
import { getPublishedProperties } from "@/lib/propertiesRepository";

export const metadata: Metadata = {
  title: "Propiedades en venta en San Luis | Víctor Abadie Inmobiliaria",
  description:
    "Catálogo de casas, departamentos, terrenos y locales en San Luis, Juana Koslay, La Punta, El Volcán, Trapiche y Nogolí.",
};

export default async function PropertiesPage() {
  const properties = await getPublishedProperties();

  return (
    <>
      <section className="bg-surface">
        <div className="container-page py-12 md:py-16">
          <SectionTitle
            eyebrow="Catálogo"
            title="Propiedades en venta en San Luis"
            description="Filtrá por tipo, localidad y operación para encontrar rápidamente casas, departamentos, terrenos y locales."
          />
        </div>
      </section>
      <section className="container-page py-10">
        <Suspense fallback={<div className="rounded-lg bg-surface p-8">Cargando filtros...</div>}>
          <PropertyFilters properties={properties} />
        </Suspense>
      </section>
      <ContactCTA />
    </>
  );
}
