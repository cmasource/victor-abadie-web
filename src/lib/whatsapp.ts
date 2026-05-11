export const WHATSAPP_NUMBER = "542664572176";
export const PHONE_NUMBER = "2664215382";
export const DISPLAY_WHATSAPP = "266 4572176";
export const DISPLAY_PHONE = "266 4215382";

export const GENERAL_WHATSAPP_MESSAGE =
  "Hola, quiero hacer una consulta desde la web de Víctor Abadie Inmobiliaria.";

export const SELL_PROPERTY_MESSAGE =
  "Hola, quiero consultar para vender/tasar mi propiedad en San Luis.";

export function buildWhatsAppLink(message: string, phone = WHATSAPP_NUMBER) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function propertyWhatsAppMessage(title: string) {
  return `Hola, quiero consultar por esta propiedad: ${title}. La vi en la web de Víctor Abadie Inmobiliaria.`;
}

export function propertyWhatsAppLink(title: string) {
  return buildWhatsAppLink(propertyWhatsAppMessage(title));
}

export function generalWhatsAppLink() {
  return buildWhatsAppLink(GENERAL_WHATSAPP_MESSAGE);
}

export function sellPropertyWhatsAppLink(message = SELL_PROPERTY_MESSAGE) {
  return buildWhatsAppLink(message);
}

export function phoneHref() {
  return `tel:${PHONE_NUMBER}`;
}
