import Image from "next/image";
import Link from "next/link";
import { formatArea, formatPrice } from "@/lib/formatters";
import { buildPropertyImageAlt } from "@/lib/seo";
import { propertyWhatsAppLink } from "@/lib/whatsapp";
import type { Property } from "@/types/property";

type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  const imageAlt = buildPropertyImageAlt(property);

  return (
    <article className="group overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/propiedades/${property.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          <Image
            src={property.mainImage}
            alt={imageAlt}
            fill
            unoptimized
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          <div className="absolute left-4 top-4 rounded-md bg-brand px-3 py-2 text-xs font-black uppercase text-white">
            {property.operation}
          </div>
          <div className="absolute right-4 top-4 rounded-md bg-white/95 px-3 py-2 text-xs font-black uppercase text-[#111111]">
            {property.type}
          </div>
        </div>
      </Link>
      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-wide text-muted">
          <span>{property.status}</span>
          <span>{property.neighborhood}</span>
        </div>
        <Link href={`/propiedades/${property.slug}`}>
          <h3 className="mt-3 text-xl font-black leading-snug text-[#111111] transition hover:text-brand-dark">
            {property.title}
          </h3>
        </Link>
        <p className="mt-2 text-sm font-semibold text-muted">{property.location}</p>
        <p className="mt-4 text-2xl font-black text-brand-dark">
          {formatPrice(property)}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold text-[#111111]">
          <span className="rounded-md bg-surface px-2 py-2">
            {property.bedrooms ? `${property.bedrooms} dorm.` : "Sin dorm."}
          </span>
          <span className="rounded-md bg-surface px-2 py-2">
            {property.bathrooms ? `${property.bathrooms} baño${property.bathrooms > 1 ? "s" : ""}` : "Consultar"}
          </span>
          <span className="rounded-md bg-surface px-2 py-2">
            {formatArea(property.area)}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href={`/propiedades/${property.slug}`}
            className="rounded-md bg-[#111111] px-4 py-3 text-center text-sm font-extrabold text-white transition hover:bg-black"
          >
            Ver detalle
          </Link>
          <Link
            href={propertyWhatsAppLink(property.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-brand px-4 py-3 text-center text-sm font-extrabold text-brand-dark transition hover:bg-brand hover:text-white"
          >
            WhatsApp
          </Link>
        </div>
      </div>
    </article>
  );
}
