/**
 * Netlify Scheduled Function: elke nacht om 3u (UTC) de opruimtaak van de site aanroepen.
 * Verwijdert sollicitaties, berichten en cv's ouder dan de bewaartermijn (beheer > Instellingen).
 */
export default async () => {
  const base = process.env.URL; // door Netlify ingesteld: het hoofdadres van de site
  const secret = process.env.CRON_SECRET;
  if (!base || !secret) {
    console.log("Opruimen overgeslagen: URL of CRON_SECRET ontbreekt.");
    return;
  }
  const res = await fetch(`${base}/api/cron/opruimen`, { headers: { authorization: `Bearer ${secret}` } });
  console.log("Opruimen:", res.status, await res.text());
};

export const config = { schedule: "0 3 * * *" };
