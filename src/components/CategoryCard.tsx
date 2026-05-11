import Link from "next/link";
import type { ReactNode } from "react";

type CategoryCardProps = {
  title: string;
  description: string;
};

export function CategoryCard({ title, description }: CategoryCardProps) {
  const Icon = categoryIcons[title] || HomeIcon;

  return (
    <Link
      href={`/propiedades?tipo=${encodeURIComponent(title === "Oportunidades" ? "Todos" : title.slice(0, -1))}${title === "Oportunidades" ? "&operacion=Oportunidad" : ""}`}
      className="group rounded-lg border border-black/5 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-md border border-brand/20 bg-brand/15 text-brand-dark transition group-hover:bg-brand group-hover:text-white">
        <Icon />
      </div>
      <p className="text-sm font-black uppercase tracking-wide text-brand-dark">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      <p className="mt-5 text-sm font-extrabold text-[#111111]">Ver opciones</p>
    </Link>
  );
}

type IconProps = {
  className?: string;
};

const categoryIcons: Record<string, (props: IconProps) => ReactNode> = {
  Casas: HomeIcon,
  Terrenos: MapIcon,
  Departamentos: BuildingIcon,
  Oportunidades: TrendingIcon,
};

function HomeIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10.5V20h13v-9.5" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  );
}

function MapIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="m8 6-5 2v13l5-2 8 2 5-2V6l-5 2-8-2Z" />
      <path d="M8 6v13" />
      <path d="M16 8v13" />
    </svg>
  );
}

function BuildingIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M4 21h16" />
      <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
      <path d="M9 7h1" />
      <path d="M14 7h1" />
      <path d="M9 11h1" />
      <path d="M14 11h1" />
      <path d="M10 21v-5h4v5" />
    </svg>
  );
}

function TrendingIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M4 17 10 11l4 4 6-8" />
      <path d="M15 7h5v5" />
    </svg>
  );
}
