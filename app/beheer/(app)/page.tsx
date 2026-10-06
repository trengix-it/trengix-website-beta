import Link from "next/link";
import { Toast } from "@/components/beheer/Toast";
import { VacatureTable } from "@/components/beheer/VacatureTable";
import { adminTeam, adminVacatures, relatief } from "@/lib/admin";

export default async function BeheerVacatures({ searchParams }: PageProps<"/beheer">) {
  const sp = await searchParams;
  const [vacatures, team] = await Promise.all([adminVacatures(), adminTeam()]);
  const naam = new Map(team.map((t) => [t.id, t.naam]));
  const rows = vacatures.map((v) => ({
    id: v.id, slug: v.slug, title: v.title, domein: v.domein, regio: v.regio, status: v.status, apps: v.apps, nieuw: v.nieuw,
    consultant: (v.consultant_id && naam.get(v.consultant_id)) || "Niet toegewezen",
    edited: relatief(v.updated_at),
  }));
  return (
    <div className="a-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, flexWrap: "wrap" }}>
        <div>
          <h1 className="admin-h1">Vacatures</h1>
          <p className="admin-sub">Wat je hier opslaat, staat meteen op trengix.be.</p>
        </div>
        <Link href="/beheer/vacatures/nieuw" className="btn btn-blue btn-sm" style={{ minHeight: 50 }}>Nieuwe vacature</Link>
      </div>
      <VacatureTable rows={rows} />
      <Toast text={typeof sp.melding === "string" ? sp.melding : null} />
    </div>
  );
}
