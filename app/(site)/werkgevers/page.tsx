import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { RolesMarquee } from "@/components/Marquee";
import { MethodTabs } from "@/components/MethodTabs";
import { Faq } from "@/components/werkgevers/Faq";
import { Modellen } from "@/components/werkgevers/Modellen";
import { ProfielDemo } from "@/components/werkgevers/ProfielDemo";
import { getContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Voor werkgevers",
  description: "Niche-profielen in finance, data en IT snel ingevuld. Kies No Cure, No Pay of een exclusieve search.",
};

export default async function WerkgeversPage() {
  const { werkgevers: w } = await getContent();
  return (
    <>
      <header className="bg-hero inv">
        <HeroBackdrop />
        <div className="wrap grid-hero hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">Voor werkgevers</div>
            <h1 className="display" style={{ fontSize: "clamp(52px, 6.6vw, 116px)" }}>
              <span className="mask-line"><span className="a-line">Het profiel dat</span></span>
              <span className="mask-line"><span className="a-line a-line-2">anderen niet vinden.</span></span>
            </h1>
            <p className="lead a-in">{w.belofte}</p>
            <div className="btn-row">
              <Link href="/contact?onderwerp=talent" className="btn btn-white">Plan een intake</Link>
              <a href="#modellen" className="btn btn-outline-white">Bekijk de modellen</a>
            </div>
          </div>
          <ProfielDemo />
        </div>
      </header>

      <RolesMarquee />

      <section className="sec bg-night inv" aria-labelledby="methode" style={{ paddingTop: 152, paddingBottom: 152 }}>
        <div className="wrap">
          <div className="method-head">
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="eyebrow">Onze methode</div>
              <h2 id="methode" className="h-sec" style={{ maxWidth: "10ch" }}>Eerst luisteren. Dan pas matchen.</h2>
            </div>
            <p>{w.methode_intro}</p>
          </div>
          <MethodTabs steps={w.methode_stappen} />
        </div>
      </section>

      <section id="modellen" className="sec bg-soft" style={{ scrollMarginTop: 80 }}>
        <div className="wrap">
          <Modellen ncnp={{ tekst: w.ncnp_tekst, punten: w.ncnp_punten }} excl={{ tekst: w.excl_tekst, punten: w.excl_punten }} />
        </div>
      </section>

      <section className="sec" style={{ background: "#fff" }}>
        <div className="wrap stack" style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)", gap: 64, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="eyebrow">Veelgestelde vragen</div>
            <h2 className="h-sec reveal" style={{ maxWidth: "10ch" }}>Vaak gevraagd</h2>
          </div>
          <Faq items={w.faq} />
        </div>
      </section>

      <CtaBand title="Een profiel dat niemand vindt?" primary={{ href: "/contact?onderwerp=talent", label: "Plan een gesprek" }} />
    </>
  );
}
