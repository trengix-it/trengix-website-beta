"use client";

import Link from "next/link";
import { useState } from "react";
import { Mark } from "@/components/Mark";

const base = [
  {
    id: "ncnp",
    label: "No Cure, No Pay",
    title: ["No Cure,", "No Pay"],
    cta: { href: "/contact?onderwerp=talent", label: "Vraag de voorwaarden op" },
  },
  {
    id: "excl",
    label: "Exclusieve search",
    title: ["Exclusieve", "search"],
    cta: { href: "/contact?onderwerp=talent", label: "Plan een intake" },
  },
];

type Model = { tekst: string; punten: string[] };

export function Modellen({ ncnp, excl }: { ncnp: Model; excl: Model }) {
  const models = base.map((b) => ({ ...b, text: (b.id === "ncnp" ? ncnp : excl).tekst, items: (b.id === "ncnp" ? ncnp : excl).punten.filter(Boolean) }));
  const [model, setModel] = useState("ncnp");
  const m = models.find((x) => x.id === model)!;
  const night = model === "ncnp";
  return (
    <>
      <div className="stack" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 24, alignItems: "end", marginBottom: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="eyebrow">Samenwerken</div>
          <h2 className="h-sec reveal" style={{ maxWidth: "14ch" }}>Twee manieren om samen te werken</h2>
        </div>
        <div role="group" aria-label="Kies een model" className="seg seg-white" style={{ justifySelf: "start" }}>
          {models.map((x) => (
            <button key={x.id} type="button" aria-pressed={x.id === model} onClick={() => setModel(x.id)}>{x.label}</button>
          ))}
        </div>
      </div>
      <div key={model} className={`${night ? "bg-night" : "bg-door"} inv a-in stack`} aria-live="polite"
        style={{ position: "relative", overflow: "hidden", borderRadius: 32, padding: "clamp(28px, 4vw, 56px)", minHeight: 440, display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 48 }}>
        <Mark color={night ? "#1B17FF" : "#FFFFFF"} style={{ position: "absolute", right: -90, bottom: -120, height: 380, width: "auto", opacity: night ? 0.5 : 0.22 }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 20 }}>
          <h3 style={{ margin: 0, fontSize: "clamp(44px, 5vw, 80px)", lineHeight: 0.95, letterSpacing: "-0.05em", fontWeight: 400 }}>
            {m.title[0]}<br />{m.title[1]}
          </h3>
          <p style={{ margin: 0, fontSize: 21, lineHeight: 1.5, color: night ? "#E2E2EA" : "#FFFFFF" }}>{m.text}</p>
          <Link href={m.cta.href} className="btn btn-white" style={{ marginTop: "auto", alignSelf: "flex-start" }}>{m.cta.label}</Link>
        </div>
        <ul style={{ position: "relative", listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10, alignSelf: "end" }}>
          {m.items.map((it, i) => (
            <li key={i} style={{ padding: "20px 22px", borderRadius: 18, background: night ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.12)", border: `1px solid ${night ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.2)"}`, fontSize: 17 }}>{it}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
