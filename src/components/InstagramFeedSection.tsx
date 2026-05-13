import { InstagramExternalWidget } from "@/components/InstagramExternalWidget";
import { TrackedInstagramLink } from "@/components/TrackedLinks";

const ELFSIGHT_SCRIPT_SRC = "https://elfsightcdn.com/platform.js";

const ELFSIGHT_CONTAINER_HTML =
  '<div class="elfsight-app-0a1b9bbd-6582-448f-a776-e85c07d90477" data-elfsight-app-lazy></div>';

export async function InstagramFeedSection() {
  return (
    <section className="bg-surface" data-instagram-mode="external">
      <div className="container-page py-14">
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
          </div>

          <div className="lg:text-right">
            <TrackedInstagramLink
              href="https://www.instagram.com/victorabadieinmo"
              target="_blank"
              rel="noopener noreferrer"
              source="home_section"
              className="inline-flex rounded-md bg-brand px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-brand-dark"
            >
              Ver Instagram
            </TrackedInstagramLink>
          </div>
        </div>

        <InstagramExternalWidget
          provider="elfsight"
          scriptSrc={ELFSIGHT_SCRIPT_SRC}
          containerHtml={ELFSIGHT_CONTAINER_HTML}
          rawEmbedHtml=""
        />
      </div>
    </section>
  );
}
