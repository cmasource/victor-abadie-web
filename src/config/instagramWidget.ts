export type InstagramWidgetProvider = "elfsight" | "taggbox" | "flockler" | "custom";
export type InstagramFallbackMode = "properties" | "visual";

const defaultInstagramWidgetConfig = {
  enabled: true,
  provider: "elfsight" as InstagramWidgetProvider,
  scriptSrc: "https://elfsightcdn.com/platform.js",
  containerHtml:
    '<div class="elfsight-app-0a1b9bbd-6582-448f-a776-e85c07d90477" data-elfsight-app-lazy></div>',
  rawEmbedHtml: "",
  fallbackMode: "properties" as InstagramFallbackMode,
  debug: false,
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

const hasWidgetEnvOverride = Boolean(
  process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_PROVIDER !== undefined ||
    process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_SCRIPT_SRC !== undefined ||
    process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_CONTAINER_HTML !== undefined ||
    process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_RAW_HTML !== undefined,
);

export const instagramWidgetConfig = {
  enabled: parseEnabled(process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_ENABLED),
  provider: parseProvider(process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_PROVIDER),
  scriptSrc:
    process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_SCRIPT_SRC ??
    (hasWidgetEnvOverride ? "" : defaultInstagramWidgetConfig.scriptSrc),
  containerHtml:
    process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_CONTAINER_HTML ??
    (hasWidgetEnvOverride ? "" : defaultInstagramWidgetConfig.containerHtml),
  rawEmbedHtml:
    process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_RAW_HTML ??
    defaultInstagramWidgetConfig.rawEmbedHtml,
  fallbackMode: parseFallbackMode(process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_FALLBACK_MODE),
  debug:
    process.env.NEXT_PUBLIC_INSTAGRAM_WIDGET_DEBUG?.toLowerCase() === "true" ||
    defaultInstagramWidgetConfig.debug,
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
  };
}

if (process.env.NODE_ENV === "development") {
  console.info("[instagram-widget]", getInstagramWidgetDebugInfo());
}
