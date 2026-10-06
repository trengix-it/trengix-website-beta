import "server-only";
import { demo } from "./demo";
import { getInstellingen } from "./settings";
import { CV_BUCKET, DEMO } from "./supabase/config";
import { createServiceClient } from "./supabase/server";

/**
 * Verwijdert sollicitaties en contactberichten (met cv's) ouder dan de bewaartermijn.
 * Wordt elke nacht door Vercel Cron aangeroepen en kan ook handmatig vanuit Instellingen.
 */
export async function ruimOudeGegevensOp(): Promise<{ sollicitaties: number; berichten: number; maanden: number }> {
  const maanden = parseInt((await getInstellingen()).bewaartermijn_maanden, 10);
  if (!maanden || maanden < 1) return { sollicitaties: 0, berichten: 0, maanden: 0 };
  const grens = new Date();
  grens.setMonth(grens.getMonth() - maanden);
  const iso = grens.toISOString();

  if (DEMO) {
    const s0 = demo.sollicitaties.length;
    const b0 = demo.berichten.length;
    demo.sollicitaties = demo.sollicitaties.filter((s) => s.created_at >= iso);
    demo.berichten = demo.berichten.filter((s) => s.created_at >= iso);
    return { sollicitaties: s0 - demo.sollicitaties.length, berichten: b0 - demo.berichten.length, maanden };
  }

  const db = createServiceClient();
  let totaal = { sollicitaties: 0, berichten: 0 };
  for (const tabel of ["sollicitaties", "berichten"] as const) {
    const { data } = await db.from(tabel).select("id, cv_path").lt("created_at", iso).limit(1000);
    if (!data?.length) continue;
    const files = data.map((r) => r.cv_path).filter(Boolean) as string[];
    if (files.length) await db.storage.from(CV_BUCKET).remove(files);
    await db.from(tabel).delete().in("id", data.map((r) => r.id));
    totaal = { ...totaal, [tabel]: data.length };
  }
  return { ...totaal, maanden };
}
