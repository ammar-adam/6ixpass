"use client";

import { useId, useState } from "react";
import { buy } from "@/content/buy";
import { OpenWaitlistButton } from "@/components/WaitlistPopup";

/* Pick a pass, read the renewal terms, agree, continue. Checkout isn't wired: the button explains and opens the waitlist. */
export function PlanPicker() {
  const id = useId();
  const [plan, setPlan] = useState(buy.plans[1].id);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(false);
  const [notYet, setNotYet] = useState(false);
  const chosen = buy.plans.find((p) => p.id === plan) ?? buy.plans[0];

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!agreed) return setError(true);
        setNotYet(true);
      }}
    >
      <fieldset>
        <legend className="sr-only">{buy.plansLabel}</legend>
        <div className="space-y-3">
          {buy.plans.map((p) => {
            const on = p.id === plan;
            return (
              <label
                key={p.id}
                className={`flex cursor-pointer items-start gap-4 rounded-2xl border bg-white p-5 transition-colors ${on ? "border-ink border-2 p-[19px]" : "border-line"}`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={p.id}
                  checked={on}
                  onChange={() => { setPlan(p.id); setNotYet(false); }}
                  className="mt-1 size-5 shrink-0 cursor-pointer accent-ink"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="font-serif text-[24px] font-semibold leading-tight tracking-[-0.01em]">{p.name}</span>
                    <span className="text-right">
                      <s className="mr-2 text-muted">{p.regular}</s>
                      <span className="text-[20px] font-semibold">{p.price}</span>
                      <span className="text-sm text-muted"> {buy.perYear}</span>
                    </span>
                  </span>
                  <span className="mt-1 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[15px] text-muted">{p.line}</span>
                    <span className="rounded-full bg-peach-soft px-2.5 py-0.5 text-xs font-semibold text-copper">{buy.foundingTag}</span>
                  </span>
                  {on && (
                    <ul className="mt-3 space-y-1 border-t border-line pt-3 text-[15px]">
                      {p.includes.map((x) => (
                        <li key={x} className="flex gap-2">
                          <span aria-hidden="true">✓</span>
                          {x}
                        </li>
                      ))}
                    </ul>
                  )}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-4 rounded-2xl border border-line bg-white p-5 text-[15px] leading-relaxed">
        <p>{buy.renewal(chosen.name, chosen.regular)}</p>
        <p className="mt-2 text-muted">{buy.refund}</p>
        <div className="mt-4 flex items-start gap-3">
          <input
            id={`${id}-renew`}
            type="checkbox"
            checked={agreed}
            onChange={(e) => { setAgreed(e.target.checked); if (e.target.checked) setError(false); }}
            aria-invalid={error || undefined}
            aria-describedby={error ? `${id}-renew-err` : undefined}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-ink"
          />
          <label htmlFor={`${id}-renew`} className="cursor-pointer font-semibold">
            {buy.renewalConsent}
          </label>
        </div>
        {error && (
          <p id={`${id}-renew-err`} className="mt-1.5 pl-8 text-sm font-medium text-error" role="alert">
            {buy.renewalError}
          </p>
        )}
      </div>

      <button type="submit" className="mt-5 min-h-[56px] w-full rounded-full bg-ink px-6 text-[17px] font-semibold text-white">
        {buy.cta}
      </button>
      <p className="mt-3 text-center text-sm text-muted">{buy.secure}</p>

      {notYet && (
        <div className="mt-4 rounded-2xl bg-peach-soft p-5" role="status">
          <p>{buy.notYet}</p>
          <OpenWaitlistButton className="mt-3 inline-flex min-h-[44px] items-center font-semibold underline underline-offset-4">
            {buy.notYetButton}
          </OpenWaitlistButton>
        </div>
      )}
    </form>
  );
}
