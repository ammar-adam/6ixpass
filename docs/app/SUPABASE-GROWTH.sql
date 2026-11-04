-- =============================================================================
-- The 6 Pass: growth features for the website (Nov 4, 2026).
--   A. Invite-a-friend links for the waitlist
--   B. Owner applications that save (instead of a mailto link)
--   C. The Founding Partner wall (real partners Nida adds from her phone)
--   D. Admins: who may see applications and edit the wall (/admin)
--
-- Safe to run more than once. It never touches public.waitlist or its
-- policies: it only READS public.waitlist inside two functions, to check that
-- an email really joined. New tables live in t6p_private, which the API does
-- not serve; the site reaches them only through the SECURITY DEFINER
-- functions below, each of which checks its own inputs.
-- No service role key is needed or used.
-- =============================================================================

begin;

create schema if not exists t6p_private;
revoke all on schema t6p_private from public, anon, authenticated;

-- -----------------------------------------------------------------------------
-- D. Admins. Signed-in accounts with these emails (email confirmed) can use
--    /admin. Only hello@the6pass.ca for now (Ammar, Nov 4).
-- -----------------------------------------------------------------------------
create table if not exists t6p_private.admins (
  email text primary key check (email = lower(email))
);
alter table t6p_private.admins enable row level security;
insert into t6p_private.admins (email) values ('hello@the6pass.ca')
  on conflict do nothing;

create or replace function public.t6p_is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from auth.users u
    join t6p_private.admins a on a.email = lower(u.email)
    where u.id = auth.uid() and u.email_confirmed_at is not null
  );
$$;

-- -----------------------------------------------------------------------------
-- A. Invite-a-friend. Each waitlist email gets one random code. A friend who
--    joins through ?ref=CODE is counted for that code. Codes are only handed
--    out right after joining (within 30 minutes of the waitlist row), so
--    nobody can look up someone else's code by typing their email.
-- -----------------------------------------------------------------------------
create table if not exists t6p_private.ref_codes (
  email text primary key check (email = lower(email)),
  code text not null unique check (code ~ '^[a-z0-9]{8}$'),
  referred_by text,
  created_at timestamptz not null default now()
);
alter table t6p_private.ref_codes enable row level security;
create index if not exists ref_codes_referred_by on t6p_private.ref_codes (referred_by);

create or replace function public.waitlist_referral(p_email text, p_ref text default null)
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  e text := lower(trim(coalesce(p_email, '')));
  r text := lower(trim(coalesce(p_ref, '')));
  c text;
begin
  if length(e) < 5 or length(e) > 254 then
    return null;
  end if;
  -- Only someone who just joined (with consent) gets their code back.
  if not exists (
    select 1 from public.waitlist w
    where lower(w.email) = e and w.consent and w.created_at > now() - interval '30 minutes'
  ) then
    return null;
  end if;
  select code into c from t6p_private.ref_codes where email = e;
  if c is not null then
    return c;
  end if;
  -- A referrer must exist and can't be yourself.
  if r !~ '^[a-z0-9]{8}$' or not exists (select 1 from t6p_private.ref_codes where code = r and email <> e) then
    r := null;
  end if;
  loop
    c := encode(extensions.gen_random_bytes(4), 'hex');
    begin
      insert into t6p_private.ref_codes (email, code, referred_by) values (e, c, r);
      return c;
    exception when unique_violation then
      -- Same email at the same moment: return theirs. Same code: try again.
      select code into c from t6p_private.ref_codes where email = e;
      if c is not null then
        return c;
      end if;
    end;
  end loop;
end;
$$;

-- How many friends joined with this code. Only friends who are still on the
-- waitlist with consent count. Returns nothing personal.
create or replace function public.referral_status(p_code text)
returns json
language sql stable security definer set search_path = ''
as $$
  select case when exists (select 1 from t6p_private.ref_codes where code = lower(p_code))
    then json_build_object(
      'invites', (
        select count(*) from t6p_private.ref_codes r
        where r.referred_by = lower(p_code)
          and exists (select 1 from public.waitlist w where lower(w.email) = r.email and w.consent)
      ),
      'goal', 3
    )
  end;
$$;

