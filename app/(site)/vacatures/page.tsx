import type { Metadata } from "next";
import Link from "next/link";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { Mark } from "@/components/Mark";
import { RolesMarquee } from "@/components/Marquee";
import { JobAlert } from "@/components/vacatures/JobAlert";
import { LatestBubble, SearchProvider, VacatureList, VacatureSearch } from "@/components/vacatures/VacatureList";
import { getContent, getOnlineVacatures } from "@/lib/data";
import { isNieuw } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Vacatures",
  description: "Vacatures in finance, data en IT die we van binnenuit kennen. We spraken met de werkgever voor ze online kwamen.",
};

export default async function VacaturesPage() {
  const [all, c] = await Promise.all([getOnlineVacatures(), getContent()]);
  const jobs = all.map((v) => ({ id: v.id, slug: v.slug, title: v.title, domein: v.domein, regio: v.regio, contract: v.contract, nieuw: isNieuw(v) }));

  return (
    <SearchProvider>
      <header className="bg-hero inv">
        <HeroBackdrop />
        <div className="wrap grid-hero hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">Voor kandidaten</div>
            <h1 className="display" style={{ fontSize: "clamp(72px, 11vw, 196px)" }}>
              <span className="mask-line"><span className="a-line">Vacatures</span></span>
            </h1>
            <p className="lead a-in">{c.vacatures.lead}</p>
            <VacatureSearch />
          </div>
          <div className="hide-m" style={{ position: "relative", height: 380 }}>
            <div className="card-float a-bob" style={{ position: "absolute", top: 10, right: 30, width: 300, gap: 10 }}>
              <span style={{ fontSize: 14, color: "#4A4A55" }}>Nu open</span>
              <span style={{ fontSize: 72, lineHeight: 1, letterSpacing: "-0.05em" }}>{all.length}</span>
              <span style={{ fontSize: 16, color: "#3D3D46" }}>vacatures die we van binnenuit kennen</span>
            </div>
            <LatestBubble items={all.slice(0, 5).map((v) => `${v.title}, ${v.regio}`)} />
          </div>
        </div>
      </header>

      <RolesMarquee />

      <section id="lijst" className="sec bg-soft" style={{ paddingTop: 80, paddingBottom: 136, scrollMarginTop: 80 }}>
        <div className="wrap">
          <VacatureList jobs={jobs} />

          <div className="cols-2" style={{ gap: 16, marginTop: 56 }}>
            <div className="bg-night inv reveal" style={{ position: "relative", overflow: "hidden", padding: 44, borderRadius: 32, display: "flex", flexDirection: "column", gap: 18 }}>
              <Mark color="#1B17FF" style={{ position: "absolute", right: -60, top: -80, height: 260, width: "auto", opacity: 0.5 }} />
              <h2 style={{ position: "relative", margin: 0, fontSize: "clamp(32px, 3.2vw, 48px)", lineHeight: 1, letterSpacing: "-0.035em", fontWeight: 400 }}>Mis geen enkele vacature</h2>
              <JobAlert />
            </div>
            <div className="bg-door inv reveal" style={{ position: "relative", overflow: "hidden", padding: 44, borderRadius: 32, display: "flex", flexDirection: "column", gap: 18 }}>
              <Mark style={{ position: "absolute", right: -60, bottom: -80, height: 260, width: "auto", opacity: 0.22 }} />
              <h2 style={{ position: "relative", margin: 0, fontSize: "clamp(32px, 3.2vw, 48px)", lineHeight: 1, letterSpacing: "-0.035em", fontWeight: 400 }}>Je job staat er niet tussen?</h2>
              <p style={{ position: "relative", margin: 0, fontSize: 17, lineHeight: 1.5, color: "#E6E6FF", maxWidth: "40ch" }}>{c.vacatures.spontaan}</p>
              <Link href="/contact?onderwerp=job" className="btn btn-white" style={{ position: "relative", marginTop: "auto", alignSelf: "flex-start" }}>Spontaan solliciteren</Link>
            </div>
          </div>
        </div>
      </section>
    </SearchProvider>
  );
}
