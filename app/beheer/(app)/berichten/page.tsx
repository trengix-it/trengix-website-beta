import Link from "next/link";
import { ConfirmButton } from "@/components/beheer/ConfirmButton";
import { Notities } from "@/components/beheer/Notities";
import { StatusSelect } from "@/components/beheer/StatusSelect";
import { Toast } from "@/components/beheer/Toast";
import { deleteInzending } from "@/lib/actions/admin";
import { adminBerichten, relatief } from "@/lib/admin";

const label = { job: "Zoekt een job", talent: "Zoekt talent", anders: "Iets anders" } as const;
const FILTERS = [
  ["open", "Open"],
  ["afgehandeld", "Afgehandeld"],
  ["alle", "Alle"],
] as const;

export default async function Berichten({ searchParams }: PageProps<"/beheer/berichten">) {
  const sp = await searchParams;
  const f = typeof sp.filter === "string" ? sp.filter : "open";
  const o = typeof sp.onderwerp === "string" ? sp.onderwerp : "";
  const all = await adminBerichten();
  const items = all.filter((m) => (f === "alle" || (f === "open" ? m.status !== "afgehandeld" : m.status === f)) && (!o || m.onderwerp === o));
  const count = (k: string) => all.filter((m) => k === "alle" || (k === "open" ? m.status !== "afgehandeld" : m.status === k)).length;
  const href = (nf: string, no: string) => `/beheer/berichten?filter=${nf}${no ? `&onderwerp=${no}` : ""}`;

  return (
    <div className="a-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 className="admin-h1">Berichten</h1>
        <p className="admin-sub">Alles wat via het contactformulier binnenkomt, ook spontane sollicitaties en vragen van werkgevers.</p>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {FILTERS.map(([k, l]) => (
          <Link key={k} href={href(k, o)} className="pill-tab" aria-pressed={f === k}>{l} <span className="n">{count(k)}</span></Link>
        ))}
        <span style={{ width: 1, height: 28, background: "#DCDCE6", margin: "0 6px" }} aria-hidden="true" />
        {[["", "Alle onderwerpen"], ["job", "Job"], ["talent", "Talent"], ["anders", "Anders"]].map(([k, l]) => (
          <Link key={k} href={href(f, k)} className="pill-tab" aria-pressed={o === k}>{l}</Link>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((m) => (
          <article key={m.id} className="admin-card stack" style={{ padding: 24, display: "grid", gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <h2 style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>{m.naam}</h2>
                <span className="tag">{label[m.onderwerp]}</span>
                <span style={{ fontSize: 13, color: "#4A4A55" }}>{relatief(m.created_at)}</span>
              </div>
              <div style={{ fontSize: 14, color: "#3D3D46", display: "flex", gap: 16, flexWrap: "wrap" }}>
                <a href={`mailto:${m.email}`}>{m.email}</a>
                {m.telefoon && <a href={`tel:${m.telefoon.replace(/[^\d+]/g, "")}`}>{m.telefoon}</a>}
                {m.bedrijf && <span>{m.bedrijf}</span>}
                {m.profiel && <span>Zoekt: {m.profiel}</span>}
              </div>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, whiteSpace: "pre-line" }}>{m.bericht}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: "auto" }}>
                <StatusSelect tabel="berichten" id={m.id} status={m.status} label={`Status van bericht van ${m.naam}`} />
                {m.cv_path && <a className="mini-btn" href={`/beheer/cv?tabel=berichten&id=${m.id}`} target="_blank" rel="noopener">Cv openen</a>}
                <a className="mini-btn" href={`mailto:${m.email}?subject=${encodeURIComponent("Je bericht aan Trengix")}`}>Antwoorden</a>
                <ConfirmButton className="mini-btn" action={deleteInzending.bind(null, "berichten", m.id)} vraag={`Bericht van ${m.naam} definitief verwijderen?`}>Verwijderen</ConfirmButton>
              </div>
            </div>
            <Notities tabel="berichten" id={m.id} initial={m.notities} />
          </article>
        ))}
        {items.length === 0 && <div className="admin-card" style={{ padding: "40px 24px", fontSize: 16, color: "#3D3D46" }}>Geen berichten in deze selectie.</div>}
      </div>
      <Toast text={typeof sp.melding === "string" ? sp.melding : null} />
    </div>
  );
}
