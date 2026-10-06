"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { verstuurAlerts } from "@/lib/alerts";
import { DEFAULTS, mergeContent, type SectionId } from "@/lib/content";
import { demo } from "@/lib/demo";
import { removeImage, uploadImage } from "@/lib/media";
import { ruimOudeGegevensOp } from "@/lib/opruimen";
import { CV_BUCKET, DEMO } from "@/lib/supabase/config";
import { createServiceClient, createSessionClient } from "@/lib/supabase/server";
import {
  CONTRACTEN,
  DOMEINEN,
  PIPELINE,
  STATUSSEN,
  UREN,
  slugify,
  type ActionResult,
  type BerichtStatus,
  type SollicitatieStatus,
  type TeamLid,
  type Vacature,
} from "@/lib/types";

const go = (path: string, melding: string) => redirect(`${path}?melding=${encodeURIComponent(melding)}`);
const fail = (error: string): ActionResult => ({ ok: false, error });

/* ======================================================================
   Inloggen met e-mailcode
   ====================================================================== */

export async function sendLoginCode(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const email = String(fd.get("email") || "").trim().toLowerCase();
  if (!z.string().email().safeParse(email).success) return fail("Vul een geldig e-mailadres in.");
  if (DEMO) return { ok: true, message: email };
  // Enkel bekende beheerders krijgen een code. We melden niet of een adres bestaat.
  const { data } = await createServiceClient().from("beheerders").select("email").eq("email", email).maybeSingle();
  if (data) {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    if (error) {
      console.error("signInWithOtp", error);
      return fail("De code kon niet verstuurd worden. Probeer het over een minuut opnieuw.");
    }
  }
  return { ok: true, message: email };
}

export async function verifyLoginCode(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const token = String(fd.get("code") || "").replace(/\s+/g, "");
  if (!/^\d{6,10}$/.test(token)) return fail("Vul de code uit de mail in.");
  if (DEMO) redirect("/beheer");
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error) return fail("Die code klopt niet of is verlopen. Vraag een nieuwe aan.");
  redirect("/beheer");
}

export async function logout() {
  if (!DEMO) {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  }
  redirect("/beheer/login");
}

/* ======================================================================
   Vacatures
   ====================================================================== */

const vacSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "Vul een functietitel in.").max(120),
  domein: z.enum(DOMEINEN),
  regio: z.string().trim().min(1, "Vul een regio in.").max(80),
  contract: z.enum(CONTRACTEN),
  uren: z.enum(UREN),
  status: z.enum(STATUSSEN),
  intro: z.string().max(600),
  redenen: z.string().max(600),
  bedrijf: z.string().max(4000),
  taken: z.string().max(4000),
  profiel: z.string().max(4000),
  aanbod: z.string().max(4000),
  consultant_id: z.string().nullable(),
});

const vacFields = ["id", "title", "domein", "regio", "contract", "uren", "status", "intro", "redenen", "bedrijf", "taken", "profiel", "aanbod", "consultant_id"] as const;

