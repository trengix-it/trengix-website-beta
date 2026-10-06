/**
 * Alle bewerkbare sitetekst. DEFAULTS bepaalt de vorm én de startinhoud;
 * SECTIONS beschrijft hoe het beheerscherm elk veld toont.
 * Wat in de database (tabel `inhoud`) staat, overschrijft de defaults per veld.
 */

export const DEFAULTS = {
  bedrijf: {
    telefoon: "[Algemeen telefoonnummer]",
    email: "[Algemeen e-mailadres]",
    straat: "Desguinlei 100-35",
    postcode: "2018",
    stad: "Antwerpen",
    openingsuren: "[Openingsuren]",
    juridisch: "[Juridische entiteit en ondernemingsnummer]",
    linkedin: "",
  },
  home: {
    lead_kandidaat: "Je volgende job begint met een gesprek over wat jij wil. Niet met een lijst vereisten.",
    lead_werkgever: "Niche-profielen snel ingevuld, omdat we eerst begrijpen wat je team echt nodig heeft.",
    deur_kandidaat: "[Wat een kandidaat van Trengix mag verwachten, in één zin.]",
    deur_werkgever: "[Wat een werkgever van Trengix mag verwachten, in één zin.]",
    methode_intro: "[Twee zinnen over waarom deze methode niche-profielen sneller invult.]",
    methode_stappen: [
      { title: "Luisteren", text: "[Hoe het eerste gesprek verloopt en wat we willen weten.]" },
      { title: "Scherpstellen", text: "[Hoe we de echte behoefte vertalen naar een haalbaar profiel.]" },
      { title: "Selecteren", text: "[Hoe we enkel voorstellen wat echt past, en hoe snel.]" },
      { title: "Matchen", text: "[Begeleiding tot de start en opvolging daarna.]" },
    ],
    team_intro: "[Eén zin over wie jullie consultants zijn en hoe ze werken.]",
    cta_kandidaat: "Klaar voor een eerlijk gesprek?",
    cta_werkgever: "Een profiel dat niemand vindt?",
  },
  getuigenissen: {
    items: [
      { text: "[Citaat van een klant over hoe snel en gericht de samenwerking verliep.]", naam: "[Naam]", rol: "[Functie] bij [bedrijf]" },
      { text: "[Citaat van een kandidaat over hoe goed er geluisterd werd.]", naam: "[Naam]", rol: "[Functie] bij [bedrijf]" },
      { text: "[Citaat van een klant over de kwaliteit van de shortlist.]", naam: "[Naam]", rol: "[Functie] bij [bedrijf]" },
    ],
  },
  klanten: {
    items: [] as { naam: string; logo: string }[],
  },
  vacatures: {
    lead: "Elke vacature hier kennen we van binnenuit. We spraken met de werkgever voor ze online kwam.",
    spontaan: "Veel vacatures vullen we in voor ze online staan. Laat je cv achter, dan bellen we je bij een match.",
    bevestiging: "{consultant} belt je binnen [termijn] voor een eerste gesprek.",
    mail_kandidaat:
      "Dag {voornaam},\n\nBedankt voor je sollicitatie voor {vacature}. {consultant} bekijkt je cv en belt je binnen [termijn] voor een eerste gesprek.\n\nTot snel,\nTrengix",
  },
  werkgevers: {
    belofte: "[Belofte aan werkgevers: snelheid op niche-profielen dankzij jullie methode.]",
    methode_intro: "[Twee zinnen over waarom deze methode niche-profielen sneller invult.]",
    methode_stappen: [
      { title: "Intake", text: "[Hoe we het team, de cultuur en de echte behoefte leren kennen.]" },
      { title: "Profielschets", text: "[Hoe we de vacature scherpstellen tot een haalbaar profiel.]" },
      { title: "Shortlist", text: "[Hoe snel en hoe grondig kandidaten worden voorgesteld.]" },
      { title: "Plaatsing", text: "[Opvolging na de start en de garantie die daarbij hoort.]" },
    ],
    ncnp_tekst: "Je betaalt pas wanneer we iemand plaatsen.",
    ncnp_punten: ["[Voor wie dit model past]", "[Honorarium]", "[Garantieperiode]"],
    excl_tekst: "Eén partner met volle focus op je vacature.",
    excl_punten: ["[Werkwijze]", "[Timing]", "[Wanneer exclusiviteit loont]"],
    faq: [
      { q: "Hoe snel krijg ik een eerste shortlist?", a: "[Antwoord]" },
      { q: "Wat kost een plaatsing?", a: "[Antwoord]" },
      { q: "Wat als de kandidaat niet blijft?", a: "[Antwoord]" },
      { q: "Voor welke profielen kan ik bij jullie terecht?", a: "[Antwoord]" },
    ],
  },
  overons: {
    lead: "Een match begint bij iemand die luistert. Dit zijn de mensen die dat elke dag doen.",
    principes: [
      { title: "[Principe 1]", text: "[Korte uitleg]" },
      { title: "[Principe 2]", text: "[Korte uitleg]" },
      { title: "[Principe 3]", text: "[Korte uitleg]" },
    ],
  },
  contact: {
    bevestiging: "[Wie je bericht oppikt en binnen welke termijn je antwoord krijgt.]",
    langskomen: "[Parkeren, openbaar vervoer en of je vooraf een afspraak maakt.]",
  },
  juridisch: {
    privacy: "[Tekst volgt. Laat deze tekst juridisch nalezen voor de site live gaat.]",
    cookies:
      "## Wat zijn cookies\nCookies zijn kleine tekstbestanden die een website op je toestel bewaart. Ze helpen de site te werken en tonen ons, als je dat toestaat, hoe de site gebruikt wordt.\n\n## Welke cookies we gebruiken\n- **Noodzakelijk:** trengix_consent onthoudt je cookiekeuze, gedurende 6 maanden. Hiervoor is geen toestemming nodig.\n- **Analytisch (alleen met je toestemming):** Google Analytics (_ga en _ga_*) meet welke pagina's bezocht worden en hoe bezoekers de site vinden. Bewaartermijn: maximaal [14] maanden. We delen deze gegevens niet voor advertentiedoeleinden en gebruiken geen Google-signalen.\n\nWe gebruiken geen advertentie- of trackingcookies van sociale netwerken.\n\n## Je keuze wijzigen\nJe kiest bij je eerste bezoek of je analytische cookies toestaat. Je kan die keuze altijd wijzigen via Cookie-instellingen onderaan elke pagina. Trek je je toestemming in, dan verwijderen we de analytische cookies meteen.\n\n## Vragen\nMeer over hoe we met je gegevens omgaan, lees je in onze [privacyverklaring](/privacy). Vragen stuur je naar [privacy-adres].",
    voorwaarden: "[Tekst volgt. Laat deze tekst juridisch nalezen voor de site live gaat.]",
  },
  instellingen: {
    bewaartermijn_maanden: "12",
    meldingen_email: "",
  },
};

