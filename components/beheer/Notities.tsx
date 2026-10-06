"use client";

import { useState, useTransition } from "react";
import { saveNotities } from "@/lib/actions/admin";

export function Notities({ tabel, id, initial }: { tabel: "sollicitaties" | "berichten"; id: string; initial: string }) {
  const [text, setText] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const dirty = text !== saved;
  return (
    <div className="a-field">
      <label htmlFor={`not-${id}`}>Interne notities</label>
      <textarea id={`not-${id}`} rows={6} className="a-input" value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Alleen zichtbaar voor het team. Bijvoorbeeld: gebeld op 3/10, sterk in Power BI, beschikbaar vanaf januari." />
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button type="button" className="mini-btn soft" disabled={!dirty || pending}
          onClick={() => start(async () => { const r = await saveNotities(tabel, id, text); if (r.ok) { setSaved(text); setMsg("Bewaard."); } else setMsg(r.error); setTimeout(() => setMsg(null), 2500); })}>
          {pending ? "Bezig" : "Notities bewaren"}
        </button>
        {dirty && !pending && <span style={{ fontSize: 13, color: "#4A4A55" }}>Niet bewaard</span>}
        {msg && <span role="status" style={{ fontSize: 13, color: "#4A4A55" }}>{msg}</span>}
      </div>
    </div>
  );
}
