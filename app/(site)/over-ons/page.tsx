import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { TeamPicker } from "@/components/team/TeamPicker";
import { getContent, getZichtbaarTeam } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Over ons: het team",
  description: "Een match begint bij iemand die luistert. Maak kennis met de consultants van Trengix.",
};

export default async function OverOnsPage() {
  const [team, c] = await Promise.all([getZichtbaarTeam(), getContent()]);
  const principes = c.overons.principes.map((p, i) => ({ t: p.title, x: p.text, blue: i === 1 }));
  return (
    <>
      <header className="bg-hero inv">
        <HeroBackdrop />
        <div className="wrap grid-hero hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">Over ons</div>
            <h1 className="display" style={{ fontSize: "clamp(56px, 7.6vw, 132px)" }}>
              <span className="mask-line"><span className="a-line">De mensen</span></span>
              <span className="mask-line"><span className="a-line a-line-2">achter Trengix</span></span>
            </h1>
            <p className="lead a-in" style={{ maxWidth: "32ch" }}>{c.overons.lead}</p>
          </div>
          <div className="hide-m" style={{ position: "relative", height: 460 }}>
            <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", alignItems: "center" }}>
              {[
                { m: 80, bg: "linear-gradient(200deg, #FFFFFF 0%, #D9D8FF 100%)", c: "#4A4A55", a: "a-bob" },
                { m: -60, bg: "linear-gradient(200deg, #3A36A8 0%, #0A0A0B 100%)", c: "#E6E6FF", a: "a-bob2" },
                { m: 40, bg: "linear-gradient(200deg, #FFFFFF 0%, #D9D8FF 100%)", c: "#4A4A55", a: "a-bob" },
              ].map((x, i) => {
                const f = team[i]?.foto_url;
                return (
                  <div key={i} className={x.a} style={{ display: "flex", justifyContent: "center", marginTop: x.m }}>
                    <div className="pill-portrait" style={{ width: 150, height: 360, backgroundImage: f ? `url(${f})` : x.bg }}>
                      {!f && <span style={{ color: x.c, fontSize: 13 }}>[Portret]</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <section className="sec bg-fade" aria-labelledby="team-title" style={{ paddingTop: 104 }}>
        <div className="wrap">
          <h2 id="team-title" style={{ margin: "0 0 36px", fontSize: 18, fontWeight: 500, color: "#3D3D46" }}>Kies een persoon om meer te lezen</h2>
          <TeamPicker team={team} />
        </div>
      </section>

      <section className="sec bg-soft" aria-labelledby="waarden">
        <div className="wrap">
          <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 48 }}>
            <div className="eyebrow">Hoe we werken</div>
            <h2 id="waarden" className="h-sec reveal" style={{ maxWidth: "14ch" }}>Iedereen werkt volgens dezelfde methode</h2>
          </div>
          <div className="three">
            {principes.map((p, i) => (
              <div key={i} className={`reveal ${p.blue ? "bg-door inv" : ""}`} style={{ padding: 36, borderRadius: 28, background: p.blue ? undefined : "#fff", minHeight: 240, display: "flex", flexDirection: "column", gap: 14 }}>
                <span aria-hidden="true" className="dot" style={{ width: 18, height: 18, background: p.blue ? "#fff" : undefined }} />
                <span style={{ marginTop: "auto", fontSize: 28, letterSpacing: "-0.03em" }}>{p.t}</span>
                <span style={{ fontSize: 16, lineHeight: 1.55, color: p.blue ? "#E6E6FF" : "#3D3D46" }}>{p.x}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Zelf mee komen luisteren?" primary={{ href: "/contact?onderwerp=anders", label: "Werken bij Trengix" }} />
    </>
  );
}
