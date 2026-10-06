import "server-only";
import { cache } from "react";
import { mergeContent, type Content } from "./content";
import { demo } from "./demo";
import { DEMO } from "./supabase/config";
import { createPublicClient } from "./supabase/server";
import type { TeamLid, Vacature } from "./types";

/** Publieke data. In productie via Supabase (RLS: enkel online vacatures). */

export async function getOnlineVacatures(): Promise<Vacature[]> {
  if (DEMO) {
    return demo.vacatures
      .filter((v) => v.status === "Online")
      .sort((a, b) => (b.published_at || "").localeCompare(a.published_at || ""));
  }
  const { data, error } = await createPublicClient()
    .from("vacatures")
    .select("*")
    .eq("status", "Online")
    .order("published_at", { ascending: false });
  if (error) {
    console.error("getOnlineVacatures", error);
    return [];
  }
  return data as Vacature[];
}

export async function getVacatureBySlug(slug: string): Promise<Vacature | null> {
  if (DEMO) return demo.vacatures.find((v) => v.slug === slug && v.status === "Online") ?? null;
  const { data } = await createPublicClient()
    .from("vacatures")
    .select("*")
    .eq("slug", slug)
    .eq("status", "Online")
    .maybeSingle();
  return (data as Vacature) ?? null;
}

export async function getTeam(): Promise<TeamLid[]> {
  if (DEMO) return [...demo.team].sort((a, b) => a.volgorde - b.volgorde);
  const { data, error } = await createPublicClient()
    .from("team")
    .select("*")
    .order("volgorde", { ascending: true });
  if (error) {
    console.error("getTeam", error);
    return [];
  }
  return data as TeamLid[];
}

/** Teamleden die op de pagina Over ons verschijnen. */
export async function getZichtbaarTeam(): Promise<TeamLid[]> {
  return (await getTeam()).filter((t) => t.zichtbaar !== false);
}

export async function getTeamLid(id: string | null): Promise<TeamLid | null> {
  if (!id) return null;
  const team = await getTeam();
  return team.find((t) => t.id === id) ?? null;
}

/** Alle sitetekst, samengevoegd met de standaardteksten. Eén keer per request opgehaald. */
export const getContent = cache(async (): Promise<Content> => {
  if (DEMO) return mergeContent(demo.inhoud);
  const { data, error } = await createPublicClient().from("inhoud").select("sleutel, waarde");
  if (error) console.error("getContent", error);
  return mergeContent(Object.fromEntries((data || []).map((r) => [r.sleutel, r.waarde as Record<string, unknown>])));
});
