"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PIPELINE, PIPELINE_LABEL } from "@/lib/types";
import { StatusSelect } from "./StatusSelect";

export type SolRow = { id: string; naam: string; email: string; telefoon: string; vacature: string; vacature_id: string | null; status: string; wanneer: string; cv: boolean; notities: boolean };

export function SollicitatieTable({ rows, vacatures }: { rows: SolRow[]; vacatures: { id: string; title: string }[] }) {
  const [status, setStatus] = useState("actief");
  const [vac, setVac] = useState("");
  const [q, setQ] = useState("");
  const counts = useMemo(() => {
    const c: Record<string, number> = { actief: 0, alle: rows.length };
    PIPELINE.forEach((p) => (c[p] = 0));
    rows.forEach((r) => { c[r.status]++; if (!["geplaatst", "afgewezen"].includes(r.status)) c.actief++; });
    return c;
  }, [rows]);
  const s = q.trim().toLowerCase();
  const shown = rows.filter((r) =>
    (status === "alle" || (status === "actief" ? !["geplaatst", "afgewezen"].includes(r.status) : r.status === status)) &&
    (!vac || r.vacature_id === vac) &&
    (!s || `${r.naam} ${r.email} ${r.vacature}`.toLowerCase().includes(s)));

  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {[["actief", "Actief"], ...PIPELINE.map((p) => [p, PIPELINE_LABEL[p]]), ["alle", "Alle"]].map(([k, l]) => (
          <button key={k} type="button" className="pill-tab" aria-pressed={status === k} onClick={() => setStatus(k)}>{l} <span className="n">{counts[k]}</span></button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <label className="sr-only" htmlFor="f-vac">Filter op vacature</label>
        <select id="f-vac" className="a-input" style={{ maxWidth: 320, borderRadius: 999 }} value={vac} onChange={(e) => setVac(e.target.value)}>
          <option value="">Alle vacatures</option>
          {vacatures.map((v) => <option key={v.id} value={v.id}>{v.title}</option>)}
        </select>
        <label className="sr-only" htmlFor="f-q">Zoek kandidaat</label>
        <input id="f-q" type="search" className="a-input" style={{ maxWidth: 300, borderRadius: 999 }} placeholder="Zoek op naam of e-mail" value={q} onChange={(e) => setQ(e.target.value)} />
        <span style={{ marginLeft: "auto", fontSize: 14, color: "#4A4A55" }} role="status">{shown.length} {shown.length === 1 ? "sollicitatie" : "sollicitaties"}</span>
      </div>
      <div className="admin-card">
        <div className="admin-row admin-head rows-sol"><span /><span>Kandidaat</span><span>Vacature</span><span>Status</span><span /></div>
        {shown.map((a, i) => (
          <div key={a.id} className="admin-row rows-sol a-in" style={{ animationDelay: `${Math.min(i, 12) * 0.03}s` }}>
            <span aria-hidden="true" className="avatar hide-m" style={{ width: 44, height: 44, backgroundImage: "linear-gradient(200deg, #D9D8FF 0%, #9A96FF 100%)" }} />
            <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
              <Link href={`/beheer/sollicitaties/${a.id}`} style={{ fontSize: 17, fontWeight: 500, color: "#0A0A0B", textDecoration: "none" }}>
                {a.naam}{a.status === "nieuw" && <span className="badge-new" style={{ marginLeft: 10, minHeight: 22, fontSize: 12 }}>Nieuw</span>}
              </Link>
              <span style={{ fontSize: 13, color: "#4A4A55", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.wanneer} · {a.email}{a.notities ? " · notities" : ""}</span>
            </span>
            <span style={{ fontSize: 15, color: "#3D3D46" }}>{a.vacature}</span>
            <StatusSelect tabel="sollicitaties" id={a.id} status={a.status} label={`Status van ${a.naam}`} />
            <span style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
              {a.cv && <a className="mini-btn" href={`/beheer/cv?tabel=sollicitaties&id=${a.id}`} target="_blank" rel="noopener">Cv</a>}
              <Link className="mini-btn soft" href={`/beheer/sollicitaties/${a.id}`}>Openen</Link>
            </span>
          </div>
        ))}
        {shown.length === 0 && <div style={{ padding: "40px 24px", fontSize: 16, color: "#3D3D46" }}>Geen sollicitaties in deze selectie.</div>}
      </div>
    </>
  );
}
