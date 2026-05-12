export type InstagramWidgetProvider =
  | "elfsight"
  | "taggbox"
  | "flockler"
  | "custom";

export type InstagramFallbackMode = "properties" | "visual";

const defaultInstagramWidgetConfig = {
  enabled: true,
  provider: "elfsight" as InstagramWidgetProvider,
  scriptSrc: "https://elfsightcdn.com/platform.js",
  containerHtml:
    '<div class="elfsight-app-0a1b9bbd-6582-448f-a776-e85c07d90477" data-elfsight-app-lazy></div>',
  rawEmbedHtml: "",
  fallbackMode: "properties" as InstagramFallbackMode,
};

function parseEnabled(value: string | undefined) {
  if (value === undefined || value.trim() === "") {
    return defaultInstagramWidgetConfig.enabled;
  }

  return value.trim().toLowerCase() === "true";
}

function parseProvider(value: string | undefined): InstagramWidgetProvider {
  const cleanValue = value?.trim();

  if (
    cleanValue === "elfsight" ||
    cleanValue === "taggbox" ||
    cleanValue === "flockler" ||
    cleanValue === "custom"
  ) {
    return cleanValue;
  }

  return defaultInstagramWidgetConfig.provider;
}

function parseFallbackMode(value: string | undefined): InstagramFallbackMode {
  const cleanValue = value?.trim();

  if (cleanValue === "visual" || cleanValue === "properties") {
    return cleanValue;
  }

  return defaultInstagramWidgetConfig.fallbackMode;
}

export const instagramWidgetConfig = {
  enabled: parseEnabled(process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_ENABLED),
  provider: parseProvider(process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_PROVIDER),
  scriptSrc:
    process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_SCRIPT_SRC?.trim() ||
    defaultInstagramWidgetConfig.scriptSrc,
  containerHtml:
    process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_CONTAINER_HTML?.trim() ||
    defaultInstagramWidgetConfig.containerHtml,
  rawEmbedHtml:
    process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_RAW_HTML?.trim() ||
    defaultInstagramWidgetConfig.rawEmbedHtml,
  fallbackMode: parseFallbackMode(
    process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_FALLBACK_MODE,
  ),
};

export function hasInstagramWidgetConfig() {
  return Boolean(
    instagramWidgetConfig.enabled &&
      (instagramWidgetConfig.containerHtml || instagramWidgetConfig.rawEmbedHtml),
  );
}

export function getInstagramWidgetDebugInfo() {
  return {
    enabled: instagramWidgetConfig.enabled,
    provider: instagramWidgetConfig.provider,
    hasScriptSrc: Boolean(instagramWidgetConfig.scriptSrc),
    hasContainerHtml: Boolean(instagramWidgetConfig.containerHtml),
    hasRawEmbedHtml: Boolean(instagramWidgetConfig.rawEmbedHtml),
    fallbackMode: instagramWidgetConfig.fallbackMode,
    debugEnabled:
      process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_DEBUG?.trim().toLowerCase() ===
      "true",
  };
}