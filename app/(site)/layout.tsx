import { Analytics } from "@/components/consent/Analytics";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">
      <a href="#inhoud" className="skip-link">Naar de inhoud</a>
      <Nav />
      <div id="inhoud">{children}</div>
      <Footer />
      <CookieBanner />
      <Analytics />
    </div>
  );
}
