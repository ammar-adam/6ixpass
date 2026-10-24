-- =============================================================================
-- The 6 Pass: real accounts for the app (members, businesses, staff, codes).
--
-- NOT RUN. Written for Ammar to review, then paste into
-- Supabase > SQL Editor > New query > Run. Steps and checks: docs/app/ACCOUNTS.md
--
-- Safe to run more than once (create if not exists / create or replace).
-- It never touches public.waitlist or its policies.
-- It needs no service role key: everything runs as the signed-in user, and
-- the rules live here, in Row Level Security and SECURITY DEFINER functions.
--
-- Contents
--   0. Private schema (not reachable through the API): settings, a secret
--      pepper for code hashes, confirm attempts for rate limits
--   1. Tables: profiles, passes, businesses, places, business_members,
--      staff_invites, saved_places, redemptions
--   2. Helper functions used by the policies
--   3. Row Level Security and column grants
--   4. Triggers: new user -> profile and pass; audit columns
--   5. Functions the app calls (RPC): my_businesses, accept_invites,
--      invite_staff, business_team, remove_team_member, issue_code,
--      cancel_code, confirm_code, place_visits, create_my_business,
--      delete_my_account
--   6. Execute grants (nothing for anon except what the policies need)
--   7. Adding a real partner (template, commented out)
--   8. Tests you can paste to prove the rules hold (all rolled back)
-- =============================================================================

begin;

create extension if not exists pgcrypto with schema extensions;

-- -----------------------------------------------------------------------------
-- 0. Private schema. Supabase's API only serves the schemas listed under
--    Settings > API > Exposed schemas (public by default), so nothing here is
--    reachable from the app. Only the SECURITY DEFINER functions below read it.
-- -----------------------------------------------------------------------------
create schema if not exists t6p_private;
revoke all on schema t6p_private from public, anon, authenticated;

create table if not exists t6p_private.settings (
  id boolean primary key default true check (id),
  -- New sign-ups get an active pass straight away. Keep false until payments
  -- exist; turn on for the beta (see ACCOUNTS.md) or activate passes by hand.
  open_beta boolean not null default false,
  pass_months int not null default 12 check (pass_months between 1 and 24),
  -- Mixed into every code hash, so a leaked hash can't be matched to a code
  -- by trying all million six-digit numbers without also having this.
  pepper text not null default encode(extensions.gen_random_bytes(32), 'hex'),
  code_minutes int not null default 10 check (code_minutes between 2 and 30),
  updated_at timestamptz not null default now()
);
insert into t6p_private.settings (id) values (true) on conflict (id) do nothing;
alter table t6p_private.settings enable row level security;

create table if not exists t6p_private.confirm_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  place_id text,
  ok boolean not null,
  at timestamptz not null default now()
);
create index if not exists confirm_attempts_user_at on t6p_private.confirm_attempts (user_id, at desc);
alter table t6p_private.confirm_attempts enable row level security;
revoke all on all tables in schema t6p_private from public, anon, authenticated;

-- -----------------------------------------------------------------------------
-- 1. Tables
-- -----------------------------------------------------------------------------

-- One row per signed-up person (created by a trigger on auth.users).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text check (char_length(first_name) <= 40),
  home_hood text check (char_length(home_hood) <= 60),
  work_hood text check (char_length(work_hood) <= 60),
  notify boolean,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The membership. Members can read their own; only Ammar (or, later, a
-- payment webhook with its own server key) changes status.
create sequence if not exists public.pass_number_seq start with 1001;
create table if not exists public.passes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  number int not null unique default nextval('public.pass_number_seq'),
  status text not null default 'pending' check (status in ('pending', 'active', 'cancelled')),
  tier text not null default 'pass' check (tier in ('pass', 'plus', 'black')),
  starts_on date,
  ends_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status <> 'active' or (starts_on is not null and ends_on is not null and ends_on > starts_on))
);

-- A business (a restaurant group, a spa, one café). Owns one or more places.
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null
);

-- A place members can visit, with its offer. The id matches the app's place id.
create table if not exists public.places (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]{1,59}$'),
  business_id uuid not null references public.businesses (id) on delete restrict,
  name text not null check (char_length(name) between 1 and 80),
  neighbourhood text check (char_length(neighbourhood) <= 60),
  category text check (category in ('restaurant', 'cafe', 'spa', 'studio', 'hotel', 'experience')),
  -- Only published places are visible to the public app.
  published boolean not null default false,
  offer text not null check (char_length(offer) between 3 and 120),
  offer_detail text check (char_length(offer_detail) <= 240),
  offer_kind text not null default 'two_for_one' check (offer_kind in ('two_for_one', 'upgrade')),
  -- Monday first. At least three days a week.
  days boolean[] not null default '{f,t,t,t,f,f,f}' check (cardinality(days) = 7 and cardinality(array_remove(days, false)) >= 3),
  uses_per_year int not null default 2 check (uses_per_year between 1 and 12),
  blackout_dates date[] not null default '{}' check (cardinality(blackout_dates) <= 120),
  paused boolean not null default false,
  saving int check (saving between 0 and 1000),
  timezone text not null default 'America/Toronto',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  -- Ontario (AGCO): no two-for-one on alcohol. Food, services and non-alcoholic drinks only.
  check (offer || ' ' || coalesce(offer_detail, '') !~* '\m(wine|beer|cocktails?|sake|spirits|prosecco|champagne|liquor|booze|happy hour|pints?|alcohol)\M')
);
create index if not exists places_business on public.places (business_id);

-- Who works where. Owner: edits the offer, sees every visit, manages the team.
-- Staff: confirms codes, sees today's visits.
create table if not exists public.business_members (
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'staff')),
  invited_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (business_id, user_id)
);
create index if not exists business_members_user on public.business_members (user_id);

