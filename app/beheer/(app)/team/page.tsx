import Link from "next/link";
import { TeamList } from "@/components/beheer/TeamList";
import { Toast } from "@/components/beheer/Toast";
import { adminTeam } from "@/lib/admin";

export default async function Team({ searchParams }: PageProps<"/beheer/team">) {
  const sp = await searchParams;
  const team = await adminTeam();
  return (
    <div className="a-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, flexWrap: "wrap" }}>
        <div>
          <h1 className="admin-h1">Team</h1>
          <p className="admin-sub">De volgorde hier is de volgorde op de pagina Over ons.</p>
        </div>
        <Link href="/beheer/team/nieuw" className="btn btn-blue btn-sm" style={{ minHeight: 50 }}>Nieuw teamlid</Link>
      </div>
      <TeamList key={team.map((t) => t.id + t.volgorde + t.zichtbaar).join()} team={team} />
      <Toast text={typeof sp.melding === "string" ? sp.melding : null} />
    </div>
  );
}
