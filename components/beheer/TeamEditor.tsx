"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mark } from "@/components/Mark";
import { deleteTeamLid, saveTeamLid } from "@/lib/actions/admin";
import type { TeamLid } from "@/lib/types";
import { useFormAction } from "@/lib/useFormAction";
import { ConfirmButton } from "./ConfirmButton";

const leeg = { naam: "", rol: "", email: "", telefoon: "", linkedin: "", bio: "", motto: "", focus: "", talen: "", boodschap: "", is_consultant: true, zichtbaar: true };

export function TeamEditor({ initial }: { initial: TeamLid | null }) {
  const [f, setF] = useState(() =>
    initial
      ? { ...leeg, ...Object.fromEntries(Object.entries(initial).map(([k, v]) => [k, v ?? ""])), is_consultant: initial.is_consultant, zichtbaar: initial.zichtbaar }
      : leeg
  );
  const [foto, setFoto] = useState<string | null>(initial?.foto_url ?? null);
  const [weg, setWeg] = useState(false);
  const { state, pending, onSubmit } = useFormAction(saveTeamLid);
  const set = (k: keyof typeof leeg) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((x) => ({ ...x, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  const shown = preview ?? (weg ? null : foto);

  return (
    <form onSubmit={onSubmit} className="a-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="foto_oud" value={initial?.foto_url ?? ""} />
      <input type="hidden" name="foto_weg" value={weg ? "1" : ""} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Link href="/beheer/team" style={{ fontSize: 15, fontWeight: 500, textUnderlineOffset: 4 }}>Alle teamleden</Link>
          <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 400 }}>{initial ? "Teamlid bewerken" : "Nieuw teamlid"}</h1>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {initial && (
            <ConfirmButton action={() => deleteTeamLid(initial.id)} vraag={`${initial.naam} verwijderen? Vacatures van deze persoon worden 'niet toegewezen'.`} style={{ fontSize: 15, minHeight: 48 }}>
              Verwijderen
            </ConfirmButton>
          )}
          <button type="submit" disabled={pending} className="btn btn-blue btn-sm" style={{ fontSize: 15, minHeight: 48 }}>{pending ? "Bezig met opslaan" : "Opslaan"}</button>
        </div>
      </div>
      {state && !state.ok && <p className="form-error" role="alert">{state.error}</p>}

      <div className="stack" style={{ display: "grid", gridTemplateColumns: "minmax(0, 5fr) minmax(0, 6fr)", gap: 24, alignItems: "start" }}>
        <div style={{ background: "#fff", borderRadius: 22, padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="a-field">
            <span>Foto</span>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <span className="avatar" style={{ width: 72, height: 72, ...(shown ? { backgroundImage: `url(${shown})` } : {}) }} aria-hidden="true" />
              <label className="mini-btn" style={{ cursor: "pointer" }}>
                {shown ? "Andere foto" : "Foto kiezen"}
                <input type="file" name="foto" accept="image/png,image/jpeg,image/webp" className="sr-only"
                  onChange={(e) => { const file = e.target.files?.[0]; if (file) { setPreview(URL.createObjectURL(file)); setWeg(false); } }} />
              </label>
              {shown && (
                <button type="button" className="mini-btn" onClick={() => { setPreview(null); setWeg(true); }}>Foto verwijderen</button>
              )}
            </div>
            <span className="hint">Staand portret werkt het best (3 op 4), max. 3 MB.</span>
          </div>
          <div className="cols-2" style={{ gap: 12 }}>
            <Field id="naam" label="Naam"><input id="naam" name="naam" required className="a-input" value={f.naam} onChange={set("naam")} /></Field>
            <Field id="rol" label="Functie"><input id="rol" name="rol" className="a-input" value={f.rol} onChange={set("rol")} placeholder="Bijvoorbeeld: Senior Consultant" /></Field>
            <Field id="email" label="E-mail" hint="Krijgt meldingen van sollicitaties."><input id="email" name="email" type="email" className="a-input" value={f.email} onChange={set("email")} /></Field>
            <Field id="telefoon" label="Telefoon"><input id="telefoon" name="telefoon" type="tel" className="a-input" value={f.telefoon} onChange={set("telefoon")} /></Field>
          </div>
          <Field id="linkedin" label="LinkedIn-profiel"><input id="linkedin" name="linkedin" className="a-input" value={f.linkedin} onChange={set("linkedin")} placeholder="https://www.linkedin.com/in/…" /></Field>
          <Field id="motto" label="Motto of uitspraak"><textarea id="motto" name="motto" rows={2} className="a-input" value={f.motto} onChange={set("motto")} /></Field>
          <Field id="bio" label="Korte bio"><textarea id="bio" name="bio" rows={5} className="a-input" value={f.bio} onChange={set("bio")} /></Field>
          <div className="cols-2" style={{ gap: 12 }}>
            <Field id="focus" label="Werkt vooral rond"><input id="focus" name="focus" className="a-input" value={f.focus} onChange={set("focus")} /></Field>
            <Field id="talen" label="Talen"><input id="talen" name="talen" className="a-input" value={f.talen} onChange={set("talen")} placeholder="Nederlands, Frans, Engels" /></Field>
          </div>
          <Field id="boodschap" label="Boodschap bij vacatures" hint="Verschijnt in het tekstballonnetje op vacatures van deze consultant.">
            <input id="boodschap" name="boodschap" className="a-input" value={f.boodschap} onChange={set("boodschap")} />
          </Field>
          <label className="switch"><input type="checkbox" name="is_consultant" checked={f.is_consultant} onChange={set("is_consultant")} /><span>Consultant (kan vacatures krijgen)</span></label>
          <label className="switch"><input type="checkbox" name="zichtbaar" checked={f.zichtbaar} onChange={set("zichtbaar")} /><span>Tonen op de pagina Over ons</span></label>
        </div>

        <div className="sticky-d" style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 14, color: "#4A4A55" }}>Voorbeeld op trengix.be/over-ons</span>
          <div className="bg-night inv" style={{ position: "relative", overflow: "hidden", borderRadius: 28, padding: 32, display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)", gap: 28, alignItems: "start" }}>
            <Mark color="#1B17FF" style={{ position: "absolute", right: -70, bottom: -90, height: 260, width: "auto", opacity: 0.45 }} />
            <div style={{ position: "relative", aspectRatio: "4 / 5", borderRadius: "999px 999px 22px 22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#E6E6FF",
              ...(shown ? { backgroundImage: `url(${shown})`, backgroundSize: "cover", backgroundPosition: "center" } : { backgroundImage: "linear-gradient(200deg, #8A86FF 0%, #1B17FF 60%, #0A0770 100%)" }) }}>
              {!shown && "[Portret]"}
            </div>
            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 36, lineHeight: 1, letterSpacing: "-0.045em" }}>{f.naam || "Naam"}</div>
                <div style={{ marginTop: 8, fontSize: 16, color: "#B9B8FF" }}>{f.rol || "Functie"}</div>
              </div>
              {f.motto && <div style={{ padding: "14px 16px", borderRadius: "18px 18px 18px 6px", background: "rgba(255,255,255,0.08)", fontSize: 16, lineHeight: 1.4 }}>{f.motto}</div>}
              {f.bio && <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#E2E2EA", whiteSpace: "pre-line" }}>{f.bio}</p>}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.14)", fontSize: 14 }}>
                <div><div style={{ fontSize: 12, color: "#A9A8D6" }}>Werkt vooral rond</div>{f.focus || "–"}</div>
                <div><div style={{ fontSize: 12, color: "#A9A8D6" }}>Talen</div>{f.talen || "–"}</div>
              </div>
            </div>
          </div>
          {f.is_consultant && (
            <>
              <span style={{ fontSize: 14, color: "#4A4A55", marginTop: 12 }}>Op een vacature</span>
              <div className="card-float" style={{ boxShadow: "0 20px 50px rgba(10,7,112,0.14)", maxWidth: 340 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="avatar" style={{ width: 52, height: 52, ...(shown ? { backgroundImage: `url(${shown})` } : {}) }} />
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 13, color: "#4A4A55" }}>Je consultant</span>
                    <span style={{ fontSize: 18, fontWeight: 600 }}>{f.naam || "Naam"}</span>
                  </span>
                </div>
                <div style={{ padding: "14px 16px", borderRadius: "18px 18px 18px 6px", background: "#EEEEF6", fontSize: 16, lineHeight: 1.4 }}>{f.boodschap || "Ik bespreek deze rol graag eerst met je."}</div>
              </div>
            </>
          )}
        </div>
      </div>
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
