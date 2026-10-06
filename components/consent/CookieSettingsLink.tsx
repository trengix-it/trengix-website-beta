"use client";

import { openCookieSettings } from "@/lib/consent";

export function CookieSettingsLink() {
  if (!process.env.NEXT_PUBLIC_GA_ID) return null;
  return (
    <button type="button" onClick={openCookieSettings} className="footer-linkbtn">Cookie-instellingen</button>
  );
}
