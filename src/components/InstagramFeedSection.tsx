import Link from "next/link";
import { InstagramExternalWidget } from "@/components/InstagramExternalWidget";
import { InstagramShowcase } from "@/components/InstagramShowcase";
import {
  getInstagramWidgetDebugInfo,
  hasInstagramWidgetConfig,
  instagramWidgetConfig,
} from "@/config/instagramWidget";
import { getPublishedProperties } from "@/lib/propertiesRepository";

export async function InstagramFeedSection() {
  const showWidget = hasInstagramWidgetConfig();
  const debugInfo = getInstagramWidgetDebugInfo();
  const properties =
    !showWidget && instagramWidgetConfig.fallbackMode === "properties"
      ? await getPublishedProperties()
      : [];

  return (
    <section className="bg-surface">
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

        {showWidget ? (
          <InstagramExternalWidget
            provider={instagramWidgetConfig.provider}
            scriptSrc={instagramWidgetConfig.scriptSrc}
            containerHtml={instagramWidgetConfig.containerHtml}
            rawEmbedHtml={instagramWidgetConfig.rawEmbedHtml}
          />
        ) : (
          <InstagramShowcase properties={properties} compact />
        )}

        {debugInfo.debugEnabled ? (
  <p className="mt-3 text-xs font-semibold text-muted">
    Instagram widget: enabled={String(debugInfo.enabled)} | provider=
    {debugInfo.provider} | container={String(debugInfo.hasContainerHtml)} |
    script={String(debugInfo.hasScriptSrc)}
  </p>
) : null}
      </div>
    </section>
  );
}
