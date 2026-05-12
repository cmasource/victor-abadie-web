import Image from "next/image";
import Link from "next/link";
import { buildPropertyImageAlt } from "@/lib/seo";
import type { Property } from "@/types/property";

type InstagramShowcaseProps = {
  properties?: Property[];
  compact?: boolean;
};

const fallbackPosts = [
  {
    image: "/properties/placeholder-1.svg",
    badge: "Nuevo ingreso",
    title: "Casa familiar en zona residencial",
    detail: "Ambientes cómodos y consulta directa.",
  },
  {
    image: "/properties/placeholder-2.svg",
    badge: "Terreno",
    title: "Lote para proyectar en San Luis",
    detail: "Ubicación clara y potencial de inversión.",
  },
  {
    image: "/properties/placeholder-3.svg",
    badge: "Departamento",
    title: "Opción funcional para vivir o alquilar",
    detail: "Ideal para quienes buscan practicidad.",
  },
  {
    image: "/properties/placeholder-4.svg",
    badge: "Inversión",
    title: "Propiedad con perfil de renta",
    detail: "Información ordenada para evaluar rápido.",
  },
  {
    image: "/properties/placeholder-5.svg",
    badge: "Desarrollo",
    title: "Oportunidad para proyecto inmobiliario",
    detail: "Superficie, ubicación y consulta comercial.",
  },
  {
    image: "/properties/placeholder-6.svg",
    badge: "Casa",
    title: "Ingreso destacado en zona tranquila",
    detail: "Publicación preparada para generar consultas.",
  },
];

export function InstagramShowcase({ properties = [], compact = false }: InstagramShowcaseProps) {
  const realPosts = properties.slice(0, 6).map((property) => ({
    image: property.mainImage,
    badge: property.type,
    title: property.title,
    detail: property.location || property.city || "San Luis",
    alt: buildPropertyImageAlt(property),
  }));
  const posts = [...realPosts, ...fallbackPosts].slice(0, 6);

  return (
    <div className={compact ? "mt-8" : "bg-surface"}>
      <div className={compact ? "" : "container-page py-14"}>
        {!compact ? (
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-dark">
              Instagram
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#111111] md:text-4xl">
              Novedades en Instagram
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Seguinos para ver nuevos ingresos, oportunidades y recorridos de
              propiedades.
            </p>
            <p className="mt-2 text-xs font-semibold text-muted">
              Vista previa visual. Para feed automático se puede integrar un widget externo.
            </p>
          </div>
          <div className="lg:text-right">
            <Link
              href="https://www.instagram.com/victorabadieinmo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-md bg-brand px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-brand-dark"
            >
              Ver Instagram
            </Link>
          </div>
        </div>
        ) : (
          <p className="text-xs font-semibold text-muted">
            Vista previa visual. Para feed automático se puede integrar un widget externo.
          </p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={`${post.badge}-${post.title}-${index}`}
              className="group overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-square overflow-hidden bg-surface">
                <Image
                  src={post.image}
                  alt={
                    "alt" in post && typeof post.alt === "string"
                      ? post.alt
                      : `${post.title} - Víctor Abadie Inmobiliaria`
                  }
                  fill
                  unoptimized
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black text-brand-dark shadow-sm">
                  {post.badge}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">
                    Víctor Abadie Inmobiliaria
                  </p>
                  <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/80">
                    {post.detail}
                  </p>
                </div>
                <span className="absolute bottom-4 right-4 rounded-full bg-white/15 px-2 py-1 text-xs font-black text-white">
                  0{index + 1}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
