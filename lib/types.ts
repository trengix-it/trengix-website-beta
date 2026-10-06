export const DOMEINEN = ["Finance", "Data", "IT"] as const;
export type Domein = (typeof DOMEINEN)[number];

export const CONTRACTEN = ["Vast contract", "Interim", "Freelance"] as const;
export const UREN = ["Voltijds", "Deeltijds"] as const;

export const STATUSSEN = ["Concept", "Online", "Ingevuld"] as const;
export type VacatureStatus = (typeof STATUSSEN)[number];

export type Vacature = {
  id: string;
  slug: string;
  title: string;
  domein: Domein;
  regio: string;
  contract: string;
  uren: string;
  intro: string;
  /** Maximaal drie korte redenen waarom deze rol, één per regel. */
  redenen: string;
  bedrijf: string;
  /** Eén taak per regel. */
  taken: string;
  /** Eén vereiste per regel. */
  profiel: string;
  aanbod: string;
  consultant_id: string | null;
  status: VacatureStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  alert_verstuurd_at?: string | null;
};

export type TeamLid = {
  id: string;
  naam: string;
  rol: string;
  email: string | null;
  telefoon: string | null;
  bio: string;
  motto: string;
  focus: string;
  talen: string;
  linkedin: string | null;
  foto_url: string | null;
  /** Korte boodschap die in de consultant-bubbel op een vacature verschijnt. */
  boodschap: string;
  is_consultant: boolean;
  /** Toont dit teamlid op de pagina Over ons. */
  zichtbaar: boolean;
  volgorde: number;
};

export const PIPELINE = ["nieuw", "bekeken", "gesprek", "voorgesteld", "geplaatst", "afgewezen"] as const;
export type SollicitatieStatus = (typeof PIPELINE)[number];
export const PIPELINE_LABEL: Record<SollicitatieStatus, string> = {
  nieuw: "Nieuw",
  bekeken: "Bekeken",
  gesprek: "In gesprek",
  voorgesteld: "Voorgesteld aan klant",
  geplaatst: "Geplaatst",
  afgewezen: "Afgewezen",
};

export type BerichtStatus = "nieuw" | "bekeken" | "afgehandeld";
export const BERICHT_LABEL: Record<BerichtStatus, string> = { nieuw: "Nieuw", bekeken: "Bekeken", afgehandeld: "Afgehandeld" };

export type Sollicitatie = {
  id: string;
  vacature_id: string | null;
  voornaam: string;
  achternaam: string;
  email: string;
  telefoon: string;
  cv_path: string | null;
  status: SollicitatieStatus;
  notities: string;
  created_at: string;
  updated_at: string;
};

export type ContactOnderwerp = "job" | "talent" | "anders";

export type Contactbericht = {
  id: string;
  onderwerp: ContactOnderwerp;
  naam: string;
  email: string;
  telefoon: string | null;
  bedrijf: string | null;
  profiel: string | null;
  bericht: string;
  cv_path: string | null;
  status: BerichtStatus;
  notities: string;
  created_at: string;
  updated_at: string;
};

export type Alert = { email: string; domein: Domein | null; token: string; created_at: string };

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

export function lines(s: string | null | undefined): string[] {
  return (s || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function isNieuw(v: Pick<Vacature, "published_at" | "created_at">): boolean {
  const d = new Date(v.published_at || v.created_at).getTime();
  return Date.now() - d < 1000 * 60 * 60 * 24 * 10; // 10 dagen
}

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
