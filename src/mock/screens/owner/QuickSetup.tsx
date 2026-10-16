"use client";

/*
 * Nida's set-up sheet (the gear on the start screen, Edit on the dashboard):
 * every field on one sheet, so she can fill in a place before a meeting.
 */
import { useState } from "react";
import { mock, useMock } from "../../store";
import { ALCOHOL, ALCOHOL_NOTE, OFFER_START, OWNER_CATEGORIES, OWNER_HOODS, OWNER_ID, blankDraft, type OwnerDraft } from "../../owner";
import { IChev } from "../../icons";
import { Sheet } from "../../ui";
import { ColourPicker, DaysPicker, KindToggle, Note, OfferLine, PhotoPicker, TextField, UsesStepper } from "./controls";

/** A native picker dressed as a grouped-list row. */
function SelectRow({ id, label, value, onChange, children }: { id: string; label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="row">
      <label htmlFor={id} className="shrink-0">
        {label}
      </label>
      <span className="relative flex min-w-0 items-center">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="min-h-[44px] min-w-0 appearance-none bg-transparent pr-5 text-right outline-none" style={{ color: "var(--sec)", textAlignLast: "right" }}>
          {children}
        </select>
        <IChev className="chev pointer-events-none absolute right-0 rotate-90" size={14} />
      </span>
    </div>
  );
}

export function QuickSetup({ onClose, onSaved }: { onClose: () => void; onSaved?: () => void }) {
  const s = useMock();
  const start: OwnerDraft =
    s.owner && s.offers[OWNER_ID]
      ? { ...s.owner, kind: s.offers[OWNER_ID].kind, offer: s.offers[OWNER_ID].offer, days: s.offers[OWNER_ID].days, usesPerYear: s.offers[OWNER_ID].usesPerYear, blackoutDates: s.offers[OWNER_ID].blackoutDates }
      : blankDraft();
  const [d, setD] = useState<OwnerDraft>(start);
  const [err, setErr] = useState<string | null>(null);
  const set = (patch: Partial<OwnerDraft>) => setD((x) => ({ ...x, ...patch }));

  function save() {
    if (!d.name.trim()) return setErr("Type the name of the place.");
    if (d.offer.trim() === "") return setErr("Write what members get.");
    if (ALCOHOL.test(d.offer) || ALCOHOL.test(d.dish ?? "")) return setErr(ALCOHOL_NOTE);
    if (d.days.filter(Boolean).length < 3) return setErr("Pick at least 3 days.");
    mock.saveOwner(d);
    onSaved?.();
    onClose();
  }

  return (
    <Sheet
      tall
      title="Place details"
      id="qs"
      onClose={onClose}
      focusFirst="#qs-name"
      left={
        <button type="button" onClick={onClose} className="navtext">
          Cancel
        </button>
      }
      right={
        <button type="button" onClick={save} className="navtext font-semibold">
          Save
        </button>
      }
    >
      <div className="m space-y-6 pt-2">
        <TextField id="qs-name" label="Name of the place" value={d.name} onChange={(name) => set({ name })} />
        <PhotoPicker value={d.photo} onChange={(photo) => set({ photo })} />
        <TextField id="qs-dish" label="Known for (optional)" value={d.dish ?? ""} onChange={(dish) => set({ dish })} maxLength={34} foot="Their signature dish or treatment, from the menu. It shows on their page." />
        <div className="group">
          <SelectRow
            id="qs-cat"
            label="Kind"
            value={d.category}
            onChange={(v) => {
              const category = v as OwnerDraft["category"];
              const st = OFFER_START[category];
              set({ category, kind: st.kind, offer: st[st.kind].offer });
            }}
          >
            {OWNER_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </SelectRow>
          <SelectRow id="qs-hood" label="Neighbourhood" value={d.neighbourhood} onChange={(neighbourhood) => set({ neighbourhood })}>
            {OWNER_HOODS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </SelectRow>
        </div>
        <KindToggle value={d.kind} onChange={(kind) => set({ kind, offer: OFFER_START[d.category][kind].offer })} />
        <OfferLine id="qs-offer" value={d.offer} onChange={(offer) => set({ offer })} />
        <DaysPicker value={d.days} onChange={(days) => set({ days })} />
        <UsesStepper value={d.usesPerYear} onChange={(usesPerYear) => set({ usesPerYear })} />
        <ColourPicker value={d.colour} onChange={(colour) => set({ colour })} />
        <div role="status" aria-live="polite">
          {err && <Note>{err}</Note>}
        </div>
        <button type="button" onClick={save} className="btn press">
          Save
        </button>
        <p className="t-foot text-center">Everything stays on this device.</p>
      </div>
    </Sheet>
  );
}
