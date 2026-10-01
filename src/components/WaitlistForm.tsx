"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { neighbourhoodOptions, waitlist as copy } from "@/content/site";
import { joinWaitlist, validEmail, type JoinResult } from "@/lib/waitlist";
import { JOINED_EVENT, JOINED_KEY, setItem } from "@/lib/storage";
import { track } from "@/lib/analytics";

type Status = "idle" | "loading" | JoinResult;
type Errors = { email?: string; consent?: string };

const input =
  "block w-full rounded-xl border-[1.5px] border-ink bg-white px-4 py-3 text-[17px] text-ink placeholder:text-muted/80 focus:outline-none focus-visible:outline-none focus:ring-[3px] focus:ring-peach aria-[invalid=true]:border-error";

export function WaitlistForm({
  placement,
  autoFocus = false,
  onDone,
}: {
  placement: "hero" | "popup";
  autoFocus?: boolean;
  onDone?: (result: JoinResult) => void;
}) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    const data = new FormData(e.currentTarget);

    // Bots fill hidden fields. People never see this one.
    if (data.get("company")) {
      setStatus("success");
      return;
    }

    const email = String(data.get("email") || "").trim();
    const consent = data.get("consent") === "on";
    const next: Errors = {};
    if (!email) next.email = copy.errors.emailMissing;
    else if (!validEmail(email)) next.email = copy.errors.emailInvalid;
    if (!consent) next.consent = copy.errors.consentMissing;
    setErrors(next);
    if (next.email) return emailRef.current?.focus();
    if (next.consent) return consentRef.current?.focus();

    setStatus("loading");
    const result = await joinWaitlist({
      email,
      firstName: String(data.get("first_name") || ""),
      neighbourhood: String(data.get("neighbourhood") || ""),
      consent,
    });
    setStatus(result);
    if (result === "success" || result === "already") {
      setItem(JOINED_KEY, "1");
      window.dispatchEvent(new Event(JOINED_EVENT));
      track("waitlist_join", { placement, result });
      requestAnimationFrame(() => resultRef.current?.focus());
      onDone?.(result);
    }
  }

  if (status === "success" || status === "already") {
    const msg = status === "success" ? copy.success : copy.already;
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border-[1.5px] border-ink bg-white p-5 focus:outline-none"
      >
        <p className="font-serif text-2xl leading-tight">{msg.title}</p>
        <p className="mt-1 text-muted">{msg.text}</p>
      </div>
    );
  }

  const loading = status === "loading";

  return (
    <form noValidate onSubmit={onSubmit} aria-busy={loading} className="grid gap-4">
      <div>
        <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-semibold">
          {copy.emailLabel}
        </label>
        <input
          ref={emailRef}
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          required
          maxLength={254}
          autoFocus={autoFocus}
          placeholder="you@example.com"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? `${id}-email-err` : undefined}
          className={input}
        />
        {errors.email && (
          <p id={`${id}-email-err`} className="mt-1.5 text-sm font-medium text-error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="mb-1.5 block text-sm font-semibold">
            {copy.firstNameLabel} <span className="font-normal text-muted">({copy.optional})</span>
          </label>
          <input
            id={`${id}-name`}
            name="first_name"
            type="text"
            autoComplete="given-name"
            maxLength={80}
            className={input}
          />
        </div>
        <div>
          <label htmlFor={`${id}-hood`} className="mb-1.5 block text-sm font-semibold">
            {copy.neighbourhoodLabel} <span className="font-normal text-muted">({copy.optional})</span>
          </label>
          <select id={`${id}-hood`} name="neighbourhood" defaultValue="" className={`${input} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 fill=%22none%22 stroke=%22%230f2e33%22 stroke-width=%221.8%22/></svg>')] bg-[right_1rem_center] bg-no-repeat pr-10`}>
            <option value="">{copy.neighbourhoodPlaceholder}</option>
            {neighbourhoodOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            ref={consentRef}
            id={`${id}-consent`}
            name="consent"
            type="checkbox"
            required
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${id}-consent-err` : undefined}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-ink"
          />
          <label htmlFor={`${id}-consent`} className="cursor-pointer text-[15px] leading-snug">
            {copy.consentLabel}
          </label>
        </div>
        {errors.consent && (
          <p id={`${id}-consent-err`} className="mt-1.5 pl-8 text-sm font-medium text-error">
            {errors.consent}
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-ink-2 disabled:cursor-wait disabled:opacity-80 sm:w-auto"
        >
          {loading && (
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none"
            />
          )}
          {loading ? copy.submitting : copy.submit}
        </button>
        <div aria-live="polite" className="text-sm font-medium text-error">
          {status === "error" && <p className="mt-3">{copy.errors.generic}</p>}
        </div>
      </div>
    </form>
  );
}
