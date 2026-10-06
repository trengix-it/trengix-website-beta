"use client";

import { useEffect } from "react";
import { subscribeAlert } from "@/lib/actions/public";
import { track } from "@/lib/consent";
import { useFormAction } from "@/lib/useFormAction";

export function JobAlert() {
  const { state, pending, onSubmit } = useFormAction(subscribeAlert);
  useEffect(() => { if (state?.ok) track("vacature_alert_inschrijving", {}); }, [state]); // eslint-disable-line react-hooks/exhaustive-deps
  if (state?.ok) {
    return (
      <div className="a-pop" role="status" style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, fontSize: 19 }}>
        <span className="dot a-pulse" style={{ width: 22, height: 22, background: "#fff" }} />
        Ingeschreven. We houden je op de hoogte.
      </div>
    );
  }
  return (
    <form onSubmit={onSubmit} style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: "#C8C8E0" }}>Krijg een mail zodra er een vacature binnen jouw domein online komt.</p>
      <div role="radiogroup" aria-label="Domein" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {[["", "Alle domeinen"], ["Finance", "Finance"], ["Data", "Data"], ["IT", "IT"]].map(([v, l]) => (
          <label key={v} className="alert-chip">
            <input type="radio" name="domein" value={v} defaultChecked={v === ""} />
            <span>{l}</span>
          </label>
        ))}
      </div>
      <div className="searchbar" style={{ paddingLeft: 20 }}>
        <label htmlFor="alert-email" className="sr-only">Je e-mailadres</label>
        <input id="alert-email" name="email" type="email" required autoComplete="email" placeholder="Je e-mailadres" style={{ fontSize: 16, minHeight: 46 }} />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
        <button type="submit" disabled={pending} className="btn btn-blue btn-sm" style={{ minHeight: 46, padding: "0 20px" }}>{pending ? "Even geduld" : "Inschrijven"}</button>
      </div>
      {state && !state.ok && <p className="form-error" role="alert">{state.error}</p>}
    </form>
  );
}
