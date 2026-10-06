"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { demo } from "@/lib/demo";
import { fill } from "@/lib/content";
import { getContent } from "@/lib/data";
import { sendMail } from "@/lib/mail";
import { meldingenAdres } from "@/lib/settings";
import { site } from "@/lib/site";
import { CV_BUCKET, DEMO } from "@/lib/supabase/config";
import { createServiceClient } from "@/lib/supabase/server";
import { DOMEINEN, type ActionResult, type ContactOnderwerp, type Domein } from "@/lib/types";

const MAX_CV = 4 * 1024 * 1024;
const CV_TYPES = [".pdf", ".doc", ".docx"];

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const isBot = (fd: FormData) => str(fd, "website") !== ""; // honeypot

function checkCv(file: FormDataEntryValue | null, required: boolean): { file: File | null; error?: string } {
  if (!(file instanceof File) || file.size === 0) {
    return required ? { file: null, error: "Voeg je cv toe (pdf of Word)." } : { file: null };
  }
  const name = file.name.toLowerCase();
  if (!CV_TYPES.some((t) => name.endsWith(t))) return { file: null, error: "Je cv moet een pdf- of Word-bestand zijn." };
  if (file.size > MAX_CV) return { file: null, error: "Je cv is groter dan 4 MB. Probeer een kleiner bestand." };
  return { file };
}

async function uploadCv(file: File, folder: string): Promise<string> {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(-80);
  const path = `${folder}/${randomUUID()}/${safe}`;
  const { error } = await createServiceClient()
    .storage.from(CV_BUCKET)
    .upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
  if (error) throw error;
  return path;
}

/* ---------- Sollicitatie op een vacature ---------- */

const applySchema = z.object({
  vacature_id: z.string().min(1),
  voornaam: z.string().min(1, "Vul je voornaam in.").max(100),
  achternaam: z.string().min(1, "Vul je achternaam in.").max(100),
  email: z.string().email("Vul een geldig e-mailadres in.").max(200),
  telefoon: z.string().min(6, "Vul je telefoonnummer in.").max(40),
});

export async function applyToVacature(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  if (isBot(fd)) return { ok: true };
  if (fd.get("privacy") !== "on") return { ok: false, error: "Ga akkoord met de privacyverklaring om je sollicitatie te versturen." };
  const parsed = applySchema.safeParse(Object.fromEntries(["vacature_id", "voornaam", "achternaam", "email", "telefoon"].map((k) => [k, str(fd, k)])));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const cv = checkCv(fd.get("cv"), true);
  if (cv.error || !cv.file) return { ok: false, error: cv.error ?? "Voeg je cv toe." };
  const d = parsed.data;

  if (DEMO) {
    const now = new Date().toISOString();
    demo.sollicitaties.unshift({ id: randomUUID(), ...d, cv_path: null, status: "nieuw", notities: "", created_at: now, updated_at: now });
    return { ok: true };
  }

  try {
    const db = createServiceClient();
    const { data: vac } = await db.from("vacatures").select("id, title, consultant_id, team:consultant_id (naam, email)").eq("id", d.vacature_id).maybeSingle();
    if (!vac) return { ok: false, error: "Deze vacature is niet meer beschikbaar." };
    const cv_path = await uploadCv(cv.file, "sollicitaties");
    const { error } = await db.from("sollicitaties").insert({ ...d, cv_path, status: "nieuw" });
    if (error) throw error;

    const team = (Array.isArray(vac.team) ? vac.team[0] : vac.team) as { naam: string; email: string | null } | null;
    const to = team?.email || (await meldingenAdres());
    if (to) {
      await sendMail({
        to,
        replyTo: d.email,
        subject: `Nieuwe sollicitatie: ${vac.title} (${d.voornaam} ${d.achternaam})`,
        text: `${d.voornaam} ${d.achternaam} solliciteerde op ${vac.title}.\n\nE-mail: ${d.email}\nTelefoon: ${d.telefoon}\n\nBekijk het cv in het beheerscherm: ${site.url}/beheer/sollicitaties`,
      });
    }
    // Bevestiging aan de kandidaat
    const c = await getContent();
    await sendMail({
      to: d.email,
      replyTo: team?.email || undefined,
      subject: `Je sollicitatie voor ${vac.title}`,
      text: fill(c.vacatures.mail_kandidaat, { voornaam: d.voornaam, vacature: vac.title, consultant: team?.naam || "Een van onze consultants" }),
    });
    return { ok: true };
  } catch (e) {
    console.error("applyToVacature", e);
    return { ok: false, error: "Er ging iets mis bij het versturen. Probeer het opnieuw of mail ons je cv." };
  }
}

