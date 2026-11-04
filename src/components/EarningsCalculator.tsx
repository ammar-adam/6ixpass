"use client";

import { useId, useState } from "react";
import { ownersPage } from "@/content/owners";

const c = ownersPage.calculator;
const money = (n: number) => `$${Math.max(0, Math.round(n)).toLocaleString("en-CA")}`;
const label = "mb-1.5 flex items-baseline justify-between gap-4 text-[14px] font-semibold";
const input = "min-h-[48px] w-full rounded-2xl border border-[#9a8b7e] bg-white px-4 text-[16px] text-ink";
const clamp = (v: string, max: number) => Math.min(max, Math.max(0, Number(v) || 0));

// "Calculate your earnings": the owner's own numbers in, an estimate out.
export function EarningsCalculator() {
  const id = useId();
  const [typeId, setTypeId] = useState(c.types[0].id);
  const [spend, setSpend] = useState(c.types[0].spend);
  const [item, setItem] = useState(c.types[0].item);
  const [guests, setGuests] = useState(4);
  const [days, setDays] = useState(3);

  function pickType(next: string) {
    const t = c.types.find((x) => x.id === next) ?? c.types[0];
    setTypeId(t.id);
    setSpend(t.spend);
    setItem(t.item);
  }

  const month = (guests * spend - (guests / 2) * item) * days * 4.33;
  const guestsMonth = Math.round(guests * days * 4.33);

  return (
    <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-10">
      <div className="grid gap-5">
        <div>
          <label htmlFor={`${id}-type`} className={label}>{c.type}</label>
          <select id={`${id}-type`} value={typeId} onChange={(e) => pickType(e.target.value)} className={input}>
            {c.types.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-spend`} className={label}>{c.spend} ($)</label>
            <input id={`${id}-spend`} type="number" inputMode="numeric" min={0} max={2000} value={spend} onChange={(e) => setSpend(clamp(e.target.value, 2000))} className={input} />
          </div>
          <div>
            <label htmlFor={`${id}-item`} className={label}>{c.item} ($)</label>
            <input id={`${id}-item`} type="number" inputMode="numeric" min={0} max={2000} value={item} onChange={(e) => setItem(clamp(e.target.value, 2000))} className={input} />
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-guests`} className={label}>
            {c.guests} <span className="font-serif text-[22px] font-normal">{guests}</span>
          </label>
          <input id={`${id}-guests`} type="range" min={2} max={20} step={2} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full accent-[#c2452d]" />
        </div>
        <div>
          <label htmlFor={`${id}-days`} className={label}>
            {c.days} <span className="font-serif text-[22px] font-normal">{days}</span>
          </label>
          <input id={`${id}-days`} type="range" min={3} max={7} step={1} value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full accent-[#c2452d]" />
        </div>
      </div>

      <div className="on-dark flex flex-col justify-between gap-6 rounded-[24px] bg-night p-6 text-[#f3e9de] md:p-8">
        <div aria-live="polite">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-peach">{c.month}</p>
          <p className="mt-2 font-serif text-[clamp(48px,6vw,72px)] leading-none">{money(month)}</p>
          <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-peach">{c.year}</p>
          <p className="mt-2 font-serif text-[36px] leading-none">{money(month * 12)}</p>
          <p className="mt-6 text-[15px] text-pale">
            About {guestsMonth} {c.guestsMonth}
          </p>
        </div>
        <a href="#apply" className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-accent px-6 text-[15px] font-semibold text-white hover:bg-accent-2">
          {c.cta}
        </a>
      </div>
      <p className="text-[13px] leading-relaxed text-muted md:col-span-2">{c.note}</p>
    </div>
  );
}
