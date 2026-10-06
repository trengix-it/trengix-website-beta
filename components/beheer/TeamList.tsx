"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { reorderTeam, setTeamZichtbaar } from "@/lib/actions/admin";
import type { TeamLid } from "@/lib/types";

export function TeamList({ team }: { team: TeamLid[] }) {
  const [list, setList] = useState(team);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(null), 2600); };

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    setList(next);
    start(async () => {
      const r = await reorderTeam(next.map((t) => t.id));
      flash(r.ok ? "Volgorde bewaard." : `Mislukt: ${r.error}`);
    });
  };
  const toggle = (t: TeamLid) => {
    const z = !t.zichtbaar;
    setList((l) => l.map((x) => (x.id === t.id ? { ...x, zichtbaar: z } : x)));
    start(async () => {
      const r = await setTeamZichtbaar(t.id, z);
      flash(r.ok ? (z ? `${t.naam} staat op de site.` : `${t.naam} is verborgen.`) : `Mislukt: ${r.error}`);
    });
  };

  return (
    <div className="admin-card">
      <div className="admin-row admin-head rows-team">
        <span /><span>Naam en functie</span><span>Contact</span><span>Op de site</span><span>Volgorde</span><span />
      </div>
      {list.map((t, i) => (
        <div key={t.id} className="admin-row rows-team">
          <span aria-hidden="true" className="avatar hide-m" style={{ width: 48, height: 48, ...(t.foto_url ? { backgroundImage: `url(${t.foto_url})` } : {}) }} />
          <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 17, fontWeight: 500 }}>{t.naam}</span>
            <span style={{ fontSize: 13, color: "#4A4A55" }}>{t.rol}{t.is_consultant ? " · consultant" : ""}</span>
          </span>
          <span style={{ fontSize: 14, color: "#3D3D46", overflow: "hidden", textOverflow: "ellipsis" }}>{t.email || <em style={{ color: "#8A8A96" }}>geen e-mail</em>}</span>
          <span>
            <label className="switch">
              <input type="checkbox" checked={t.zichtbaar} onChange={() => toggle(t)} disabled={pending} />
              <span>{t.zichtbaar ? "Zichtbaar" : "Verborgen"}</span>
            </label>
          </span>
          <span style={{ display: "flex", gap: 4 }}>
            <button type="button" className="mini-btn" onClick={() => move(i, -1)} disabled={i === 0 || pending} aria-label={`${t.naam} omhoog`}>↑</button>
            <button type="button" className="mini-btn" onClick={() => move(i, 1)} disabled={i === list.length - 1 || pending} aria-label={`${t.naam} omlaag`}>↓</button>
          </span>
          <span style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link href={`/beheer/team/${t.id}`} className="mini-btn soft">Bewerken</Link>
          </span>
        </div>
      ))}
      {list.length === 0 && <div style={{ padding: "40px 24px", color: "#3D3D46" }}>Nog geen teamleden. Voeg er een toe.</div>}
      {msg && <div className="toast a-pop" role="status"><span className="dot a-pulse" style={{ width: 22, height: 22 }} />{msg}</div>}
    </div>
  );
}
