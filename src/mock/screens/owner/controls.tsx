"use client";

/*
 * The pieces the onboarding, Nida's quick setup sheet and the owner
 * dashboard share, so an offer is edited the same way everywhere.
 * iOS-style: grouped lists, segmented controls, a stepper, a switch.
 */
import { useId, useRef, useState } from "react";
import { DAY_LETTERS, DAY_NAMES } from "@/demo/data";
import { DEMO_DATE, type OfferKind } from "../../store";
import { ALCOHOL, ALCOHOL_NOTE, OWNER_COLOURS, resizePhoto } from "../../owner";
import { ICamera, ICheck, IClose, IMinus, IPlus } from "../../icons";

export function Note({ children }: { children: React.ReactNode }) {
  return <p className="note">{children}</p>;
}

/** A grouped list with a check on the chosen row, like iOS settings. */
export function Choices<T extends string>({ legend, options, value, onChange }: { legend: string; options: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="group-label">{legend}</legend>
      <div className="group">
        {options.map((o) => (
          <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)} className="row">
            <span>{o.label}</span>
            {value === o.id && <ICheck size={18} className="shrink-0 text-[color:var(--accent)]" />}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Two to four options side by side. */
export function Segmented<T extends string>({ legend, options, value, onChange }: { legend: string; options: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="group-label">{legend}</legend>
      <div className="segmented">
        {options.map((o) => (
          <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function KindToggle({ value, onChange }: { value: OfferKind; onChange: (k: OfferKind) => void }) {
  return (
    <Segmented
      legend="Offer"
      value={value}
      onChange={onChange}
      options={[
        { id: "two_for_one", label: "Two for one" },
        { id: "upgrade", label: "Free upgrade" },
      ]}
    />
  );
}

/** A text field in a grouped box, with its label above. */
export function TextField({ id, label, value, onChange, maxLength = 40, onEnter, foot }: { id: string; label: string; value: string; onChange: (v: string) => void; maxLength?: number; onEnter?: () => void; foot?: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="group-label block">
        {label}
      </label>
      <div className="field-box">
        <input
          id={id}
          value={value}
          maxLength={maxLength}
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint={onEnter ? "next" : undefined}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
          className="field"
        />
      </div>
      {foot && <p className="group-foot">{foot}</p>}
    </div>
  );
}

/** The offer line. Refuses alcohol and says why. */
export function OfferLine({ value, onChange, id }: { value: string; onChange: (v: string) => void; id?: string }) {
  const auto = useId();
  const fid = id ?? auto;
  const [note, setNote] = useState<string | null>(null);
  return (
    <div>
      <label htmlFor={fid} className="group-label block">
        What members get
      </label>
      <div className="field-box">
        <input
          id={fid}
          value={value}
          maxLength={60}
          autoComplete="off"
          onChange={(e) => {
            if (ALCOHOL.test(e.target.value)) return setNote(ALCOHOL_NOTE);
            setNote(null);
            onChange(e.target.value);
          }}
          className="field"
        />
      </div>
      <div role="status" aria-live="polite" className={note ? "mt-2" : ""}>
        {note && <Note>{note}</Note>}
      </div>
      <p className="group-foot">Food, services and non-alcoholic drinks only.</p>
    </div>
  );
}

/**
 * Mon to Sun. At least three days; says so plainly when there are fewer.
 * `strict` (the dashboard) won't save fewer than three: a live offer never drops below the minimum.
 */
export function DaysPicker({ value, onChange, strict = false }: { value: boolean[]; onChange: (d: boolean[]) => void; strict?: boolean }) {
  const count = value.filter(Boolean).length;
  const [refused, setRefused] = useState<string | null>(null);
  return (
    <fieldset>
      <legend className="group-label">Days it runs</legend>
      <div className="group flex justify-between px-3 py-3">
        {DAY_LETTERS.map((d, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={value[i]}
            aria-label={DAY_NAMES[i]}
            onClick={() => {
              if (strict && value[i] && count <= 3) return setRefused(`Keep at least 3 days. Add another day before taking ${DAY_NAMES[i]} off.`);
              setRefused(null);
              onChange(value.map((v, j) => (j === i ? !v : v)));
            }}
            className="grid size-[42px] place-items-center rounded-full text-[15px] font-semibold transition-colors"
            style={value[i] ? { background: "var(--btn)", color: "var(--onBtn)" } : { background: "var(--fill)", color: "var(--sec)" }}
          >
            {d}
          </button>
        ))}
      </div>
      <div role="status" aria-live="polite" className="mt-2">
        {refused ? (
          <Note>{refused}</Note>
        ) : count < 3 ? (
          <Note>Pick at least 3 days. You have {count === 0 ? "none" : count === 1 ? "1 day" : `${count} days`} so far.</Note>
        ) : (
          <p className="group-foot pt-0">At least three days a week. Leave out your busy nights.</p>
        )}
      </div>
    </fieldset>
  );
}

export function UsesStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const id = useId();
  return (
    <div>
      <div className="group">
        <div className="row">
          <span className="min-w-0">
            <span id={id} className="block">Uses per member</span>
            <span className="t-foot block">Each year. Most start with 2, up to 12.</span>
          </span>
          <span className="flex items-center gap-3" role="group" aria-labelledby={id}>
            <span className="tnum w-7 text-center text-[22px] font-semibold" aria-live="polite" data-testid="uses-per-year">
              {value}
            </span>
            <span className="flex overflow-hidden rounded-[9px]" style={{ background: "rgba(118,118,128,0.12)" }}>
              <button type="button" aria-label="Fewer uses" disabled={value <= 1} onClick={() => onChange(value - 1)} className="grid h-11 w-12 place-items-center disabled:opacity-30">
                <IMinus size={18} />
              </button>
              <span className="my-2.5 w-px" style={{ background: "var(--line)" }} />
              <button type="button" aria-label="More uses" disabled={value >= 12} onClick={() => onChange(value + 1)} className="grid h-11 w-12 place-items-center disabled:opacity-30">
                <IPlus size={18} />
              </button>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

const fmtDate = (d: string) => (d === DEMO_DATE ? "Today" : new Date(`${d}T12:00:00`).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" }));

export function Blackouts({ value, onChange }: { value: string[]; onChange: (d: string[]) => void }) {
  const id = useId();
  const [date, setDate] = useState("");
  return (
    <div>
      <label htmlFor={id} className="group-label block">
        Blackout dates (optional)
      </label>
      <div className="group">
        <div className="row py-1.5 pr-2">
          <input id={id} type="date" value={date} min={DEMO_DATE} onChange={(e) => setDate(e.target.value)} className="min-h-[44px] min-w-0 flex-1 bg-transparent outline-none" />
          <button
            type="button"
            disabled={!date}
            onClick={() => {
              if (!value.includes(date)) onChange([...value, date].sort());
              setDate("");
            }}
            className="link min-h-[44px] px-3 disabled:opacity-35"
          >
            Add
          </button>
        </div>
        {value.map((d) => (
          <div key={d} className="row">
            <span>{fmtDate(d)}</span>
            <button type="button" onClick={() => onChange(value.filter((x) => x !== d))} className="iconbtn -mr-3" aria-label={`Remove ${fmtDate(d)}`} style={{ color: "var(--sec)" }}>
              <IClose size={18} />
            </button>
          </div>
        ))}
      </div>
      <p className="group-foot">Holidays, events, your busiest weeks. Any, any time.</p>
    </div>
  );
}

export function PhotoPicker({ value, onChange }: { value: string; onChange: (dataUrl: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <div>
      <p className="group-label">Photo (optional)</p>
      <div className="group">
        <label className="row cursor-pointer focus-within:outline focus-within:outline-2">
          <span className="flex items-center gap-3">
            <ICamera size={20} />
            {busy ? "Adding photo…" : value ? "Change photo" : "Choose a photo"}
          </span>
          <input
            ref={ref}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              setErr(null);
              try {
                onChange(await resizePhoto(f));
              } catch {
                setErr("That photo didn't work. Try another one.");
              } finally {
                setBusy(false);
                if (ref.current) ref.current.value = "";
              }
            }}
          />
        </label>
        {value && (
          <button type="button" onClick={() => onChange("")} className="row" style={{ color: "var(--warn)" }}>
            Remove photo
          </button>
        )}
      </div>
      <div role="status" aria-live="polite">
        {err && (
          <div className="mt-2">
            <Note>{err}</Note>
          </div>
        )}
      </div>
      <p className="group-foot">It stays on this device. No photo? We use your colour and first letter.</p>
    </div>
  );
}

export function ColourPicker({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  return (
    <fieldset>
      <legend className="group-label">Colour</legend>
      <div className="group flex gap-3 px-4 py-3">
        {OWNER_COLOURS.map((c) => (
          <button
            key={c.hex}
            type="button"
            aria-pressed={value === c.hex}
            aria-label={c.name}
            onClick={() => onChange(c.hex)}
            className="size-11 rounded-full"
            style={{ background: c.hex, boxShadow: value === c.hex ? `0 0 0 2px var(--card), 0 0 0 4px ${c.hex}` : undefined }}
          />
        ))}
      </div>
    </fieldset>
  );
}

/** The Pause switch as a row, for a grouped list. */
export function PauseSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <div className="row">
      <span id={id}>Pause the offer</span>
      <button type="button" role="switch" aria-checked={value} aria-labelledby={id} onClick={() => onChange(!value)} className="switch-hit" data-testid="pause">
        <span className="switch" aria-hidden="true" data-on={value} />
      </button>
    </div>
  );
}
