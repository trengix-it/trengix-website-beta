"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNav({ counts }: { counts: { sollicitaties: number; berichten: number } }) {
  const p = usePathname();
  const items: { href: string; label: string; active: boolean; count?: number }[] = [
    { href: "/beheer", label: "Vacatures", active: p === "/beheer" || p.startsWith("/beheer/vacatures") },
    { href: "/beheer/sollicitaties", label: "Sollicitaties", active: p.startsWith("/beheer/sollicitaties"), count: counts.sollicitaties },
    { href: "/beheer/berichten", label: "Berichten", active: p.startsWith("/beheer/berichten"), count: counts.berichten },
    { href: "/beheer/team", label: "Team", active: p.startsWith("/beheer/team") },
    { href: "/beheer/inhoud", label: "Inhoud", active: p.startsWith("/beheer/inhoud") },
    { href: "/beheer/alerts", label: "Vacature-alerts", active: p.startsWith("/beheer/alerts") },
    { href: "/beheer/instellingen", label: "Instellingen", active: p.startsWith("/beheer/instellingen") },
  ];
  return (
    <nav aria-label="Beheer" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {items.map((i) => (
        <Link key={i.href} href={i.href} className="side-link" aria-current={i.active ? "page" : undefined}>
          {i.label}
          {!!i.count && <span className="count" aria-label={`${i.count} nieuw`}>{i.count}</span>}
        </Link>
      ))}
    </nav>
  );
}
