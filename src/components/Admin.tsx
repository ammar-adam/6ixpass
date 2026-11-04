"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { neighbourhoodOptions } from "@/content/site";
import { ownersPage } from "@/content/owners";
import { Wordmark } from "./Wordmark";

type App = {
  id: number; business: string; name: string; email: string; phone: string | null; kind: string; area: string;
  web: string | null; message: string | null; source: string | null; status: string; notes: string | null; created_at: string;
};
type Wall = { id: number | null; name: string; area: string; kind: string; offer: string; photo_url: string | null; link: string | null; published: boolean; sort: number };

const STATUSES: [string, string][] = [["new", "New"], ["contacted", "Contacted"], ["meeting", "Meeting booked"], ["signed", "Signed"], ["not_now", "Not now"]];
const input = "min-h-[44px] w-full rounded-xl border border-[#9a8b7e] bg-white px-3 text-[15px]";
const btn = "min-h-[44px] rounded-full bg-accent px-5 text-[15px] font-semibold text-white hover:bg-accent-2 disabled:opacity-60";
const empty: Wall = { id: null, name: "", area: "", kind: ownersPage.apply.types[0], offer: "", photo_url: null, link: null, published: true, sort: 100 };

let client: SupabaseClient | null = null;
function sb() {
  if (!client) {
    client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "", {
      auth: { storageKey: "t6p-admin", persistSession: true, autoRefreshToken: true },
    });
  }
  return client;
}

