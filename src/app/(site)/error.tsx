"use client";

export default function SiteError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-2xl rounded-lg border border-black/5 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
          Sitio web
        </p>
        <h1 className="mt-3 text-3xl font-black text-[#111111]">
          No se pudo cargar la información
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          No se pudieron cargar las propiedades en este momento. Intentá
          nuevamente más tarde.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-6 rounded-md bg-brand px-5 py-3 text-sm font-black text-white transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/30"
        >
          Intentar nuevamente
        </button>
      </div>
    </section>
  );
}
