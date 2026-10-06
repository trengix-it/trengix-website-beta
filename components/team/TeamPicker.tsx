"use client";

import Link from "next/link";
import { useState } from "react";
import { Mark } from "@/components/Mark";
import type { TeamLid } from "@/lib/types";

const photo = (url: string | null, fallback: string) => (url ? { backgroundImage: `url(${url})`, backgroundSize: "cover", backgroundPosition: "center" } : { backgroundImage: fallback });

export function TeamPicker({ team }: { team: TeamLid[] }) {
  const [picked, setPicked] = useState(0);
  const p = team[picked];
  if (!p) return null;
  return (
    <>
      <div className="team-grid">
        {team.map((m, i) => {
          const sel = i === picked;
          return (
            <button key={m.id} type="button" aria-pressed={sel} onClick={() => setPicked(i)} className={sel ? undefined : "door"}
              style={{ display: "flex", flexDirection: "column", gap: 6, padding: 0, border: 0, background: "transparent", textAlign: "left", color: "#0A0A0B", cursor: "pointer", minHeight: 0, borderRadius: 0, overflow: "visible" }}>
              <span className={sel ? "a-pop" : undefined}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", aspectRatio: "3 / 4", borderRadius: "999px 999px 24px 24px", color: sel ? "#fff" : "#4A4A55", fontSize: 14, marginBottom: 10, boxShadow: sel ? "0 20px 50px rgba(27,23,255,0.35)" : undefined,
                  ...photo(m.foto_url, sel ? "linear-gradient(200deg, #8A86FF 0%, #1B17FF 55%, #0A0770 100%)" : "linear-gradient(200deg, #D9D8FF 0%, #FFFFFF 100%)") }}>
                {!m.foto_url && "[Portret]"}
              </span>
              <span style={{ fontSize: 19, fontWeight: 600, color: sel ? "#1B17FF" : undefined }}>{m.naam}</span>
              <span style={{ fontSize: 14, color: "#3D3D46" }}>{m.rol}</span>
            </button>
          );
        })}
      </div>

      <div key={p.id} className="bg-night inv a-in stack" aria-live="polite"
        style={{ position: "relative", overflow: "hidden", marginTop: 48, borderRadius: 32, padding: "clamp(24px, 4vw, 48px)", display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)", gap: 56, alignItems: "start" }}>
        <Mark color="#1B17FF" style={{ position: "absolute", right: -80, bottom: -110, height: 340, width: "auto", opacity: 0.45 }} />
        <div style={{ position: "relative", aspectRatio: "4 / 5", borderRadius: "999px 999px 28px 28px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#E6E6FF",
          ...photo(p.foto_url, "linear-gradient(200deg, #8A86FF 0%, #1B17FF 60%, #0A0770 100%)") }}>
          {!p.foto_url && "[Portret groot]"}
        </div>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "clamp(40px, 4.4vw, 68px)", lineHeight: 1, letterSpacing: "-0.045em", fontWeight: 400 }}>{p.naam}</h3>
            <p style={{ margin: "12px 0 0", fontSize: 20, color: "#B9B8FF" }}>{p.rol}</p>
          </div>
          {p.motto && <blockquote style={{ margin: 0, padding: "22px 24px", borderRadius: "22px 22px 22px 6px", background: "rgba(255,255,255,0.08)", fontSize: 22, lineHeight: 1.4, letterSpacing: "-0.015em" }}>{p.motto}</blockquote>}
          {p.bio && <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6, color: "#E2E2EA", maxWidth: "52ch", whiteSpace: "pre-line" }}>{p.bio}</p>}
          <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 20, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.14)" }}>
            <div><dt style={{ fontSize: 14, color: "#A9A8D6" }}>Werkt vooral rond</dt><dd style={{ margin: "4px 0 0", fontSize: 17 }}>{p.focus}</dd></div>
            <div><dt style={{ fontSize: 14, color: "#A9A8D6" }}>Talen</dt><dd style={{ margin: "4px 0 0", fontSize: 17 }}>{p.talen}</dd></div>
          </dl>
          <div className="btn-row">
            <Link href={p.email ? `mailto:${p.email}` : "/contact"} className="btn btn-white">Neem contact op</Link>
            {p.linkedin && <a href={p.linkedin} className="btn btn-outline-white" rel="noopener" target="_blank">LinkedIn</a>}
          </div>
        </div>
      </div>
    </>
  );
}
