"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { saveContent, uploadMedia } from "@/lib/actions/admin";
import type { FieldDef, SectionDef } from "@/lib/content";

type Values = Record<string, unknown>;
type Item = Record<string, string>;

/** Generieke editor voor één onderdeel van de sitetekst, op basis van het veldschema. */
export function SectionEditor({ def, initial, defaults, bijgewerkt }: { def: SectionDef; initial: Values; defaults: Values; bijgewerkt?: string }) {
  const [vals, setVals] = useState<Values>(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const dirty = useMemo(() => JSON.stringify(vals) !== saved, [vals, saved]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = (k: string, v: unknown) => setVals((x) => ({ ...x, [k]: v }));
  const save = () =>
    start(async () => {
      const json = JSON.stringify(vals);
      const r = await saveContent(def.id, json);
      if (r.ok) setSaved(json);
      setMsg({ ok: r.ok, text: r.ok ? r.message ?? "Opgeslagen." : r.error });
      setTimeout(() => setMsg(null), 3500);
    });

  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); save(); }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 30, fontWeight: 400, letterSpacing: "-0.03em" }}>{def.title}</h2>
          <p className="admin-sub" style={{ marginTop: 4 }}>{def.beschrijving}{bijgewerkt ? ` Laatst bewaard ${bijgewerkt}.` : ""}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {def.pagina && <a className="mini-btn" href={def.pagina} target="_blank" rel="noopener">Bekijk op de site</a>}
          <button type="button" className="mini-btn" onClick={() => { if (confirm("Alle velden van dit onderdeel terugzetten naar de standaardtekst? Je moet daarna nog opslaan.")) setVals(structuredClone(defaults)); }}>
            Standaardtekst
          </button>
          <button type="submit" className="btn btn-blue btn-sm" style={{ minHeight: 48, fontSize: 15 }} disabled={pending || !dirty}>
            {pending ? "Bezig met opslaan" : dirty ? "Opslaan" : "Opgeslagen"}
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22, overflow: "visible" }}>
        {def.fields.map((f) => (
          <FieldInput key={f.key} def={f} value={vals[f.key]} onChange={(v) => set(f.key, v)} sectionId={def.id} />
        ))}
      </div>

      {dirty && (
        <div className="savebar" role="region" aria-label="Niet-opgeslagen wijzigingen">
          <span>Je hebt wijzigingen die nog niet opgeslagen zijn.</span>
          <button type="button" className="mini-btn" onClick={() => setVals(JSON.parse(saved))}>Ongedaan maken</button>
          <button type="submit" className="btn btn-white btn-sm" style={{ minHeight: 42, fontSize: 15 }} disabled={pending}>{pending ? "Bezig" : "Opslaan"}</button>
        </div>
      )}
      {msg && (
        <div className="toast a-pop" role="status" style={msg.ok ? undefined : { background: "#8a0c20" }}>
          <span className="dot a-pulse" style={{ width: 22, height: 22 }} />
          {msg.text}
        </div>
      )}
    </form>
  );
}