function refreshSite(slug?: string) {
  revalidatePath("/");
  revalidatePath("/vacatures");
  if (slug) revalidatePath(`/vacatures/${slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/beheer", "layout");
}

const alertTekst = (n: number) => (n > 0 ? ` ${n} ${n === 1 ? "abonnee kreeg" : "abonnees kregen"} een mail.` : "");

export async function saveVacature(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const raw = Object.fromEntries(vacFields.map((k) => [k, String(fd.get(k) ?? "")]));
  const parsed = vacSchema.safeParse({ ...raw, id: raw.id || undefined, consultant_id: raw.consultant_id || null });
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  const { id, ...v } = parsed.data;
  const melding = v.status === "Online" ? "Opgeslagen. De vacature staat meteen online." : `Opgeslagen als ${v.status.toLowerCase()}.`;
  let row: Vacature;

  if (DEMO) {
    const now = new Date().toISOString();
    const existing = id ? demo.vacatures.find((x) => x.id === id) : undefined;
    if (existing) {
      Object.assign(existing, v, { updated_at: now, published_at: existing.published_at || (v.status === "Online" ? now : null) });
      row = existing;
    } else {
      row = { ...v, id: randomUUID(), slug: uniqueSlugFrom(new Set(demo.vacatures.map((x) => x.slug)), v.title, v.regio), created_at: now, updated_at: now, published_at: v.status === "Online" ? now : null, alert_verstuurd_at: null };
      demo.vacatures.unshift(row);
    }
  } else {
    const supabase = await createSessionClient();
    if (id) {
      const { data, error } = await supabase.from("vacatures").update(v).eq("id", id).select("*").single();
      if (error) return fail("Opslaan mislukt: " + error.message);
      row = data as Vacature;
    } else {
      const base = slugify(`${v.title} ${v.regio}`) || "vacature";
      const { data: taken } = await supabase.from("vacatures").select("slug").like("slug", `${base}%`);
      const slug = uniqueSlugFrom(new Set((taken || []).map((r) => r.slug)), v.title, v.regio);
      const { data, error } = await supabase.from("vacatures").insert({ ...v, slug }).select("*").single();
      if (error) return fail("Opslaan mislukt: " + error.message);
      row = data as Vacature;
    }
  }
  const n = await verstuurAlerts(row);
  refreshSite(row.slug);
  go("/beheer", melding + alertTekst(n));
  return { ok: true };
}

export async function setVacatureStatus(id: string, status: Vacature["status"]): Promise<ActionResult> {
  await requireAdmin();
  if (!STATUSSEN.includes(status)) return fail("Onbekende status.");
  let row: Vacature | undefined;
  if (DEMO) {
    row = demo.vacatures.find((x) => x.id === id);
    if (row) {
      row.status = status;
      row.updated_at = new Date().toISOString();
      if (status === "Online" && !row.published_at) row.published_at = row.updated_at;
    }
  } else {
    const supabase = await createSessionClient();
    const { data, error } = await supabase.from("vacatures").update({ status }).eq("id", id).select("*").single();
    if (error) return fail(error.message);
    row = data as Vacature;
  }
  if (!row) return fail("Vacature niet gevonden.");
  const n = await verstuurAlerts(row);
  refreshSite(row.slug);
  return { ok: true, message: alertTekst(n).trim() };
}

export async function deleteVacature(id: string) {
  await requireAdmin();
  if (DEMO) {
    const i = demo.vacatures.findIndex((x) => x.id === id);
    if (i >= 0) demo.vacatures.splice(i, 1);
  } else {
    const supabase = await createSessionClient();
    await supabase.from("vacatures").delete().eq("id", id);
  }
  refreshSite();
  go("/beheer", "Vacature verwijderd.");
}

function uniqueSlugFrom(taken: Set<string>, title: string, regio: string) {
  const base = slugify(`${title} ${regio}`) || "vacature";
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/* ======================================================================
   Team
   ====================================================================== */

const teamSchema = z.object({
  naam: z.string().trim().min(1, "Vul een naam in.").max(120),
  rol: z.string().trim().max(120),
  email: z.union([z.literal(""), z.string().trim().email("Het e-mailadres klopt niet.")]),
  telefoon: z.string().trim().max(40),
  linkedin: z.union([z.literal(""), z.string().trim().url("De LinkedIn-link moet met https:// beginnen.")]),
  bio: z.string().max(3000),
  motto: z.string().max(400),
  focus: z.string().max(200),
  talen: z.string().max(200),
  boodschap: z.string().max(200),
});

export async function saveTeamLid(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const keys = ["naam", "rol", "email", "telefoon", "linkedin", "bio", "motto", "focus", "talen", "boodschap"] as const;
  const parsed = teamSchema.safeParse(Object.fromEntries(keys.map((k) => [k, String(fd.get(k) ?? "")])));
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  const id = String(fd.get("id") || "") || null;
  const d = parsed.data;
  const values = {
    ...d,
    email: d.email || null,
    telefoon: d.telefoon || null,
    linkedin: d.linkedin || null,
    is_consultant: fd.get("is_consultant") === "on",
    zichtbaar: fd.get("zichtbaar") === "on",
  };

  // Foto: nieuwe upload, verwijderen of ongewijzigd laten.
  const oud = String(fd.get("foto_oud") || "") || null;
  let foto_url: string | null = oud;
  const file = fd.get("foto");
  if (file instanceof File && file.size > 0) {
    const up = await uploadImage(file, "team");
    if ("error" in up) return fail(up.error);
    foto_url = up.url;
  } else if (fd.get("foto_weg") === "1") {
    foto_url = null;
  }
  if (foto_url !== oud) await removeImage(oud);

  if (DEMO) {
    const existing = id ? demo.team.find((t) => t.id === id) : undefined;
    if (existing) Object.assign(existing, values, { foto_url });
    else demo.team.push({ ...values, foto_url, id: randomUUID(), volgorde: Math.max(0, ...demo.team.map((t) => t.volgorde)) + 1 } as TeamLid);
  } else {
    const supabase = await createSessionClient();
    if (id) {
      const { error } = await supabase.from("team").update({ ...values, foto_url }).eq("id", id);
      if (error) return fail("Opslaan mislukt: " + error.message);
    } else {
      const { data: last } = await supabase.from("team").select("volgorde").order("volgorde", { ascending: false }).limit(1);
      const { error } = await supabase.from("team").insert({ ...values, foto_url, volgorde: (last?.[0]?.volgorde ?? 0) + 1 });
      if (error) return fail("Opslaan mislukt: " + error.message);
    }
  }
  revalidatePath("/", "layout");
  go("/beheer/team", `${d.naam} is opgeslagen.`);
  return { ok: true };
}

export async function deleteTeamLid(id: string) {
  await requireAdmin();
  if (DEMO) {
    const i = demo.team.findIndex((t) => t.id === id);
    if (i >= 0) demo.team.splice(i, 1);
    demo.vacatures.forEach((v) => v.consultant_id === id && (v.consultant_id = null));
  } else {
    const supabase = await createSessionClient();
    const { data } = await supabase.from("team").select("foto_url").eq("id", id).maybeSingle();
    await supabase.from("team").delete().eq("id", id);
    await removeImage(data?.foto_url);
  }
  revalidatePath("/", "layout");
  go("/beheer/team", "Teamlid verwijderd.");
}

/** Zet de volgorde van het team zoals opgegeven (lijst van id's). */
export async function reorderTeam(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  if (DEMO) {
    ids.forEach((id, i) => {
      const t = demo.team.find((x) => x.id === id);
      if (t) t.volgorde = i + 1;
    });
  } else {
    const supabase = await createSessionClient();
    const results = await Promise.all(ids.map((id, i) => supabase.from("team").update({ volgorde: i + 1 }).eq("id", id)));
    const err = results.find((r) => r.error);
    if (err?.error) return fail(err.error.message);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function setTeamZichtbaar(id: string, zichtbaar: boolean): Promise<ActionResult> {
  await requireAdmin();
  if (DEMO) {
    const t = demo.team.find((x) => x.id === id);
    if (t) t.zichtbaar = zichtbaar;
  } else {
    const supabase = await createSessionClient();
    const { error } = await supabase.from("team").update({ zichtbaar }).eq("id", id);
    if (error) return fail(error.message);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

/* ======================================================================
   Sollicitaties en berichten
   ====================================================================== */

export async function setSollicitatieStatus(id: string, status: SollicitatieStatus): Promise<ActionResult> {
  await requireAdmin();
  if (!PIPELINE.includes(status)) return fail("Onbekende status.");
  return update("sollicitaties", id, { status });
}

export async function setBerichtStatus(id: string, status: BerichtStatus): Promise<ActionResult> {
  await requireAdmin();
  if (!["nieuw", "bekeken", "afgehandeld"].includes(status)) return fail("Onbekende status.");
  return update("berichten", id, { status });
}

export async function saveNotities(tabel: "sollicitaties" | "berichten", id: string, notities: string): Promise<ActionResult> {
  await requireAdmin();
  if (notities.length > 10000) return fail("De notitie is te lang.");
  return update(tabel, id, { notities });
}

async function update(tabel: "sollicitaties" | "berichten", id: string, values: Record<string, string>): Promise<ActionResult> {
  if (DEMO) {
    const list: { id: string; updated_at: string }[] = tabel === "sollicitaties" ? demo.sollicitaties : demo.berichten;
    const row = list.find((x) => x.id === id);
    if (!row) return fail("Niet gevonden.");
    Object.assign(row, values, { updated_at: new Date().toISOString() });
  } else {
    const supabase = await createSessionClient();
    const { error } = await supabase.from(tabel).update(values).eq("id", id);
    if (error) return fail(error.message);
  }
  revalidatePath("/beheer", "layout");
  return { ok: true };
}

/** Verwijdert een sollicitatie of bericht, inclusief het cv. */
export async function deleteInzending(tabel: "sollicitaties" | "berichten", id: string) {
  await requireAdmin();
  if (DEMO) {
    const list = tabel === "sollicitaties" ? demo.sollicitaties : demo.berichten;
    const i = list.findIndex((x) => x.id === id);
    if (i >= 0) list.splice(i, 1);
  } else {
    const supabase = await createSessionClient();
    const { data } = await supabase.from(tabel).select("cv_path").eq("id", id).maybeSingle();
    if (data?.cv_path) await createServiceClient().storage.from(CV_BUCKET).remove([data.cv_path]);
    await supabase.from(tabel).delete().eq("id", id);
  }
  revalidatePath("/beheer", "layout");
  go(`/beheer/${tabel}`, tabel === "sollicitaties" ? "Sollicitatie en cv verwijderd." : "Bericht verwijderd.");
}

/* ======================================================================
   Inhoud en instellingen
   ====================================================================== */

export async function saveContent(section: SectionId, json: string): Promise<ActionResult> {
  await requireAdmin();
  if (!(section in DEFAULTS)) return fail("Onbekend onderdeel.");
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(json);
  } catch {
    return fail("De inhoud kon niet gelezen worden.");
  }
  // Alleen bekende velden met de juiste vorm bewaren.
  const clean = mergeContent({ [section]: parsed })[section] as Record<string, unknown>;
  if (section === "instellingen") {
    const m = String(clean.meldingen_email || "").trim();
    if (m && !z.string().email().safeParse(m).success) return fail("Het adres voor meldingen klopt niet.");
    const n = String(clean.bewaartermijn_maanden || "0").trim();
    if (!/^\d{1,3}$/.test(n)) return fail("De bewaartermijn moet een getal zijn.");
  }
  if (DEMO) demo.inhoud[section] = clean;
  else {
    const supabase = await createSessionClient();
    const { error } = await supabase.from("inhoud").upsert({ sleutel: section, waarde: clean });
    if (error) return fail("Opslaan mislukt: " + error.message);
  }
  revalidatePath("/", "layout");
  return { ok: true, message: "Opgeslagen. De site is bijgewerkt." };
}

/** Upload voor afbeeldingen in de inhoud (bv. klantlogo's). */
export async function uploadMedia(fd: FormData): Promise<ActionResult & { url?: string }> {
  await requireAdmin();
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return fail("Kies een afbeelding.");
  const up = await uploadImage(file, "logos");
  if ("error" in up) return fail(up.error);
  return { ok: true, url: up.url };
}

/* ======================================================================
   Beheerders, alerts, opruimen
   ====================================================================== */

export async function addBeheerder(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const naam = String(fd.get("naam") || "").trim() || null;
  if (!z.string().email().safeParse(email).success) return fail("Vul een geldig e-mailadres in.");
  if (DEMO) {
    if (!demo.beheerders.some((b) => b.email === email)) demo.beheerders.push({ email, naam });
  } else {
    const supabase = await createSessionClient();
    const { error } = await supabase.from("beheerders").upsert({ email, naam });
    if (error) return fail("Toevoegen mislukt: " + error.message);
  }
  revalidatePath("/beheer/instellingen");
  return { ok: true, message: `${email} kan nu inloggen met een e-mailcode.` };
}

export async function removeBeheerder(email: string): Promise<ActionResult> {
  const me = await requireAdmin();
  if (email === me.email) return fail("Je kan jezelf niet verwijderen.");
  if (DEMO) {
    const i = demo.beheerders.findIndex((b) => b.email === email);
    if (i >= 0) demo.beheerders.splice(i, 1);
  } else {
    const supabase = await createSessionClient();
    const { error } = await supabase.from("beheerders").delete().eq("email", email);
    if (error) return fail(error.message);
  }
  revalidatePath("/beheer/instellingen");
  return { ok: true };
}

export async function deleteAlert(email: string): Promise<ActionResult> {
  await requireAdmin();
  if (DEMO) {
    const i = demo.alerts.findIndex((a) => a.email === email);
    if (i >= 0) demo.alerts.splice(i, 1);
  } else {
    const supabase = await createSessionClient();
    const { error } = await supabase.from("vacature_alerts").delete().eq("email", email);
    if (error) return fail(error.message);
  }
  revalidatePath("/beheer/alerts");
  return { ok: true };
}

export async function opruimenNu(): Promise<ActionResult> {
  await requireAdmin();
  const r = await ruimOudeGegevensOp();
  revalidatePath("/beheer", "layout");
  if (!r.maanden) return { ok: true, message: "Er is geen bewaartermijn ingesteld, er is niets verwijderd." };
  return { ok: true, message: `${r.sollicitaties} sollicitaties en ${r.berichten} berichten ouder dan ${r.maanden} maanden verwijderd.` };
}
