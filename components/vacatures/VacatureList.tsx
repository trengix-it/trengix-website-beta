"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { JobRow } from "@/components/JobRow";
import { DOMEINEN } from "@/lib/types";

type Job = { id: string; slug: string; title: string; domein: string; regio: string; contract: string; nieuw: boolean };

type Ctx = { query: string; setQuery: (v: string) => void };
const SearchCtx = createContext<Ctx>({ query: "", setQuery: () => {} });

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  return <SearchCtx.Provider value={{ query, setQuery }}>{children}</SearchCtx.Provider>;
}

export function VacatureSearch() {
  const { query, setQuery } = useContext(SearchCtx);
  return (
    <form role="search" className="searchbar" style={{ maxWidth: 560 }}
      onSubmit={(e) => { e.preventDefault(); document.getElementById("lijst")?.scrollIntoView({ behavior: "smooth" }); }}>
      <label htmlFor="vzoek" className="sr-only">Zoek op functie of regio</label>
      <input id="vzoek" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zoek op functie of regio" />
      <button type="submit" className="btn btn-blue btn-sm" style={{ minHeight: 48, padding: "0 22px" }}>Zoeken</button>
    </form>
  );
}

export function VacatureList({ jobs }: { jobs: Job[] }) {
  const { query, setQuery } = useContext(SearchCtx);
  const [filter, setFilter] = useState<string>("Alle");
  const q = query.trim().toLowerCase();
  const shown = useMemo(
    () => jobs.filter((j) => (filter === "Alle" || j.domein === filter) && (!q || `${j.title} ${j.regio} ${j.domein}`.toLowerCase().includes(q))),
    [jobs, filter, q]
  );

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap", marginBottom: 32 }}>
        <div role="group" aria-label="Filter op domein" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Alle", ...DOMEINEN].map((l) => (
            <button key={l} type="button" className="chip-btn" aria-pressed={filter === l} onClick={() => setFilter(l)}>{l}</button>
          ))}
        </div>
        <span role="status" style={{ fontSize: 16, color: "#4A4A55" }}>{shown.length === 1 ? "1 vacature" : `${shown.length} vacatures`}</span>
      </div>
      <div className="jobs">
        {shown.map((j, i) => (
          <JobRow key={j.id} job={j} nieuw={j.nieuw} className="a-in" style={{ animationDelay: `${i * 0.06}s` }} />
        ))}
        {shown.length === 0 && (
          <div className="a-in" style={{ padding: 48, borderRadius: 22, background: "#fff", display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 26, letterSpacing: "-0.02em" }}>Geen vacatures voor deze zoekopdracht.</span>
            <span style={{ fontSize: 17, color: "#3D3D46" }}>Pas je zoekterm aan, of laat je cv achter zodat we je bellen wanneer er iets passends opduikt.</span>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => { setQuery(""); setFilter("Alle"); }}>Toon alle vacatures</button>
          </div>
        )}
      </div>
    </>
  );
}

export function LatestBubble({ items }: { items: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((x) => (x + 1) % items.length), 4000);
    return () => clearInterval(id);
  }, [items.length]);
  if (items.length === 0) return null;
  return (
    <div className="bubble-dark a-bob2" style={{ position: "absolute", bottom: 10, left: 0, width: 290 }}>
      <small>Laatst toegevoegd</small>
      <span key={i} className="a-in" style={{ display: "block" }}>{items[i]}</span>
    </div>
  );
}