function FieldInput({ def, value, onChange, sectionId }: { def: FieldDef; value: unknown; onChange: (v: unknown) => void; sectionId: string }) {
  const id = `${sectionId}-${def.key}`;
  if (def.type === "items") return <ItemsField def={def} value={(value as Item[]) || []} onChange={onChange} id={id} />;
  return (
    <div className="a-field">
      <label htmlFor={id}>{def.label}</label>
      {def.type === "text" || def.type === "email" || def.type === "number" ? (
        <input id={id} className="a-input" type={def.type === "number" ? "text" : def.type} inputMode={def.type === "number" ? "numeric" : undefined}
          value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
      ) : def.type === "list" ? (
        <textarea id={id} className="a-input" rows={4} value={((value as string[]) || []).join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n"))}
          onBlur={(e) => onChange(e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} />
      ) : (
        <textarea id={id} className="a-input" rows={def.type === "markdown" ? 18 : 3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}
          style={def.type === "markdown" ? { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 14 } : undefined} />
      )}
      {def.hint && <span className="hint">{def.hint}</span>}
      {def.type === "markdown" && (
        <span className="hint">Opmaak: een regel met <code>## </code> wordt een titel, <code>- </code> een opsomming, <code>**vet**</code>, en <code>[tekst](https://…)</code> een link. Lege regel = nieuwe alinea.</span>
      )}
    </div>
  );
}

function ItemsField({ def, value, onChange, id }: { def: Extract<FieldDef, { type: "items" }>; value: Item[]; onChange: (v: Item[]) => void; id: string }) {
  const upd = (i: number, k: string, v: string) => onChange(value.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const leeg = Object.fromEntries(def.item.map((f) => [f.key, ""]));
  const vol = def.max !== undefined && value.length >= def.max;

  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      <legend className="a-field" style={{ padding: 0, marginBottom: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#3D3D46" }}>{def.label}</span>
      </legend>
      {def.hint && <span className="hint" style={{ fontSize: 13, color: "#4A4A55", marginTop: -6 }}>{def.hint}</span>}
      {value.map((it, i) => (
        <div key={i} className="item-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#4A4A55" }}>{i + 1}</span>
            <span style={{ display: "flex", gap: 4 }}>
              <button type="button" className="mini-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Item ${i + 1} omhoog`}>↑</button>
              <button type="button" className="mini-btn" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label={`Item ${i + 1} omlaag`}>↓</button>
              <button type="button" className="mini-btn" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={`Item ${i + 1} verwijderen`}>Verwijderen</button>
            </span>
          </div>
          {def.item.map((f) => {
            const fid = `${id}-${i}-${f.key}`;
            if (f.type === "image") return <ImageInput key={f.key} id={fid} label={f.label} value={it[f.key] || ""} onChange={(v) => upd(i, f.key, v)} />;
            return (
              <div key={f.key} className="a-field">
                <label htmlFor={fid}>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea id={fid} className="a-input" rows={3} value={it[f.key] || ""} onChange={(e) => upd(i, f.key, e.target.value)} />
                ) : (
                  <input id={fid} className="a-input" value={it[f.key] || ""} onChange={(e) => upd(i, f.key, e.target.value)} />
                )}
              </div>
            );
          })}
        </div>
      ))}
      {value.length === 0 && <p style={{ margin: 0, fontSize: 15, color: "#4A4A55" }}>Nog niets toegevoegd.</p>}
      <button type="button" className="mini-btn soft" style={{ alignSelf: "flex-start" }} disabled={vol} onClick={() => onChange([...value, { ...leeg }])}>
        {vol ? `Maximaal ${def.max}` : "Toevoegen"}
      </button>
    </fieldset>
  );
}

function ImageInput({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="a-field">
      <span>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span className="logo-tile" style={{ width: 180, height: 80 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {value ? <img src={value} alt="" style={{ maxWidth: 140, maxHeight: 48, objectFit: "contain" }} /> : "Geen afbeelding"}
        </span>
        <label className="mini-btn" htmlFor={id} style={{ cursor: "pointer" }}>{pending ? "Bezig met uploaden" : value ? "Vervangen" : "Afbeelding kiezen"}</label>
        <input id={id} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" disabled={pending}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const fd = new FormData();
            fd.append("file", file);
            start(async () => {
              const r = await uploadMedia(fd);
              if (r.ok && r.url) { onChange(r.url); setErr(null); } else if (!r.ok) setErr(r.error);
            });
            e.target.value = "";
          }} />
        {value && <button type="button" className="mini-btn" onClick={() => onChange("")}>Weghalen</button>}
      </div>
      {err && <span role="alert" style={{ fontSize: 13, color: "#8a0c20" }}>{err}</span>}
    </div>
  );
}
