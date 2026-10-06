import Link from "next/link";
import { SectionEditor } from "@/components/beheer/SectionEditor";
import { adminContent, relatief } from "@/lib/admin";
import { DEFAULTS, SECTIONS } from "@/lib/content";

export default async function Inhoud({ searchParams }: PageProps<"/beheer/inhoud">) {
  const sp = await searchParams;
  const id = typeof sp.sectie === "string" ? sp.sectie : SECTIONS[0].id;
  const def = SECTIONS.find((s) => s.id === id) ?? SECTIONS[0];
  const content = await adminContent();
  const bij = content._bijgewerkt[def.id];

  return (
    <div className="a-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 className="admin-h1">Inhoud</h1>
        <p className="admin-sub">Alle vaste teksten van de site. Wat je opslaat, staat meteen online.</p>
      </div>
      <nav aria-label="Onderdelen" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {SECTIONS.map((s) => (
          <Link key={s.id} href={`/beheer/inhoud?sectie=${s.id}`} className="pill-tab" aria-pressed={s.id === def.id}>{s.title}</Link>
        ))}
      </nav>
      <SectionEditor key={def.id + (bij ?? "")} def={def} initial={content[def.id] as Record<string, unknown>}
        defaults={DEFAULTS[def.id] as Record<string, unknown>} bijgewerkt={bij ? relatief(bij) : undefined} />
    </div>
  );
}
