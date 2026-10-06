"use client";

import { useEffect, useState } from "react";

const sets = [
  { role: "Business Controller", crit: ["Plant-ervaring", "Power BI", "Nederlands en Frans", "Groeit naar CFO"] },
  { role: "Data Analyst", crit: ["SQL", "Stakeholders", "Commercieel inzicht", "Antwerpen"] },
  { role: "Functioneel Analist", crit: ["Business en IT", "Agile", "Klantcontact", "ERP-kennis"] },
];

export function ProfielDemo() {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(12);
      return;
    }
    const id = setInterval(() => setT((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const cyc = t % 14;
  const set = sets[Math.floor(t / 14) % sets.length];
  const shown = Math.min(set.crit.length, Math.max(0, Math.floor(cyc / 2)));

  return (
    <div className="hide-m" style={{ position: "relative", height: 480 }} role="img" aria-label="Zo bouwen we een profielschets op: van criteria tot shortlist.">
      <div className="card-float a-bob" style={{ position: "absolute", top: 0, right: 0, width: 360, gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 18, fontWeight: 600 }}>Profielschets</span>
          <span style={{ fontSize: 14, color: "#4A4A55" }}>{set.role}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, minHeight: 76, alignContent: "flex-start" }}>
          {set.crit.slice(0, shown).map((c) => (
            <span key={set.role + c} className="tag tag-on" style={{ minHeight: 34, padding: "0 14px" }}>{c}</span>
          ))}
        </div>
        <div style={{ height: 6, borderRadius: 999, background: "#EEEEF6", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.round((shown / set.crit.length) * 100)}%`, backgroundImage: "linear-gradient(90deg, #1B17FF, #7A6CFF)", borderRadius: 999, transition: "width .6s cubic-bezier(.16,1,.3,1)" }} />
        </div>
      </div>
      {cyc >= 10 && (
        <div className="match-pill a-pop" style={{ position: "absolute", bottom: 60, left: 10, zIndex: 3, gap: 12, padding: "14px 22px 14px 14px", fontSize: 19 }}>
          <span className="dot a-pulse" style={{ width: 30, height: 30 }} />
          Shortlist klaar
        </div>
      )}
      <div className="bubble-dark a-bob2" style={{ position: "absolute", bottom: 150, left: 40, maxWidth: 280 }}>
        <small>Trengix luistert</small>
        Wat moet deze persoon over een jaar bereikt hebben?
      </div>
    </div>
  );
}
