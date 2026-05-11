import Image from "next/image";
import Link from "next/link";
import { BUSINESS_NAME } from "@/lib/site";
import { DISPLAY_PHONE, DISPLAY_WHATSAPP, buildWhatsAppLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[#111111] text-white">
      <div className="container-page grid gap-8 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Link href="/" className="mb-5 inline-flex rounded-sm bg-white p-2">
            <Image
              src="/brand/logo-horizontal.jpg"
              alt={BUSINESS_NAME}
              width={250}
              height={72}
              className="h-14 w-auto object-contain"
            />
          </Link>
          <p className="max-w-xl text-sm leading-7 text-white/75">
            Víctor Abadie Inmobiliaria acompaña operaciones de casas, terrenos,
            departamentos, locales, campos, desarrollos e inversiones en San
            Luis y zonas cercanas.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-brand">
            Contacto
          </h2>
          <ul className="space-y-3 text-sm text-white/80">
            <li>WhatsApp: {DISPLAY_WHATSAPP}</li>
            <li>Llamadas: {DISPLAY_PHONE}</li>
            <li>San Luis, Argentina</li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-brand">
            Enlaces
          </h2>
          <div className="grid gap-3 text-sm text-white/80">
            <Link href="/propiedades" className="hover:text-white">
              Propiedades
            </Link>
            <Link href="/vende-tu-propiedad" className="hover:text-white">
              Vendé tu propiedad
            </Link>
            <Link href="/contacto" className="hover:text-white">
              Contacto
            </Link>
            <Link
              href={buildWhatsAppLink("Hola, quiero consultar con Víctor Abadie Inmobiliaria.")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand"
            >
              Consultar por WhatsApp
            </Link>
            <Link href="/admin/login" className="pt-2 text-xs text-white/45 hover:text-white/75">
              Acceso admin
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/55">
        Víctor Abadie Inmobiliaria | Propiedades en San Luis
      </div>
    </footer>
  );
}
