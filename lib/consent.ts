"use client";

/**
 * Cookietoestemming. De keuze staat in een eerste-partijcookie (6 maanden geldig),
 * zodat we na die periode opnieuw vragen, zoals de GBA aanbeveelt.
 * Verhoog VERSION wanneer er een nieuwe categorie of tool bijkomt: dan vragen we opnieuw.
 */
export const CONSENT_COOKIE = "trengix_consent";
export const CONSENT_VERSION = 1;
const MAX_AGE = 60 * 60 * 24 * 182; // 6 maanden

export type Consent = { v: number; analytics: boolean; ts: string };

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split("; ").find((c) => c.startsWith(CONSENT_COOKIE + "="));
  if (!raw) return null;
  try {
    const c = JSON.parse(decodeURIComponent(raw.split("=").slice(1).join("="))) as Consent;
    return c.v === CONSENT_VERSION ? c : null;
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean): Consent {
  const c: Consent = { v: CONSENT_VERSION, analytics, ts: new Date().toISOString() };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(c))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  if (!analytics) removeAnalyticsCookies();
  window.dispatchEvent(new CustomEvent("trengix:consent", { detail: c }));
  return c;
}

/** Opent de cookie-instellingen opnieuw (bv. via de link in de footer). */
export function openCookieSettings() {
  window.dispatchEvent(new Event("trengix:cookie-settings"));
}

/** Verwijdert Google Analytics-cookies wanneer toestemming ingetrokken wordt. */
function removeAnalyticsCookies() {
  const host = location.hostname;
  const domains = ["", host, "." + host, "." + host.split(".").slice(-2).join(".")];
  document.cookie.split("; ").forEach((c) => {
    const name = c.split("=")[0];
    if (name === "_ga" || name.startsWith("_ga_") || name === "_gid" || name.startsWith("_gat")) {
      domains.forEach((d) => {
        document.cookie = `${name}=; Max-Age=0; Path=/${d ? `; Domain=${d}` : ""}`;
      });
    }
  });
}

type Gtag = (...args: unknown[]) => void;

/** Stuurt een gebeurtenis naar Google Analytics, enkel als die geladen is (dus na toestemming). */
export function track(event: string, params: Record<string, string | number> = {}) {
  const w = window as unknown as { gtag?: Gtag };
  w.gtag?.("event", event, params);
}
