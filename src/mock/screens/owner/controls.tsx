"use client";

/*
 * The pieces the onboarding, Nida's quick setup sheet and the owner
 * dashboard share, so an offer is edited the same way everywhere.
 */
import { useId, useRef, useState } from "react";
import { CalendarX, Camera, Minus, Plus, Trash, X } from "@phosphor-icons/react";
import { DAY_NAMES, DAY_SHORT } from "@/demo/data";
import { DEMO_DATE, type OfferKind } from "../../store";
import { ALCOHOL, ALCOHOL_NOTE, OWNER_COLOURS, resizePhoto } from "../../owner";
import { C, label } from "../../ui";

export const fieldCls = "block w-full rounded-2xl border px-4 py-3 text-[16px] outline-none focus:ring-2 focus:ring-[#A9D1FF]";
export const fieldStyle = { background: C.bg, borderColor: C.line, color: C.text };
const choiceOn = { background: C.ice, color: C.iceInk, borderColor: C.ice };
const choiceOff = { borderColor: C.line, color: C.soft };

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl px-4 py-3 text-[14px] font-semibold" style={{ background: "rgba(255,201,163,0.14)", color: C.warn }}>
      {children}
    </p>
  );
}

/** Big tappable choices, one per row or in a grid. */
export function Choices<T extends string>({
  legend,
  options,
  value,
  onChange,
  cols = 1,
}: {
  legend: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  cols?: 1 | 2;
}) {
  return (
    <fieldset>
      <legend className={label} style={{ color: C.muted }}>{legend}</legend>
      <div className={`mt-2 grid gap-2 ${cols === 2 ? "grid-cols-2" : ""}`}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
            className="m-press min-h-[48px] rounded-2xl border px-4 text-left text-[15px] font-semibold"
            style={value === o.id ? choiceOn : choiceOff}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function KindToggle({ value, onChange }: { value: OfferKind; onChange: (k: OfferKind) => void }) {
  return (
    <Choices
      legend="Offer"
      cols={2}
      value={value}
      onChange={onChange}
      options={[
        { id: "two_for_one", label: "Two-for-one" },
        { id: "upgrade", label: "Free upgrade or add-on" },
      ]}
    />
  );
}

/** The offer line. Refuses alcohol and says why. */
export function OfferLine({ value, onChange, id }: { value: string; onChange: (v: string) => void; id?: string }) {
  const auto = useId();
  const fid = id ?? auto;
  const [note, setNote] = useState<string | null>(null);
  return (
    <div>
      <label htmlFor={fid} className={label} style={{ color: C.muted }}>What members get</label>
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
        className={`${fieldCls} mt-2`}
        style={fieldStyle}
      />
      <div role="status" aria-live="polite" className="mt-2">{note && <Note>{note}</Note>}</div>
      <p className="text-[13px]" style={{ color: C.muted }}>Food, services and non-alcoholic drinks only.</p>
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
      <legend className={label} style={{ color: C.muted }}>Days it runs</legend>
      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {DAY_SHORT.map((d, i) => (
          <button
            key={d}
            type="button"
            aria-pressed={value[i]}
            aria-label={DAY_NAMES[i]}
            onClick={() => {
              if (strict && value[i] && count <= 3) return setRefused(`Keep at least 3 days. Add another day before taking ${DAY_NAMES[i]} off.`);
              setRefused(null);
              onChange(value.map((v, j) => (j === i ? !v : v)));
            }}
            className="min-h-[48px] rounded-xl border text-[13px] font-bold"
            style={value[i] ? choiceOn : { borderColor: C.line, color: C.muted }}
          >
            {d}
          </button>
        ))}
      </div>
      <div role="status" aria-live="polite" className="mt-3">
        {refused ? (
          <Note>{refused}</Note>
        ) : count < 3 ? (
          <Note>Pick at least 3 days. You have {count === 0 ? "none" : count === 1 ? "1 day" : `${count} days`} so far.</Note>
        ) : (
          <p className="text-[13px]" style={{ color: C.muted }}>At least three days a week. Leave out your busy nights.</p>
        )}
      </div>
    </fieldset>
  );
}

export function UsesStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p id={id} className={label} style={{ color: C.muted }}>Uses per member a year</p>
        <p className="mt-1 text-[13px]" style={{ color: C.muted }}>Most start with 2. Up to 12.</p>
      </div>
      <div className="flex items-center gap-3" role="group" aria-labelledby={id}>
        <button type="button" aria-label="Fewer uses" disabled={value <= 1} onClick={() => onChange(value - 1)} className="grid size-12 place-items-center rounded-full border disabled:opacity-40" style={{ borderColor: C.line }}>
          <Minus size={18} weight="bold" aria-hidden="true" />
        </button>
        <span className="tabular w-8 text-center text-[32px] font-bold leading-none" aria-live="polite" data-testid="uses-per-year">{value}</span>
        <button type="button" aria-label="More uses" disabled={value >= 12} onClick={() => onChange(value + 1)} className="grid size-12 place-items-center rounded-full border disabled:opacity-40" style={{ borderColor: C.line }}>
          <Plus size={18} weight="bold" aria-hidden="true" />
        </button>
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
      <label htmlFor={id} className={label} style={{ color: C.muted }}>Blackout dates (optional)</label>
      <div className="mt-2 flex gap-2">
        <input id={id} type="date" value={date} min={DEMO_DATE} onChange={(e) => setDate(e.target.value)} className={`${fieldCls} min-w-0 flex-1 [color-scheme:dark]`} style={fieldStyle} />
        <button
          type="button"
          disabled={!date}
          onClick={() => {
            if (!value.includes(date)) onChange([...value, date].sort());
            setDate("");
          }}
          className="min-h-[48px] rounded-2xl px-5 font-bold disabled:opacity-40"
          style={{ background: C.ice, color: C.iceInk }}
        >
          Add
        </button>
      </div>
      {value.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {value.map((d) => (
            <li key={d}>
              <button type="button" onClick={() => onChange(value.filter((x) => x !== d))} className="flex min-h-[44px] items-center gap-1.5 rounded-full border px-3 text-[14px] font-semibold" style={{ borderColor: C.line }}>
                <CalendarX size={15} aria-hidden="true" />
                {fmtDate(d)}
                <X size={13} aria-hidden="true" />
                <span className="sr-only">remove</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-[13px]" style={{ color: C.muted }}>Holidays, events, your busiest weeks. Any, any time.</p>
      )}
    </div>
  );
}

export function PhotoPicker({ value, onChange }: { value: string; onChange: (dataUrl: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <div>
      <p className={label} style={{ color: C.muted }}>Photo (optional)</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <label className="m-press flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl border px-4 text-[15px] font-semibold focus-within:ring-2 focus-within:ring-[#A9D1FF]" style={{ borderColor: C.line }}>
          <Camera size={20} aria-hidden="true" />
          {busy ? "Adding photo…" : value ? "Change photo" : "Choose a photo"}
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
          <button type="button" onClick={() => onChange("")} className="flex min-h-[48px] items-center gap-2 rounded-2xl border px-4 text-[15px] font-semibold" style={{ borderColor: C.line }}>
            <Trash size={18} aria-hidden="true" />
            Remove photo
          </button>
        )}
      </div>
      <div role="status" aria-live="polite">{err && <div className="mt-2"><Note>{err}</Note></div>}</div>
      <p className="mt-2 text-[13px]" style={{ color: C.muted }}>It stays on this phone. No photo? We use your colour and first letter.</p>
    </div>
  );
}

export function ColourPicker({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  return (
    <fieldset>
      <legend className={label} style={{ color: C.muted }}>Colour</legend>
      <div className="mt-2 flex flex-wrap gap-3">
        {OWNER_COLOURS.map((c) => (
          <button
            key={c.hex}
            type="button"
            aria-pressed={value === c.hex}
            aria-label={c.name}
            onClick={() => onChange(c.hex)}
            className="size-12 rounded-full border-2"
            style={{ background: c.hex, borderColor: value === c.hex ? C.text : "transparent", boxShadow: value === c.hex ? `inset 0 0 0 3px ${C.bg}` : undefined }}
          />
        ))}
      </div>
    </fieldset>
  );
}

export function PauseSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p id={id} className="text-[16px] font-semibold">Pause the offer</p>
        <p className="text-[13px]" style={{ color: C.muted }}>{value ? "Members see “Paused by the venue”." : "Members can redeem on your days."}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-labelledby={id}
        onClick={() => onChange(!value)}
        className="flex h-[34px] w-[58px] shrink-0 items-center rounded-full p-[3px] transition-colors motion-reduce:transition-none"
        style={{ background: value ? C.warn : "rgba(255,255,255,0.16)", justifyContent: value ? "flex-end" : "flex-start" }}
        data-testid="pause"
      >
        <span className="size-7 rounded-full" style={{ background: value ? C.iceInk : C.text }} />
      </button>
    </div>
  );
}