export type Content = typeof DEFAULTS;
export type SectionId = keyof Content;

export type FieldDef =
  | { key: string; label: string; type: "text" | "textarea" | "markdown" | "email" | "number"; hint?: string }
  | { key: string; label: string; type: "list"; hint?: string }
  | { key: string; label: string; type: "items"; hint?: string; item: { key: string; label: string; type: "text" | "textarea" | "image" }[]; max?: number };

export type SectionDef = { id: SectionId; title: string; beschrijving: string; pagina?: string; fields: FieldDef[] };

const stappen = (label: string): FieldDef => ({
  key: "methode_stappen",
  label,
  type: "items",
  max: 4,
  hint: "Precies vier stappen. De titel staat op de knop, de tekst verschijnt als de stap open staat.",
  item: [
    { key: "title", label: "Titel", type: "text" },
    { key: "text", label: "Uitleg", type: "textarea" },
  ],
});

/** Volgorde en velden zoals ze in /beheer/inhoud verschijnen. */
export const SECTIONS: SectionDef[] = [
  {
    id: "home",
    title: "Home",
    pagina: "/",
    beschrijving: "Teksten op de startpagina.",
    fields: [
      { key: "lead_kandidaat", label: "Intro voor kandidaten", type: "textarea", hint: "Onder 'We listen, we match.' als 'Ik zoek een job' gekozen is." },
      { key: "lead_werkgever", label: "Intro voor werkgevers", type: "textarea", hint: "Als 'Ik zoek talent' gekozen is." },
      { key: "deur_kandidaat", label: "Kaart 'Voor kandidaten'", type: "textarea" },
      { key: "deur_werkgever", label: "Kaart 'Voor werkgevers'", type: "textarea" },
      { key: "methode_intro", label: "Methode: intro", type: "textarea" },
      stappen("Methode: stappen"),
      { key: "team_intro", label: "Blok 'Het team'", type: "textarea" },
      { key: "cta_kandidaat", label: "Slotzin voor kandidaten", type: "text" },
      { key: "cta_werkgever", label: "Slotzin voor werkgevers", type: "text" },
    ],
  },
  {
    id: "getuigenissen",
    title: "Getuigenissen",
    pagina: "/",
    beschrijving: "Citaten van klanten en kandidaten op de startpagina. Vraag altijd toestemming.",
    fields: [
      {
        key: "items",
        label: "Getuigenissen",
        type: "items",
        item: [
          { key: "text", label: "Citaat", type: "textarea" },
          { key: "naam", label: "Naam", type: "text" },
          { key: "rol", label: "Functie en bedrijf", type: "text" },
        ],
      },
    ],
  },
  {
    id: "klanten",
    title: "Klantlogo's",
    pagina: "/",
    beschrijving: "Logo's in de band 'Bedrijven die op ons rekenen'. Zonder logo's verdwijnt de band.",
    fields: [
      {
        key: "items",
        label: "Klanten",
        type: "items",
        hint: "Liefst een PNG of SVG met transparante achtergrond.",
        item: [
          { key: "naam", label: "Naam (voor schermlezers)", type: "text" },
          { key: "logo", label: "Logo", type: "image" },
        ],
      },
    ],
  },
  {
    id: "vacatures",
    title: "Vacatures",
    pagina: "/vacatures",
    beschrijving: "Vaste teksten rond de vacatures en het solliciteren.",
    fields: [
      { key: "lead", label: "Intro op de vacaturepagina", type: "textarea" },
      { key: "spontaan", label: "Kaart 'Je job staat er niet tussen?'", type: "textarea" },
      { key: "bevestiging", label: "Bevestiging na solliciteren", type: "textarea", hint: "{consultant} wordt vervangen door de naam van de consultant." },
      { key: "mail_kandidaat", label: "Bevestigingsmail aan de kandidaat", type: "textarea", hint: "Beschikbaar: {voornaam}, {vacature}, {consultant}. Wordt alleen verstuurd als mail is ingesteld." },
    ],
  },
  {
    id: "werkgevers",
    title: "Voor werkgevers",
    pagina: "/werkgevers",
    beschrijving: "Teksten op de pagina voor werkgevers.",
    fields: [
      { key: "belofte", label: "Belofte (intro)", type: "textarea" },
      { key: "methode_intro", label: "Methode: intro", type: "textarea" },
      stappen("Methode: stappen"),
      { key: "ncnp_tekst", label: "No Cure, No Pay: tekst", type: "textarea" },
      { key: "ncnp_punten", label: "No Cure, No Pay: punten", type: "list", hint: "Eén punt per regel." },
      { key: "excl_tekst", label: "Exclusieve search: tekst", type: "textarea" },
      { key: "excl_punten", label: "Exclusieve search: punten", type: "list", hint: "Eén punt per regel." },
      {
        key: "faq",
        label: "Veelgestelde vragen",
        type: "items",
        item: [
          { key: "q", label: "Vraag", type: "text" },
          { key: "a", label: "Antwoord", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "overons",
    title: "Over ons",
    pagina: "/over-ons",
    beschrijving: "Teksten op de teampagina. De teamleden zelf beheer je onder Team.",
    fields: [
      { key: "lead", label: "Intro", type: "textarea" },
      {
        key: "principes",
        label: "Principes",
        type: "items",
        max: 3,
        item: [
          { key: "title", label: "Titel", type: "text" },
          { key: "text", label: "Uitleg", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    pagina: "/contact",
    beschrijving: "Teksten op de contactpagina. Adres en telefoon staan onder Instellingen.",
    fields: [
      { key: "bevestiging", label: "Bevestiging na versturen", type: "textarea" },
      { key: "langskomen", label: "Langskomen", type: "textarea" },
    ],
  },
  {
    id: "juridisch",
    title: "Juridisch",
    pagina: "/privacy",
    beschrijving: "Privacyverklaring, cookiebeleid en gebruiksvoorwaarden.",
    fields: [
      { key: "privacy", label: "Privacyverklaring", type: "markdown" },
      { key: "cookies", label: "Cookiebeleid", type: "markdown" },
      { key: "voorwaarden", label: "Gebruiksvoorwaarden", type: "markdown" },
    ],
  },
];

/** Velden op de instellingenpagina. */
export const BEDRIJF_SECTION: SectionDef = {
  id: "bedrijf",
  title: "Bedrijfsgegevens",
  beschrijving: "Verschijnen in de footer, op de contactpagina en in de knoppen 'Bel ons'.",
  fields: [
    { key: "telefoon", label: "Telefoonnummer", type: "text", hint: "Bijvoorbeeld +32 3 123 45 67" },
    { key: "email", label: "E-mailadres", type: "email" },
    { key: "straat", label: "Straat en nummer", type: "text" },
    { key: "postcode", label: "Postcode", type: "text" },
    { key: "stad", label: "Gemeente", type: "text" },
    { key: "openingsuren", label: "Bereikbaar", type: "text" },
    { key: "juridisch", label: "Juridische entiteit en ondernemingsnummer", type: "text" },
    { key: "linkedin", label: "LinkedIn-pagina (URL)", type: "text" },
  ],
};

export const INSTELLINGEN_SECTION: SectionDef = {
  id: "instellingen",
  title: "Meldingen en privacy",
  beschrijving: "Waar meldingen naartoe gaan en hoe lang we cv's bewaren.",
  fields: [
    { key: "meldingen_email", label: "Meldingen naar", type: "email", hint: "Ontvangt contactberichten en sollicitaties zonder toegewezen consultant. Leeg = het adres uit de serverinstellingen." },
    { key: "bewaartermijn_maanden", label: "Bewaartermijn sollicitaties en berichten (maanden)", type: "number", hint: "Ouder wordt elke nacht automatisch verwijderd, cv's inbegrepen. 0 = nooit automatisch." },
  ],
};

/** Voegt opgeslagen waarden samen met de defaults (alleen bekende velden, juiste vorm). */
export function mergeContent(stored: Partial<Record<string, Record<string, unknown>>>): Content {
  const out = structuredClone(DEFAULTS) as Record<string, Record<string, unknown>>;
  for (const [sec, vals] of Object.entries(stored)) {
    if (!out[sec] || !vals) continue;
    for (const [k, v] of Object.entries(vals)) {
      const def = out[sec][k];
      if (def === undefined) continue;
      if (Array.isArray(def) ? Array.isArray(v) : typeof v === typeof def) out[sec][k] = v;
    }
  }
  return out as unknown as Content;
}

export const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

export const telHref = (tel: string) => (/\d{6,}/.test(tel.replace(/\D/g, "")) ? `tel:${tel.replace(/[^\d+]/g, "")}` : "");
export const mailHref = (m: string) => (/^[^@\s[\]]+@[^@\s]+\.[^@\s]+$/.test(m) ? `mailto:${m}` : "");
