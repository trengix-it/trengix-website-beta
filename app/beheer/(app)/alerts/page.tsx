import { AlertList } from "@/components/beheer/AlertList";
import { adminAlerts, relatief } from "@/lib/admin";
import { DOMEINEN } from "@/lib/types";

export default async function Alerts() {
  const alerts = await adminAlerts();
  const per = (d: string | null) => alerts.filter((a) => a.domein === d).length;
  return (
    <div className="a-in" style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1000 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, flexWrap: "wrap" }}>
        <div>
          <h1 className="admin-h1">Vacature-alerts</h1>
          <p className="admin-sub">Wie zich inschreef op /vacatures krijgt één mail zodra een vacature in zijn domein voor het eerst online komt.</p>
        </div>
        <a href="/beheer/export?wat=alerts" className="btn btn-outline btn-sm" style={{ minHeight: 48, fontSize: 15 }}>Exporteren (CSV)</a>
      </div>
      <div className="admin-card" style={{ padding: 20, display: "flex", gap: 32, flexWrap: "wrap" }}>
        <Stat n={alerts.length} l="Totaal" />
        <Stat n={per(null)} l="Alle domeinen" />
        {DOMEINEN.map((d) => <Stat key={d} n={per(d)} l={d} />)}
      </div>
      <AlertList rows={alerts.map((a) => ({ email: a.email, domein: a.domein ?? "Alle", wanneer: relatief(a.created_at) }))} />
    </div>
  );
}

function Stat({ n, l }: { n: number; l: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontSize: 36, letterSpacing: "-0.04em", lineHeight: 1 }}>{n}</span>
      <span style={{ fontSize: 14, color: "#4A4A55" }}>{l}</span>
    </div>
  );
}
