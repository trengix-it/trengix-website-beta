"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { readConsent, type Consent } from "@/lib/consent";

const RAW = process.env.NEXT_PUBLIC_GA_ID || "";
const GA_ID = /^G-[A-Z0-9]{4,20}$/.test(RAW) ? RAW : "";

/**
 * Google Analytics 4 met Consent Mode v2 in de "basic"-variant:
 * het Google-script wordt pas geladen nadat de bezoeker analytische cookies aanvaardt.
 * Zonder toestemming gaat er niets naar Google.
 */
export function Analytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(!!readConsent()?.analytics);
    const on = (e: Event) => {
      const c = (e as CustomEvent<Consent>).detail;
      setAllowed(c.analytics);
      const w = window as unknown as { gtag?: (...a: unknown[]) => void };
      // Toestemming ingetrokken tijdens het bezoek: Google meteen laten weten.
      if (!c.analytics) w.gtag?.("consent", "update", { analytics_storage: "denied" });
    };
    window.addEventListener("trengix:consent", on);
    return () => window.removeEventListener("trengix:consent", on);
  }, []);

  if (!GA_ID || !allowed) return null;
  return (
    <>
      <Script id="ga-consent" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('consent', 'default', {
          ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
          analytics_storage: 'granted', functionality_storage: 'granted', security_storage: 'granted'
        });
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { allow_google_signals: false, allow_ad_personalization_signals: false });
      `}</Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  );
}
