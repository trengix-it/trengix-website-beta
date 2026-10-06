import Image from "next/image";
import Link from "next/link";
import { CookieSettingsLink } from "@/components/consent/CookieSettingsLink";
import { mailHref } from "@/lib/content";
import { getContent } from "@/lib/data";
import { site } from "@/lib/site";

export async function Footer() {
  const { bedrijf: b } = await getContent();
  const mail = mailHref(b.email);
  return (
    <footer className="footer bg-night inv">
      <div className="wrap">
        <div className="footer-grid">
          <address>
            <span style={{ display: "block", color: "#fff", fontSize: 22, marginBottom: 10 }}>{site.slugline}</span>
            {b.straat}
            <br />
            {b.postcode} {b.stad}
            <br />
            {mail ? <a href={mail}>{b.email}</a> : b.email}
          </address>
          <nav aria-label="Kandidaten" className="footer-col">
            <span>Kandidaten</span>
            <Link href="/vacatures">Vacatures</Link>
            <Link href="/contact?onderwerp=job">Spontaan solliciteren</Link>
          </nav>
          <nav aria-label="Werkgevers" className="footer-col">
            <span>Werkgevers</span>
            <Link href="/werkgevers">Onze aanpak</Link>
            <Link href="/contact?onderwerp=talent">Profiel doorgeven</Link>
          </nav>
          <nav aria-label="Trengix" className="footer-col">
            <span>Trengix</span>
            <Link href="/over-ons">Over ons</Link>
            <Link href="/contact?onderwerp=anders">Werken bij Trengix</Link>
            <Link href="/contact">Contact</Link>
            {b.linkedin && <a href={b.linkedin} target="_blank" rel="noopener">LinkedIn</a>}
          </nav>
        </div>
        <Image src="/brand/logo-wit.png" alt="Trengix" width={165} height={32}
          style={{ height: 32, width: "auto", margin: "80px 0 28px", opacity: 0.9 }} />
        <div className="footer-bottom">
          <span>{b.juridisch}</span>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <Link href="/privacy">Privacyverklaring</Link>
            <Link href="/cookies">Cookiebeleid</Link>
            <Link href="/voorwaarden">Gebruiksvoorwaarden</Link>
            <CookieSettingsLink />
          </div>
        </div>
      </div>
    </footer>
  );
}
