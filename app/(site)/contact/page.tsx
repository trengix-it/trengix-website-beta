import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { CtaBand } from "@/components/CtaBand";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Mark } from "@/components/Mark";
import { mailHref, telHref } from "@/lib/content";
import { getContent } from "@/lib/data";
import type { ContactOnderwerp } from "@/lib/types";

export const metadata: Metadata = {
  title: "Contact",
  description: "Vertel het ons. Kies waarover je wil praten, dan weet de juiste consultant meteen waar het over gaat.",
};

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const o = typeof sp.onderwerp === "string" ? sp.onderwerp : "";
  const start: ContactOnderwerp = o === "talent" || o === "anders" ? o : "job";
  const c = await getContent();
  const b = c.bedrijf;
  const tel = telHref(b.telefoon);
  const mail = mailHref(b.email);

  return (
    <>
      <header className="bg-hero inv">
        <HeroBackdrop />
        <div className="wrap hero-inner" style={{ paddingBottom: 220 }}>
          <div className="hero-copy">
            <div className="eyebrow">Contact</div>
            <h1 className="display" style={{ fontSize: "clamp(64px, 10vw, 176px)" }}>
              <span className="mask-line"><span className="a-line">Vertel het ons.</span></span>
            </h1>
            <p className="lead a-in" style={{ maxWidth: "40ch" }}>We luisteren eerst. Kies waarover je wil praten, dan weet de juiste consultant meteen waar het over gaat.</p>
          </div>
        </div>
      </header>

      <main className="bg-fade">
        <div className="wrap stack" style={{ position: "relative", zIndex: 2, marginTop: -150, paddingBottom: 136, display: "grid", gridTemplateColumns: "minmax(0, 7fr) minmax(0, 5fr)", gap: 20, alignItems: "start" }}>
          <section aria-labelledby="form-title" className="a-in" style={{ background: "#fff", borderRadius: 32, padding: "clamp(24px, 4vw, 48px)", boxShadow: "0 40px 100px rgba(10,7,112,0.2)" }}>
            <ContactForm start={start} bevestiging={c.contact.bevestiging} />
          </section>
          <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="bg-night inv a-in" style={{ animationDelay: ".1s", position: "relative", overflow: "hidden", borderRadius: 32, padding: 44, display: "flex", flexDirection: "column", gap: 28 }}>
              <Mark color="#1B17FF" style={{ position: "absolute", right: -60, bottom: -80, height: 260, width: "auto", opacity: 0.5 }} />
              <address style={{ position: "relative", fontStyle: "normal", display: "flex", flexDirection: "column", gap: 4, fontSize: 24, lineHeight: 1.4 }}>
                <span>{b.straat}</span>
                <span>{b.postcode} {b.stad}</span>
              </address>
              <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 16, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.14)" }}>
                <Row label="Bel ons">{tel ? <a href={tel} style={{ fontSize: 20, textDecoration: "none" }}>{b.telefoon}</a> : <span style={{ fontSize: 20 }}>{b.telefoon}</span>}</Row>
                <Row label="Mail ons">{mail ? <a href={mail} style={{ fontSize: 20, textDecoration: "none" }}>{b.email}</a> : <span style={{ fontSize: 20 }}>{b.email}</span>}</Row>
                <Row label="Bereikbaar"><span style={{ fontSize: 18 }}>{b.openingsuren}</span></Row>
              </div>
            </div>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.straat}, ${b.postcode} ${b.stad}`)}`}
              target="_blank" rel="noopener" aria-label={`Open ${b.straat}, ${b.stad} in Google Maps`}
              className="bg-soft a-in" style={{ animationDelay: ".2s", position: "relative", overflow: "hidden", height: 300, borderRadius: 32, display: "block" }}>
              <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <path d="M-20 210 C 80 170, 160 240, 260 190 S 380 120, 440 150" fill="none" stroke="#FFFFFF" strokeWidth="22" strokeLinecap="round" />
                <path d="M120 -20 L 170 320" fill="none" stroke="#FFFFFF" strokeWidth="14" />
                <path d="M-20 90 L 420 60" fill="none" stroke="#FFFFFF" strokeWidth="10" />
                <path d="M300 -20 L 250 320" fill="none" stroke="#FFFFFF" strokeWidth="10" />
              </svg>
              <span style={{ position: "absolute", left: "50%", top: "46%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <span className="dot a-pulse-blue" style={{ width: 26, height: 26, border: "4px solid #fff" }} />
                <span style={{ padding: "8px 14px", borderRadius: 999, background: "#0A0A0B", color: "#fff", fontSize: 14, whiteSpace: "nowrap" }}>{b.straat}</span>
              </span>
            </a>
            <div style={{ padding: "8px 8px 0", display: "flex", flexDirection: "column", gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 500 }}>Langskomen</h2>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: "#3D3D46" }}>{c.contact.langskomen}</p>
            </div>
          </aside>
        </div>
      </main>

      <CtaBand title="Liever weten met wie je praat?" primary={{ href: "/over-ons", label: "Maak kennis met het team" }} />
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 14, color: "#A9A8D6" }}>{label}</span>
      {children}
    </div>
  );
}
