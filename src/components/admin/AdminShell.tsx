import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";
import type { AdminRole } from "@/lib/adminAuth";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/propiedades", label: "Propiedades" },
  { href: "/admin/propiedades/nueva", label: "Nueva propiedad" },
  { href: "/admin/importar-instagram", label: "Importar Instagram" },
  { href: "/admin/mi-cuenta", label: "Mi cuenta" },
  { href: "/", label: "Ver sitio" },
];

type AdminShellProps = {
  children: React.ReactNode;
  email?: string | null;
  role?: AdminRole | null;
};

export function AdminShell({ children, email, role }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-black/5 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/brand/logo-square.jpg"
              alt="Víctor Abadie Inmobiliaria"
              width={64}
              height={64}
              className="h-12 w-12 rounded-md object-contain"
            />
            <span className="hidden min-w-0 sm:block">
              <span className="block text-sm font-black leading-tight text-[#111111]">
                Víctor Abadie
              </span>
              <span className="block text-xs font-semibold text-muted">
                Inmobiliaria
              </span>
            </span>
            <span className="rounded-md bg-brand/10 px-3 py-2 text-xs font-black uppercase text-brand-dark">
              ADMIN
            </span>
          </Link>
          <nav className="grid grid-cols-2 gap-2 text-sm font-semibold sm:flex sm:flex-wrap sm:items-center">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md bg-surface px-3 py-2 text-center text-[#111111] transition hover:bg-brand hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        {email || role ? (
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium text-muted">
            {email ? <span>Sesión: {email}</span> : null}
            {role ? (
              <span className="rounded-full bg-brand/10 px-3 py-1 font-black uppercase text-brand-dark">
                {role}
              </span>
            ) : null}
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
