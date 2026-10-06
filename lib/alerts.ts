import "server-only";
import { demo } from "./demo";
import { sendBatch } from "./mail";
import { site } from "./site";
import { DEMO } from "./supabase/config";
import { createServiceClient } from "./supabase/server";
import type { Vacature } from "./types";

/**
 * Mailt abonnees (alle domeinen of het domein van de vacature) wanneer een vacature
 * voor het eerst online komt. Elke vacature triggert dit maar één keer.
 * Geeft het aantal abonnees terug dat een mail kreeg (of zou krijgen in demomodus).
 */
export async function verstuurAlerts(v: Pick<Vacature, "id" | "slug" | "title" | "regio" | "domein" | "intro" | "status" | "alert_verstuurd_at">): Promise<number> {
  if (v.status !== "Online" || v.alert_verstuurd_at) return 0;
  const now = new Date().toISOString();

  if (DEMO) {
    const doel = demo.alerts.filter((a) => !a.domein || a.domein === v.domein);
    const row = demo.vacatures.find((x) => x.id === v.id);
    if (row) row.alert_verstuurd_at = now;
    console.info(`[demo] vacature-alert voor ${v.title} naar ${doel.length} abonnees`);
    return doel.length;
  }

  const db = createServiceClient();
  // Eerst markeren, zodat dubbel opslaan nooit twee keer mailt.
  const { data: claimed } = await db.from("vacatures").update({ alert_verstuurd_at: now }).eq("id", v.id).is("alert_verstuurd_at", null).select("id");
  if (!claimed?.length) return 0;

  const { data: subs } = await db.from("vacature_alerts").select("email, token, domein").or(`domein.is.null,domein.eq.${v.domein}`);
  if (!subs?.length) return 0;
  const url = `${site.url}/vacatures/${v.slug}`;
  return sendBatch(
    subs.map((s) => ({
      to: s.email,
      subject: `Nieuwe vacature: ${v.title} in ${v.regio}`,
      text: [
        `Er staat een nieuwe vacature online die bij je interesse past.`,
        ``,
        `${v.title}, ${v.regio} (${v.domein})`,
        v.intro ? `\n${v.intro}\n` : ``,
        `Bekijk de vacature: ${url}`,
        ``,
        `Geen mails meer ontvangen? Meld je af: ${site.url}/alerts/afmelden?token=${s.token}`,
      ].join("\n"),
    }))
  );
}
