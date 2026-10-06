"use client";

import Link from "next/link";
import { useState } from "react";
import { Mark } from "@/components/Mark";
import { deleteVacature, saveVacature } from "@/lib/actions/admin";
import { CONTRACTEN, DOMEINEN, STATUSSEN, UREN, lines, type TeamLid, type Vacature } from "@/lib/types";
import { useFormAction } from "@/lib/useFormAction";

type Form = Pick<Vacature, "title" | "domein" | "regio" | "contract" | "uren" | "status" | "intro" | "redenen" | "bedrijf" | "taken" | "profiel" | "aanbod"> & { id: string | null; consultant_id: string };

export function VacatureEditor({ initial, team }: { initial: Vacature | null; team: TeamLid[] }) {
  const consultants = team.filter((t) => t.is_consultant);
  const [f, setF] = useState<Form>(() =>
    initial
      ? { ...initial, id: initial.id, consultant_id: initial.consultant_id ?? "" }
      : { id: null, title: "", domein: "Finance", regio: "", contract: "Vast contract", uren: "Voltijds", status: "Concept", intro: "", redenen: "", bedrijf: "", taken: "", profiel: "", aanbod: "", consultant_id: consultants[0]?.id ?? "" }
  );
  const [note, setNote] = useState<string | null>(null);
  const { state, pending, onSubmit } = useFormAction(saveVacature);
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF((x) => ({ ...x, [k]: e.target.value }));
  const consultant = team.find((t) => t.id === f.consultant_id);

  const duplicate = () => {
    setF((x) => ({ ...x, id: null, title: `${x.title} (kopie)`, status: "Concept" }));
    setNote("Kopie gemaakt. Pas aan en sla op.");
    setTimeout(() => setNote(null), 3200);
  };

  const taken = lines(f.taken);
  const profiel = lines(f.profiel);

  return (
    <form onSubmit={onSubmit} className="a-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {f.id && <input type="hidden" name="id" value={f.id} />}
      <input type="hidden" name="status" value={f.status} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Link href="/beheer" style={{ fontSize: 15, fontWeight: 500, textUnderlineOffset: 4 }}>Alle vacatures</Link>
          <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 400 }}>{f.id ? "Vacature bewerken" : "Nieuwe vacature"}</h1>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {f.id && (
            <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: 15, minHeight: 48 }}
              onClick={async () => { if (confirm("Deze vacature definitief verwijderen? Sollicitaties blijven bewaard.")) await deleteVacature(f.id!); }}>
              Verwijderen
            </button>
          )}
          <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: 15, minHeight: 48, borderColor: "#C9C9D6" }} onClick={duplicate}>Dupliceren</button>
          <button type="submit" disabled={pending} className="btn btn-blue btn-sm" style={{ fontSize: 15, minHeight: 48 }}>
            {pending ? "Bezig met opslaan" : f.status === "Online" ? "Opslaan en publiceren" : "Opslaan"}
          </button>
        </div>
      </div>
      {state && !state.ok && <p className="form-error" role="alert">{state.error}</p>}

      <div className="stack" style={{ display: "grid", gridTemplateColumns: "minmax(0, 5fr) minmax(0, 6fr)", gap: 24, alignItems: "start" }}>
        <div style={{ background: "#fff", borderRadius: 22, padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="a-field">
            <span id="status-label">Status</span>
            <div role="group" aria-labelledby="status-label" style={{ display: "inline-flex", alignSelf: "flex-start", padding: 4, borderRadius: 999, background: "#F1F1F7", gap: 4 }}>
              {STATUSSEN.map((s) => (
                <button key={s} type="button" aria-pressed={f.status === s} onClick={() => setF((x) => ({ ...x, status: s }))}
                  style={{ minHeight: 40, padding: "0 16px", border: 0, borderRadius: 999, background: f.status === s ? "#0A0A0B" : "transparent", color: f.status === s ? "#fff" : "#0A0A0B", fontSize: 14, fontWeight: f.status === s ? 600 : 500, cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <Field id="title" label="Functietitel"><input id="title" name="title" required className="a-input" value={f.title} onChange={set("title")} placeholder="Bijvoorbeeld: Business Controller" /></Field>
          <div className="cols-2" style={{ gap: 12 }}>
            <Field id="domein" label="Domein"><select id="domein" name="domein" className="a-input" value={f.domein} onChange={set("domein")}>{DOMEINEN.map((d) => <option key={d}>{d}</option>)}</select></Field>
            <Field id="regio" label="Regio"><input id="regio" name="regio" required className="a-input" value={f.regio} onChange={set("regio")} placeholder="Bijvoorbeeld: Antwerpen" /></Field>
            <Field id="contract" label="Contract"><select id="contract" name="contract" className="a-input" value={f.contract} onChange={set("contract")}>{CONTRACTEN.map((d) => <option key={d}>{d}</option>)}</select></Field>
            <Field id="uren" label="Uren"><select id="uren" name="uren" className="a-input" value={f.uren} onChange={set("uren")}>{UREN.map((d) => <option key={d}>{d}</option>)}</select></Field>
          </div>
          <Field id="intro" label="Openingszin"><textarea id="intro" name="intro" rows={2} className="a-input" value={f.intro} onChange={set("intro")} placeholder="Wat maakt deze rol bijzonder?" /></Field>
          <Field id="redenen" label="Waarom deze rol" hint="Maximaal drie korte redenen, één per regel. Verschijnen als kaartjes."><textarea id="redenen" name="redenen" rows={3} className="a-input" value={f.redenen} onChange={set("redenen")} /></Field>
          <Field id="bedrijf" label="Over het bedrijf"><textarea id="bedrijf" name="bedrijf" rows={3} className="a-input" value={f.bedrijf} onChange={set("bedrijf")} /></Field>
          <Field id="taken" label="Wat je gaat doen" hint="Eén taak per regel."><textarea id="taken" name="taken" rows={4} className="a-input" value={f.taken} onChange={set("taken")} /></Field>
          <Field id="profiel" label="Wat je meebrengt" hint="Eén vereiste per regel."><textarea id="profiel" name="profiel" rows={4} className="a-input" value={f.profiel} onChange={set("profiel")} /></Field>
          <Field id="aanbod" label="Wat je krijgt"><textarea id="aanbod" name="aanbod" rows={3} className="a-input" value={f.aanbod} onChange={set("aanbod")} placeholder="Verloning, extralegale voordelen en werkregeling" /></Field>
          <Field id="consultant_id" label="Verantwoordelijke consultant" hint="Krijgt een mail bij elke nieuwe sollicitatie.">
            <select id="consultant_id" name="consultant_id" className="a-input" value={f.consultant_id} onChange={set("consultant_id")}>
              <option value="">Niet toegewezen</option>
              {consultants.map((t) => <option key={t.id} value={t.id}>{t.naam}</option>)}
            </select>
          </Field>
        </div>

        <div className="sticky-d" style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 14, color: "#4A4A55" }}>Live voorbeeld op trengix.be</span>
          <div style={{ borderRadius: 22, overflow: "hidden", background: "#fff", boxShadow: "0 30px 80px rgba(10,7,112,0.16)" }}>
            <div className="bg-hero inv" style={{ padding: "32px 32px 36px", display: "flex", flexDirection: "column", gap: 16 }}>
              <Mark style={{ position: "absolute", right: -50, top: -40, height: 220, width: "auto", opacity: 0.14 }} />
              <span style={{ position: "relative", fontSize: 13, color: "#E6E6FF" }}>Alle vacatures</span>
              <span style={{ position: "relative", fontSize: 44, lineHeight: 0.95, letterSpacing: "-0.05em" }}>{f.title || "Functietitel"}</span>
              <span style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[f.regio || "[Regio]", f.contract, f.uren, f.domein].map((t, i) => (
                  <span key={i} className="tag-glass" style={{ minHeight: 30, padding: "0 12px", fontSize: 13 }}>{t}</span>
                ))}
              </span>
            </div>
            <div style={{ padding: "28px 32px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
              <p style={{ margin: 0, fontSize: 20, lineHeight: 1.38, letterSpacing: "-0.015em", whiteSpace: "pre-line" }}>{f.intro || "[Openingszin van de vacature]"}</p>
              {lines(f.redenen).length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {lines(f.redenen).slice(0, 3).map((r, i) => <span key={i} className="tag" style={{ background: "#EEEEFF", color: "#1B17FF" }}>{r}</span>)}
                </div>
              )}
              <PreviewList title="Wat je gaat doen" items={taken.length ? taken : ["[Taak]"]} />
              <PreviewList title="Wat je meebrengt" items={profiel.length ? profiel : ["[Vereiste]"]} />
              <div className="bg-soft" style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 16 }}>
                <span aria-hidden="true" className="avatar" style={{ width: 40, height: 40, ...(consultant?.foto_url ? { backgroundImage: `url(${consultant.foto_url})` } : {}) }} />
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 12, color: "#4A4A55" }}>Je contactpersoon</span>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{consultant?.naam ?? "Niet toegewezen"}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {note && <div className="toast a-pop" role="status"><span className="dot a-pulse" style={{ width: 22, height: 22 }} />{note}</div>}
    </form>
  );
}

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="a-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

function PreviewList({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 18, borderTop: "1px solid #ECECF3" }}>
      <span style={{ fontSize: 18, fontWeight: 500 }}>{title}</span>
      <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.6, color: "#3D3D46" }}>
        {items.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}
