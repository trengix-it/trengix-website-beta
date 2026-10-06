"use client";

import { useEffect, useState } from "react";

const scenes = [
  { functie: "Business Controller", vraag: "Wat vind je echt belangrijk in je volgende job?", antwoord: "Ruimte om te groeien, en een team dat naar me luistert.", tags: ["Groeipad", "Hybride", "Klein team"] },
  { functie: "Data Analyst", vraag: "Wanneer ben jij op je best?", antwoord: "Als mijn analyses echt beslissingen sturen.", tags: ["Impact", "SQL", "Gent"] },
  { functie: "Functioneel Analist", vraag: "Wat miste je in je vorige job?", antwoord: "Een duidelijke rol tussen business en IT.", tags: ["Business en IT", "Agile", "Opleiding"] },
];

/** De geanimeerde 'zo verloopt een match'-scène in de hero. */
export function MatchStage() {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(8); // toon de eindtoestand
      return;
    }
    const id = setInterval(() => setT((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const phase = Math.floor(t / 2) % 6;
  const sc = scenes[Math.floor(t / 12) % scenes.length];
  const on = phase >= 3;

  const Tags = () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {sc.tags.map((x) => (
        <span key={x + on} className={on ? "tag tag-on" : "tag"}>{x}</span>
      ))}
    </div>
  );

  return (
    <div className="stage" role="img" aria-label="Zo verloopt een match: we luisteren naar de kandidaat, vinden wat overeenkomt met de vacature en maken de match." style={{ position: "relative", height: 620 }}>
      <div className="a-bob" style={{ position: "absolute", top: 0, left: 0, width: 330, zIndex: 2 }}>
        <div className="card-float" style={{ borderRadius: 26, gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="avatar" style={{ width: 48, height: 48 }} />
            <span style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, color: "#4A4A55" }}>Kandidaat</span>
              <span style={{ fontSize: 18, fontWeight: 600 }}>[Kandidaat]</span>
            </span>
          </div>
          <Tags />
        </div>
      </div>

      {phase >= 1 && (
        <div key={`q${sc.functie}`} className="bubble-dark a-in" style={{ position: "absolute", top: 190, left: 120, maxWidth: 290, zIndex: 3 }}>
          <small>Trengix luistert</small>
          {sc.vraag}
        </div>
      )}
      {phase >= 2 && (
        <div key={`a${sc.functie}`} className="bubble-light a-in" style={{ position: "absolute", top: 290, left: 10, maxWidth: 280, zIndex: 3 }}>
          {sc.antwoord}
        </div>
      )}
      {on && (
        <svg className="a-in" aria-hidden="true" viewBox="0 0 120 200" style={{ position: "absolute", top: 250, left: 330, width: 110, height: "auto", zIndex: 1 }}>
          <line x1="96" y1="24" x2="24" y2="176" stroke="#FFFFFF" strokeWidth="38" strokeLinecap="round" strokeOpacity="0.9" />
        </svg>
      )}

      <div className="a-bob2" style={{ position: "absolute", bottom: 20, right: 0, width: 330, zIndex: 2 }}>
        <div className="card-float" style={{ borderRadius: 26, gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 48, height: 48, borderRadius: 14, background: "#0A0A0B", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>[logo]</span>
            <span style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, color: "#4A4A55" }}>Vacature</span>
              <span style={{ fontSize: 18, fontWeight: 600 }}>{sc.functie}</span>
            </span>
          </div>
          <Tags />
        </div>
      </div>

      {phase >= 4 && (
        <div className="match-pill a-pop" style={{ position: "absolute", top: 236, right: 18, zIndex: 4 }}>
          <span className="dot a-pulse" style={{ width: 30, height: 30 }} />
          Match
        </div>
      )}
    </div>
  );
}
