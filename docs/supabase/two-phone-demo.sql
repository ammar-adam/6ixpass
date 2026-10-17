-- Two-phone demo: one phone is the member, the other is the place's staff.
-- NOT RUN YET. Ammar reviews this, then pastes it into Supabase:
--   Dashboard -> SQL Editor -> New query -> paste -> Run.
--
-- What it adds: two new tables and four functions, all named demo_*.
-- What it does NOT touch: public.waitlist, its policies, or anything else.
-- No personal data: a 4-letter room code, the demo place's name and offer,
-- and 6-digit visit codes. Rooms and their visits delete themselves after a day.
--
-- Nobody can read or write the tables directly (row level security is on,
-- with no policies). The app can only call the four functions below, with the
-- public (publishable) key. The functions check every input.

create table if not exists public.demo_rooms (
  room       text primary key check (room ~ '^[A-Z2-9]{4}$'),
  place_name text not null check (char_length(place_name) between 1 and 60),
  offer      text not null check (char_length(offer) between 1 and 80),
  created_at timestamptz not null default now()
);

create table if not exists public.demo_visits (
  id           bigint generated always as identity primary key,
  room         text not null references public.demo_rooms(room) on delete cascade,
  code         text not null check (code ~ '^[0-9]{6}$'),
  status       text not null default 'issued' check (status in ('issued', 'confirmed')),
  issued_at    timestamptz not null default now(),
  confirmed_at timestamptz
);
create index if not exists demo_visits_room_idx on public.demo_visits (room, issued_at desc);

alter table public.demo_rooms enable row level security;
alter table public.demo_visits enable row level security;
revoke all on public.demo_rooms, public.demo_visits from anon, authenticated;

-- The staff phone opens a room for its place and shows the room code.
create or replace function public.demo_open_room(p_place text, p_offer text)
returns text language plpgsql security definer set search_path = public as $$
declare
  r text;
  letters constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
begin
  if p_place is null or char_length(trim(p_place)) not between 1 and 60 then raise exception 'bad place'; end if;
  if p_offer is null or char_length(trim(p_offer)) not between 1 and 80 then raise exception 'bad offer'; end if;
  delete from demo_rooms where created_at < now() - interval '1 day';
  loop
    r := '';
    for i in 1..4 loop r := r || substr(letters, 1 + floor(random() * length(letters))::int, 1); end loop;
    exit when not exists (select 1 from demo_rooms where room = r);
  end loop;
  insert into demo_rooms (room, place_name, offer) values (r, trim(p_place), trim(p_offer));
  return r;
end $$;

-- The member phone taps Redeem: a new 6-digit code for that room.
create or replace function public.demo_issue(p_room text)
returns text language plpgsql security definer set search_path = public as $$
declare c text;
begin
  if not exists (select 1 from demo_rooms where room = upper(p_room)) then raise exception 'no room'; end if;
  if (select count(*) from demo_visits where room = upper(p_room) and issued_at > now() - interval '1 hour') >= 60 then raise exception 'slow down'; end if;
  c := lpad(floor(random() * 1000000)::int::text, 6, '0');
  insert into demo_visits (room, code) values (upper(p_room), c);
  return c;
end $$;

-- The staff phone scans or types the code and taps Confirm. Codes last 10 minutes.
create or replace function public.demo_confirm(p_room text, p_code text)
returns boolean language plpgsql security definer set search_path = public as $$
declare n int;
begin
  update demo_visits set status = 'confirmed', confirmed_at = now()
   where room = upper(p_room) and code = p_code and status = 'issued' and issued_at > now() - interval '10 minutes';
  get diagnostics n = row_count;
  return n > 0;
end $$;

-- Both phones check this every two seconds: the place, and the last 20 visits.
create or replace function public.demo_room_state(p_room text)
returns json language sql security definer set search_path = public stable as $$
  select json_build_object(
    'place_name', r.place_name,
    'offer', r.offer,
    'visits', coalesce((select json_agg(v order by v.issued_at desc) from (
      select code, status, issued_at, confirmed_at from demo_visits where room = r.room order by issued_at desc limit 20) v), '[]'::json))
  from demo_rooms r where r.room = upper(p_room);
$$;

revoke all on function public.demo_open_room(text, text), public.demo_issue(text), public.demo_confirm(text, text), public.demo_room_state(text) from public;
grant execute on function public.demo_open_room(text, text), public.demo_issue(text), public.demo_confirm(text, text), public.demo_room_state(text) to anon;

-- To undo everything above:
--   drop function if exists public.demo_open_room(text, text), public.demo_issue(text), public.demo_confirm(text, text), public.demo_room_state(text);
--   drop table if exists public.demo_visits, public.demo_rooms;
