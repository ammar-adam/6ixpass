"use client";

/*
 * Nida's "Set up for a restaurant" sheet (the gear button): every field on
 * one sheet, so she can prefill a place before she walks into a meeting.
 */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import { mock, useMock } from "../../store";
import { OFFER_START, OWNER_CATEGORIES, OWNER_HOODS, OWNER_ID, blankDraft, type OwnerDraft } from "../../owner";
import { C, label, serif } from "../../ui";
import { ColourPicker, DaysPicker, KindToggle, Note, OfferLine, PhotoPicker, UsesStepper, fieldCls, fieldStyle } from "./controls";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function QuickSetup({ onClose, onSaved }: { onClose: () => void; onSaved?: () => void }) {
  const s = useMock();
  const start: OwnerDraft = s.owner && s.offers[OWNER_ID]
    ? { ...s.owner, kind: s.offers[OWNER_ID].kind, offer: s.offers[OWNER_ID].offer, days: s.offers[OWNER_ID].days, usesPerYear: s.offers[OWNER_ID].usesPerYear, blackoutDates: s.offers[OWNER_ID].blackoutDates }
    : blankDraft();
  const [d, setD] = useState<OwnerDraft>(start);
  const [err, setErr] = useState<string | null>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const set = (patch: Partial<OwnerDraft>) => setD((x) => ({ ...x, ...patch }));
  const host = typeof document === "undefined" ? null : document.getElementById("app-frame");

  // Esc closes; Tab stays inside the sheet; focus starts on the name.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    sheet.current?.querySelector<HTMLInputElement>("#qs-name")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !sheet.current) return;
      const els = [...sheet.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [onClose]);

  function save() {
    if (!d.name.trim()) return setErr("Type the name of the place.");
    if (d.offer.trim() === "") return setErr("Write what members get.");
    if (d.days.filter(Boolean).length < 3) return setErr("Pick at least 3 days.");
    mock.saveOwner(d);
    onSaved?.();
    onClose();
  }

  const ui = (
    <div className="absolute inset-0 z-40 flex items-end bg-black/60" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={sheet} role="dialog" aria-modal="true" aria-labelledby="qs-title" className="m-sheet max-h-[92%] w-full overflow-y-auto rounded-t-[26px] px-5 pb-8 pt-5" style={{ background: C.panel }}>
        <div className="flex items-center justify-between">
          <h2 id="qs-title" className="text-[28px] leading-none" style={serif}>Set up for a restaurant</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-11 place-items-center rounded-full border" style={{ borderColor: C.line }}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <p className="mt-2 text-[14px]" style={{ color: C.muted }}>Fill this in before the meeting. Everything stays on this phone.</p>

        <div className="mt-5 space-y-5">
          <div>
            <label htmlFor="qs-name" className={label} style={{ color: C.muted }}>Name of the place</label>
            <input id="qs-name" value={d.name} maxLength={40} autoComplete="off" autoCapitalize="words" onChange={(e) => set({ name: e.target.value })} className={`${fieldCls} mt-2`} style={fieldStyle} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="qs-cat" className={label} style={{ color: C.muted }}>Kind</label>
              <select
                id="qs-cat"
                value={d.category}
                onChange={(e) => {
                  const category = e.target.value as OwnerDraft["category"];
                  const st = OFFER_START[category];
                  set({ category, kind: st.kind, offer: st[st.kind].offer });
                }}
                className={`${fieldCls} mt-2 min-h-[48px] appearance-none`}
                style={fieldStyle}
              >
                {OWNER_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="qs-hood" className={label} style={{ color: C.muted }}>Neighbourhood</label>
              <select id="qs-hood" value={d.neighbourhood} onChange={(e) => set({ neighbourhood: e.target.value })} className={`${fieldCls} mt-2 min-h-[48px] appearance-none`} style={fieldStyle}>
                {OWNER_HOODS.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>
          <KindToggle value={d.kind} onChange={(kind) => set({ kind, offer: OFFER_START[d.category][kind].offer })} />
          <OfferLine id="qs-offer" value={d.offer} onChange={(offer) => set({ offer })} />
          <DaysPicker value={d.days} onChange={(days) => set({ days })} />
          <UsesStepper value={d.usesPerYear} onChange={(usesPerYear) => set({ usesPerYear })} />
          <PhotoPicker value={d.photo} onChange={(photo) => set({ photo })} />
          <ColourPicker value={d.colour} onChange={(colour) => set({ colour })} />
        </div>

        <div role="status" aria-live="polite" className="mt-5">{err && <Note>{err}</Note>}</div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" onClick={onClose} className="h-14 rounded-[18px] border text-[16px] font-bold" style={{ borderColor: C.line }}>Cancel</button>
          <button type="button" onClick={save} className="m-press h-14 rounded-[18px] text-[16px] font-bold" style={{ background: C.ice, color: C.iceInk }}>Save</button>
        </div>
      </div>
    </div>
  );
  return host ? createPortal(ui, host) : ui;
}
