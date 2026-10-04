"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarX, Check, DoorOpen, Minus, Plus, Scan, Sliders, X } from "@phosphor-icons/react";
import { DAY_NAMES, DAY_SHORT, OFFER_PRESETS, PARTNERS, copy } from "@/demo/data";
import { DEMO_DATE, isLive, mock, offerLabel, place, useMock, type OfferKind } from "../store";
import { C, cardGlow, DayDots, label, Photo, serif, splitCode, useNow } from "../ui";

function PartnerHeader({ tab }: { tab: "door" | "offer" }) {
  const s = useMock();
  const home = place(s, s.partnerId) ?? place(s, PARTNERS[0].id)!;
  const tabs = [
    { id: "door", href: "/app/partner", name: copy.staff.door, Icon: DoorOpen },
    { id: "offer", href: "/app/partner/offer", name: copy.staff.offer, Icon: Sliders },
  ] as const;
  return (
    <>
      <div className="relative h-[150px]">
        <Photo p={home} priority className="absolute inset-0 size-full" />
        <span className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(10,20,36,0.3), ${C.bg})` }} />
        <div className="absolute inset-x-5 bottom-2">
          <p className={label} style={{ color: C.ice }}>{copy.staff.sub}</p>
          <h1 className="mt-1 text-[32px] leading-none" style={serif}>{home.name}</h1>
        </div>
      </div>
      <div className="mx-5 mt-3">
        <label htmlFor="partner-pick" className="sr-only">Show the staff view for</label>
        <select
          id="partner-pick"
          value={home.id}
          onChange={(e) => mock.setPartner(e.target.value)}
          className="h-11 w-full appearance-none rounded-2xl border px-4 text-[14px] font-semibold"
          style={{ background: C.panel, borderColor: C.line, color: C.text }}
        >
          {PARTNERS.map((p) => (
            <option key={p.id} value={p.id}>Showing as: {p.name}</option>
          ))}
        </select>
      </div>
      <nav className="mx-5 mt-3 grid grid-cols-2 rounded-2xl border p-1" style={{ background: C.panel, borderColor: C.line }} aria-label="Partner sections">
        {tabs.map(({ id, href, name, Icon }) => {
          const on = tab === id;
          return (
            <Link key={id} href={href} aria-current={on ? "page" : undefined} className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl text-[13px] font-semibold" style={on ? { background: C.ice, color: C.iceInk } : { color: C.muted }}>
              <Icon size={16} weight={on ? "fill" : "regular"} aria-hidden="true" />
              {name}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function PartnerDoor() {
  const s = useMock();
  const now = useNow();
  const [typed, setTyped] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const home = place(s, s.partnerId) ?? place(s, PARTNERS[0].id)!;
  const mine = s.redemptions.filter((r) => r.partnerId === home.id);
  const waiting = mine.filter((r) => isLive(r, now || r.issuedAt));
  const done = mine.filter((r) => r.status === "confirmed").reverse();

  return (
    <div className="m-enter pb-32">
      <PartnerHeader tab="door" />
      <section className="mt-5 px-5" aria-label={copy.staff.door}>
        {waiting.length === 0 && (
          <div className="rounded-[22px] border p-5 text-center" style={{ borderColor: C.line }}>
            <Scan size={34} aria-hidden="true" className="mx-auto" style={{ color: C.ice }} />
            <p className="mt-3 text-[15px]" style={{ color: C.soft }}>
              No codes waiting. Open {home.name} in Explore and tap Redeem to see one arrive here.
            </p>
          </div>
        )}
        <ul className="space-y-3">
          {waiting.map((r) => (
            <li key={r.id} className="m-pop rounded-[24px] p-5" style={cardGlow}>
              <p className={label} style={{ color: C.ice }}>New at the table</p>
              <p className="tabular mt-2 text-[44px] font-bold leading-none tracking-[0.06em]" data-testid="staff-code">{splitCode(r.code)}</p>
              <p className="mt-2 text-[14px]" style={{ color: C.soft }}>Alex · {r.offer}</p>
              <p className="text-[13px]" style={{ color: C.muted }}>Check the guest&apos;s screen shows the same code.</p>
              <button type="button" onClick={() => mock.confirm(r.id)} className="m-press mt-4 h-14 w-full rounded-[18px] text-[17px] font-bold" style={{ background: C.ice, color: C.iceInk }}>
                {copy.staff.confirm}
              </button>
            </li>
          ))}
        </ul>

        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            const ok = mock.confirmCode(home.id, typed);
            setMsg(ok ? "Confirmed. The second one is on the house." : "That code doesn't match a live code here. Check it with the guest.");
            if (ok) setTyped("");
          }}
        >
          <label htmlFor="code-in" className="text-[14px] font-semibold" style={{ color: C.soft }}>Or type the code from the guest&apos;s phone</label>
          <div className="mt-2 flex gap-2">
            <input
              id="code-in"
              inputMode="numeric"
              autoComplete="off"
              maxLength={7}
              value={typed}
              onChange={(e) => setTyped(e.target.value.replace(/[^\d ]/g, ""))}
              placeholder="000 000"
              className="tabular h-12 min-w-0 flex-1 rounded-2xl border px-4 text-[20px] tracking-[0.15em] outline-none focus:ring-2 focus:ring-[#A9D1FF]"
              style={{ background: C.panel, borderColor: C.line, color: C.text }}
            />
            <button type="submit" className="h-12 rounded-2xl px-5 font-bold" style={{ background: C.ice, color: C.iceInk }}>Check</button>
          </div>
          {msg && <p role="status" className="mt-2 text-[14px]" style={{ color: C.soft }}>{msg}</p>}
        </form>

        {done.length > 0 && (
          <>
            <h2 className={`${label} mt-7`} style={{ color: C.muted }}>Confirmed</h2>
            <ul className="mt-2 space-y-2">
              {done.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4 rounded-[18px] border px-4 py-3.5" style={{ background: C.panel, borderColor: C.line }}>
                  <span className="tabular tracking-[0.06em]">{splitCode(r.code)}</span>
                  <span className="flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: C.ok }}>
                    <Check size={16} weight="bold" aria-hidden="true" />{copy.staff.confirmed}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        <h2 className="mt-8 text-[24px] leading-tight" style={serif}>{copy.staff.week}</h2>
        <dl className="mt-3 grid grid-cols-3 gap-2">
          {copy.staff.weekStats.map((st) => (
            <div key={st.label} className="flex flex-col-reverse rounded-[18px] border p-3.5" style={{ background: C.panel, borderColor: C.line }}>
              <dt className="mt-1.5 text-[12px] font-semibold" style={{ color: C.muted }}>{st.label}</dt>
              <dd className="text-[28px] leading-none" style={serif}>{st.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-[13px]" style={{ color: C.muted }}>{copy.staff.weekNote}</p>
      </section>
    </div>
  );
}

// Ontario doesn't allow two-for-one on alcohol, so offers never mention it.
const ALCOHOL = /\b(wine|beer|cocktails?|sake|spirits|prosecco|champagne|liquor|booze|happy hour|pints?|alcohol)\b/i;

export function PartnerOffer() {
  const s = useMock();
  const home = place(s, s.partnerId) ?? place(s, PARTNERS[0].id)!;
  const o = home.settings;
  const [note, setNote] = useState<string | null>(null);
  const [date, setDate] = useState(DEMO_DATE);
  const dayCount = o.days.filter(Boolean).length;
  const dining = home.category === "Dining" || home.category === "Hotels";
  const update = (patch: Parameters<typeof mock.updateOffer>[1]) => mock.updateOffer(home.id, patch);
  const original = PARTNERS.find((p) => p.id === home.id)!;

  function setKind(kind: OfferKind) {
    if (kind === o.kind) return;
    if (dining) {
      const preset = OFFER_PRESETS.find((x) => x.id === (kind === "two_for_one" ? "two" : "upgrade"))!;
      update({ kind, offer: preset.offer, detail: preset.detail, saving: preset.saving });
    } else if (kind === "upgrade") {
      update({ kind, offer: "A free add-on, on us.", detail: "Book any service and add a short extra at no charge.", saving: Math.round(original.saving / 2) });
    } else {
      update({ kind, offer: original.offer, detail: original.detail, saving: original.saving });
    }
  }

  function setText(field: "offer" | "detail", value: string) {
    if (ALCOHOL.test(value)) {
      setNote("Offers can't include alcohol. Food, services and non-alcoholic drinks only.");
      return;
    }
    setNote(null);
    update({ [field]: value });
  }

  const field = "mt-2 block w-full rounded-2xl border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#A9D1FF]";
  const fieldStyle = { background: C.bg, borderColor: C.line, color: C.text };

  return (
    <div className="m-enter pb-32">
      <PartnerHeader tab="offer" />
      <section className="mt-5 px-5" aria-labelledby="offer-title">
        <h2 id="offer-title" className="sr-only">{copy.staff.offer}</h2>
        <p className="text-[14px]" style={{ color: C.muted }}>{copy.staff.offerNote}</p>
        <div role="status" aria-live="polite">{note && <p className="mt-3 rounded-2xl px-4 py-3 text-[14px] font-semibold" style={{ background: "rgba(255,201,163,0.14)", color: C.warn }}>{note}</p>}</div>

        <div className="mt-3 space-y-5 rounded-[24px] border p-5" style={{ background: C.panel, borderColor: C.line }}>
          <fieldset>
            <legend className={label} style={{ color: C.muted }}>{copy.staff.type}</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(
                [
                  ["two_for_one", "Two-for-one"],
                  ["upgrade", "Free upgrade or add-on"],
                ] as const
              ).map(([k, name]) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={o.kind === k}
                  onClick={() => setKind(k)}
                  className="min-h-[48px] rounded-2xl border px-3 text-[14px] font-semibold"
                  style={o.kind === k ? { background: C.ice, color: C.iceInk, borderColor: C.ice } : { borderColor: C.line, color: C.soft }}
                >
                  {name}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="o-title" className={label} style={{ color: C.muted }}>What members get</label>
            <input id="o-title" value={o.offer} maxLength={60} onChange={(e) => setText("offer", e.target.value)} className={field} style={fieldStyle} />
          </div>
          <div>
            <label htmlFor="o-detail" className={label} style={{ color: C.muted }}>The details</label>
            <textarea id="o-detail" rows={2} value={o.detail} maxLength={160} onChange={(e) => setText("detail", e.target.value)} className={field} style={fieldStyle} />
          </div>

          <fieldset>
            <legend className={label} style={{ color: C.muted }}>{copy.staff.days}</legend>
            <div className="mt-2 grid grid-cols-7 gap-1.5">
              {DAY_SHORT.map((d, i) => {
                const on = o.days[i];
                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={on}
                    aria-label={DAY_NAMES[i]}
                    onClick={() => {
                      if (on && dayCount <= 3) {
                        setNote(`Offers run at least 3 days a week. Add another day before removing ${DAY_NAMES[i]}.`);
                        return;
                      }
                      setNote(null);
                      update({ days: o.days.map((v, j) => (j === i ? !v : v)) });
                    }}
                    className="min-h-[44px] rounded-xl text-[12px] font-bold"
                    style={on ? { background: C.ice, color: C.iceInk } : { border: `1px solid ${C.line}`, color: C.muted }}
                  >
                    {d.slice(0, 2)}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[13px]" style={{ color: C.muted }}>{copy.staff.daysMin}</p>
          </fieldset>

          <div className="flex items-center justify-between gap-4">
            <p id="uses-label" className={`${label} max-w-[10rem]`} style={{ color: C.muted }}>{copy.staff.uses}</p>
            <div className="flex items-center gap-3" role="group" aria-labelledby="uses-label">
              <button type="button" aria-label="Fewer uses" disabled={o.usesPerYear <= 1} onClick={() => update({ usesPerYear: o.usesPerYear - 1 })} className="grid size-11 place-items-center rounded-full border disabled:opacity-40" style={{ borderColor: C.line }}>
                <Minus size={18} weight="bold" aria-hidden="true" />
              </button>
              <span className="tabular w-8 text-center text-[30px] leading-none" style={serif} aria-live="polite" data-testid="uses-per-year">{o.usesPerYear}</span>
              <button type="button" aria-label="More uses" disabled={o.usesPerYear >= 12} onClick={() => update({ usesPerYear: o.usesPerYear + 1 })} className="grid size-11 place-items-center rounded-full border disabled:opacity-40" style={{ borderColor: C.line }}>
                <Plus size={18} weight="bold" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="o-blackout" className={label} style={{ color: C.muted }}>Blackout dates</label>
            <div className="mt-2 flex gap-2">
              <input id="o-blackout" type="date" value={date} min={DEMO_DATE} onChange={(e) => setDate(e.target.value)} className={`${field} mt-0 flex-1 [color-scheme:dark]`} style={fieldStyle} />
              <button
                type="button"
                disabled={!date}
                onClick={() => !o.blackoutDates.includes(date) && update({ blackoutDates: [...o.blackoutDates, date].sort() })}
                className="rounded-2xl px-5 font-bold disabled:opacity-40"
                style={{ background: C.ice, color: C.iceInk }}
              >
                Add
              </button>
            </div>
            <p className="mt-2 text-[13px]" style={{ color: C.muted }}>Today in the demo is {DEMO_DATE}. Add it to see the member side blocked.</p>
            {o.blackoutDates.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {o.blackoutDates.map((d) => (
                  <li key={d}>
                    <button type="button" onClick={() => update({ blackoutDates: o.blackoutDates.filter((x) => x !== d) })} className="flex min-h-[40px] items-center gap-1.5 rounded-full border px-3 text-[13px] font-semibold" style={{ borderColor: C.line }}>
                      <CalendarX size={15} aria-hidden="true" />
                      {d === DEMO_DATE ? "Today" : d}
                      <X size={13} aria-hidden="true" />
                      <span className="sr-only">remove</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className={`${label} mb-2 mt-6`} style={{ color: C.muted }}>{copy.staff.preview}</p>
        <Link href={`/app/place/${home.id}`} className="m-press block overflow-hidden rounded-[22px] border" style={{ background: C.panel, borderColor: C.line }}>
          <span className="relative block aspect-[16/8]">
            <Photo p={home} className="absolute inset-0 size-full" />
            <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-[12px] font-bold" style={{ background: C.ice, color: C.iceInk }}>{offerLabel(home)}</span>
          </span>
          <span className="block p-4">
            <span className="block text-[22px] leading-tight" style={serif}>{home.name}</span>
            <span className="mt-1 block font-semibold">{o.offer}</span>
            <span className="mt-1 block text-[13px]" style={{ color: C.muted }}>
              {DAY_SHORT.filter((_, i) => o.days[i]).join(", ")} · {o.usesPerYear} {o.usesPerYear === 1 ? "use" : "uses"} a year
            </span>
            <span className="mt-3 block"><DayDots days={o.days} /></span>
            <span className="mt-3 block text-[13px] font-semibold" style={{ color: C.ice }}>See it as a member</span>
          </span>
        </Link>
      </section>
    </div>
  );
}
