import { TrackedWhatsAppLink } from "@/components/TrackedLinks";
import { generalWhatsAppLink } from "@/lib/whatsapp";

export function FloatingWhatsAppButton() {
  return (
    <TrackedWhatsAppLink
      href={generalWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      ariaLabel="Consultar por WhatsApp"
      source="floating_button"
      className="fixed bottom-5 right-5 z-[80] inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-black text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-brand/25 sm:bottom-6 sm:right-6"
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20">
        <WhatsAppIcon />
      </span>
      <span className="hidden sm:inline">WhatsApp</span>
    </TrackedWhatsAppLink>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M5.5 18.5 6.4 15A7.4 7.4 0 1 1 9 17.6l-3.5.9Z" />
      <path d="M9.2 8.9c.2-.5.4-.6.8-.6h.5c.2 0 .4.1.5.4l.5 1.2c.1.3 0 .5-.2.7l-.4.4c.6 1.1 1.5 2 2.6 2.6l.4-.4c.2-.2.4-.3.7-.2l1.2.5c.3.1.4.3.4.6v.5c0 .4-.1.6-.6.8-.5.2-1.2.2-1.9 0-2.4-.7-4.4-2.7-5.1-5.1-.2-.7-.2-1.4 0-1.9Z" />
    </svg>
  );
}
