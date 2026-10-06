"use client";

import { useEffect, useState } from "react";

type Quote = { text: string; naam: string; rol: string };

export function Quotes({ quotes }: { quotes: Quote[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((x) => x + 1), 6000);
    return () => clearInterval(id);
  }, [paused]);
  const qi = ((i % quotes.length) + quotes.length) % quotes.length;
  const q = quotes[qi];
  const go = (d: number) => {
    setI((x) => x + d);
    setPaused(true);
  };

  return (
    <div className="stack" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 3fr)", gap: 48 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="eyebrow">Ervaringen</div>
        <h2 id="ervaringen" className="sr-only">Wat klanten en kandidaten zeggen</h2>
        <div className="quote-nav">
          <button type="button" className="round-btn" aria-label="Vorige getuigenis" onClick={() => go(-1)}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0A0A0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" className="round-btn blue" aria-label="Volgende getuigenis" onClick={() => go(1)}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <figure key={qi} className="quote">
          <blockquote>{q.text}</blockquote>
          <figcaption style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span aria-hidden="true" className="avatar" style={{ width: 56, height: 56, backgroundImage: "linear-gradient(200deg, #8A86FF 0%, #1B17FF 100%)" }} />
            <span style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 18, fontWeight: 600 }}>{q.naam}</span>
              <span style={{ fontSize: 15, color: "#4A4A55" }}>{q.rol}</span>
            </span>
          </figcaption>
        </figure>
        <div className="progress-bars">
          {quotes.map((_, k) => (
            <div key={k}>
              {k < qi && <span style={{ width: "100%" }} />}
              {k === qi && <span key={i} className={paused ? undefined : "a-fill-6"} style={paused ? { width: "100%" } : undefined} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
