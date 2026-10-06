"use client";

import { useEffect, useRef, useState } from "react";
import { Mark } from "./Mark";

type Step = { title: string; text: string };

/** De vier stappen van de methode, met automatische doorloop (5 s) tot de bezoeker zelf kiest. */
export function MethodTabs({ steps, rol = "Business Controller" }: { steps: Step[]; rol?: string }) {
  const [step, setStep] = useState(0);
  const [manual, setManual] = useState(false);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (manual) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setStep((s) => (s + 1) % steps.length), 5000);
    return () => clearInterval(t);
  }, [manual, steps.length]);

  const pick = (i: number) => {
    setStep(i);
    setManual(true);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (step + d + steps.length) % steps.length;
    pick(n);
    refs.current[n]?.focus();
  };

  return (
    <div className="method">
      <div role="tablist" aria-label="Stappen van de methode" aria-orientation="vertical" className="tablist" onKeyDown={onKey}>
        {steps.map((s, i) => {
          const active = i === step;
          return (
            <button key={s.title} ref={(el) => { refs.current[i] = el; }} type="button" role="tab" id={`tab-${i}`}
              aria-selected={active} aria-controls="methode-panel" tabIndex={active ? 0 : -1}
              className="tab" onClick={() => pick(i)}>
              <span className="tab-head">
                <span className="tab-n">0{i + 1}</span>
                <span className="tab-t">{s.title}</span>
              </span>
              {active && (
                <>
                  <span className="tab-text">{s.text}</span>
                  <span className="tab-bar">
                    <span key={`${step}-${manual}`} className={manual ? undefined : "a-fill-5"} style={manual ? { width: "100%" } : undefined} />
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id="methode-panel" aria-labelledby={`tab-${step}`} className="panel">
        <div key={step} className="panel-stack a-in">
          {step === 0 && <PanelIntake />}
          {step === 1 && <PanelProfiel rol={rol} />}
          {step === 2 && <PanelShortlist />}
          {step === 3 && <PanelStart />}
        </div>
      </div>
    </div>
  );
}

function PanelIntake() {
  return (
    <>
      <div className="pcard">
        <span className="pcard-label">Intakegesprek</span>
        <div className="chat-q">Wat moet deze persoon over een jaar bereikt hebben?</div>
        <div className="chat-a">[Antwoord van de klant tijdens de intake]</div>
        <div className="chat-q">En waarom vertrok de vorige?</div>
      </div>
      <div className="pcard" style={{ gap: 10 }}>
        <span className="pcard-label">Notities</span>
        <div className="skel" style={{ width: "92%" }} />
        <div className="skel" style={{ width: "74%" }} />
        <div className="skel" style={{ width: "84%" }} />
      </div>
    </>
  );
}

function PanelProfiel({ rol }: { rol: string }) {
  const crit = [
    { l: "[Criterium 1]", must: true, w: 92 },
    { l: "[Criterium 2]", must: true, w: 80 },
    { l: "[Criterium 3]", must: false, w: 58 },
    { l: "[Criterium 4]", must: false, w: 40 },
  ];
  return (
    <div className="pcard" style={{ gap: 18, flexGrow: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 18, fontWeight: 600 }}>Profielschets</span>
        <span className="pcard-label">{rol}</span>
      </div>
      {crit.map((c) => (
        <div key={c.l} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
            <span>{c.l}</span>
            <span style={{ color: c.must ? "#1B17FF" : "#4A4A55" }}>{c.must ? "Must-have" : "Nice-to-have"}</span>
          </div>
          <div className="meter">
            <div style={{ width: `${c.w}%` }}>
              <span style={{ background: c.must ? "#1B17FF" : "#9A96FF" }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PanelShortlist() {
  return (
    <>
      {[["A", 94], ["B", 88], ["C", 81]].map(([k, w], i) => (
        <div key={k} className="pcard cand a-in" style={{ animationDelay: `${i * 0.15}s`, display: "grid" }}>
          <span className="avatar" style={{ width: 52, height: 52 }} />
          <span style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 17, fontWeight: 600 }}>[Kandidaat {k}]</span>
            <span className="meter" style={{ height: 8 }}>
              <span style={{ width: `${w}%`, background: "#1B17FF", animation: "none" }} />
            </span>
          </span>
          <span style={{ fontSize: 15, color: "#1B17FF", fontWeight: 600 }}>Shortlist</span>
        </div>
      ))}
    </>
  );
}

function PanelStart() {
  return (
    <div className="pcard" style={{ position: "relative", overflow: "hidden", flexGrow: 1, padding: 32, justifyContent: "flex-end" }}>
      <Mark color="#1B17FF" style={{ position: "absolute", top: -30, right: -40, height: 260, width: "auto", opacity: 0.12 }} />
      <span className="dot a-pop" style={{ width: 36, height: 36 }} />
      <span style={{ fontSize: 40, lineHeight: 1, letterSpacing: "-0.04em" }}>Start bevestigd</span>
      <span style={{ fontSize: 17, color: "#4A4A55" }}>[Kandidaat] begint op [datum] bij [klant]. We volgen op na [termijn].</span>
    </div>
  );
}
