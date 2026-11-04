"use client";

import { useState } from "react";
import { ownersPage } from "@/content/owners";
import { neighbourhoodOptions, site } from "@/content/site";

const c = ownersPage.apply;
const input = "min-h-[52px] w-full rounded-2xl border border-[#9a8b7e] bg-white px-4 text-[16px] text-ink placeholder:text-muted";
const label = "mb-1.5 block text-[14px] font-semibold";

// The owner application. It doesn't send anything itself: it opens the
// owner's email app with a filled-in email to hello@, so nothing is stored.
export function ApplyForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const v = (k: string) => String(d.get(k) || "").trim();
    const lines = [
      [c.fields.business, v("business")],
      [c.fields.name, v("name")],
      [c.fields.email, v("email")],
      [c.fields.phone, v("phone")],
      [c.fields.type, v("type")],
      [c.fields.area, v("area")],
      [c.fields.web, v("web")],
    ]
      .filter(([, val]) => val)
      .map(([k, val]) => `${k}: ${val}`);
    if (v("message")) lines.push("", v("message"));
    const subject = `${c.subject}: ${v("business")}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
  }

  const opt = <span className="font-normal text-muted">({c.fields.optional})</span>;

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="ap-business" className={label}>{c.fields.business}</label>
        <input id="ap-business" name="business" required autoComplete="organization" className={input} />
      </div>
      <div>
        <label htmlFor="ap-name" className={label}>{c.fields.name}</label>
        <input id="ap-name" name="name" required autoComplete="name" className={input} />
      </div>
      <div>
        <label htmlFor="ap-email" className={label}>{c.fields.email}</label>
        <input id="ap-email" name="email" type="email" required autoComplete="email" className={input} />
      </div>
      <div>
        <label htmlFor="ap-phone" className={label}>{c.fields.phone} {opt}</label>
        <input id="ap-phone" name="phone" type="tel" autoComplete="tel" className={input} />
      </div>
      <div>
        <label htmlFor="ap-type" className={label}>{c.fields.type}</label>
        <select id="ap-type" name="type" required defaultValue="" className={input}>
          <option value="" disabled>{c.fields.choose}</option>
          {c.types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="ap-area" className={label}>{c.fields.area}</label>
        <select id="ap-area" name="area" required defaultValue="" className={input}>
          <option value="" disabled>{c.fields.choose}</option>
          {neighbourhoodOptions.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="ap-web" className={label}>{c.fields.web} {opt}</label>
        <input id="ap-web" name="web" autoComplete="url" className={input} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="ap-message" className={label}>{c.fields.message} {opt}</label>
        <textarea id="ap-message" name="message" rows={4} className={`${input} py-3`} />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="min-h-[52px] rounded-full bg-accent px-7 text-[16px] font-semibold text-white shadow-[0_8px_20px_-10px_rgb(194_69_45/0.8)] hover:bg-accent-2">
          {c.submit}
        </button>
        {sent && (
          <p role="status" className="mt-4 max-w-[52ch] text-[15px] text-ink/80">
            {c.sent}{" "}
            <a href={`mailto:${site.email}`} className="font-semibold underline underline-offset-4">{site.email}</a>.
          </p>
        )}
      </div>
    </form>
  );
}
