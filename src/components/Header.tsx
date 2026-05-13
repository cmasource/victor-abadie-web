"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { trackWhatsAppClick } from "@/lib/analyticsEvents";
import { BUSINESS_NAME } from "@/lib/site";
import { generalWhatsAppLink } from "@/lib/whatsapp";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/vende-tu-propiedad", label: "Vendé tu propiedad" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 shadow-sm backdrop-blur">
      <div className="container-page flex min-h-[72px] items-center justify-between gap-4 py-2.5 md:min-h-[86px]">
        <Link
          href="/"
          className="flex min-w-0 items-center"
          aria-label="Ir al inicio"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/brand/logo-horizontal-transparente.png"
            alt={BUSINESS_NAME}
            width={380}
            height={96}
            className="h-14 w-auto object-contain sm:h-16 md:h-[72px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-bold text-[#111111] lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-brand-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={generalWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ source: "site_cta" })}
            className="rounded-md bg-brand px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-brand-dark"
          >
            Consultar
          </Link>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 text-[#111111] lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            <span className="grid gap-1">
              <span className="h-0.5 w-5 rounded bg-[#111111]" />
              <span className="h-0.5 w-5 rounded bg-[#111111]" />
              <span className="h-0.5 w-5 rounded bg-[#111111]" />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="container-page grid gap-2 border-t border-black/5 py-3 text-sm font-bold text-[#111111] lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md bg-surface px-4 py-3"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
