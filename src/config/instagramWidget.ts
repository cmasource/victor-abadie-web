export type InstagramWidgetProvider = "elfsight" | "taggbox" | "flockler" | "custom";
export type InstagramFallbackMode = "properties" | "visual";

const defaultInstagramWidgetConfig = {
  enabled: false,
  provider: "custom" as InstagramWidgetProvider,
  scriptSrc: "",
  containerHtml: "",
  rawEmbedHtml: "",
  fallbackMode: "properties" as InstagramFallbackMode,
};

function parseEnabled(value: string | undefined) {
  if (value === undefined) {
    return defaultInstagramWidgetConfig.enabled;
  }

  return value.toLowerCase() === "true";
}

function parseProvider(value: string | undefined): InstagramWidgetProvider {
  if (value === "elfsight" || value === "taggbox" || value === "flockler" || value === "custom") {
    return value;
  }

  return defaultInstagramWidgetConfig.provider;
}

function parseFallbackMode(value: string | undefined): InstagramFallbackMode {
  if (value === "visual" || value === "properties") {
    return value;
  }

  return defaultInstagramWidgetConfig.fallbackMode;
}

export const instagramWidgetConfig = {
  enabled: parseEnabled(process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_ENABLED),
  provider: parseProvider(process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_PROVIDER),
  scriptSrc:
    process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_SCRIPT_SRC ??
    defaultInstagramWidgetConfig.scriptSrc,
  containerHtml:
    process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_CONTAINER_HTML ??
    defaultInstagramWidgetConfig.containerHtml,
  rawEmbedHtml:
    process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_RAW_HTML ??
    defaultInstagramWidgetConfig.rawEmbedHtml,
  fallbackMode: parseFallbackMode(process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_FALLBACK_MODE),
};

export function hasInstagramWidgetConfig() {
  return Boolean(
    instagramWidgetConfig.enabled &&
      (instagramWidgetConfig.containerHtml || instagramWidgetConfig.rawEmbedHtml),
  );
}
