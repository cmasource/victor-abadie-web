type EventParams = Record<string, string | number | boolean | null | undefined>;

type Gtag = (
  command: "event",
  eventName: string,
  params?: EventParams,
) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  try {
    window.gtag("event", eventName, cleanParams(params));
  } catch {
    // Analytics must never block navigation or user actions.
  }
}

export function trackWhatsAppClick(params: EventParams) {
  trackEvent("whatsapp_click", params);
}

export function trackPropertyView(params: EventParams) {
  trackEvent("property_view", params);
}

export function trackPropertyCardClick(params: EventParams) {
  trackEvent("property_card_click", params);
}

export function trackInstagramClick(params: EventParams) {
  trackEvent("instagram_click", params);
}

function cleanParams(params: EventParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
  );
}
