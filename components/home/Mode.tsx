"use client";

import Link from "next/link";
import { createContext, useContext, useState } from "react";

type Mode = "kandidaat" | "werkgever";
const Ctx = createContext<{ mode: Mode; setMode: (m: Mode) => void }>({ mode: "kandidaat", setMode: () => {} });

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("kandidaat");
  return <Ctx.Provider value={{ mode, setMode }}>{children}</Ctx.Provider>;
}

export function ModeText({ kandidaat, werkgever }: { kandidaat: React.ReactNode; werkgever: React.ReactNode }) {
  const { mode } = useContext(Ctx);
  return <>{mode === "kandidaat" ? kandidaat : werkgever}</>;
}

export function ModeSwitch() {
  const { mode, setMode } = useContext(Ctx);
  return (
    <div className="btn-row">
      <div role="group" aria-label="Kies wie je bent" className="seg seg-glass">
        <button type="button" aria-pressed={mode === "kandidaat"} onClick={() => setMode("kandidaat")}>Ik zoek een job</button>
        <button type="button" aria-pressed={mode === "werkgever"} onClick={() => setMode("werkgever")}>Ik zoek talent</button>
      </div>
      {mode === "kandidaat" ? (
        <Link href="/vacatures" className="btn btn-white">Bekijk vacatures</Link>
      ) : (
        <Link href="/contact?onderwerp=talent" className="btn btn-white">Profiel doorgeven</Link>
      )}
    </div>
  );
}

export function ModeLead({ kandidaat, werkgever }: { kandidaat: string; werkgever: string }) {
  const { mode } = useContext(Ctx);
  return (
    <p key={mode} className="lead a-in" style={{ fontSize: 23, lineHeight: 1.38, maxWidth: "30ch" }} aria-live="polite">
      {mode === "kandidaat" ? kandidaat : werkgever}
    </p>
  );
}
