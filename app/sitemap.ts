import type { MetadataRoute } from "next";
import { getOnlineVacatures } from "@/lib/data";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vac = await getOnlineVacatures();
  const pages = ["", "/vacatures", "/werkgevers", "/over-ons", "/contact"].map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const }));
  return [...pages, ...vac.map((v) => ({ url: `${site.url}/vacatures/${v.slug}`, lastModified: v.updated_at }))];
}
