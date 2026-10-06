# Trengix-website

De nieuwe trengix.be, gebouwd op basis van het prototype in het Design-canvas.
Next.js 16 (App Router) + Supabase (database, login, cv-opslag), te hosten op Vercel.

## Wat zit erin

| Pagina | Pad |
| --- | --- |
| Home (kandidaat/werkgever-schakelaar, match-animatie, methode, vacatures, getuigenissen) | `/` |
| Vacatures met zoeken, filter op domein en vacature-alert | `/vacatures` |
| Vacature-detail met sollicitatieformulier en cv-upload | `/vacatures/[slug]` |
| Voor werkgevers (methode, No Cure No Pay / exclusieve search, FAQ) | `/werkgevers` |
| Over ons: het team | `/over-ons` |
| Contact (onderwerp kiezen; met `?onderwerp=job\|talent\|anders`) | `/contact` |
| Privacy, cookies, voorwaarden (tekst nog in te vullen) | `/privacy`, `/cookies`, `/voorwaarden` |
| **Beheer** (login met e-mailcode) | `/beheer` |

### Beheerscherm (`/beheer`)

| Onderdeel | Wat je er doet |
| --- | --- |
| **Vacatures** | Aanmaken, bewerken met live voorbeeld, dupliceren, online/offline zetten, verwijderen. Zie per vacature hoeveel (nieuwe) sollicitaties er zijn. |
| **Sollicitaties** | Pipeline per kandidaat (nieuw, bekeken, in gesprek, voorgesteld, geplaatst, afgewezen), filteren op status en vacature, zoeken, interne notities, cv openen, mailen/bellen, verwijderen (met cv), CSV-export voor Excel. |
| **Berichten** | Alles uit het contactformulier, met status, notities, cv, filter op onderwerp en verwijderen. |
| **Team** | Teamleden toevoegen en bewerken met foto-upload en live voorbeeld, volgorde aanpassen, tonen of verbergen op Over ons, consultant ja/nee. |
| **Inhoud** | Alle vaste teksten van de site: home, getuigenissen, klantlogo's (upload), vacatureteksten en bevestigingsmail, werkgeverspagina (stappen, modellen, FAQ), Over ons, contact en de juridische pagina's. |
| **Vacature-alerts** | Wie zich inschreef (per domein), uitschrijven, CSV-export. Abonnees krijgen automatisch één mail zodra een vacature in hun domein voor het eerst online komt. |
| **Instellingen** | Bedrijfsgegevens (telefoon, e-mail, adres, ondernemingsnummer, LinkedIn), adres voor meldingen, bewaartermijn voor cv's, beheerders toevoegen/verwijderen, systeemstatus. |

