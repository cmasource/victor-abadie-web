import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactCTA } from "@/components/ContactCTA";
import { JsonLd } from "@/components/JsonLd";
import { PropertyFeatures } from "@/components/PropertyFeatures";
import { PropertyGallery } from "@/components/PropertyGallery";
import { RelatedProperties } from "@/components/RelatedProperties";
import { formatPrice } from "@/lib/formatters";
import { propertyJsonLd } from "@/lib/jsonLd";
import {
  getPropertyBySlug,
  getPublishedProperties,
  getRelatedProperties,
} from "@/lib/propertiesRepository";
import { propertyMetadata } from "@/lib/seo";
import { DISPLAY_PHONE, phoneHref, propertyWhatsAppLink } from "@/lib/whatsapp";

type PropertyDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const properties = await getPublishedProperties();
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) {
    return {};
  }
  return propertyMetadata(property);
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const related = await getRelatedProperties(property);

  return (
    <>
      <JsonLd data={propertyJsonLd(property)} />
      <section className="container-page py-8 md:py-12">
        <Link href="/propiedades" className="text-sm font-extrabold text-brand-dark">
          Volver a propiedades
        </Link>

        <div className="mt-6">
          <PropertyGallery title={property.title} images={property.images} />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <article>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
              {property.operation} | {property.type}
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-[#111111] md:text-5xl">
              {property.title}
            </h1>
            <p className="mt-4 text-lg font-bold text-muted">{property.location}</p>
            <p className="mt-5 text-4xl font-black text-brand-dark">
              {formatPrice(property)}
            </p>

            <div className="mt-8">
              <PropertyFeatures property={property} />
            </div>

            <div className="mt-10 rounded-lg bg-surface p-6">
              <h2 className="text-2xl font-black text-[#111111]">Descripción</h2>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted">
                {property.description}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-black text-[#111111]">Características</h2>
              {property.features.length > 0 ? (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {property.features.map((feature) => (
                    <li
                      key={feature}
                      className="rounded-md border border-black/5 bg-white px-4 py-3 text-sm font-bold text-muted"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 rounded-md bg-surface px-4 py-3 text-sm font-semibold text-muted">
                  Consultá por WhatsApp para recibir más características de esta propiedad.
                </p>
              )}
            </div>
          </article>

          <aside className="h-fit rounded-lg border border-black/5 bg-white p-6 shadow-xl lg:sticky lg:top-28">
            <p className="text-sm font-black uppercase tracking-wide text-muted">
              Consulta directa
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#111111]">
              ¿Te interesa esta propiedad?
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Enviá una consulta con el título de la propiedad ya incluido o
              llamá al fijo para coordinar atención.
            </p>
            <Link
              href={propertyWhatsAppLink(property.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex rounded-md bg-brand px-5 py-3 text-center text-sm font-extrabold text-white hover:bg-brand-dark"
            >
              Consultar por WhatsApp
            </Link>
            <Link
              href={phoneHref()}
              className="mt-3 flex rounded-md border border-black/10 px-5 py-3 text-center text-sm font-extrabold text-[#111111] hover:border-brand hover:text-brand-dark"
            >
              Llamar al {DISPLAY_PHONE}
            </Link>
            <div className="mt-6 rounded-md bg-surface p-4 text-sm leading-6 text-muted">
              Atención inmobiliaria en San Luis y zonas cercanas. Matrícula
              profesional visible para reforzar confianza en la consulta.
            </div>
          </aside>
        </div>
      </section>

      <div className="sticky bottom-0 z-40 border-t border-black/5 bg-white p-3 shadow-2xl lg:hidden">
        <div className="container-page grid grid-cols-2 gap-3">
          <Link
            href={propertyWhatsAppLink(property.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-brand px-4 py-3 text-center text-sm font-extrabold text-white"
          >
            WhatsApp
          </Link>
          <Link
            href={phoneHref()}
            className="rounded-md border border-black/10 px-4 py-3 text-center text-sm font-extrabold text-[#111111]"
          >
            Llamar
          </Link>
        </div>
      </div>

      <RelatedProperties properties={related} />
      <ContactCTA />
    </>
  );
}
