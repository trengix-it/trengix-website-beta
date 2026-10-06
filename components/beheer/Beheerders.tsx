"use client";

import { useState, useTransition } from "react";
import { addBeheerder, removeBeheerder } from "@/lib/actions/admin";
import { useFormAction } from "@/lib/useFormAction";

export function Beheerders({ list, me }: { list: { email: string; naam: string | null }[]; me: string }) {
  const { state, pending, onSubmit } = useFormAction(addBeheerder);
  const [busy, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="admin-card" style={{ boxShadow: "none", border: "1px solid #ECECF3" }}>
        {list.map((b) => (
          <div key={b.email} className="admin-row" style={{ gridTemplateColumns: "minmax(0, 1fr) auto" }}>
            <span style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 500 }}>{b.naam || b.email}{b.email === me && <span style={{ color: "#4A4A55", fontWeight: 400 }}> (jij)</span>}</span>
              {b.naam && <span style={{ fontSize: 13, color: "#4A4A55" }}>{b.email}</span>}
            </span>
            {b.email !== me && (
              <button type="button" className="mini-btn" disabled={busy}
                onClick={() => { if (confirm(`Toegang van ${b.email} intrekken?`)) start(async () => { const r = await removeBeheerder(b.email); setErr(r.ok ? null : r.error); }); }}>
                Toegang intrekken
              </button>
            )}
          </div>
        ))}
      </div>
      {err && <p className="form-error" role="alert">{err}</p>}
      <form onSubmit={(e) => { onSubmit(e); (e.currentTarget as HTMLFormElement).reset(); }} style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 2fr) auto", gap: 10, alignItems: "end" }} className="stack">
        <div className="a-field"><label htmlFor="b-naam">Naam</label><input id="b-naam" name="naam" className="a-input" /></div>
        <div className="a-field"><label htmlFor="b-email">E-mailadres</label><input id="b-email" name="email" type="email" required className="a-input" /></div>
        <button type="submit" className="btn btn-blue btn-sm" style={{ minHeight: 46, fontSize: 15 }} disabled={pending}>Toegang geven</button>
      </form>
      {state && <p role="status" className={state.ok ? undefined : "form-error"} style={state.ok ? { margin: 0, fontSize: 14, color: "#0b5a2c" } : undefined}>{state.ok ? state.message : state.error}</p>}
    </div>
  );
}
