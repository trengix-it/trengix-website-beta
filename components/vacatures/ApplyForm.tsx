"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mark } from "@/components/Mark";
import { applyToVacature } from "@/lib/actions/public";
import { track } from "@/lib/consent";
import { useFormAction } from "@/lib/useFormAction";

const FIELDS = ["voornaam", "achternaam", "email", "telefoon", "cv", "privacy"] as const;

export function ApplyForm({ vacatureId, bevestiging }: { vacatureId: string; bevestiging: string }) {
  const { state, pending, onSubmit } = useFormAction(applyToVacature);
  useEffect(() => { if (state?.ok) track("sollicitatie_verstuurd", { vacature_id: vacatureId }); }, [state]); // eslint-disable-line react-hooks/exhaustive-deps
  const [filled, setFilled] = useState<Record<string, boolean>>({});
  const done = FIELDS.filter((k) => filled[k]).length;

  const trackFilled = (e: React.FormEvent<HTMLFormElement>) => {
    const t = e.target as HTMLInputElement;
    if (!t.name) return;
    const v = t.type === "checkbox" ? t.checked : t.type === "file" ? !!t.files?.length : !!t.value.trim();
    setFilled((f) => ({ ...f, [t.name]: v }));
  };

  if (state?.ok) {
    return (
      <div role="status" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Mark color="#1B17FF" animated className="a-in" style={{ width: 72, height: "auto" }} />
        <h2 style={{ margin: 0, fontSize: 32, fontWeight: 500, letterSpacing: "-0.025em" }}>Sollicitatie verstuurd</h2>
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: "#3D3D46" }}>
          {bevestiging}
        </p>
        <Link href="/vacatures" style={{ alignSelf: "flex-start", fontSize: 16, fontWeight: 600, textUnderlineOffset: 5 }}>Terug naar alle vacatures</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} onInput={trackFilled} onChange={trackFilled} style={{ display: "flex", flexDirection: "column", gap: 16 }} noValidate={false}>
      <input type="hidden" name="vacature_id" value={vacatureId} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 30, fontWeight: 500, letterSpacing: "-0.025em" }}>Solliciteer</h2>
        <span style={{ fontSize: 14, color: "#4A4A55" }}>{done} van 6 ingevuld</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: "#E4E4EE", overflow: "hidden" }} aria-hidden="true">
        <div style={{ height: "100%", width: `${Math.round((done / 6) * 100)}%`, borderRadius: 999, backgroundImage: "linear-gradient(90deg, #1B17FF, #7A6CFF)", transition: "width .4s cubic-bezier(.16,1,.3,1)" }} />
      </div>
      <div className="cols-2" style={{ gap: 12 }}>
        <div className="field"><label htmlFor="a-voornaam">Voornaam</label><input id="a-voornaam" name="voornaam" className="input" required autoComplete="given-name" /></div>
        <div className="field"><label htmlFor="a-achternaam">Achternaam</label><input id="a-achternaam" name="achternaam" className="input" required autoComplete="family-name" /></div>
      </div>
      <div className="field"><label htmlFor="a-email">E-mail</label><input id="a-email" name="email" type="email" className="input" required autoComplete="email" /></div>
      <div className="field"><label htmlFor="a-tel">Telefoon</label><input id="a-tel" name="telefoon" type="tel" className="input" required autoComplete="tel" /></div>
      <div className="field"><label htmlFor="a-cv">Cv (pdf of Word, max. 4 MB)</label><input id="a-cv" name="cv" type="file" className="input-file" required accept=".pdf,.doc,.docx" /></div>
      <div className="check">
        <input id="a-privacy" name="privacy" type="checkbox" required />
        <label htmlFor="a-privacy">Ik ga akkoord met de <Link href="/privacy">privacyverklaring</Link> en de verwerking van mijn cv.</label>
      </div>
      {state && !state.ok && <p className="form-error" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-blue" style={{ minHeight: 58 }}>
        {pending ? "Bezig met versturen" : "Sollicitatie versturen"}
      </button>
    </form>
  );
}
