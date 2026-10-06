"use client";

import { useState, useTransition } from "react";
import { setBerichtStatus, setSollicitatieStatus } from "@/lib/actions/admin";
import { BERICHT_LABEL, PIPELINE, PIPELINE_LABEL, type BerichtStatus, type SollicitatieStatus } from "@/lib/types";

/** Statuskeuze die meteen bewaart. */
export function StatusSelect({ tabel, id, status, label }: { tabel: "sollicitaties" | "berichten"; id: string; status: string; label?: string }) {
  const [value, setValue] = useState(status);
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const opts = tabel === "sollicitaties" ? PIPELINE.map((p) => [p, PIPELINE_LABEL[p]] as const) : (Object.entries(BERICHT_LABEL) as [BerichtStatus, string][]);
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", gap: 4 }}>
      <select aria-label={label ?? "Status"} className={`a-input status-select st-${value}`} value={value} disabled={pending}
        onChange={(e) => {
          const v = e.target.value;
          const prev = value;
          setValue(v);
          start(async () => {
            const r = tabel === "sollicitaties" ? await setSollicitatieStatus(id, v as SollicitatieStatus) : await setBerichtStatus(id, v as BerichtStatus);
            if (!r.ok) { setValue(prev); setErr(r.error); } else setErr(null);
          });
        }}>
        {opts.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
      </select>
      {err && <span role="alert" style={{ fontSize: 12, color: "#8a0c20" }}>{err}</span>}
    </span>
  );
}
