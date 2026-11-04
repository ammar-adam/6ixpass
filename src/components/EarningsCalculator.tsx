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
  const [cost, setCost] = useState(c.types[0].cost);
  const [guests, setGuests] = useState(2);
  const [days, setDays] = useState(3);
  const [anyway, setAnyway] = useState(20);

  function pickType(next: string) {
    const t = c.types.find((x) => x.id === next) ?? c.types[0];
    setTypeId(t.id);
    setSpend(t.spend);
    setItem(t.item);
    setCost(t.cost);
  }

  const weeks = days * 4.33;
  const fresh = guests * (1 - anyway / 100); // guests who only came because of the pass
  const old = guests - fresh; // would have come and paid full price anyway
  const sales = (fresh * spend - (fresh / 2) * item - (old / 2) * item) * weeks;
  // Round once, so the month times 12 is exactly the year.
  const net = Math.round(sales - (cost / 100) * fresh * spend * weeks);
  const guestsMonth = Math.round(fresh * weeks);

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
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor={`${id}-spend`} className={label}>{c.spend} ($)</label>
            <input id={`${id}-spend`} type="number" inputMode="numeric" min={0} max={2000} value={spend} onChange={(e) => setSpend(clamp(e.target.value, 2000))} className={input} />
          </div>
          <div>
            <label htmlFor={`${id}-item`} className={label}>{c.item} ($)</label>
            <input id={`${id}-item`} type="number" inputMode="numeric" min={0} max={2000} value={item} onChange={(e) => setItem(clamp(e.target.value, 2000))} className={input} />
          </div>
          <div>
            <label htmlFor={`${id}-cost`} className={label}>{c.cost}</label>
            <input id={`${id}-cost`} type="number" inputMode="numeric" min={0} max={100} value={cost} onChange={(e) => setCost(clamp(e.target.value, 100))} className={input} />
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-guests`} className={label}>
            {c.guests} <span className="font-serif text-[22px] font-normal">{guests}</span>
          </label>
          <input id={`${id}-guests`} type="range" min={2} max={12} step={2} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full accent-[#c2452d]" />
        </div>
        <div>
          <label htmlFor={`${id}-anyway`} className={label}>
            {c.anyway} <span className="font-serif text-[22px] font-normal">{anyway}%</span>
          </label>
          <input id={`${id}-anyway`} type="range" min={0} max={80} step={10} value={anyway} onChange={(e) => setAnyway(Number(e.target.value))} className="w-full accent-[#c2452d]" />
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
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-peach">{c.net}</p>
          <p className="mt-2 font-serif text-[clamp(48px,6vw,72px)] leading-none">{money(net)}</p>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-[15px]">
            <div>
              <dt className="text-pale">{c.month}</dt>
              <dd className="mt-1 font-serif text-[28px] leading-none">{money(sales)}</dd>
            </div>
            <div>
              <dt className="text-pale">{c.year}</dt>
              <dd className="mt-1 font-serif text-[28px] leading-none">{money(net * 12)}</dd>
            </div>
          </dl>
          <p className="mt-6 text-[15px] text-pale">
            About {guestsMonth} {c.guestsMonth}
          </p>
        </div>
        <a href="/owners#apply" className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-accent px-6 text-[15px] font-semibold text-white hover:bg-accent-2">
          {c.cta}
        </a>
      </div>
      <p className="text-[13px] leading-relaxed text-muted md:col-span-2">{c.note}</p>
    </div>
  );
}
