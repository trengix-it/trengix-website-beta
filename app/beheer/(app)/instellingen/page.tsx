import { Beheerders } from "@/components/beheer/Beheerders";
import { OpruimKnop } from "@/components/beheer/OpruimKnop";
import { SectionEditor } from "@/components/beheer/SectionEditor";
import { adminBeheerders, adminContent, relatief, requireAdmin } from "@/lib/admin";
import { BEDRIJF_SECTION, DEFAULTS, INSTELLINGEN_SECTION } from "@/lib/content";
import { DEMO } from "@/lib/supabase/config";

export default async function Instellingen() {
  const [me, content, beheerders] = await Promise.all([requireAdmin(), adminContent(), adminBeheerders()]);
  const bij = (k: string) => (content._bijgewerkt[k] ? relatief(content._bijgewerkt[k]) : undefined);
  const mail = !!process.env.RESEND_API_KEY;
  const cron = !!process.env.CRON_SECRET;

  return (
    <div className="a-in" style={{ display: "flex", flexDirection: "column", gap: 40, maxWidth: 1000 }}>
      <div>
        <h1 className="admin-h1">Instellingen</h1>
        <p className="admin-sub">Bedrijfsgegevens, meldingen, privacy en wie toegang heeft tot het beheer.</p>
      </div>

      <section aria-label="Systeemstatus" className="admin-card" style={{ padding: 24, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
        <Status ok={!DEMO} titel="Database" uitleg={DEMO ? "Demomodus: niets wordt blijvend bewaard." : "Gekoppeld met Supabase."} />
        <Status ok={mail} titel="Mail" uitleg={mail ? "Meldingen en bevestigingen worden verstuurd." : "Geen RESEND_API_KEY: er gaan geen mails uit."} />
        <Status ok={cron} titel="Nachtelijk opruimen" uitleg={cron ? "Actief via Vercel Cron." : "Geen CRON_SECRET ingesteld."} />
      </section>

      <SectionEditor key={"b" + bij("bedrijf")} def={BEDRIJF_SECTION} initial={content.bedrijf} defaults={DEFAULTS.bedrijf} bijgewerkt={bij("bedrijf")} />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionEditor key={"i" + bij("instellingen")} def={INSTELLINGEN_SECTION} initial={content.instellingen} defaults={DEFAULTS.instellingen} bijgewerkt={bij("instellingen")} />
        <OpruimKnop />
      </div>

      <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 30, fontWeight: 400, letterSpacing: "-0.03em" }}>Beheerders</h2>
          <p className="admin-sub" style={{ marginTop: 4 }}>Wie hier staat, kan inloggen op /beheer met een code per mail.</p>
        </div>
        <Beheerders list={beheerders} me={me.email} />
      </section>
    </div>
  );
}

function Status({ ok, titel, uitleg }: { ok: boolean; titel: string; uitleg: string }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span aria-hidden="true" style={{ width: 12, height: 12, marginTop: 5, borderRadius: 999, background: ok ? "#1f9d55" : "#d99a00", flexShrink: 0 }} />
      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <strong style={{ fontWeight: 600 }}>{titel}: {ok ? "in orde" : "aandacht"}</strong>
        <span style={{ fontSize: 14, color: "#3D3D46" }}>{uitleg}</span>
      </span>
    </div>
  );
}
