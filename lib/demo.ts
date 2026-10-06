import type { Alert, Contactbericht, Sollicitatie, TeamLid, Vacature } from "./types";

/**
 * Voorbeelddata voor de demomodus (geen Supabase-sleutels ingesteld).
 * Dezelfde inhoud staat in supabase/seed.sql.
 */
const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();

function vac(
  i: number,
  title: string,
  domein: Vacature["domein"],
  regio: string,
  status: Vacature["status"],
  consultant: string,
  age: number,
  uren = "Voltijds"
): Vacature {
  return {
    id: `demo-${i}`,
    slug: title.toLowerCase().replace(/\s+/g, "-") + "-" + regio.toLowerCase(),
    title,
    domein,
    regio,
    contract: "Vast contract",
    uren,
    intro: "[Openingszin van de vacature: wat deze rol bijzonder maakt.]",
    redenen: "[Reden 1 waarom deze rol]\n[Reden 2]\n[Reden 3]",
    bedrijf: "[Omschrijving van de klant.]",
    taken: "[Taak of verantwoordelijkheid]\n[Taak of verantwoordelijkheid]\n[Taak of verantwoordelijkheid]",
    profiel: "[Ervaring of opleiding]\n[Vaardigheid]\n[Taalkennis]",
    aanbod: "[Verloning, extralegale voordelen en werkregeling.]",
    consultant_id: consultant,
    status,
    created_at: daysAgo(age),
    updated_at: daysAgo(age),
    published_at: status === "Concept" ? null : daysAgo(age),
  };
}

function lid(i: number, is_consultant = true): TeamLid {
  return {
    id: `team-${i}`,
    naam: `[Naam ${i}]`,
    rol: "[Functie]",
    email: null,
    telefoon: null,
    bio: "[Korte bio: achtergrond, waarom recruitment, wat deze persoon onderscheidt.]",
    motto: "[Persoonlijk motto of uitspraak over luisteren.]",
    focus: "[Type profielen of klanten]",
    talen: "[Talen]",
    linkedin: null,
    foto_url: null,
    boodschap: "[Persoonlijke boodschap van de consultant]",
    is_consultant,
    zichtbaar: true,
    volgorde: i,
  };
}

type DemoStore = {
  vacatures: Vacature[];
  team: TeamLid[];
  sollicitaties: Sollicitatie[];
  berichten: Contactbericht[];
  alerts: Alert[];
  beheerders: { email: string; naam: string | null }[];
  inhoud: Record<string, Record<string, unknown>>;
};

function seed(): DemoStore {
  const team = [1, 2, 3, 4, 5, 6].map((i) => lid(i, i <= 4));
  const vacatures = [
    vac(1, "Business Controller", "Finance", "Antwerpen", "Online", "team-1", 1),
    vac(2, "Data Analyst", "Data", "Gent", "Online", "team-2", 3),
    vac(3, "Functioneel Analist", "IT", "Mechelen", "Online", "team-1", 14),
    vac(4, "AP Accountant", "Finance", "Antwerpen", "Online", "team-3", 20, "Deeltijds"),
    vac(5, "Financial Risk Analyst", "Finance", "Brussel", "Online", "team-2", 25),
    vac(6, "Business Analist", "IT", "Antwerpen", "Online", "team-4", 30),
    vac(7, "BI Developer", "Data", "Leuven", "Online", "team-3", 32),
    vac(8, "GL Accountant", "Finance", "Antwerpen", "Concept", "team-1", 2),
    vac(9, "Financial Controller", "Finance", "Gent", "Ingevuld", "team-2", 60),
  ];
  const s = (i: number, v: string, min: number, status: Sollicitatie["status"]): Sollicitatie => ({
    id: `sol-${i}`,
    vacature_id: v,
    voornaam: `[Kandidaat`,
    achternaam: `${i}]`,
    email: `kandidaat${i}@voorbeeld.be`,
    telefoon: "+32 400 00 00 00",
    cv_path: null,
    status,
    notities: "",
    created_at: new Date(now - min * 60000).toISOString(),
    updated_at: new Date(now - min * 60000).toISOString(),
  });
  return {
    team,
    vacatures,
    sollicitaties: [
      s(1, "demo-1", 12, "nieuw"),
      s(2, "demo-4", 300, "nieuw"),
      s(3, "demo-2", 1500, "bekeken"),
      s(4, "demo-1", 2900, "bekeken"),
    ],
    berichten: [],
    alerts: [],
    beheerders: [{ email: "demo@trengix.be", naam: "Demomodus" }],
    inhoud: {},
  };
}

const g = globalThis as unknown as { __trengixDemo2?: DemoStore };
export const demo: DemoStore = g.__trengixDemo2 ?? (g.__trengixDemo2 = seed());
