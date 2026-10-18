-- The 6 Pass: email hello@the6pass.ca when someone joins the waitlist (website)
-- or creates an account (app). Steps and clicks: docs/app/SIGNUP-ALERTS.md.
--
-- How it works: a trigger on public.waitlist and one on auth.users send the
-- new row to a small Google Apps Script (running in the hello@ account), and
-- that script sends the email. The script's address lives in the database
-- only, never in this repository.
--
-- Run AFTER docs/app/SUPABASE-ACCOUNTS.sql. Before you press Run, replace
-- PASTE_SCRIPT_URL_HERE below with the Web app URL from the script,
-- followed by ?key= and your key. Safe to run again (for a new URL too).
--
-- What it changes: adds two triggers (waitlist, auth.users), two functions
-- and one private table. The waitlist table's columns and policies are not
-- touched. If the script is down, sign-ups still work: an alert can never
-- stop a sign-up.

begin;

create extension if not exists pg_net with schema extensions;

create schema if not exists t6p_private;
revoke all on schema t6p_private from public, anon, authenticated;

-- The script's address. One row.
create table if not exists t6p_private.signup_alert (
  id boolean primary key default true check (id),
  url text not null
);
alter table t6p_private.signup_alert enable row level security;
insert into t6p_private.signup_alert (url) values ('PASTE_SCRIPT_URL_HERE')
  on conflict (id) do update set url = excluded.url;

create or replace function t6p_private.send_signup_alert(payload jsonb)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  u text;
begin
  select url into u from t6p_private.signup_alert where id;
  if u is null or u not like 'https://script.google.com/%' then
    return;
  end if;
  perform net.http_post(url := u, body := payload, headers := '{"Content-Type": "application/json"}'::jsonb);
exception when others then
  return;
end;
$$;

create or replace function t6p_private.on_waitlist_signup()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  perform t6p_private.send_signup_alert(jsonb_build_object(
    'kind', 'waitlist',
    'email', new.email,
    'first_name', new.first_name,
    'neighbourhood', new.neighbourhood,
    'source', new.source,
    'campaign', new.campaign,
    'created_at', new.created_at
  ));
  return new;
exception when others then
  return new;
end;
$$;

create or replace function t6p_private.on_app_signup()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  perform t6p_private.send_signup_alert(jsonb_build_object(
    'kind', 'app',
    'email', new.email,
    'created_at', new.created_at
  ));
  return new;
exception when others then
  return new;
end;
$$;

revoke all on function t6p_private.send_signup_alert(jsonb) from public, anon, authenticated;
revoke all on function t6p_private.on_waitlist_signup() from public, anon, authenticated;
revoke all on function t6p_private.on_app_signup() from public, anon, authenticated;

drop trigger if exists t6p_signup_alert on public.waitlist;
create trigger t6p_signup_alert after insert on public.waitlist
  for each row execute function t6p_private.on_waitlist_signup();

drop trigger if exists t6p_signup_alert on auth.users;
create trigger t6p_signup_alert after insert on auth.users
  for each row execute function t6p_private.on_app_signup();

commit;

-- To stop the emails without removing anything:
--   update t6p_private.signup_alert set url = 'off';
-- To check recent sends (Supabase keeps responses for a few hours):
--   select id, status_code, created from net._http_response order by created desc limit 10;