/* ---------- Contactformulier ---------- */

const contactSchema = z.object({
  onderwerp: z.enum(["job", "talent", "anders"]),
  naam: z.string().min(1, "Vul je naam in.").max(150),
  email: z.string().email("Vul een geldig e-mailadres in.").max(200),
  telefoon: z.string().max(40),
  bedrijf: z.string().max(200),
  profiel: z.string().max(300),
  bericht: z.string().min(1, "Schrijf kort waarover je wil praten.").max(5000),
});

const onderwerpLabel: Record<ContactOnderwerp, string> = { job: "Zoekt een job", talent: "Zoekt talent", anders: "Iets anders" };

export async function sendContact(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  if (isBot(fd)) return { ok: true };
  if (fd.get("privacy") !== "on") return { ok: false, error: "Ga akkoord met de privacyverklaring om je bericht te versturen." };
  const parsed = contactSchema.safeParse(Object.fromEntries(["onderwerp", "naam", "email", "telefoon", "bedrijf", "profiel", "bericht"].map((k) => [k, str(fd, k)])));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;
  const cv = d.onderwerp === "job" ? checkCv(fd.get("cv"), false) : { file: null };
  if ("error" in cv && cv.error) return { ok: false, error: cv.error };

  if (DEMO) {
    const now = new Date().toISOString();
    demo.berichten.unshift({ id: randomUUID(), ...d, telefoon: d.telefoon || null, bedrijf: d.bedrijf || null, profiel: d.profiel || null, cv_path: null, status: "nieuw", notities: "", created_at: now, updated_at: now });
    return { ok: true };
  }

  try {
    const cv_path = cv.file ? await uploadCv(cv.file, "contact") : null;
    const { error } = await createServiceClient().from("berichten").insert({
      ...d,
      telefoon: d.telefoon || null,
      bedrijf: d.bedrijf || null,
      profiel: d.profiel || null,
      cv_path,
      status: "nieuw",
    });
    if (error) throw error;
    const to = await meldingenAdres();
    if (to) {
      await sendMail({
        to,
        replyTo: d.email,
        subject: `Contactformulier: ${onderwerpLabel[d.onderwerp]} (${d.naam})`,
        text: [
          `Onderwerp: ${onderwerpLabel[d.onderwerp]}`,
          `Naam: ${d.naam}`,
          `E-mail: ${d.email}`,
          d.telefoon && `Telefoon: ${d.telefoon}`,
          d.bedrijf && `Bedrijf: ${d.bedrijf}`,
          d.profiel && `Gezocht profiel: ${d.profiel}`,
          cv_path && `Cv bijgevoegd: zie ${site.url}/beheer/berichten`,
          "",
          d.bericht,
        ].filter(Boolean).join("\n"),
      });
    }
    return { ok: true };
  } catch (e) {
    console.error("sendContact", e);
    return { ok: false, error: "Er ging iets mis bij het versturen. Probeer het opnieuw of bel ons." };
  }
}

/* ---------- Vacature-alert ---------- */

export async function subscribeAlert(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  if (isBot(fd)) return { ok: true };
  const email = z.string().email().safeParse(str(fd, "email"));
  if (!email.success) return { ok: false, error: "Vul een geldig e-mailadres in." };
  const d = str(fd, "domein");
  const domein = (DOMEINEN as readonly string[]).includes(d) ? (d as Domein) : null;
  const mail = email.data.toLowerCase();
  if (DEMO) {
    const bestaand = demo.alerts.find((a) => a.email === mail);
    if (bestaand) bestaand.domein = domein;
    else demo.alerts.unshift({ email: mail, domein, token: randomUUID(), created_at: new Date().toISOString() });
    return { ok: true };
  }
  const { error } = await createServiceClient().from("vacature_alerts").upsert({ email: mail, domein }, { onConflict: "email" });
  if (error) {
    console.error("subscribeAlert", error);
    return { ok: false, error: "Inschrijven lukte niet. Probeer het later opnieuw." };
  }
  return { ok: true };
}

/* ---------- Afmelden voor alerts ---------- */

export async function unsubscribeAlert(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const token = str(fd, "token");
  if (!z.string().uuid().safeParse(token).success) return { ok: false, error: "Deze afmeldlink is ongeldig." };
  if (DEMO) {
    const i = demo.alerts.findIndex((a) => a.token === token);
    if (i >= 0) demo.alerts.splice(i, 1);
    return { ok: true };
  }
  const { error } = await createServiceClient().from("vacature_alerts").delete().eq("token", token);
  if (error) return { ok: false, error: "Afmelden lukte niet. Probeer het later opnieuw." };
  return { ok: true };
}