Wat je opslaat staat meteen op de site (pagina's worden on-demand ververst, geen nieuwe deploy nodig).

Automatisch:
- Nieuwe sollicitatie: mail naar de consultant van de vacature (anders naar het meldingenadres) en een bevestigingsmail naar de kandidaat.
- Nieuw contactbericht: mail naar het meldingenadres.
- Elke nacht om 3u: sollicitaties en berichten ouder dan de bewaartermijn worden verwijderd, cv's inbegrepen (GDPR).

Alles tussen `[vierkante haken]` is nog in te vullen inhoud, net als in het prototype. Dat kan nu volledig via het beheerscherm.

## Lokaal draaien (demomodus)

```bash
npm install
npm run dev        # http://localhost:3000
```

Zonder Supabase-sleutels draait de site in **demomodus**: voorbeelddata, formulieren werken maar
worden alleen in het geheugen bewaard, en `/beheer` is open. Handig om alles te bekijken.

## Live zetten

### 1. Supabase (database, login en cv-opslag)

1. Maak een project op [supabase.com](https://supabase.com) (regio **EU (Frankfurt)** of een andere EU-regio, voor de GDPR).
2. **SQL Editor**: voer `supabase/schema.sql` uit, daarna `supabase/seed.sql` (pas eerst de e-mailadressen van de beheerders aan).
   Had je `schema.sql` al uitgevoerd vóór de uitbreiding van het beheerscherm? Voer dan `supabase/migrations/002_volledig_beheer.sql` uit.
3. **Authentication > Emails > Templates > Magic Link**: zet de code in de mail, bijvoorbeeld:
   `Je inlogcode voor het Trengix-beheer: {{ .Token }}`
4. **Authentication > SMTP**: koppel een eigen mailserver (bv. Resend of Microsoft 365). De ingebouwde Supabase-mailer is alleen voor testen en stuurt maar enkele mails per uur.
5. Noteer onder **Project Settings > API**: Project URL, `anon`-sleutel en `service_role`-sleutel.

Daarna voeg je beheerders en teamleden toe in het beheerscherm zelf (Instellingen en Team).

### 2. Code op GitHub

```bash
git remote add origin git@github.com:<organisatie>/trengix-site.git
git push -u origin main
```

### 3. Netlify (hosting)

1. Op [netlify.com](https://netlify.com): **Add new project > Import an existing project > GitHub** en kies de repo. Netlify herkent Next.js zelf (`netlify.toml` staat klaar).
2. Zet onder **Project configuration > Environment variables** de waarden uit `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (eerst het testadres `https://<naam>.netlify.app`, later `https://trengix.be`)
   - `RESEND_API_KEY` en `MAIL_FROM` voor alle mails. Verifieer het domein trengix.be in Resend.
   - `CRON_SECRET`: een lange willekeurige tekst, voor de nachtelijke opruimtaak
   - optioneel `MAIL_FALLBACK_TO` en `NEXT_PUBLIC_GA_ID`
3. **Deploy**. Wijzig je later een variabele die met `NEXT_PUBLIC_` begint, deploy dan opnieuw.
4. Opruimtaak: `netlify/functions/opruimen.mjs` draait elke nacht om 3u (UTC) en roept `/api/cron/opruimen` aan.
5. Op het Pro-plan: **Project configuration > Functions > Region** op **EU (Frankfurt)** zetten en opnieuw deployen. Op Free/Personal draaien de serverfuncties in de VS (Ohio); de gegevens zelf blijven in Supabase in de EU.
6. **Domain management**: voeg `trengix.be` en `www.trengix.be` toe en pas de DNS aan zoals Netlify aangeeft. Raak de MX-records (mail via Microsoft 365) niet aan. Doe dit pas wanneer de Framer-site mag verdwijnen.

Uploads (cv's, foto's) zijn beperkt tot 4 MB, omdat serverfuncties op Netlify maximaal 6 MB per verzoek aanvaarden.

Liever Vercel? Dat kan ook: `vercel.json` staat klaar (regio Frankfurt en de nachtelijke taak via Vercel Cron).

## Cookiemelding en Google Analytics

- Zet `NEXT_PUBLIC_GA_ID` (bv. `G-ABC123XYZ`) in Vercel en deploy opnieuw. Zonder die waarde is er geen Analytics en ook geen cookiemelding.
- De melding volgt de richtlijnen van de GBA: "Weigeren" en "Alles accepteren" staan even groot naast elkaar, niets is vooraf aangevinkt, en via "Cookie-instellingen" in de footer pas je je keuze altijd aan. De keuze blijft 6 maanden geldig.
- Google Consent Mode v2, basisvariant: het Google-script laadt pas na toestemming. Advertentieopslag en Google-signalen staan altijd uit.
- Gemeten gebeurtenissen (zonder persoonsgegevens): `sollicitatie_verstuurd`, `contact_verstuurd`, `vacature_alert_inschrijving`. Markeer ze in GA4 als belangrijke gebeurtenis (conversie).
- Instellen in GA4: Beheer > Gegevensverzameling: Google-signalen uit; Gegevensbewaring: 14 maanden (en pas de cookiebeleidtekst aan als je iets anders kiest); Domeinen: trengix.be.
- Komt er later een andere tool bij (bv. LinkedIn Insight Tag), verhoog dan `CONSENT_VERSION` in `lib/consent.ts`, zodat iedereen opnieuw gevraagd wordt.

## Nog te doen voor livegang

- Echte teksten, teamfoto's en klantlogo's invullen via het beheerscherm.
- Privacyverklaring en cookiebeleid laten opstellen en plakken onder Inhoud > Juridisch; bewaartermijn bevestigen onder Instellingen.
- Inloggen testen met een beheerdersadres, een testsollicitatie en een testalert doen.

## Technisch

- `app/(site)`: publieke pagina's · `app/beheer`: beheerscherm · `components/`: UI
- `lib/data.ts` (publieke data) · `lib/admin.ts` (beheerdata) · `lib/actions/` (server actions)
- `lib/content.ts`: alle bewerkbare teksten (standaardwaarden + velden in het beheerscherm). Een nieuw tekstveld toevoegen = één regel daar.
- `proxy.ts` ververst de loginsessie op `/beheer`
- `app/api/cron/opruimen`: nachtelijke opruimtaak (Vercel Cron, zie `vercel.json`)
- Row Level Security: het publiek leest enkel online vacatures en het team; formulieren schrijven via de server; cv's staan in een privé-bucket en openen via een link die 2 minuten geldig is; foto's en logo's staan in de publieke bucket `media`.
- Lettertype Space Grotesk is zelf gehost (`app/fonts`), dus geen verzoeken naar Google.
- Controleren: `npm run lint` (TypeScript) en `npm run build`.
