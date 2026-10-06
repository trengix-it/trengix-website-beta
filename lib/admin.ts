import "server-only";
import { redirect } from "next/navigation";
import { mergeContent, type Content } from "./content";
import { demo } from "./demo";
import { DEMO } from "./supabase/config";
import { createSessionClient } from "./supabase/server";
import type { Alert, Contactbericht, Sollicitatie, TeamLid, Vacature } from "./types";

export type Beheerder = { email: string; naam: string };

/** Geeft de ingelogde beheerder terug, of stuurt door naar de loginpagina. */
export async function requireAdmin(): Promise<Beheerder> {
  if (DEMO) return { email: "demo@trengix.be", naam: "Demomodus" };
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (!email) redirect("/beheer/login");
  const { data: row } = await supabase.from("beheerders").select("email, naam").eq("email", email).maybeSingle();
  if (!row) redirect("/beheer/login?fout=geen-toegang");
  return { email: row.email, naam: row.naam || email };
}

/* ---------- Vacatures ---------- */

export async function adminVacatures(): Promise<(Vacature & { apps: number; nieuw: number })[]> {
  if (DEMO) {
    return [...demo.vacatures]
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .map((v) => {
        const s = demo.sollicitaties.filter((x) => x.vacature_id === v.id);
        return { ...v, apps: s.length, nieuw: s.filter((x) => x.status === "nieuw").length };
      });
  }
  const supabase = await createSessionClient();
  const [{ data: vac }, { data: sol }] = await Promise.all([
    supabase.from("vacatures").select("*").order("updated_at", { ascending: false }),
    supabase.from("sollicitaties").select("vacature_id, status"),
  ]);
  const counts = new Map<string, { apps: number; nieuw: number }>();
  (sol || []).forEach((s) => {
    if (!s.vacature_id) return;
    const c = counts.get(s.vacature_id) || { apps: 0, nieuw: 0 };
    c.apps++;
    if (s.status === "nieuw") c.nieuw++;
    counts.set(s.vacature_id, c);
  });
  return ((vac || []) as Vacature[]).map((v) => ({ ...v, ...(counts.get(v.id) || { apps: 0, nieuw: 0 }) }));
}

export async function adminVacature(id: string): Promise<Vacature | null> {
  if (DEMO) return demo.vacatures.find((v) => v.id === id) ?? null;
  const supabase = await createSessionClient();
  const { data } = await supabase.from("vacatures").select("*").eq("id", id).maybeSingle();
  return (data as Vacature) ?? null;
}

/* ---------- Team ---------- */

export async function adminTeam(): Promise<TeamLid[]> {
  if (DEMO) return [...demo.team].sort((a, b) => a.volgorde - b.volgorde);
  const supabase = await createSessionClient();
  const { data } = await supabase.from("team").select("*").order("volgorde");
  return (data || []) as TeamLid[];
}

export async function adminTeamLid(id: string): Promise<TeamLid | null> {
  if (DEMO) return demo.team.find((t) => t.id === id) ?? null;
  const supabase = await createSessionClient();
  const { data } = await supabase.from("team").select("*").eq("id", id).maybeSingle();
  return (data as TeamLid) ?? null;
}

/* ---------- Sollicitaties en berichten ---------- */

export type SollicitatieRij = Sollicitatie & { vacature: string; vacature_slug: string | null };

export async function adminSollicitaties(): Promise<SollicitatieRij[]> {
  if (DEMO) {
    return demo.sollicitaties.map((s) => {
      const v = demo.vacatures.find((x) => x.id === s.vacature_id);
      return { ...s, vacature: v?.title ?? "Vacature verwijderd", vacature_slug: v?.slug ?? null };
    });
  }
  const supabase = await createSessionClient();
  const { data } = await supabase.from("sollicitaties").select("*, vacatures (title, slug)").order("created_at", { ascending: false }).limit(1000);
  return (data || []).map(toRij);
}

export async function adminSollicitatie(id: string): Promise<SollicitatieRij | null> {
  if (DEMO) return (await adminSollicitaties()).find((s) => s.id === id) ?? null;
  const supabase = await createSessionClient();
  const { data } = await supabase.from("sollicitaties").select("*, vacatures (title, slug)").eq("id", id).maybeSingle();
  return data ? toRij(data) : null;
}

function toRij(r: Record<string, unknown>): SollicitatieRij {
  const v = r.vacatures as { title: string; slug: string } | { title: string; slug: string }[] | null;
  const one = Array.isArray(v) ? v[0] : v;
  return { ...(r as unknown as Sollicitatie), vacature: one?.title ?? "Vacature verwijderd", vacature_slug: one?.slug ?? null };
}

export async function adminBerichten(): Promise<Contactbericht[]> {
  if (DEMO) return demo.berichten;
  const supabase = await createSessionClient();
  const { data } = await supabase.from("berichten").select("*").order("created_at", { ascending: false }).limit(1000);
  return (data || []) as Contactbericht[];
}

export async function adminCounts() {
  if (DEMO) {
    return {
      sollicitaties: demo.sollicitaties.filter((s) => s.status === "nieuw").length,
      berichten: demo.berichten.filter((s) => s.status === "nieuw").length,
    };
  }
  const supabase = await createSessionClient();
  const [a, b] = await Promise.all([
    supabase.from("sollicitaties").select("id", { count: "exact", head: true }).eq("status", "nieuw"),
    supabase.from("berichten").select("id", { count: "exact", head: true }).eq("status", "nieuw"),
  ]);
  return { sollicitaties: a.count || 0, berichten: b.count || 0 };
}

/* ---------- Alerts, beheerders, inhoud ---------- */

export async function adminAlerts(): Promise<Alert[]> {
  if (DEMO) return demo.alerts;
  const supabase = await createSessionClient();
  const { data } = await supabase.from("vacature_alerts").select("*").order("created_at", { ascending: false });
  return (data || []) as Alert[];
}

export async function adminBeheerders(): Promise<{ email: string; naam: string | null; created_at?: string }[]> {
  if (DEMO) return demo.beheerders;
  const supabase = await createSessionClient();
  const { data } = await supabase.from("beheerders").select("*").order("created_at");
  return data || [];
}

/** Alle inhoud inclusief interne instellingen (enkel voor beheerders). */
export async function adminContent(): Promise<Content & { _bijgewerkt: Record<string, string> }> {
  if (DEMO) return { ...mergeContent(demo.inhoud), _bijgewerkt: {} };
  const supabase = await createSessionClient();
  const { data } = await supabase.from("inhoud").select("sleutel, waarde, updated_at");
  const rows = data || [];
  return {
    ...mergeContent(Object.fromEntries(rows.map((r) => [r.sleutel, r.waarde as Record<string, unknown>]))),
    _bijgewerkt: Object.fromEntries(rows.map((r) => [r.sleutel, r.updated_at as string])),
  };
}

/* ---------- Hulpmiddelen ---------- */

const rtf = new Intl.RelativeTimeFormat("nl", { numeric: "auto" });
export function relatief(iso: string): string {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const abs = Math.abs(diff);
  if (abs < 60) return "net";
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 86400 * 7) return rtf.format(Math.round(diff / 86400), "day");
  if (abs < 86400 * 35) return rtf.format(Math.round(diff / (86400 * 7)), "week");
  return datum(iso);
}

export const datum = (iso: string) => new Date(iso).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" });
