import { AdminQuickAccess } from "@/components/admin/AdminQuickAccess";
import { Footer } from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Header } from "@/components/Header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleAnalytics />
      <Header />
      <main>{children}</main>
      <AdminQuickAccess />
      <FloatingWhatsAppButton />
      <Footer />
    </>
  );
}
