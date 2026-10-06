"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mark } from "@/components/Mark";
import { sendContact } from "@/lib/actions/public";
import type { ContactOnderwerp } from "@/lib/types";
import { track } from "@/lib/consent";
import { useFormAction } from "@/lib/useFormAction";

const defs: { id: ContactOnderwerp; label: string }[] = [
  { id: "job", label: "Ik zoek een job" },
  { id: "talent", label: "Ik zoek talent" },
  { id: "anders", label: "Iets anders" },
];
const labels: Record<ContactOnderwerp, string> = { job: "Wat voor job zoek je?", talent: "Vertel kort over de functie en je team", anders: "Je bericht" };
const hints: Record<ContactOnderwerp, string> = {
  job: "Fijn. Vertel ons wat je zoekt, dan bellen we je om je beter te leren kennen.",
  talent: "Top. Een consultant plant met jou een korte intake over de functie.",
  anders: "Geen probleem. We bezorgen je vraag bij de juiste persoon.",
};

export function ContactForm({ start, bevestiging }: { start: ContactOnderwerp; bevestiging: string }) {
  const [topic, setTopic] = useState<ContactOnderwerp>(start);
  const [nonce, setNonce] = useState(0);
  return <Inner key={nonce} topic={topic} setTopic={setTopic} bevestiging={bevestiging} reset={() => setNonce((n) => n + 1)} />;
}

function Inner({ topic, setTopic, bevestiging, reset }: { topic: ContactOnderwerp; setTopic: (t: ContactOnderwerp) => void; bevestiging: string; reset: () => void }) {
  const { state, pending, onSubmit } = useFormAction(sendContact);
  useEffect(() => { if (state?.ok) track("contact_verstuurd", { onderwerp: topic }); }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state?.ok) {
    return (
      <div role="status" style={{ display: "flex", flexDirection: "column", gap: 18, padding: "24px 0" }}>
        <Mark color="#1B17FF" animated style={{ width: 96, height: "auto" }} />
        <h2 className="a-in" style={{ margin: 0, fontSize: 44, fontWeight: 400, letterSpacing: "-0.035em" }}>Bericht verstuurd</h2>
        <p className="a-in" style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: "#3D3D46", maxWidth: "44ch" }}>{bevestiging}</p>
        <button type="button" onClick={reset} className="btn btn-outline btn-sm" style={{ alignSelf: "flex-start" }}>Nog een bericht sturen</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <input type="hidden" name="onderwerp" value={topic} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <h2 id="form-title" style={{ margin: 0, fontSize: 34, fontWeight: 400, letterSpacing: "-0.03em" }}>Waarover wil je praten?</h2>
      <div role="group" aria-label="Onderwerp" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {defs.map((d) => (
          <button key={d.id} type="button" className="chip-btn" aria-pressed={d.id === topic} onClick={() => setTopic(d.id)} style={{ minHeight: 52, padding: "0 24px", fontSize: 17 }}>{d.label}</button>
        ))}
      </div>
      <div key={topic} className="a-in" style={{ display: "flex", gap: 12, alignItems: "center", padding: "16px 18px", borderRadius: "18px 18px 18px 6px", background: "#0A0A0B", color: "#fff", fontSize: 16, lineHeight: 1.4, alignSelf: "flex-start", maxWidth: 520 }}>
        <span aria-hidden="true" className="dot" style={{ width: 12, height: 12, background: "#8A86FF" }} />
        {hints[topic]}
      </div>
      <div className="cols-2" style={{ gap: 14 }}>
        <div className="field"><label htmlFor="c-naam">Naam</label><input id="c-naam" name="naam" className="input" required autoComplete="name" /></div>
        <div className="field"><label htmlFor="c-email">E-mail</label><input id="c-email" name="email" type="email" className="input" required autoComplete="email" /></div>
        <div className="field"><label htmlFor="c-tel">Telefoon</label><input id="c-tel" name="telefoon" type="tel" className="input" autoComplete="tel" /></div>
        {topic === "talent" && <div className="field"><label htmlFor="c-bedrijf">Bedrijf</label><input id="c-bedrijf" name="bedrijf" className="input" autoComplete="organization" /></div>}
        {topic === "job" && <div className="field"><label htmlFor="c-cv">Cv (optioneel)</label><input id="c-cv" name="cv" type="file" className="input-file" accept=".pdf,.doc,.docx" /></div>}
        {topic === "anders" && <div className="field"><label htmlFor="c-org">Organisatie (optioneel)</label><input id="c-org" name="bedrijf" className="input" autoComplete="organization" /></div>}
      </div>
      {topic === "talent" && (
        <div className="field"><label htmlFor="c-profiel">Welk profiel zoek je?</label><input id="c-profiel" name="profiel" className="input" placeholder="Bijvoorbeeld: business controller, regio Antwerpen" /></div>
      )}
      <div className="field"><label htmlFor="c-bericht">{labels[topic]}</label><textarea id="c-bericht" name="bericht" rows={5} className="textarea" required /></div>
      <div className="check">
        <input id="c-privacy" name="privacy" type="checkbox" required />
        <label htmlFor="c-privacy">Ik ga akkoord met de <Link href="/privacy">privacyverklaring</Link>.</label>
      </div>
      {state && !state.ok && <p className="form-error" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-blue" style={{ alignSelf: "flex-start", minHeight: 58, padding: "0 32px" }}>{pending ? "Bezig met versturen" : "Bericht versturen"}</button>
    </form>
  );
}
