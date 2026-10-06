-- Alleen nodig als je schema.sql al uitvoerde vóór de uitbreiding van het beheerscherm.
-- Nieuwe installaties: gewoon schema.sql gebruiken.

alter table public.team add column if not exists zichtbaar boolean not null default true;
alter table public.vacatures add column if not exists alert_verstuurd_at timestamptz;

alter table public.sollicitaties drop constraint if exists sollicitaties_status_check;
alter table public.sollicitaties add constraint sollicitaties_status_check
  check (status in ('nieuw', 'bekeken', 'gesprek', 'voorgesteld', 'geplaatst', 'afgewezen'));
alter table public.sollicitaties add column if not exists notities text not null default '';
alter table public.sollicitaties add column if not exists updated_at timestamptz not null default now();

alter table public.berichten drop constraint if exists berichten_status_check;
alter table public.berichten add constraint berichten_status_check check (status in ('nieuw', 'bekeken', 'afgehandeld'));
alter table public.berichten add column if not exists notities text not null default '';
alter table public.berichten add column if not exists updated_at timestamptz not null default now();

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists sollicitaties_touch on public.sollicitaties;
create trigger sollicitaties_touch before update on public.sollicitaties for each row execute function public.touch_updated_at();
drop trigger if exists berichten_touch on public.berichten;
create trigger berichten_touch before update on public.berichten for each row execute function public.touch_updated_at();

alter table public.vacature_alerts add column if not exists domein text check (domein in ('Finance', 'Data', 'IT'));
alter table public.vacature_alerts add column if not exists token uuid not null unique default gen_random_uuid();

create table if not exists public.inhoud (
  sleutel text primary key,
  waarde jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
drop trigger if exists inhoud_touch on public.inhoud;
create trigger inhoud_touch before update on public.inhoud for each row execute function public.touch_updated_at();
alter table public.inhoud enable row level security;

drop policy if exists "beheerders lezen zichzelf" on public.beheerders;
drop policy if exists "beheerders beheer" on public.beheerders;
create policy "beheerders beheer" on public.beheerders for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "alerts beheer" on public.vacature_alerts;
create policy "alerts beheer" on public.vacature_alerts for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "inhoud publiek" on public.inhoud;
create policy "inhoud publiek" on public.inhoud for select using (sleutel <> 'instellingen' or public.is_admin());
drop policy if exists "inhoud beheer" on public.inhoud;
create policy "inhoud beheer" on public.inhoud for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 3145728, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'])
on conflict (id) do nothing;
