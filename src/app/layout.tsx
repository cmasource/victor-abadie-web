import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { BUSINESS_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BUSINESS_NAME} | Propiedades en San Luis`,
  description:
    "Casas, terrenos, departamentos y oportunidades inmobiliarias en San Luis, Juana Koslay, La Punta, El Volcán, Trapiche y zonas cercanas.",
  keywords: [
    "inmobiliaria San Luis",
    "propiedades en San Luis",
    "casas en venta San Luis",
    "terrenos San Luis",
    "departamentos San Luis",
    "inmobiliaria Juana Koslay",
    "Victor Abadie Inmobiliaria",
  ],
  openGraph: {
    title: `${BUSINESS_NAME} | Propiedades en San Luis`,
    description:
      "Casas, terrenos, departamentos y oportunidades inmobiliarias en San Luis, Juana Koslay, La Punta, El Volcán, Trapiche y zonas cercanas.",
    url: SITE_URL,
    siteName: BUSINESS_NAME,
    locale: "es_AR",
    type: "website",
  },
  icons: {
    icon: "/brand/favicon.png",
    shortcut: "/brand/favicon.png",
    apple: "/brand/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className={`${montserrat.variable} scroll-smooth`}>
      <body>{children}</body>
    </html>
  );
}
