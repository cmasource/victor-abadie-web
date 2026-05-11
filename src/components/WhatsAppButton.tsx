import Link from "next/link";
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
    <Link
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark ${className}`}
    >
      {label}
    </Link>
  );
}
