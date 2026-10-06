"use client";

import { useState } from "react";
import { sendLoginCode, verifyLoginCode } from "@/lib/actions/admin";
import { useFormAction } from "@/lib/useFormAction";

export function LoginForm({ fout }: { fout: string | null }) {
  const send = useFormAction(sendLoginCode);
  const verify = useFormAction(verifyLoginCode);
  const [restart, setRestart] = useState(0);
  const email = send.state?.ok && restart === 0 ? send.state.message : null;

  if (!email) {
    return (
      <form onSubmit={(e) => { setRestart(0); send.onSubmit(e); }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 400 }}>Inloggen</h1>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: "#3D3D46" }}>Vul je Trengix-adres in. Je krijgt een code per mail, geen wachtwoord nodig.</p>
        {fout === "geen-toegang" && <p className="form-error" role="alert">Dit adres heeft (nog) geen toegang tot het beheer.</p>}
        <div className="field"><label htmlFor="l-email">E-mailadres</label><input id="l-email" name="email" type="email" required autoComplete="email" className="input" /></div>
        {send.state && !send.state.ok && <p className="form-error" role="alert">{send.state.error}</p>}
        <button type="submit" disabled={send.pending} className="btn btn-blue">{send.pending ? "Even geduld" : "Stuur me een code"}</button>
      </form>
    );
  }

  return (
    <form onSubmit={verify.onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 400 }}>Check je mail</h1>
      <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: "#3D3D46" }}>Als {email} toegang heeft, staat er nu een code in je inbox.</p>
      <input type="hidden" name="email" value={email} />
      <div className="field"><label htmlFor="l-code">Code</label><input id="l-code" name="code" inputMode="numeric" autoComplete="one-time-code" required className="input" style={{ fontSize: 22, letterSpacing: "0.2em" }} /></div>
      {verify.state && !verify.state.ok && <p className="form-error" role="alert">{verify.state.error}</p>}
      <button type="submit" disabled={verify.pending} className="btn btn-blue">{verify.pending ? "Even geduld" : "Inloggen"}</button>
      <button type="button" onClick={() => setRestart((r) => r + 1)} style={{ alignSelf: "flex-start", padding: 0, border: 0, background: "transparent", color: "#1B17FF", fontWeight: 500, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4, minHeight: 44 }}>Ander adres gebruiken</button>
    </form>
  );
}
