import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactCTA } from "@/components/ContactCTA";
import { PropertyFilters } from "@/components/PropertyFilters";
import { SectionTitle } from "@/components/SectionTitle";
import { getPublishedProperties } from "@/lib/propertiesRepository";
import { buildCanonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Propiedades en venta en San Luis",
  description:
    "Catálogo de casas, terrenos, departamentos, campos, desarrollos e inversiones disponibles en San Luis y zonas cercanas.",
  alternates: {
    canonical: buildCanonicalUrl("/propiedades"),
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
            headingLevel="h1"
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
