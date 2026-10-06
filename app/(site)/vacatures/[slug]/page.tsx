import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { ApplyForm } from "@/components/vacatures/ApplyForm";
import { ConsultantCard } from "@/components/vacatures/ConsultantCard";
import { fill } from "@/lib/content";
import { getContent, getOnlineVacatures, getTeamLid, getVacatureBySlug } from "@/lib/data";
import { lines } from "@/lib/types";

export const revalidate = 60;

export async function generateStaticParams() {
  const [all, c] = await Promise.all([getOnlineVacatures(), getContent()]);
  return all.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/vacatures/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVacatureBySlug(slug);
  if (!v) return { title: "Vacature niet gevonden" };
  return { title: `${v.title} in ${v.regio}`, description: v.intro.slice(0, 160) };
}

export default async function VacaturePage({ params }: PageProps<"/vacatures/[slug]">) {
  const { slug } = await params;
  const v = await getVacatureBySlug(slug);
  if (!v) notFound();
  const consultant = await getTeamLid(v.consultant_id);
  const [all, c] = await Promise.all([getOnlineVacatures(), getContent()]);
  const similar = [...all.filter((x) => x.id !== v.id && x.domein === v.domein), ...all.filter((x) => x.id !== v.id && x.domein !== v.domein)].slice(0, 3);

  const words = v.title.split(" ");
  const titleLines = words.length > 1 ? [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")] : [v.title];
  const redenen = lines(v.redenen).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: v.title,
    description: [v.intro, v.bedrijf, ...lines(v.taken), ...lines(v.profiel), v.aanbod].filter(Boolean).join("\n"),
    datePosted: v.published_at || v.created_at,
    employmentType: v.uren === "Deeltijds" ? "PART_TIME" : "FULL_TIME",
    hiringOrganization: { "@type": "Organization", name: "Trengix", sameAs: "https://trengix.be" },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: v.regio, addressCountry: "BE" } },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="bg-hero inv">
        <HeroBackdrop />
        <div className="wrap grid-hero hero-inner">
          <div className="hero-copy">
            <Link href="/vacatures" style={{ fontSize: 16, fontWeight: 500, textUnderlineOffset: 5 }}>Alle vacatures</Link>
            <h1 className="display" style={{ fontSize: "clamp(60px, 8.4vw, 148px)" }}>
              {titleLines.map((l, i) => (
                <span key={i} className="mask-line"><span className={`a-line${i ? " a-line-2" : ""}`}>{l}</span></span>
              ))}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {[v.regio, v.contract, v.uren, v.domein].filter(Boolean).map((t, i) => (
                <span key={t} className="tag-glass a-pop" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>{t}</span>
              ))}
            </div>
          </div>
          <div className="hide-m" style={{ position: "relative", height: 340 }}>
            <ConsultantCard naam={consultant?.naam ?? "[Naam consultant]"} foto={consultant?.foto_url ?? null}
              berichten={["Ik bespreek deze rol graag eerst met je.", "Ik ken het team van binnenuit.", consultant?.boodschap || "[Persoonlijke boodschap van de consultant]"]} />
          </div>
        </div>
      </header>

      <main className="bg-fade">
        <div className="wrap stack" style={{ display: "grid", gridTemplateColumns: "minmax(0, 7fr) minmax(0, 5fr)", gap: 80, alignItems: "start", paddingTop: 96, paddingBottom: 120 }}>
          <article style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            {v.intro && <p className="reveal" style={{ margin: 0, fontSize: 30, lineHeight: 1.32, letterSpacing: "-0.02em", maxWidth: "30ch" }}>{v.intro}</p>}
            {redenen.length > 0 && (
              <div className="three" style={{ gap: 10 }}>
                {redenen.map((r) => (
                  <div key={r} className="bg-soft reveal" style={{ padding: 26, borderRadius: 22, display: "flex", flexDirection: "column", gap: 10 }}>
                    <span aria-hidden="true" className="dot" style={{ width: 14, height: 14 }} />
                    <span style={{ fontSize: 20, letterSpacing: "-0.02em" }}>{r}</span>
                  </div>
                ))}
              </div>
            )}
            <Block title="Over het bedrijf" text={v.bedrijf} />
            <Block title="Wat je gaat doen" items={lines(v.taken)} />
            <Block title="Wat je meebrengt" items={lines(v.profiel)} />
            <Block title="Wat je krijgt" text={v.aanbod} />
          </article>
          <aside className="sticky-d" style={{ position: "sticky", top: 112, display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="bg-soft" style={{ borderRadius: 28, padding: 36, boxShadow: "0 30px 80px rgba(10,7,112,0.14)", display: "flex", flexDirection: "column", gap: 16 }}>
              <ApplyForm vacatureId={v.id} bevestiging={fill(c.vacatures.bevestiging, { consultant: consultant?.naam ?? "Je consultant" })} />
            </div>
          </aside>
        </div>
      </main>

      {similar.length > 0 && (
        <section className="sec bg-soft" style={{ paddingTop: 120 }}>
          <div className="wrap">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap", marginBottom: 40 }}>
              <h2 className="h-sec reveal">Ook interessant</h2>
              <Link href="/vacatures" className="btn btn-ink">Alle vacatures</Link>
            </div>
            <div className="three">
              {similar.map((j) => (
                <Link key={j.id} href={`/vacatures/${j.slug}`} className="job job-card reveal">
                  <span className="job-meta" style={{ fontSize: 15 }}>{j.domein}</span>
                  <span className="job-title">{j.title}</span>
                  <span className="job-meta" style={{ fontSize: 15 }}>{j.regio}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Block({ title, text, items }: { title: string; text?: string; items?: string[] }) {
  if (!text && (!items || items.length === 0)) return null;
  return (
    <section className="reveal" style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 32, borderTop: "1px solid #DCDCE6" }}>
      <h2 style={{ margin: 0, fontSize: 30, fontWeight: 500, letterSpacing: "-0.025em" }}>{title}</h2>
      {text && <p style={{ margin: 0, fontSize: 18, lineHeight: 1.65, color: "#3D3D46", maxWidth: "62ch", whiteSpace: "pre-line" }}>{text}</p>}
      {items && (
        <ul style={{ margin: 0, paddingLeft: 22, fontSize: 18, lineHeight: 1.65, color: "#3D3D46", display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      )}
    </section>
  );
}
