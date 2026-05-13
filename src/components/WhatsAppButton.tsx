import { TrackedWhatsAppLink } from "@/components/TrackedLinks";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  message: string;
  label?: string;
  className?: string;
};

export function WhatsAppButton({
  message,
  label = "Consultar por WhatsApp",
  className = "",
}: WhatsAppButtonProps) {
  return (
    <TrackedWhatsAppLink
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      source="site_cta"
      className={`inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark ${className}`}
    >
      {label}
    </TrackedWhatsAppLink>
  );
}
