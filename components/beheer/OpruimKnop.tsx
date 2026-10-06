"use client";

import { useState, useTransition } from "react";
import { opruimenNu } from "@/lib/actions/admin";

export function OpruimKnop() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <button type="button" className="mini-btn" disabled={pending}
        onClick={() => { if (confirm("Alle sollicitaties en berichten ouder dan de bewaartermijn nu verwijderen, cv's inbegrepen?")) start(async () => { const r = await opruimenNu(); setMsg(r.ok ? r.message ?? "Klaar." : r.error); }); }}>
        {pending ? "Bezig met opruimen" : "Nu opruimen"}
      </button>
      {msg && <span role="status" style={{ fontSize: 14, color: "#3D3D46" }}>{msg}</span>}
    </div>
  );
}
