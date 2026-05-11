import Link from "next/link";

export function InstagramCTA() {
  return (
    <section className="bg-surface">
      <div className="container-page grid gap-6 py-12 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-dark">
            Novedades
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-[#111111]">
            Seguinos en Instagram para ver nuevos ingresos
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Próximamente se podrán conectar publicaciones automáticamente. Por
            ahora, el enlace lleva directo al perfil oficial.
          </p>
        </div>
        <Link
          href="https://www.instagram.com/victorabadieinmo"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-brand px-5 py-3 text-center text-sm font-bold text-white hover:bg-brand-dark"
        >
          Ver Instagram
        </Link>
      </div>
    </section>
  );
}
