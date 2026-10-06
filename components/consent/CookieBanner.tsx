"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { readConsent, writeConsent } from "@/lib/consent";

/**
 * Cookiemelding volgens de richtlijnen van de GBA:
 * accepteren en weigeren even zichtbaar op de eerste laag, niets vooraf aangevinkt,
 * en de keuze is altijd te wijzigen via "Cookie-instellingen" in de footer.
 */
export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GA_ID) return; // Geen tracking ingesteld: geen melding nodig.
    if (!readConsent()) setOpen(true);
    const reopen = () => {
      setAnalytics(!!readConsent()?.analytics);
      setDetails(true);
      setOpen(true);
      setTimeout(() => ref.current?.focus(), 0);
    };
    window.addEventListener("trengix:cookie-settings", reopen);
    return () => window.removeEventListener("trengix:cookie-settings", reopen);
  }, []);

  if (!open) return null;
  const kies = (a: boolean) => {
    writeConsent(a);
    setOpen(false);
  };

  return (
    <div ref={ref} tabIndex={-1} role="dialog" aria-modal="false" aria-labelledby="cookie-titel" className="cookie a-in">
      <h2 id="cookie-titel" className="cookie-titel">Cookies op trengix.be</h2>
      <p className="cookie-tekst">
        We gebruiken noodzakelijke cookies om de site te laten werken. Met jouw toestemming meten we ook hoe de site gebruikt wordt, met Google Analytics,
        zodat we ze kunnen verbeteren. We gebruiken geen advertentiecookies. Lees meer in ons <Link href="/cookies">cookiebeleid</Link>.
      </p>

      {details && (
        <div className="cookie-cats">
          <div className="cookie-cat">
            <div>
              <strong>Noodzakelijk</strong>
              <span>Onthouden je cookiekeuze. Altijd actief.</span>
            </div>
            <span className="cookie-altijd">Altijd aan</span>
          </div>
          <label className="cookie-cat">
            <div>
              <strong>Analytisch</strong>
              <span>Google Analytics: welke pagina&apos;s bezocht worden en hoe bezoekers de site vinden. Zonder advertentiedoeleinden.</span>
            </div>
            <span className="switch"><input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} aria-label="Analytische cookies toestaan" /></span>
          </label>
        </div>
      )}

      <div className="cookie-knoppen">
        <button type="button" className="btn btn-sm cookie-btn" onClick={() => kies(false)}>Weigeren</button>
        <button type="button" className="btn btn-sm cookie-btn" onClick={() => kies(true)}>Alles accepteren</button>
        {details ? (
          <button type="button" className="cookie-link" onClick={() => kies(analytics)}>Keuze bewaren</button>
        ) : (
          <button type="button" className="cookie-link" onClick={() => setDetails(true)}>Instellingen</button>
        )}
      </div>
    </div>
  );
}
