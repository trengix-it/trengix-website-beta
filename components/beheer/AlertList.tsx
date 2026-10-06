"use client";

import { useState, useTransition } from "react";
import { deleteAlert } from "@/lib/actions/admin";

export function AlertList({ rows }: { rows: { email: string; domein: string; wanneer: string }[] }) {
  const [list, setList] = useState(rows);
  const [q, setQ] = useState("");
  const [pending, start] = useTransition();
  const shown = list.filter((r) => !q || r.email.includes(q.toLowerCase()));
  return (
    <>
      <div>
        <label htmlFor="al-q" className="sr-only">Zoek e-mailadres</label>
        <input id="al-q" type="search" className="a-input" style={{ maxWidth: 320, borderRadius: 999 }} placeholder="Zoek e-mailadres" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="admin-card">
        <div className="admin-row admin-head" style={{ gridTemplateColumns: "minmax(0, 3fr) 160px 180px 120px" }}><span>E-mail</span><span>Domein</span><span>Ingeschreven</span><span /></div>
        {shown.map((r) => (
          <div key={r.email} className="admin-row stack" style={{ gridTemplateColumns: "minmax(0, 3fr) 160px 180px 120px" }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{r.email}</span>
            <span><span className="tag">{r.domein}</span></span>
            <span style={{ fontSize: 14, color: "#4A4A55" }}>{r.wanneer}</span>
            <span style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" className="mini-btn" disabled={pending}
                onClick={() => { if (confirm(`${r.email} uitschrijven?`)) start(async () => { const res = await deleteAlert(r.email); if (res.ok) setList((l) => l.filter((x) => x.email !== r.email)); }); }}>
                Uitschrijven
              </button>
            </span>
          </div>
        ))}
        {shown.length === 0 && <div style={{ padding: "40px 24px", color: "#3D3D46" }}>Nog geen inschrijvingen.</div>}
      </div>
    </>
  );
}
