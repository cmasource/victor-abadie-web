import Image from "next/image";
import Link from "next/link";
import { AdminBadge, statusTone } from "@/components/admin/AdminBadge";
import { AdminPropertyActions } from "@/components/admin/AdminPropertyActions";
import { formatPrice } from "@/lib/formatters";
import type { AdminRole } from "@/lib/adminAuth";
import type { Property } from "@/types/property";

type AdminPropertyCardProps = {
  property: Property;
  showActions?: boolean;
  role?: AdminRole | null;
};

export function AdminPropertyCard({
  property,
  showActions = false,
  role,
}: AdminPropertyCardProps) {
  return (
    <article className="grid min-w-0 gap-4 overflow-hidden rounded-lg border border-black/5 bg-white p-4 shadow-sm transition hover:border-brand/30 hover:shadow-md lg:grid-cols-[140px_1fr_220px] lg:items-center">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface lg:h-[96px] lg:w-[128px]">
        <Image
          src={property.mainImage}
          alt={property.title}
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <AdminBadge tone="soft">{property.operation}</AdminBadge>
          <AdminBadge tone="neutral">{property.type}</AdminBadge>
          <AdminBadge tone={statusTone(property.status)}>{property.status}</AdminBadge>
          <AdminBadge tone={property.published ? "positive" : "muted"}>
            {property.published ? "Publicada" : "Oculta"}
          </AdminBadge>
          {property.featured ? (
            <AdminBadge tone="positive">Destacada</AdminBadge>
          ) : (
            <AdminBadge tone="muted">No destacada</AdminBadge>
          )}
        </div>

        <h2 className="mt-3 line-clamp-2 text-xl font-black text-[#111111]">
          {property.title}
        </h2>
        <p className="mt-2 text-sm font-semibold text-muted">
          {property.location || property.city || "Sin ubicación cargada"}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <span className="font-black text-brand-dark">{formatPrice(property)}</span>
          <span className="text-muted">
            Cargada el {new Date(property.createdAt).toLocaleDateString("es-AR")}
          </span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:hidden">
          <AdminLinks property={property} />
        </div>
      </div>

      <div className="grid min-w-0 gap-2">
        <div className="hidden gap-2 lg:grid lg:grid-cols-2">
          <AdminLinks property={property} />
        </div>
        {showActions ? (
          <AdminPropertyActions
            id={property.id}
            published={property.published}
            featured={property.featured}
            role={role}
          />
        ) : null}
      </div>
    </article>
  );
}

function AdminLinks({ property }: { property: Property }) {
  return (
    <>
      <Link
        href={`/admin/propiedades/${property.id}/editar`}
        className="rounded-md bg-[#111111] px-3 py-2 text-center text-xs font-black text-white transition hover:bg-black"
      >
        Editar
      </Link>
      <Link
        href={`/propiedades/${property.slug}`}
        target="_blank"
        className="rounded-md border border-black/10 px-3 py-2 text-center text-xs font-black text-[#111111] transition hover:border-brand hover:text-brand-dark"
      >
        Ver en web
      </Link>
    </>
  );
}