-- Invites by email. Accepted when someone signs in with that (confirmed) email.
create table if not exists public.staff_invites (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  email text not null check (email = lower(email) and char_length(email) between 5 and 254),
  role text not null check (role in ('owner', 'staff')),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '14 days',
  accepted_at timestamptz,
  accepted_by uuid references auth.users (id) on delete set null,
  unique (business_id, email)
);

create table if not exists public.saved_places (
  user_id uuid not null references auth.users (id) on delete cascade,
  place_id text not null references public.places (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, place_id)
);

-- One row per code. The plain code is never stored: only a peppered hash.
-- A code is live while status = 'issued' and expires_at is in the future.
-- The partial unique index means two live codes can never share digits, and
-- confirm_code marks a code used in the same statement that checks it.
create table if not exists public.redemptions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references auth.users (id) on delete set null,
  place_id text not null references public.places (id) on delete restrict,
  code_hash text not null,
  status text not null default 'issued' check (status in ('issued', 'confirmed', 'cancelled', 'expired')),
  issued_at timestamptz not null default now(),
  expires_at timestamptz not null,
  confirmed_at timestamptz,
  confirmed_by uuid references auth.users (id) on delete set null,
  -- The offer as it was, so editing the offer later doesn't rewrite history.
  offer_text text not null,
  saving int,
  -- First name, shown to staff on confirm. Cleared when the member deletes their account.
  member_name text check (char_length(member_name) <= 40),
  check ((status = 'confirmed') = (confirmed_at is not null)),
  check (expires_at > issued_at)
);
create unique index if not exists redemptions_one_live_code on public.redemptions (code_hash) where status = 'issued';
create index if not exists redemptions_member on public.redemptions (member_id, issued_at desc);
create index if not exists redemptions_place on public.redemptions (place_id, confirmed_at desc) where status = 'confirmed';
create index if not exists redemptions_hash on public.redemptions (code_hash, issued_at desc);

-- -----------------------------------------------------------------------------
-- 2. Helpers for the policies. SECURITY DEFINER so a policy on one table can
--    look at business_members without tripping that table's own policies.
-- -----------------------------------------------------------------------------
create or replace function public.t6p_in_business(p_business uuid, p_owner_only boolean default false)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.business_members m
    where m.business_id = p_business and m.user_id = auth.uid() and (not p_owner_only or m.role = 'owner')
  );
$$;

-- 'owner', 'staff' or null: the caller's role at a place.
create or replace function public.t6p_role_at(p_place text)
returns text
language sql stable security definer set search_path = public
as $$
  select m.role from public.places p
  join public.business_members m on m.business_id = p.business_id
  where p.id = p_place and m.user_id = auth.uid()
  order by (m.role = 'owner') desc
  limit 1;
$$;

create or replace function public.t6p_code_hash(p_code text)
returns text
language sql stable security definer set search_path = public
as $$
  select encode(extensions.digest((select pepper from t6p_private.settings) || ':' || p_code, 'sha256'), 'hex');
$$;

-- -----------------------------------------------------------------------------
-- 3. Row Level Security. Every new table has it on. Policies are the only way
--    in; anything not listed is refused.
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.passes enable row level security;
alter table public.businesses enable row level security;
alter table public.places enable row level security;
alter table public.business_members enable row level security;
alter table public.staff_invites enable row level security;
alter table public.saved_places enable row level security;
alter table public.redemptions enable row level security;

-- Start from nothing, then grant only what each role needs.
revoke all on public.profiles, public.passes, public.businesses, public.places, public.business_members,
  public.staff_invites, public.saved_places, public.redemptions from anon, authenticated;
revoke all on sequence public.pass_number_seq from anon, authenticated;

-- profiles: your own row only. You can change your name, areas and notification choice; nothing else.
grant select on public.profiles to authenticated;
grant update (first_name, home_hood, work_hood, notify, onboarded) on public.profiles to authenticated;
drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles for select to authenticated using (id = auth.uid());
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- passes: read your own. No writes from the app.
grant select (id, user_id, number, status, tier, starts_on, ends_on) on public.passes to authenticated;
drop policy if exists "passes: read own" on public.passes;
create policy "passes: read own" on public.passes for select to authenticated using (user_id = auth.uid());

-- businesses: only people who work there can see them.
grant select (id, name) on public.businesses to authenticated;
drop policy if exists "businesses: read if on the team" on public.businesses;
create policy "businesses: read if on the team" on public.businesses for select to authenticated using (public.t6p_in_business(id));

-- places: everyone (signed in or not) sees published places and their offers.
-- The team also sees their own unpublished place. Only owners edit, and only the offer columns.
grant select (id, name, neighbourhood, category, published, offer, offer_detail, offer_kind, days, uses_per_year, blackout_dates, paused, saving) on public.places to anon, authenticated;
grant update (offer, offer_detail, offer_kind, days, uses_per_year, blackout_dates, paused) on public.places to authenticated;
drop policy if exists "places: read published" on public.places;
create policy "places: read published" on public.places for select to anon, authenticated using (published);
drop policy if exists "places: team reads own" on public.places;
create policy "places: team reads own" on public.places for select to authenticated using (public.t6p_in_business(business_id));
drop policy if exists "places: owners edit offer" on public.places;
create policy "places: owners edit offer" on public.places for update to authenticated
  using (public.t6p_in_business(business_id, true)) with check (public.t6p_in_business(business_id, true));

-- business_members: you see your own memberships. Owners list the team through business_team().
grant select (business_id, user_id, role) on public.business_members to authenticated;
drop policy if exists "business_members: read own" on public.business_members;
create policy "business_members: read own" on public.business_members for select to authenticated using (user_id = auth.uid());

-- staff_invites: no direct access at all (invite_staff, accept_invites, business_team).

