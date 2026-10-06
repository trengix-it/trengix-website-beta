"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { setVacatureStatus } from "@/lib/actions/admin";
import type { VacatureStatus } from "@/lib/types";

export type Row = { id: string; slug: string; title: string; domein: string; regio: string; consultant: string; status: VacatureStatus; apps: number; nieuw: number; edited: string };

const TABS = ["Alle", "Online", "Concept", "Ingevuld"] as const;

export function VacatureTable({ rows }: { rows: Row[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Alle");
  const [q, setQ] = useState("");
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { Alle: rows.length, Online: 0, Concept: 0, Ingevuld: 0 };
    rows.forEach((r) => (c[r.status] += 1));
    return c;
  }, [rows]);
  const s = q.trim().toLowerCase();
  const visible = rows.filter((r) => (tab === "Alle" || r.status === tab) && (!s || `${r.title} ${r.regio}`.toLowerCase().includes(s)));

  const toggle = (r: Row) => {
    const ns: VacatureStatus = r.status === "Online" ? "Concept" : "Online";
    setBusy(r.id);
    start(async () => {
      const res = await setVacatureStatus(r.id, ns);
      setBusy(null);
      setMsg(res.ok ? (ns === "Online" ? `${r.title} staat nu online.` : `${r.title} is offline gehaald.`) + (res.message ? ` ${res.message}` : "") : `Mislukt: ${res.error}`);
      setTimeout(() => setMsg(null), 3200);
    });
  };

  return (
    <>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {TABS.map((t) => (
          <button key={t} type="button" className="pill-tab" aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t} <span className="n">{counts[t]}</span>
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, minHeight: 44, padding: "0 16px", border: "1px solid #C9C9D6", borderRadius: 999, background: "#fff", minWidth: 260 }}>
          <label htmlFor="a-zoek" className="sr-only">Zoek vacature</label>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#4A4A55" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input id="a-zoek" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Zoek vacature"
            style={{ flexGrow: 1, minWidth: 0, border: 0, background: "transparent", fontSize: 15, minHeight: 42, outlineOffset: 4 }} />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-row admin-head rows-vac">
          <span>Functie</span><span>Domein en regio</span><span>Consultant</span><span>Status</span><span>Sollicitaties</span><span />
        </div>
        {visible.map((r, i) => (
          <div key={r.id} className="admin-row rows-vac a-in" style={{ animationDelay: `${i * 0.04}s` }}>
            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em" }}>{r.title}</span>
              <span style={{ fontSize: 13, color: "#4A4A55" }}>Gewijzigd {r.edited}</span>
            </span>
            <span style={{ fontSize: 15, color: "#3D3D46" }}>{r.domein}, {r.regio || "[regio]"}</span>
            <span style={{ fontSize: 15, color: "#3D3D46" }}>{r.consultant}</span>
            <span><span className={`status status-${r.status}`}>{r.status}</span></span>
            <span style={{ fontSize: 15, color: "#3D3D46" }}>{r.apps}{r.nieuw > 0 && <span className="badge-new" style={{ marginLeft: 8, minHeight: 22, fontSize: 12 }}>{r.nieuw} nieuw</span>}</span>
            <span style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
              {r.status === "Online" && <a href={`/vacatures/${r.slug}`} target="_blank" rel="noopener" className="mini-btn" aria-label={`Bekijk ${r.title} op de site`}>Bekijk</a>}
              {r.status !== "Ingevuld" && (
                <button type="button" className="mini-btn" disabled={pending && busy === r.id} onClick={() => toggle(r)}
                  aria-label={(r.status === "Online" ? "Offline halen: " : "Online zetten: ") + r.title}>
                  {r.status === "Online" ? "Offline halen" : "Online zetten"}
                </button>
              )}
              <Link href={`/beheer/vacatures/${r.id}`} className="mini-btn soft">Bewerken</Link>
            </span>
          </div>
        ))}
        {visible.length === 0 && <div style={{ padding: "40px 24px", fontSize: 16, color: "#3D3D46" }}>Geen vacatures in deze lijst. Maak een nieuwe aan of kies een andere status.</div>}
      </div>
      {msg && (
        <div className="toast a-pop" role="status"><span className="dot a-pulse" style={{ width: 22, height: 22 }} />{msg}</div>
      )}
    </>
  );
}
