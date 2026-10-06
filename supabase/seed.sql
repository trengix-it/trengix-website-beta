-- Startdata. Pas namen en e-mailadressen aan voor je dit uitvoert.

-- Wie mag inloggen op /beheer (kleine letters):
insert into public.beheerders (email, naam) values
  ('seppe@trengix.be', 'Seppe Lenaerts');

-- Team (vul aan via Supabase > Table Editor > team)
insert into public.team (naam, rol, email, volgorde, is_consultant) values
  ('[Naam 1]', '[Functie]', null, 1, true),
  ('[Naam 2]', '[Functie]', null, 2, true),
  ('[Naam 3]', '[Functie]', null, 3, true);

-- Voorbeeldvacature (als concept, zodat ze niet meteen online staat)
insert into public.vacatures (slug, title, domein, regio, intro, redenen, bedrijf, taken, profiel, aanbod, status, consultant_id)
select 'business-controller-antwerpen', 'Business Controller', 'Finance', 'Antwerpen',
  '[Openingszin van de vacature: wat deze rol bijzonder maakt.]',
  E'[Reden 1 waarom deze rol]\n[Reden 2]\n[Reden 3]',
  '[Omschrijving van de klant.]',
  E'[Taak of verantwoordelijkheid]\n[Taak of verantwoordelijkheid]',
  E'[Ervaring of opleiding]\n[Vaardigheid]\n[Taalkennis]',
  '[Verloning, extralegale voordelen en werkregeling.]',
  'Concept', (select id from public.team order by volgorde limit 1);
