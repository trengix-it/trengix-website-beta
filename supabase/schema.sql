-- =====================================================================
-- Trengix website: databaseschema voor Supabase
-- Uitvoeren in Supabase > SQL Editor (eenmalig, op een leeg project).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- Beheerders: wie mag inloggen op /beheer ----------
create table public.beheerders (
  email text primary key check (email = lower(email)),
  naam text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.beheerders where email = lower(auth.jwt() ->> 'email'));
$$;

-- ---------- Team ----------
create table public.team (
  id uuid primary key default gen_random_uuid(),
  naam text not null,
  rol text not null default '',
  email text,
  telefoon text,
  bio text not null default '',
  motto text not null default '',
  focus text not null default '',
  talen text not null default '',
  linkedin text,
  foto_url text,
  boodschap text not null default '',
  is_consultant boolean not null default true,
  zichtbaar boolean not null default true,
  volgorde int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Vacatures ----------
create table public.vacatures (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  domein text not null check (domein in ('Finance', 'Data', 'IT')),
  regio text not null default '',
  contract text not null default 'Vast contract',
  uren text not null default 'Voltijds',
  intro text not null default '',
  redenen text not null default '',
  bedrijf text not null default '',
  taken text not null default '',
  profiel text not null default '',
  aanbod text not null default '',
  consultant_id uuid references public.team (id) on delete set null,
  status text not null default 'Concept' check (status in ('Concept', 'Online', 'Ingevuld')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  alert_verstuurd_at timestamptz
);
create index vacatures_status_idx on public.vacatures (status, published_at desc);

create or replace function public.vacatures_touch() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  if new.status = 'Online' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end $$;
create trigger vacatures_touch before insert or update on public.vacatures
  for each row execute function public.vacatures_touch();

-- ---------- Sollicitaties ----------
create table public.sollicitaties (
  id uuid primary key default gen_random_uuid(),
  vacature_id uuid references public.vacatures (id) on delete set null,
  voornaam text not null,
  achternaam text not null,
  email text not null,
  telefoon text not null,
  cv_path text,
  status text not null default 'nieuw'
    check (status in ('nieuw', 'bekeken', 'gesprek', 'voorgesteld', 'geplaatst', 'afgewezen')),
  notities text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index sollicitaties_created_idx on public.sollicitaties (created_at desc);

-- ---------- Contactberichten ----------
create table public.berichten (
  id uuid primary key default gen_random_uuid(),
  onderwerp text not null check (onderwerp in ('job', 'talent', 'anders')),
  naam text not null,
  email text not null,
  telefoon text,
  bedrijf text,
  profiel text,
  bericht text not null,
  cv_path text,
  status text not null default 'nieuw' check (status in ('nieuw', 'bekeken', 'afgehandeld')),
  notities text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;
create trigger sollicitaties_touch before update on public.sollicitaties for each row execute function public.touch_updated_at();
create trigger berichten_touch before update on public.berichten for each row execute function public.touch_updated_at();

-- ---------- Vacature-alerts ----------
create table public.vacature_alerts (
  email text primary key,
  domein text check (domein in ('Finance', 'Data', 'IT')),
  token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);

-- ---------- Bewerkbare sitetekst (beheer > Inhoud en Instellingen) ----------
create table public.inhoud (
  sleutel text primary key,
  waarde jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create trigger inhoud_touch before update on public.inhoud for each row execute function public.touch_updated_at();

-- =====================================================================
-- Row Level Security
-- Publiek (anon) leest enkel het team en online vacatures.
-- Formulieren schrijven server-side met de service-role-sleutel.
-- Ingelogde beheerders (tabel beheerders) mogen alles lezen en beheren.
-- =====================================================================
alter table public.beheerders enable row level security;
alter table public.team enable row level security;
alter table public.vacatures enable row level security;
alter table public.sollicitaties enable row level security;
alter table public.berichten enable row level security;
alter table public.vacature_alerts enable row level security;
alter table public.inhoud enable row level security;

create policy "beheerders beheer" on public.beheerders for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "team publiek" on public.team for select using (true);
create policy "team beheer" on public.team for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "online vacatures publiek" on public.vacatures for select using (status = 'Online');
create policy "vacatures beheer" on public.vacatures for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "sollicitaties beheer" on public.sollicitaties for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "berichten beheer" on public.berichten for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "alerts beheer" on public.vacature_alerts for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Sitetekst is publiek leesbaar, behalve de interne instellingen.
create policy "inhoud publiek" on public.inhoud for select using (sleutel <> 'instellingen' or public.is_admin());
create policy "inhoud beheer" on public.inhoud for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Opslag voor cv's (privé) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cv', 'cv', false, 5242880, array[
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream'
])
on conflict (id) do nothing;

-- Publieke opslag voor teamfoto's en klantlogo's (uploads gebeuren server-side).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 3145728, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'])
on conflict (id) do nothing;

create policy "cv lezen door beheer" on storage.objects for select to authenticated
  using (bucket_id = 'cv' and public.is_admin());
create policy "cv verwijderen door beheer" on storage.objects for delete to authenticated
  using (bucket_id = 'cv' and public.is_admin());