export function Admin() {
  const [state, setState] = useState<"loading" | "out" | "denied" | "in">("loading");
  const [tab, setTab] = useState<"apps" | "wall">("apps");

  const check = useCallback(async () => {
    const { data } = await sb().auth.getSession();
    if (!data.session) return setState("out");
    const { data: ok } = await sb().rpc("t6p_is_admin");
    setState(ok ? "in" : "denied");
  }, []);
  useEffect(() => {
    void Promise.resolve().then(check);
  }, [check]);

  return (
    <main id="main" className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white/70">
        <div className="wrap flex items-center justify-between py-4">
          <Wordmark className="text-[24px]" />
          {state === "in" && (
            <button type="button" onClick={async () => { await sb().auth.signOut(); setState("out"); }} className="text-[15px] font-semibold underline underline-offset-4">
              Sign out
            </button>
          )}
        </div>
      </header>
      <div className="wrap py-8 md:py-12">
        {state === "loading" && <p className="text-muted">Loading...</p>}
        {state === "out" && <SignIn onDone={check} />}
        {state === "denied" && (
          <p className="max-w-[48ch] text-[17px]">
            This account isn&apos;t an admin. Email hello@the6pass.ca to have it added, then sign in again.{" "}
            <button type="button" className="font-semibold underline" onClick={async () => { await sb().auth.signOut(); setState("out"); }}>Sign out</button>
          </p>
        )}
        {state === "in" && (
          <>
            <div role="tablist" className="flex gap-2">
              {([["apps", "Applications"], ["wall", "Partner wall"]] as const).map(([k, label]) => (
                <button key={k} role="tab" aria-selected={tab === k} type="button" onClick={() => setTab(k)}
                  className={`min-h-[44px] rounded-full px-5 text-[15px] font-semibold ${tab === k ? "bg-night text-white" : "border border-line bg-white"}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-8">{tab === "apps" ? <Applications /> : <WallEditor />}</div>
          </>
        )}
      </div>
    </main>
  );
}

function SignIn({ onDone }: { onDone: () => void }) {
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="max-w-[420px] rounded-[20px] bg-white p-6 shadow-card"
      onSubmit={async (e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        setBusy(true);
        const { error } = await sb().auth.signInWithPassword({ email: String(d.get("email")).trim().toLowerCase(), password: String(d.get("password")) });
        setBusy(false);
        if (error) return setErr("That email and password didn't work.");
        onDone();
      }}
    >
      <h1 className="font-serif text-[32px]">Admin sign in</h1>
      <p className="mt-1 text-[14px] text-muted">Use your The 6 Pass app account.</p>
      <label className="mt-5 block text-[14px] font-semibold" htmlFor="ad-email">Email</label>
      <input id="ad-email" name="email" type="email" required autoComplete="email" className={`${input} mt-1`} />
      <label className="mt-4 block text-[14px] font-semibold" htmlFor="ad-pass">Password</label>
      <input id="ad-pass" name="password" type="password" required autoComplete="current-password" className={`${input} mt-1`} />
      {err && <p role="alert" className="mt-3 text-[14px] text-error">{err}</p>}
      <button type="submit" disabled={busy} className={`${btn} mt-5 w-full`}>{busy ? "Signing in..." : "Sign in"}</button>
    </form>
  );
}

function Applications() {
  const [rows, setRows] = useState<App[] | null>(null);
  const [filter, setFilter] = useState("open");
  const load = useCallback(async () => {
    const { data } = await sb().rpc("admin_applications");
    setRows((data as App[]) ?? []);
  }, []);
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);
  const shown = useMemo(() => (rows ?? []).filter((r) => filter === "all" || (filter === "open" ? !["signed", "not_now"].includes(r.status) : r.status === filter)), [rows, filter]);
  if (!rows) return <p className="text-muted">Loading...</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-serif text-[32px]">Applications</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${input} w-auto`} aria-label="Show">
          <option value="open">Open</option>
          <option value="all">All ({rows.length})</option>
          {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      {!shown.length && <p className="mt-6 text-muted">Nothing here yet. Applications from the For partners page show up here.</p>}
      <ul className="mt-6 grid gap-4">
        {shown.map((r) => <AppRow key={r.id} r={r} onSaved={load} />)}
      </ul>
    </div>
  );
}

function AppRow({ r, onSaved }: { r: App; onSaved: () => void }) {
  const [status, setStatus] = useState(r.status);
  const [notes, setNotes] = useState(r.notes ?? "");
  const [saved, setSaved] = useState(false);
  const when = new Date(r.created_at).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Toronto" });
  return (
    <li className="rounded-[20px] border border-line bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-serif text-[26px] leading-tight">{r.business}</h3>
        <span className="text-[13px] text-muted">{when}</span>
      </div>
      <p className="mt-1 text-[15px]">{r.kind} · {r.area}</p>
      <p className="mt-2 text-[15px]">
        {r.name} · <a className="underline" href={`mailto:${r.email}`}>{r.email}</a>
        {r.phone && <> · <a className="underline" href={`tel:${r.phone}`}>{r.phone}</a></>}
        {r.web && <> · <a className="underline" href={/^https?:/.test(r.web) ? r.web : `https://${r.web}`} target="_blank" rel="noopener">{r.web}</a></>}
      </p>
      {r.message && <p className="mt-3 whitespace-pre-line rounded-xl bg-mist p-3 text-[15px]">{r.message}</p>}
      <div className="mt-4 grid gap-3 sm:grid-cols-[200px_1fr_auto] sm:items-start">
        <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className={input}>
          {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <textarea aria-label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Notes (only you see these)" className={`${input} py-2`} />
        <button type="button" className={btn} onClick={async () => {
          await sb().rpc("admin_update_application", { p_id: r.id, p_status: status, p_notes: notes });
          setSaved(true);
          setTimeout(() => setSaved(false), 1500);
          onSaved();
        }}>{saved ? "Saved" : "Save"}</button>
      </div>
    </li>
  );
}

function WallEditor() {
  const [rows, setRows] = useState<Wall[] | null>(null);
  const [edit, setEdit] = useState<Wall | null>(null);
  const load = useCallback(async () => {
    const { data } = await sb().rpc("admin_wall");
    setRows((data as Wall[]) ?? []);
  }, []);
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);
  if (!rows) return <p className="text-muted">Loading...</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-[32px]">Partner wall</h2>
          <p className="text-[14px] text-muted">Published places show on the home page and the Places page straight away. Only add places that have signed and agreed to be shown.</p>
        </div>
        {!edit && <button type="button" className={btn} onClick={() => setEdit({ ...empty })}>Add a partner</button>}
      </div>
      {edit && <WallForm row={edit} onClose={() => { setEdit(null); load(); }} />}
      <ul className="mt-6 grid gap-3">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center gap-4 rounded-[16px] border border-line bg-white p-3">
            {r.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
              <img src={r.photo_url} alt="" className="size-16 rounded-xl object-cover" />
            ) : <span className="size-16 rounded-xl bg-mist" />}
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{r.name} {!r.published && <span className="ml-2 rounded-full bg-mist px-2 py-0.5 text-[12px]">Hidden</span>}</p>
              <p className="truncate text-[14px] text-muted">{r.offer} · {r.area}</p>
            </div>
            <button type="button" className="min-h-[44px] rounded-full border border-line px-4 font-semibold" onClick={() => setEdit(r)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WallForm({ row, onClose }: { row: Wall; onClose: () => void }) {
  const [w, setW] = useState<Wall>(row);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: keyof Wall, v: unknown) => setW((x) => ({ ...x, [k]: v }));

  async function upload(file: File) {
    setBusy(true);
    setErr("");
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${Date.now()}-${w.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "place"}.${ext}`;
    const { error } = await sb().storage.from("wall").upload(path, file, { contentType: file.type, upsert: false });
    setBusy(false);
    if (error) return setErr("The photo didn't upload. Use a JPG or PNG under 5 MB.");
    set("photo_url", sb().storage.from("wall").getPublicUrl(path).data.publicUrl);
  }

  return (
    <form
      className="mt-6 grid gap-4 rounded-[20px] bg-white p-5 shadow-card sm:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const { error } = await sb().rpc("admin_save_wall", {
          p_id: w.id, p_name: w.name, p_area: w.area, p_kind: w.kind, p_offer: w.offer,
          p_photo_url: w.photo_url ?? "", p_link: w.link ?? "", p_published: w.published, p_sort: w.sort,
        });
        setBusy(false);
        if (error) return setErr("That didn't save. Check the name, area and offer are filled in.");
        onClose();
      }}
    >
      <label className="text-[14px] font-semibold">Name<input required value={w.name} onChange={(e) => set("name", e.target.value)} className={`${input} mt-1`} /></label>
      <label className="text-[14px] font-semibold">Where
        <input required list="wall-areas" value={w.area} onChange={(e) => set("area", e.target.value)} placeholder="e.g. Leslieville" className={`${input} mt-1`} />
        <datalist id="wall-areas">{neighbourhoodOptions.map((n) => <option key={n} value={n} />)}</datalist>
      </label>
      <label className="text-[14px] font-semibold">Type
        <select value={w.kind} onChange={(e) => set("kind", e.target.value)} className={`${input} mt-1`}>
          {ownersPage.apply.types.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label className="text-[14px] font-semibold">Offer<input required value={w.offer} onChange={(e) => set("offer", e.target.value)} placeholder="e.g. Second pasta, on us" className={`${input} mt-1`} /></label>
      <label className="text-[14px] font-semibold">Website or Instagram link (optional)<input value={w.link ?? ""} onChange={(e) => set("link", e.target.value)} placeholder="https://" className={`${input} mt-1`} /></label>
      <label className="text-[14px] font-semibold">Order (lower shows first)<input type="number" value={w.sort} onChange={(e) => set("sort", Number(e.target.value) || 100)} className={`${input} mt-1`} /></label>
      <div className="sm:col-span-2">
        <p className="text-[14px] font-semibold">Photo (with the owner&apos;s permission, no alcohol in it)</p>
        <div className="mt-2 flex items-center gap-4">
          {w.photo_url && (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview
            <img src={w.photo_url} alt="" className="size-20 rounded-xl object-cover" />
          )}
          <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} className="text-[14px]" />
        </div>
      </div>
      <label className="flex items-center gap-3 text-[15px] font-semibold sm:col-span-2">
        <input type="checkbox" checked={w.published} onChange={(e) => set("published", e.target.checked)} className="size-5 accent-[#c2452d]" />
        Show on the website
      </label>
      {err && <p role="alert" className="text-[14px] text-error sm:col-span-2">{err}</p>}
      <div className="flex gap-3 sm:col-span-2">
        <button type="submit" disabled={busy} className={btn}>{busy ? "Saving..." : "Save"}</button>
        <button type="button" onClick={onClose} className="min-h-[44px] rounded-full border border-line px-5 font-semibold">Cancel</button>
      </div>
    </form>
  );
}