-- -----------------------------------------------------------------------------
-- B. Owner applications. Anyone can submit; only admins can read.
-- -----------------------------------------------------------------------------
create table if not exists t6p_private.partner_applications (
  id bigint generated always as identity primary key,
  business text not null check (length(business) between 1 and 120),
  name text not null check (length(name) between 1 and 120),
  email text not null check (length(email) between 5 and 254),
  phone text check (length(phone) <= 40),
  kind text not null check (length(kind) <= 60),
  area text not null check (length(area) <= 80),
  web text check (length(web) <= 300),
  message text check (length(message) <= 2000),
  source text check (length(source) <= 200),
  status text not null default 'new' check (status in ('new', 'contacted', 'meeting', 'signed', 'not_now')),
  notes text check (length(notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table t6p_private.partner_applications enable row level security;

create or replace function public.submit_partner_application(
  p_business text, p_name text, p_email text, p_phone text, p_kind text,
  p_area text, p_web text, p_message text, p_source text default null)
returns boolean
language plpgsql security definer set search_path = ''
as $$
declare
  e text := lower(trim(coalesce(p_email, '')));
begin
  if e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(e) > 254
     or length(trim(coalesce(p_business, ''))) = 0 or length(trim(coalesce(p_name, ''))) = 0 then
    raise exception 'invalid' using errcode = 'P0001';
  end if;
  -- Simple limits against spam: 3 a day per email, 100 a day in total.
  if (select count(*) from t6p_private.partner_applications where email = e and created_at > now() - interval '1 day') >= 3
     or (select count(*) from t6p_private.partner_applications where created_at > now() - interval '1 day') >= 100 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  insert into t6p_private.partner_applications (business, name, email, phone, kind, area, web, message, source)
  values (
    left(trim(p_business), 120), left(trim(p_name), 120), e,
    nullif(left(trim(coalesce(p_phone, '')), 40), ''), left(trim(coalesce(p_kind, '')), 60),
    left(trim(coalesce(p_area, '')), 80), nullif(left(trim(coalesce(p_web, '')), 300), ''),
    nullif(left(trim(coalesce(p_message, '')), 2000), ''), nullif(left(trim(coalesce(p_source, '')), 200), '')
  );
  return true;
end;
$$;

create or replace function public.admin_applications()
returns setof t6p_private.partner_applications
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.t6p_is_admin() then
    raise exception 'not_allowed' using errcode = 'P0001';
  end if;
  return query select * from t6p_private.partner_applications order by created_at desc limit 500;
end;
$$;

create or replace function public.admin_update_application(p_id bigint, p_status text, p_notes text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.t6p_is_admin() then
    raise exception 'not_allowed' using errcode = 'P0001';
  end if;
  update t6p_private.partner_applications
     set status = p_status, notes = nullif(left(coalesce(p_notes, ''), 2000), ''), updated_at = now()
   where id = p_id;
end;
$$;

-- -----------------------------------------------------------------------------
-- C. Founding Partner wall. Admins add and edit; the site shows published rows.
--    Nothing is ever deleted: unpublish instead.
-- -----------------------------------------------------------------------------
create table if not exists t6p_private.partner_wall (
  id bigint generated always as identity primary key,
  name text not null check (length(name) between 1 and 120),
  area text not null check (length(area) <= 80),
  kind text not null check (length(kind) <= 60),
  offer text not null check (length(offer) between 1 and 160),
  photo_url text check (length(photo_url) <= 500),
  link text check (length(link) <= 300),
  published boolean not null default false,
  sort int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table t6p_private.partner_wall enable row level security;

create or replace function public.partner_wall()
returns table (id bigint, name text, area text, kind text, offer text, photo_url text, link text)
language sql stable security definer set search_path = ''
as $$
  select id, name, area, kind, offer, photo_url, link
  from t6p_private.partner_wall where published
  order by sort, created_at;
$$;

create or replace function public.admin_wall()
returns setof t6p_private.partner_wall
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.t6p_is_admin() then
    raise exception 'not_allowed' using errcode = 'P0001';
  end if;
  return query select * from t6p_private.partner_wall order by sort, created_at;
end;
$$;

-- p_id null = add a new one. Returns the row's id.
create or replace function public.admin_save_wall(
  p_id bigint, p_name text, p_area text, p_kind text, p_offer text,
  p_photo_url text, p_link text, p_published boolean, p_sort int default 100)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare
  new_id bigint;
begin
  if not public.t6p_is_admin() then
    raise exception 'not_allowed' using errcode = 'P0001';
  end if;
  if p_photo_url is not null and p_photo_url <> '' and p_photo_url !~ '^https://' then
    raise exception 'invalid' using errcode = 'P0001';
  end if;
  if p_id is null then
    insert into t6p_private.partner_wall (name, area, kind, offer, photo_url, link, published, sort)
    values (trim(p_name), trim(p_area), trim(p_kind), trim(p_offer), nullif(trim(p_photo_url), ''), nullif(trim(p_link), ''), coalesce(p_published, false), coalesce(p_sort, 100))
    returning id into new_id;
    return new_id;
  end if;
  update t6p_private.partner_wall
     set name = trim(p_name), area = trim(p_area), kind = trim(p_kind), offer = trim(p_offer),
         photo_url = nullif(trim(p_photo_url), ''), link = nullif(trim(p_link), ''),
         published = coalesce(p_published, false), sort = coalesce(p_sort, 100), updated_at = now()
   where id = p_id;
  return p_id;
end;
$$;

-- Photos for the wall: a public bucket; only admins can upload or replace.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wall', 'wall', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "wall photos: admins upload" on storage.objects;
create policy "wall photos: admins upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'wall' and public.t6p_is_admin());

drop policy if exists "wall photos: admins update" on storage.objects;
create policy "wall photos: admins update" on storage.objects
  for update to authenticated
  using (bucket_id = 'wall' and public.t6p_is_admin());

-- -----------------------------------------------------------------------------
-- Execute grants. Functions are callable by nobody unless granted here.
-- -----------------------------------------------------------------------------
revoke all on function public.t6p_is_admin() from public, anon, authenticated;
revoke all on function public.waitlist_referral(text, text) from public, anon, authenticated;
revoke all on function public.referral_status(text) from public, anon, authenticated;
revoke all on function public.submit_partner_application(text, text, text, text, text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.admin_applications() from public, anon, authenticated;
revoke all on function public.admin_update_application(bigint, text, text) from public, anon, authenticated;
revoke all on function public.partner_wall() from public, anon, authenticated;
revoke all on function public.admin_wall() from public, anon, authenticated;
revoke all on function public.admin_save_wall(bigint, text, text, text, text, text, text, boolean, int) from public, anon, authenticated;

grant execute on function public.t6p_is_admin() to authenticated;
grant execute on function public.waitlist_referral(text, text) to anon, authenticated;
grant execute on function public.referral_status(text) to anon, authenticated;
grant execute on function public.submit_partner_application(text, text, text, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.partner_wall() to anon, authenticated;
grant execute on function public.admin_applications() to authenticated;
grant execute on function public.admin_update_application(bigint, text, text) to authenticated;
grant execute on function public.admin_wall() to authenticated;
grant execute on function public.admin_save_wall(bigint, text, text, text, text, text, text, boolean, int) to authenticated;

commit;