-- saved_places: your own list.
grant select, insert, delete on public.saved_places to authenticated;
drop policy if exists "saved_places: read own" on public.saved_places;
create policy "saved_places: read own" on public.saved_places for select to authenticated using (user_id = auth.uid());
drop policy if exists "saved_places: add own" on public.saved_places;
create policy "saved_places: add own" on public.saved_places for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "saved_places: remove own" on public.saved_places;
create policy "saved_places: remove own" on public.saved_places for delete to authenticated using (user_id = auth.uid());

-- redemptions: members read their own visits (never the hash or who confirmed).
-- No inserts or updates from the app: issue_code, cancel_code and confirm_code do that.
grant select (id, place_id, status, issued_at, expires_at, confirmed_at, offer_text, saving) on public.redemptions to authenticated;
drop policy if exists "redemptions: read own" on public.redemptions;
create policy "redemptions: read own" on public.redemptions for select to authenticated using (member_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 4. Triggers
-- -----------------------------------------------------------------------------

-- A new account gets a profile and a pass. The pass is active straight away
-- only while open_beta is on; otherwise it waits for Ammar (or payments).
create or replace function public.t6p_on_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  s t6p_private.settings;
  today date := (now() at time zone 'America/Toronto')::date;
begin
  select * into s from t6p_private.settings where id;
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  insert into public.passes (user_id, status, starts_on, ends_on)
  values (
    new.id,
    case when s.open_beta then 'active' else 'pending' end,
    case when s.open_beta then today end,
    case when s.open_beta then (today + make_interval(months => s.pass_months))::date end
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists t6p_on_auth_user_created on auth.users;
create trigger t6p_on_auth_user_created after insert on auth.users
  for each row execute function public.t6p_on_new_user();

-- Accounts that existed before this script get a profile and a pass too.
insert into public.profiles (id) select id from auth.users on conflict (id) do nothing;
insert into public.passes (user_id) select id from auth.users on conflict (user_id) do nothing;

create or replace function public.t6p_touch()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  new.updated_at := now();
  if tg_table_name = 'places' then
    new.updated_by := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists t6p_profiles_touch on public.profiles;
create trigger t6p_profiles_touch before update on public.profiles for each row execute function public.t6p_touch();
drop trigger if exists t6p_places_touch on public.places;
create trigger t6p_places_touch before update on public.places for each row execute function public.t6p_touch();
drop trigger if exists t6p_passes_touch on public.passes;
create trigger t6p_passes_touch before update on public.passes for each row execute function public.t6p_touch();

-- -----------------------------------------------------------------------------
-- 5. Functions the app calls. All SECURITY DEFINER with a fixed search_path,
--    all check auth.uid() themselves, all refuse anon (section 6).
--    Errors are short codes the app turns into plain words.
-- -----------------------------------------------------------------------------

-- The businesses and places the caller works at.
create or replace function public.my_businesses()
returns table (business_id uuid, business_name text, role text, place_ids text[])
language sql stable security definer set search_path = public
as $$
  select b.id, b.name, m.role, coalesce(array_agg(p.id order by p.name) filter (where p.id is not null), '{}')
  from public.business_members m
  join public.businesses b on b.id = m.business_id
  left join public.places p on p.business_id = b.id
  where m.user_id = auth.uid()
  group by b.id, b.name, m.role
  order by b.name;
$$;

-- Turn pending invites for the caller's confirmed email into team memberships.
create or replace function public.accept_invites()
returns int
language plpgsql security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  my_email text;
  n int := 0;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  -- Only a confirmed email counts, so nobody can claim an invite by typing someone else's address.
  select lower(email) into my_email from auth.users where id = uid and email_confirmed_at is not null;
  if my_email is null then return 0; end if;

  insert into public.business_members (business_id, user_id, role, invited_by)
  select i.business_id, uid, i.role, i.created_by
  from public.staff_invites i
  where i.email = my_email and i.accepted_at is null and i.expires_at > now()
  on conflict (business_id, user_id) do nothing;
  get diagnostics n = row_count;

  update public.staff_invites set accepted_at = now(), accepted_by = uid
  where email = my_email and accepted_at is null and expires_at > now();
  return n;
end;
$$;

-- Owners invite someone by email as Owner or Staff.
create or replace function public.invite_staff(p_business uuid, p_email text, p_role text)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  e text := lower(trim(p_email));
  inv uuid;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  if not public.t6p_in_business(p_business, true) then raise exception 'not_owner'; end if;
  if p_role not in ('owner', 'staff') then raise exception 'bad_role'; end if;
  if e !~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' or char_length(e) > 254 then raise exception 'invalid_email'; end if;
  if (select count(*) from public.staff_invites where business_id = p_business and accepted_at is null and expires_at > now()) >= 50 then
    raise exception 'rate_limited';
  end if;
  if exists (select 1 from public.business_members m join auth.users u on u.id = m.user_id where m.business_id = p_business and lower(u.email) = e) then
    raise exception 'already_on_team';
  end if;
  insert into public.staff_invites (business_id, email, role, created_by)
  values (p_business, e, p_role, auth.uid())
  on conflict (business_id, email) do update
    set role = excluded.role, created_by = excluded.created_by, created_at = now(),
        expires_at = now() + interval '14 days', accepted_at = null, accepted_by = null
  returning id into inv;
  return inv;
end;
$$;

-- Owners see the team: people and pending invites.
create or replace function public.business_team(p_business uuid)
returns table (id uuid, email text, role text, status text)
language plpgsql stable security definer set search_path = public
as $$
begin
  if not public.t6p_in_business(p_business, true) then raise exception 'not_owner'; end if;
  return query
    select m.user_id, u.email::text, m.role, 'active'::text
    from public.business_members m join auth.users u on u.id = m.user_id
    where m.business_id = p_business
    union all
    select i.id, i.email, i.role, 'invited'::text
    from public.staff_invites i
    where i.business_id = p_business and i.accepted_at is null and i.expires_at > now()
    order by 4, 3, 2;
end;
$$;

-- Owners remove a person or cancel an invite. A business always keeps one owner.
create or replace function public.remove_team_member(p_business uuid, p_id uuid, p_kind text)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not public.t6p_in_business(p_business, true) then raise exception 'not_owner'; end if;
  if p_kind = 'invited' then
    delete from public.staff_invites where id = p_id and business_id = p_business;
    return;
  end if;
  if (select role from public.business_members where business_id = p_business and user_id = p_id) = 'owner'
     and (select count(*) from public.business_members where business_id = p_business and role = 'owner') <= 1 then
    raise exception 'last_owner';
  end if;
  delete from public.business_members where business_id = p_business and user_id = p_id;
end;
$$;

-- Uses a member has had at a place in their current pass year.
create or replace function public.t6p_uses(p_member uuid, p_place text)
returns int
language sql stable security definer set search_path = public
as $$
  select count(*)::int from public.redemptions r
  where r.member_id = p_member and r.place_id = p_place and r.status = 'confirmed'
    and r.confirmed_at >= coalesce(
      (select starts_on from public.passes where user_id = p_member)::timestamptz,
      date_trunc('year', now())
    );
$$;

-- A member asks for a code. Every rule is checked here, not in the app.
create or replace function public.issue_code(p_place text)
returns table (redemption_id uuid, code text, issued_at timestamptz, expires_at timestamptz, offer_text text, saving int)
language plpgsql security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  s t6p_private.settings;
  pl public.places;
  pass public.passes;
  local_now timestamp;
  c text;
  rid uuid;
  tries int := 0;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  select * into s from t6p_private.settings where id;
  select * into pass from public.passes where user_id = uid;
  if pass.status is distinct from 'active' or pass.ends_on < current_date then raise exception 'no_pass'; end if;
  select * into pl from public.places where id = p_place and published;
  if not found then raise exception 'not_found'; end if;
  if pl.paused then raise exception 'paused'; end if;
  local_now := now() at time zone pl.timezone;
  if not pl.days[extract(isodow from local_now)::int] then raise exception 'not_today'; end if;
  if local_now::date = any (pl.blackout_dates) then raise exception 'blackout'; end if;
  if public.t6p_uses(uid, p_place) >= pl.uses_per_year then raise exception 'used_up'; end if;
  if (select count(*) from public.redemptions r where r.member_id = uid and r.issued_at > now() - interval '1 hour') >= 12 then
    raise exception 'rate_limited';
  end if;

  -- One live code per member per place: a new one replaces the old one.
  update public.redemptions r set status = 'cancelled' where r.member_id = uid and r.place_id = p_place and r.status = 'issued';
  -- Tidy codes that ran out, so their digits can be used again.
  update public.redemptions r set status = 'expired' where r.status = 'issued' and r.expires_at < now();

  loop
    tries := tries + 1;
    c := lpad(((('x' || encode(extensions.gen_random_bytes(4), 'hex'))::bit(32)::bigint) % 1000000)::text, 6, '0');
    begin
      insert into public.redemptions (member_id, place_id, code_hash, expires_at, offer_text, saving, member_name)
      values (uid, p_place, public.t6p_code_hash(c), now() + make_interval(mins => s.code_minutes), pl.offer, pl.saving,
              (select first_name from public.profiles where id = uid))
      returning id into rid;
      exit;
    exception when unique_violation then
      if tries >= 8 then raise exception 'busy'; end if;
    end;
  end loop;

  return query select r.id, c, r.issued_at, r.expires_at, r.offer_text, r.saving from public.redemptions r where r.id = rid;
end;
$$;

-- A member closes their code.
create or replace function public.cancel_code(p_redemption uuid)
returns void
language sql security definer set search_path = public
as $$
  update public.redemptions set status = 'cancelled'
  where id = p_redemption and member_id = auth.uid() and status = 'issued';
$$;

-- Staff check a code and mark it used, in one transaction. Only people on the
-- place's team can call it for that place. Wrong guesses are rate limited.
create or replace function public.confirm_code(p_place text, p_code text)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  digits text := regexp_replace(coalesce(p_code, ''), '\D', '', 'g');
  h text;
  r public.redemptions;
  pl public.places;
  used int;
  n int;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  if public.t6p_role_at(p_place) is null then return jsonb_build_object('result', 'not-allowed'); end if;
  if (select count(*) from t6p_private.confirm_attempts a where a.user_id = uid and not a.ok and a.at > now() - interval '10 minutes') >= 10 then
    return jsonb_build_object('result', 'rate-limited');
  end if;
  if digits !~ '^\d{6}$' then
    insert into t6p_private.confirm_attempts (user_id, place_id, ok) values (uid, p_place, false);
    return jsonb_build_object('result', 'unknown');
  end if;
  h := public.t6p_code_hash(digits);

  -- The live code with these digits, locked so two phones can't confirm it at once.
  select * into r from public.redemptions where code_hash = h and status = 'issued' for update;
  if not found then
    -- Not live: was it used or did it run out recently? Say so plainly.
    select * into r from public.redemptions
    where code_hash = h and place_id = p_place and issued_at > now() - interval '1 day'
    order by issued_at desc limit 1;
    if found and r.status = 'confirmed' then return jsonb_build_object('result', 'used'); end if;
    if found and r.status in ('expired', 'cancelled') then return jsonb_build_object('result', 'expired'); end if;
    insert into t6p_private.confirm_attempts (user_id, place_id, ok) values (uid, p_place, false);
    return jsonb_build_object('result', 'unknown');
  end if;

  if r.place_id <> p_place then return jsonb_build_object('result', 'wrong-place'); end if;
  if r.expires_at < now() then
    update public.redemptions set status = 'expired' where id = r.id;
    return jsonb_build_object('result', 'expired');
  end if;
  select * into pl from public.places where id = p_place;
  if pl.paused then return jsonb_build_object('result', 'paused'); end if;
  used := public.t6p_uses(r.member_id, p_place);
  if used >= pl.uses_per_year then return jsonb_build_object('result', 'used-up'); end if;

  update public.redemptions set status = 'confirmed', confirmed_at = now(), confirmed_by = uid
  where id = r.id and status = 'issued';
  get diagnostics n = row_count;
  if n = 0 then return jsonb_build_object('result', 'used'); end if;
  insert into t6p_private.confirm_attempts (user_id, place_id, ok) values (uid, p_place, true);

  return jsonb_build_object(
    'result', 'ok',
    'offer', r.offer_text,
    'member_name', coalesce(r.member_name, ''),
    'uses_left', pl.uses_per_year - used - 1,
    'uses_per_year', pl.uses_per_year
  );
end;
$$;

-- Visits at a place. Owners: up to 400 days back. Staff: today only.
create or replace function public.place_visits(p_place text, p_days int default 1)
returns table (id uuid, confirmed_at timestamptz, offer_text text, member_name text, saving int)
language plpgsql stable security definer set search_path = public
as $$
declare
  role text := public.t6p_role_at(p_place);
  tz text := (select timezone from public.places where places.id = p_place);
  since timestamptz;
begin
  if role is null then raise exception 'not_allowed'; end if;
  if role = 'owner' then
    since := now() - make_interval(days => least(greatest(coalesce(p_days, 1), 1), 400));
  else
    since := ((now() at time zone tz)::date)::timestamp at time zone tz;
  end if;
  return query
    select r.id, r.confirmed_at, r.offer_text, r.member_name, r.saving
    from public.redemptions r
    where r.place_id = p_place and r.status = 'confirmed' and r.confirmed_at >= since
    order by r.confirmed_at desc
    limit 500;
end;
$$;

-- A new business signs itself up from the app (I'm a business > New business).
-- The caller becomes the owner of a new business with one new place. The place
-- is NOT published: only the team sees it (policy "places: team reads own")
-- until Ammar sets published = true. At most 3 businesses per person.
-- Returns the new place id, a slug of the name ("corner-cafe", "corner-cafe-2").
create or replace function public.create_my_business(p_name text, p_neighbourhood text, p_category text)
returns text
language plpgsql security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  n text := btrim(regexp_replace(coalesce(p_name, ''), '\s+', ' ', 'g'));
  hood text := nullif(left(btrim(regexp_replace(coalesce(p_neighbourhood, ''), '\s+', ' ', 'g')), 60), '');
  cat text := case when p_category in ('restaurant', 'cafe', 'spa', 'studio', 'hotel', 'experience') then p_category end;
  base text;
  slug text;
  i int := 1;
  bid uuid;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  if char_length(n) < 1 or char_length(n) > 80 then raise exception 'invalid_name'; end if;
  -- One person signing up twice at once still counts as two.
  perform pg_advisory_xact_lock(hashtext('t6p_create_business:' || uid::text));
  if (select count(*) from public.businesses where created_by = uid) >= 3 then raise exception 'too_many_businesses'; end if;

  -- "Corner Café & Co." -> "corner-cafe-and-co"
  base := lower(n);
  base := translate(base, 'àáâäãåāçćčèéêëēėęìíîïīñńòóôöõøōùúûüūýÿžźż', 'aaaaaaaccceeeeeeeiiiiinnooooooouuuuuyyzzz');
  base := replace(base, '&', ' and ');
  base := btrim(regexp_replace(base, '[^a-z0-9]+', '-', 'g'), '-');
  base := btrim(left(base, 50), '-');
  if char_length(base) < 2 then base := btrim('place-' || base, '-'); end if;
  -- The app's own routes and ids (the query-based place page, Nida's demo place) are never used.
  slug := base;
  while slug in ('view', 'your-place', 'new') or exists (select 1 from public.places where id = slug) loop
    i := i + 1;
    slug := base || '-' || i;
  end loop;

  insert into public.businesses (name, created_by) values (n, uid) returning id into bid;
  insert into public.business_members (business_id, user_id, role) values (bid, uid, 'owner');
  insert into public.places (id, business_id, name, neighbourhood, category, published, offer)
  values (slug, bid, n, hood, cat, false, 'Second one, on us.');
  return slug;
end;
$$;

-- A member deletes their account. Their profile, pass and saved places go
-- with it; places keep the visit counts, without the name.
create or replace function public.delete_my_account()
returns void
language plpgsql security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  if exists (
    select 1 from public.business_members m
    where m.user_id = uid and m.role = 'owner'
      and (select count(*) from public.business_members o where o.business_id = m.business_id and o.role = 'owner') = 1
  ) then
    raise exception 'last_owner';
  end if;
  update public.redemptions set member_name = null, status = case when status = 'issued' then 'cancelled' else status end
  where member_id = uid;
  delete from auth.users where id = uid;
end;
$$;

-- -----------------------------------------------------------------------------
-- 6. Who may call what. Postgres lets everyone execute new functions by
--    default; take that away, then give each function to who needs it.
-- -----------------------------------------------------------------------------
revoke execute on function
  public.t6p_in_business(uuid, boolean), public.t6p_role_at(text), public.t6p_code_hash(text), public.t6p_uses(uuid, text),
  public.t6p_on_new_user(), public.t6p_touch(),
  public.my_businesses(), public.accept_invites(), public.invite_staff(uuid, text, text), public.business_team(uuid),
  public.remove_team_member(uuid, uuid, text), public.issue_code(text), public.cancel_code(uuid),
  public.confirm_code(text, text), public.place_visits(text, int), public.delete_my_account(),
  public.create_my_business(text, text, text)
from public, anon, authenticated;

-- The policies on places call this, for signed-in users and for the public read.
grant execute on function public.t6p_in_business(uuid, boolean) to anon, authenticated;
-- What the app calls, signed in only.
grant execute on function
  public.my_businesses(), public.accept_invites(), public.invite_staff(uuid, text, text), public.business_team(uuid),
  public.remove_team_member(uuid, uuid, text), public.issue_code(text), public.cancel_code(uuid),
  public.confirm_code(text, text), public.place_visits(text, int), public.delete_my_account(),
  public.create_my_business(text, text, text)
to authenticated;

commit;

-- =============================================================================
-- 7. Adding a real partner (run by Ammar in the SQL Editor; edit, then run).
--    The place id must match the app's place id. Nothing below runs unless you
--    remove the comment marks.
-- =============================================================================
-- with b as (
--   insert into public.businesses (name) values ('Business name') returning id
-- )
-- insert into public.places (id, business_id, name, neighbourhood, category, published, offer, offer_detail, offer_kind, days, uses_per_year, saving)
-- select 'place-id', b.id, 'Place name', 'Ossington', 'restaurant', true,
--        'Second main, on us.', 'Order two mains and the second one is on the house.', 'two_for_one',
--        '{f,t,t,t,t,f,f}', 2, 30
-- from b;
--
-- Invite the owner (they sign in with this email in the app: I'm a business > Email me a sign-in code):
-- insert into public.staff_invites (business_id, email, role)
-- select id, 'owner@their-domain.ca', 'owner' from public.businesses where name = 'Business name';
--
-- Turn a member's pass on by hand (before payments exist):
-- update public.passes set status = 'active', starts_on = current_date, ends_on = current_date + interval '12 months'
-- where user_id = (select id from auth.users where email = 'member@example.com');
--
-- Beta: every new sign-up gets an active pass straight away.
-- update t6p_private.settings set open_beta = true;

-- =============================================================================
-- 8. Tests. Paste this whole block into a new query and Run. It makes test
--    users, a test business and two test places, plays each role, and then
--    ROLLS BACK: nothing stays in the database. Any broken rule stops the run
--    with "FAIL: ...". A clean run ends with the notice "ALL CHECKS PASSED".
-- =============================================================================
/*
begin;

-- Test people (removed by the rollback at the end).
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-4000-8000-00000000000a', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 't6p-test-member@example.com', '', now(), now(), now(), '{}', '{}'),
  ('00000000-0000-4000-8000-00000000000b', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 't6p-test-owner@example.com', '', now(), now(), now(), '{}', '{}'),
  ('00000000-0000-4000-8000-00000000000c', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 't6p-test-staff@example.com', '', now(), now(), now(), '{}', '{}'),
  ('00000000-0000-4000-8000-00000000000d', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 't6p-test-stranger@example.com', '', now(), now(), now(), '{}', '{}');

do $$ begin
  assert (select count(*) from public.profiles where id::text like '00000000-0000-4000-8000-00000000000%') = 4, 'FAIL: new users did not get profiles';
  assert (select count(*) from public.passes where user_id::text like '00000000-0000-4000-8000-00000000000%') = 4, 'FAIL: new users did not get passes';
end $$;

update public.passes set status = 'active', starts_on = current_date, ends_on = current_date + 365
where user_id = '00000000-0000-4000-8000-00000000000a';
update public.profiles set first_name = 'Testy' where id = '00000000-0000-4000-8000-00000000000a';
insert into public.businesses (id, name) values ('00000000-0000-4000-8000-0000000000b1', 'T6P Test Business');
insert into public.places (id, business_id, name, published, offer, days, uses_per_year)
values ('t6p-test-place', '00000000-0000-4000-8000-0000000000b1', 'Test Place', true, 'Second main, on us.', '{t,t,t,t,t,t,t}', 1),
       ('t6p-test-other', '00000000-0000-4000-8000-0000000000b1', 'Test Other', true, 'Second coffee, on us.', '{t,t,t,t,t,t,t}', 2),
       ('t6p-test-hidden', '00000000-0000-4000-8000-0000000000b1', 'Test Hidden', false, 'Second main, on us.', '{t,t,t,t,t,t,t}', 2);
insert into public.business_members (business_id, user_id, role) values
  ('00000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-00000000000b', 'owner'),
  ('00000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-00000000000c', 'staff');

do $$ begin
  begin
    insert into public.places (id, business_id, name, published, offer, days) values ('t6p-test-wine', '00000000-0000-4000-8000-0000000000b1', 'X', true, 'Second glass of wine, on us.', '{t,t,t,t,t,t,t}');
    raise exception 'FAIL: an alcohol offer was accepted';
  exception when check_violation then raise notice 'ok: alcohol offers are refused';
  end;
  begin
    insert into public.places (id, business_id, name, published, offer, days) values ('t6p-test-days', '00000000-0000-4000-8000-0000000000b1', 'X', true, 'Second main, on us.', '{t,t,f,f,f,f,f}');
    raise exception 'FAIL: an offer on fewer than 3 days was accepted';
  exception when check_violation then raise notice 'ok: at least 3 days a week';
  end;
end $$;

-- ---- Anyone (not signed in)
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
do $$ begin
  assert (select count(*) from public.places where id like 't6p-test-%') = 2, 'FAIL: anon should see the 2 published test places only';
  begin perform 1 from public.redemptions limit 1; raise exception 'FAIL: anon read redemptions';
  exception when insufficient_privilege then raise notice 'ok: anon cannot read redemptions'; end;
  begin perform 1 from public.profiles limit 1; raise exception 'FAIL: anon read profiles';
  exception when insufficient_privilege then raise notice 'ok: anon cannot read profiles'; end;
  begin perform public.issue_code('t6p-test-place'); raise exception 'FAIL: anon issued a code';
  exception when insufficient_privilege then raise notice 'ok: anon cannot issue codes'; end;
  begin perform public.confirm_code('t6p-test-place', '123456'); raise exception 'FAIL: anon confirmed a code';
  exception when insufficient_privilege then raise notice 'ok: anon cannot confirm codes'; end;
end $$;
reset role;

-- ---- The member: gets a code
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000a","role":"authenticated"}', true);
select set_config('t6p.code', (select code from public.issue_code('t6p-test-place')), true);
select set_config('t6p.code_other', (select code from public.issue_code('t6p-test-other')), true);
do $$ begin
  assert current_setting('t6p.code') ~ '^\d{6}$', 'FAIL: no 6-digit code';
  assert (select count(*) from public.redemptions where status = 'issued') = 2, 'FAIL: member should see their 2 live codes';
  assert (select count(*) from public.profiles) = 1, 'FAIL: member sees other profiles';
  assert (select count(*) from public.business_members) = 0, 'FAIL: member sees team rows';
  assert (select count(*) from public.businesses) = 0, 'FAIL: member sees businesses';
  begin perform code_hash from public.redemptions limit 1; raise exception 'FAIL: member can read code hashes';
  exception when insufficient_privilege then raise notice 'ok: code hashes are hidden'; end;
  begin update public.passes set status = 'active'; raise exception 'FAIL: member can change a pass';
  exception when insufficient_privilege then raise notice 'ok: members cannot change passes'; end;
  begin insert into public.redemptions (member_id, place_id, code_hash, expires_at, offer_text) values (auth.uid(), 't6p-test-place', 'x', now() + interval '1 hour', 'x');
    raise exception 'FAIL: member inserted a redemption';
  exception when insufficient_privilege then raise notice 'ok: members cannot write redemptions'; end;
  assert (public.confirm_code('t6p-test-place', current_setting('t6p.code')) ->> 'result') = 'not-allowed', 'FAIL: a member confirmed their own code';
  begin perform public.issue_code('t6p-test-hidden'); raise exception 'FAIL: code for an unpublished place';
  exception when raise_exception then raise notice 'ok: no codes for unpublished places'; end;
end $$;
reset role;

-- ---- A stranger (signed in, not on the team)
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000d","role":"authenticated"}', true);
do $$ declare n int; begin
  assert (select count(*) from public.redemptions) = 0, 'FAIL: stranger sees someone else''s codes';
  update public.places set paused = true where id = 't6p-test-place';
  get diagnostics n = row_count;
  assert n = 0, 'FAIL: stranger paused a place';
  assert (public.confirm_code('t6p-test-place', current_setting('t6p.code')) ->> 'result') = 'not-allowed', 'FAIL: stranger confirmed a code';
  begin perform public.issue_code('t6p-test-place'); raise exception 'FAIL: stranger without an active pass got a code';
  exception when raise_exception then raise notice 'ok: no code without an active pass'; end;
end $$;
reset role;

-- ---- Staff: scans
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000c","role":"authenticated"}', true);
do $$ declare n int; r jsonb; begin
  assert (public.confirm_code('t6p-test-place', '000000') ->> 'result') in ('unknown'), 'FAIL: a made-up code was not refused';
  assert (public.confirm_code('t6p-test-place', current_setting('t6p.code_other')) ->> 'result') = 'wrong-place', 'FAIL: wrong place not caught';
  r := public.confirm_code('t6p-test-place', current_setting('t6p.code'));
  assert r ->> 'result' = 'ok', 'FAIL: the real code was not confirmed: ' || r::text;
  assert r ->> 'member_name' = 'Testy', 'FAIL: staff should see the first name';
  assert (public.confirm_code('t6p-test-place', current_setting('t6p.code')) ->> 'result') = 'used', 'FAIL: a code worked twice';
  update public.places set uses_per_year = 12 where id = 't6p-test-place';
  get diagnostics n = row_count;
  assert n = 0, 'FAIL: staff changed the offer';
  assert (select count(*) from public.place_visits('t6p-test-place', 400)) = 1, 'FAIL: staff should see today''s visit';
  begin perform public.business_team('00000000-0000-4000-8000-0000000000b1'); raise exception 'FAIL: staff listed the team';
  exception when raise_exception then raise notice 'ok: staff cannot manage the team'; end;
  begin perform public.invite_staff('00000000-0000-4000-8000-0000000000b1', 'x@example.com', 'owner'); raise exception 'FAIL: staff invited someone';
  exception when raise_exception then raise notice 'ok: staff cannot invite'; end;
end $$;
reset role;

-- ---- The member again: used up (1 use a year at the test place), and the visit is in their history
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000a","role":"authenticated"}', true);
do $$ begin
  assert (select count(*) from public.redemptions where status = 'confirmed') = 1, 'FAIL: the visit is not in the member''s history';
  begin perform public.issue_code('t6p-test-place'); raise exception 'FAIL: a code past the yearly limit';
  exception when raise_exception then raise notice 'ok: uses per year are enforced'; end;
end $$;
reset role;

-- An expired code is refused: age the other code, then staff try it.
update public.redemptions set issued_at = now() - interval '20 minutes', expires_at = now() - interval '10 minutes'
where place_id = 't6p-test-other' and status = 'issued';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000c","role":"authenticated"}', true);
do $$ begin
  assert (public.confirm_code('t6p-test-other', current_setting('t6p.code_other')) ->> 'result') = 'expired', 'FAIL: an expired code was accepted';
end $$;
reset role;

-- ---- Owner: edits the offer, sees the team, invites
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000b","role":"authenticated"}', true);
do $$ declare n int; begin
  update public.places set uses_per_year = 3 where id = 't6p-test-place';
  get diagnostics n = row_count;
  assert n = 1, 'FAIL: owner could not change the offer';
  begin update public.places set business_id = gen_random_uuid() where id = 't6p-test-place'; raise exception 'FAIL: owner moved a place to another business';
  exception when insufficient_privilege then raise notice 'ok: owners can only change the offer columns'; end;
  assert (select count(*) from public.business_team('00000000-0000-4000-8000-0000000000b1')) = 2, 'FAIL: owner should see 2 people';
  perform public.invite_staff('00000000-0000-4000-8000-0000000000b1', 'T6P-New-Staff@Example.com', 'staff');
  assert (select count(*) from public.business_team('00000000-0000-4000-8000-0000000000b1') where status = 'invited') = 1, 'FAIL: invite not listed';
  begin perform public.remove_team_member('00000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-00000000000b', 'active'); raise exception 'FAIL: removed the last owner';
  exception when raise_exception then raise notice 'ok: a business keeps its last owner'; end;
  assert (select count(*) from public.place_visits('t6p-test-place', 30)) = 1, 'FAIL: owner should see the visit';
end $$;
reset role;

-- ---- Rate limit: ten wrong guesses, then refused
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000c","role":"authenticated"}', true);
do $$ begin
  for i in 1..10 loop perform public.confirm_code('t6p-test-place', lpad(i::text, 6, '9')); end loop;
  assert (public.confirm_code('t6p-test-place', '111111') ->> 'result') = 'rate-limited', 'FAIL: wrong guesses are not rate limited';
  raise notice 'ok: wrong guesses are rate limited';
end $$;
reset role;

-- ---- A new business signs itself up (the stranger, who works nowhere yet)
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
do $$ begin
  begin perform public.create_my_business('Anon Cafe', 'Ossington', 'cafe'); raise exception 'FAIL: anon created a business';
  exception when insufficient_privilege then raise notice 'ok: anon cannot create a business'; end;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000d","role":"authenticated"}', true);
select set_config('t6p.new_place', public.create_my_business('  Corner Café &  Co. ', '  Ossington ', 'cafe'), true);
do $$ declare id2 text; begin
  assert current_setting('t6p.new_place') = 'corner-cafe-and-co', 'FAIL: slug was ' || current_setting('t6p.new_place');
  assert (select published from public.places where id = 'corner-cafe-and-co') = false, 'FAIL: a new place should not be published';
  assert (select name || '|' || neighbourhood || '|' || category || '|' || offer from public.places where id = 'corner-cafe-and-co') = 'Corner Café & Co.|Ossington|cafe|Second one, on us.', 'FAIL: new place fields';
  assert exists (select 1 from public.my_businesses() where role = 'owner' and 'corner-cafe-and-co' = any (place_ids)), 'FAIL: the new owner does not see their place';
  update public.places set uses_per_year = 4 where id = 'corner-cafe-and-co';
  assert (select uses_per_year from public.places where id = 'corner-cafe-and-co') = 4, 'FAIL: the new owner cannot edit their offer';
  begin update public.places set published = true where id = 'corner-cafe-and-co'; raise exception 'FAIL: an owner published their own place';
  exception when insufficient_privilege then raise notice 'ok: only The 6 Pass publishes a place'; end;
  id2 := public.create_my_business('Corner Cafe and Co', null, 'bakery');
  assert id2 = 'corner-cafe-and-co-2', 'FAIL: second slug was ' || id2;
  assert (select category from public.places where id = id2) is null, 'FAIL: an unknown category was kept';
  assert public.create_my_business('!', '', 'spa') ~ '^[a-z0-9][a-z0-9-]{1,59}$', 'FAIL: a name with no letters gave a bad id';
  begin perform public.create_my_business('One too many', null, null); raise exception 'FAIL: a fourth business was allowed';
  exception when raise_exception then raise notice 'ok: at most 3 businesses per person'; end;
  begin perform public.create_my_business('   ', null, null); raise exception 'FAIL: an empty name was accepted';
  exception when raise_exception then raise notice 'ok: a business needs a name'; end;
  raise notice 'ok: create_my_business makes an unpublished place for its new owner';
end $$;
reset role;
-- Nobody else sees the unpublished place; the member cannot get a code for it.
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
do $$ begin
  assert not exists (select 1 from public.places where id = 'corner-cafe-and-co'), 'FAIL: anon sees an unpublished new place';
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000a","role":"authenticated"}', true);
do $$ begin
  assert not exists (select 1 from public.places where id = 'corner-cafe-and-co'), 'FAIL: a member sees an unpublished new place';
  begin perform public.issue_code('corner-cafe-and-co'); raise exception 'FAIL: code for an unpublished new place';
  exception when raise_exception then raise notice 'ok: no codes until the new place is published'; end;
end $$;
reset role;
-- Once published (by Ammar in the SQL Editor, signed in as nobody), everyone sees it.
select set_config('request.jwt.claims', '', true);
update public.places set published = true where id = 'corner-cafe-and-co';
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
do $$ begin
  assert exists (select 1 from public.places where id = 'corner-cafe-and-co'), 'FAIL: a published new place is hidden';
  raise notice 'ok: a published new place is visible to everyone';
end $$;
reset role;

-- ---- The member deletes their account: visits stay for the place, without the name
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000a","role":"authenticated"}', true);
select public.delete_my_account();
reset role;
do $$ begin
  assert not exists (select 1 from auth.users where id = '00000000-0000-4000-8000-00000000000a'), 'FAIL: account not deleted';
  assert (select count(*) from public.redemptions where place_id = 't6p-test-place' and status = 'confirmed' and member_id is null and member_name is null) = 1, 'FAIL: visit not kept anonymously';
  raise notice 'ALL CHECKS PASSED';
end $$;

rollback;
*/
