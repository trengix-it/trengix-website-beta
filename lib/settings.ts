import "server-only";
import { DEFAULTS } from "./content";
import { demo } from "./demo";
import { DEMO } from "./supabase/config";
import { createServiceClient } from "./supabase/server";

/** Interne instellingen (niet publiek leesbaar). */
export async function getInstellingen(): Promise<typeof DEFAULTS.instellingen> {
  let stored: Record<string, unknown> = {};
  if (DEMO) stored = demo.inhoud.instellingen || {};
  else {
    const { data } = await createServiceClient().from("inhoud").select("waarde").eq("sleutel", "instellingen").maybeSingle();
    stored = (data?.waarde as Record<string, unknown>) || {};
  }
  return { ...DEFAULTS.instellingen, ...(stored as Partial<typeof DEFAULTS.instellingen>) };
}

/** Adres voor meldingen: instelling in beheer, anders MAIL_FALLBACK_TO. */
export async function meldingenAdres(): Promise<string> {
  const s = await getInstellingen();
  return s.meldingen_email || process.env.MAIL_FALLBACK_TO || "";
}
