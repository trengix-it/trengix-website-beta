"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/vacatures", label: "Vacatures" },
  { href: "/werkgevers", label: "Voor werkgevers" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const current = (href: string) => (pathname === href || pathname.startsWith(href + "/") ? "page" : undefined);

  return (
    <div className="nav-holder">
      <div className="wrap">
        <nav aria-label="Hoofdmenu" className="nav">
          <Link href="/" aria-label="Trengix, naar de startpagina" className="nav-logo">
            <Image src="/brand/logo.png" alt="Trengix" width={134} height={26} priority style={{ height: 26, width: "auto" }} />
          </Link>
          <div className="nav-links">
            {links.map((l) => (
              <Link key={l.href} href={l.href} aria-current={current(l.href)}>{l.label}</Link>
            ))}
          </div>
          <div className="nav-right">
            <Link href="/contact" className="btn btn-blue btn-sm nav-cta">Plan een gesprek</Link>
            <button type="button" className="nav-burger" aria-expanded={open} aria-controls="mobiel-menu"
              aria-label={open ? "Menu sluiten" : "Menu openen"} onClick={() => setOpen((o) => !o)}>
              <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0A0A0B" strokeWidth="2" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </nav>
        {open && (
          <div id="mobiel-menu" className="nav-mobile">
            {links.map((l) => (
              <Link key={l.href} href={l.href} aria-current={current(l.href)}>{l.label}</Link>
            ))}
            <Link href="/contact" className="btn btn-blue" style={{ marginTop: 8, color: "#fff" }}>Plan een gesprek</Link>
          </div>
        )}
      </div>
    </div>
  );
}
