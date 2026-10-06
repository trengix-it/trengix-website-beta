import { SollicitatieTable } from "@/components/beheer/SollicitatieTable";
import { Toast } from "@/components/beheer/Toast";
import { adminSollicitaties, adminVacatures, relatief } from "@/lib/admin";

export default async function Sollicitaties({ searchParams }: PageProps<"/beheer/sollicitaties">) {
  const sp = await searchParams;
  const [apps, vac] = await Promise.all([adminSollicitaties(), adminVacatures()]);
  const rows = apps.map((a) => ({
    id: a.id, naam: `${a.voornaam} ${a.achternaam}`, email: a.email, telefoon: a.telefoon, vacature: a.vacature,
    vacature_id: a.vacature_id, status: a.status, wanneer: relatief(a.created_at), cv: !!a.cv_path, notities: !!a.notities,
  }));
  return (
    <div className="a-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, flexWrap: "wrap" }}>
        <div>
          <h1 className="admin-h1">Sollicitaties</h1>
          <p className="admin-sub">Nieuwe sollicitaties komen hier binnen. De verantwoordelijke consultant krijgt ook een mail.</p>
        </div>
        <a href="/beheer/export?wat=sollicitaties" className="btn btn-outline btn-sm" style={{ minHeight: 48, fontSize: 15 }}>Exporteren (CSV)</a>
      </div>
      <SollicitatieTable rows={rows} vacatures={vac.map((v) => ({ id: v.id, title: `${v.title}, ${v.regio}` }))} />
      <Toast text={typeof sp.melding === "string" ? sp.melding : null} />
    </div>
  );
}
