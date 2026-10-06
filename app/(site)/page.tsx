import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { JobRow } from "@/components/JobRow";
import { Mark } from "@/components/Mark";
import { RolesMarquee } from "@/components/Marquee";
import { MethodTabs } from "@/components/MethodTabs";
import { MatchStage } from "@/components/home/MatchStage";
import { ModeLead, ModeProvider, ModeSwitch, ModeText } from "@/components/home/Mode";
import { Quotes } from "@/components/home/Quotes";
import { getContent, getOnlineVacatures } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const [all, c] = await Promise.all([getOnlineVacatures(), getContent()]);
  const jobs = all.slice(0, 4);
  const h = c.home;
  const logos = c.klanten.items.filter((k) => k.logo);

  return (
    <ModeProvider>
      <header className="bg-hero inv">
        <HeroBackdrop markStyle={{ top: 40, right: -260, height: 820 }} />
        <div className="wrap grid-hero hero-inner" style={{ paddingTop: 156, paddingBottom: 104 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <h1 className="display" style={{ fontSize: "clamp(68px, 9.6vw, 164px)", lineHeight: 0.88, letterSpacing: "-0.06em" }}>
              <span className="mask-line" style={{ paddingBottom: "0.04em" }}><span className="a-line">We listen,</span></span>
              <span className="mask-line" style={{ paddingBottom: "0.04em" }}><span className="a-line a-line-2">we match.</span></span>
            </h1>
            <ModeLead kandidaat={h.lead_kandidaat} werkgever={h.lead_werkgever} />
            <ModeSwitch />
          </div>
          <MatchStage />
        </div>
      </header>

      <RolesMarquee large />

      <section aria-label="Kies je weg" className="sec bg-fade" style={{ paddingTop: 120, paddingBottom: 120 }}>
        <div className="wrap cols-2" style={{ gap: 20 }}>
          <Link href="/vacatures" className="door bg-door inv">
            <Mark className="door-mark" style={{ opacity: 0.22 }} />
            <span className="door-kicker" style={{ color: "#E6E6FF" }}>Voor kandidaten</span>
            <span className="door-title">Een job die bij je past</span>
            <span className="door-text" style={{ color: "#E6E6FF" }}>{h.deur_kandidaat}</span>
            <span className="btn btn-white">Bekijk vacatures</span>
          </Link>
          <Link href="/werkgevers" className="door bg-night inv">
            <Mark className="door-mark" color="#1B17FF" style={{ opacity: 0.5 }} />
            <span className="door-kicker" style={{ color: "#C8C8E0" }}>Voor werkgevers</span>
            <span className="door-title">Het profiel dat anderen niet vinden</span>
            <span className="door-text" style={{ color: "#C8C8E0" }}>{h.deur_werkgever}</span>
            <span className="btn btn-white">Ontdek onze aanpak</span>
          </Link>
        </div>
      </section>

      <section className="sec bg-night inv" aria-labelledby="methode" style={{ paddingTop: 152, paddingBottom: 152 }}>
        <div className="wrap">
          <div className="method-head">
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="eyebrow">Onze methode</div>
              <h2 id="methode" className="h-sec" style={{ maxWidth: "10ch" }}>Eerst luisteren. Dan pas matchen.</h2>
            </div>
            <p>{h.methode_intro}</p>
          </div>
          <MethodTabs steps={h.methode_stappen} />
          <Link href="/werkgevers" className="btn btn-white" style={{ marginTop: 40 }}>Zo werkt onze methode</Link>
        </div>
      </section>

      <section className="sec bg-soft" aria-labelledby="nu-open">
        <div className="wrap">
          <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap", marginBottom: 56 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="eyebrow">Vacatures</div>
              <h2 id="nu-open" className="h-sec">Nu open</h2>
            </div>
            <Link href="/vacatures" className="btn btn-ink">Alle vacatures</Link>
          </div>
          <div className="jobs">
            {jobs.map((j) => (
              <JobRow key={j.id} job={j} className="reveal" />
            ))}
            {jobs.length === 0 && (
              <p style={{ margin: 0, padding: 32, borderRadius: 22, background: "#fff", fontSize: 18 }}>
                Op dit moment staan er geen vacatures online. <Link href="/contact?onderwerp=job">Laat je cv achter</Link>, dan bellen we je bij een match.
              </p>
            )}
          </div>
        </div>
      </section>

      {c.getuigenissen.items.length > 0 && (
      <section className="sec" aria-labelledby="ervaringen" style={{ paddingTop: 152, paddingBottom: 152, background: "#fff" }}>
        <div className="wrap">
          <Quotes quotes={c.getuigenissen.items} />
        </div>
      </section>
      )}

      <section className="sec bg-fade" aria-labelledby="team" style={{ paddingTop: 120, paddingBottom: 96, overflow: "hidden" }}>
        <div className="wrap stack" style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)", gap: 64, alignItems: "center" }}>
          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div className="eyebrow">Het team</div>
            <h2 id="team" className="h-sec" style={{ maxWidth: "11ch" }}>Mensen die eerst luisteren</h2>
            <p style={{ margin: 0, fontSize: 19, lineHeight: 1.55, color: "#3D3D46", maxWidth: "40ch" }}>{h.team_intro}</p>
            <Link href="/over-ons" className="btn btn-ink" style={{ alignSelf: "flex-start" }}>Maak kennis met het team</Link>
          </div>
          <div className="hide-m reveal" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", height: 560, alignItems: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
              <div className="pill-portrait" style={{ backgroundImage: "linear-gradient(200deg, #D9D8FF 0%, #F1F1FF 100%)" }}><span style={{ color: "#4A4A55" }}>[Portret]</span></div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: -60 }}>
              <div className="pill-portrait" style={{ backgroundImage: "linear-gradient(200deg, #8A86FF 0%, #1B17FF 55%, #0A0770 100%)" }}><span style={{ color: "#fff" }}>[Portret]</span></div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
              <div className="pill-portrait" style={{ backgroundImage: "linear-gradient(200deg, #D9D8FF 0%, #F1F1FF 100%)" }}><span style={{ color: "#4A4A55" }}>[Portret]</span></div>
            </div>
          </div>
        </div>
      </section>

      {logos.length > 0 && (
        <section aria-label="Bedrijven die op ons rekenen" className="marq-wrap" style={{ padding: "24px 0 120px", overflow: "hidden", background: "#F1F1FF" }}>
          <div className="wrap" style={{ marginBottom: 28 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: "#4A4A55" }}>Bedrijven die op ons rekenen</span>
          </div>
          <div className="marq-r">
            {[...Array(Math.max(2, Math.ceil(16 / logos.length / 2) * 2))].flatMap((_, r) =>
              logos.map((l, i) => (
                <span key={`${r}-${i}`} className="logo-tile" aria-hidden={r > 0 ? true : undefined}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.logo} alt={r > 0 ? "" : l.naam} style={{ maxWidth: 150, maxHeight: 52, objectFit: "contain" }} />
                </span>
              ))
            )}
          </div>
        </section>
      )}

      <CtaBand
        title={<ModeText kandidaat={h.cta_kandidaat} werkgever={h.cta_werkgever} />}
        primary={{ href: "/contact", label: "Plan een gesprek" }}
      />
    </ModeProvider>
  );
}
