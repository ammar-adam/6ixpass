"use client";

/*
 * Form pieces for the sign-in screens, iOS style: a label above each grouped
 * field, the right keyboard and autofill for each, errors under the field
 * they belong to (read out by screen readers), and a button that shows it's
 * working.
 */
import { useId, useState } from "react";
import { IEye, IEyeOff } from "./icons";

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "email" | "text" | "password" | "code";
  autoComplete?: string;
  error?: string | null;
  hint?: string;
  autoFocus?: boolean;
  placeholder?: string;
  id?: string;
  maxLength?: number;
};

export function Field({ label, value, onChange, type = "text", autoComplete, error, hint, autoFocus, placeholder, id, maxLength }: FieldProps) {
  const auto = useId();
  const fid = id ?? `f${auto}`;
  const [shown, setShown] = useState(false);
  const isPw = type === "password";
  const isCode = type === "code";
  const desc = [error ? `${fid}-err` : "", hint ? `${fid}-hint` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={fid} className="group-label block">
        {label}
      </label>
      <div className="field-box flex items-center" style={error ? { boxShadow: "inset 0 0 0 1.5px var(--warn)" } : undefined}>
        <input
          id={fid}
          value={value}
          onChange={(e) => onChange(isCode ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value)}
          type={isPw ? (shown ? "text" : "password") : type === "email" ? "email" : "text"}
          inputMode={type === "email" ? "email" : isCode ? "numeric" : undefined}
          autoComplete={autoComplete ?? (type === "email" ? "email" : isCode ? "one-time-code" : undefined)}
          autoCapitalize={type === "text" ? "words" : "none"}
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={desc}
          autoFocus={autoFocus}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`field min-w-0 flex-1 ${isCode ? "tnum text-[22px] tracking-[0.3em]" : ""}`}
        />
        {isPw && (
          <button type="button" className="iconbtn mr-1" onClick={() => setShown(!shown)} aria-label={shown ? "Hide password" : "Show password"} aria-pressed={shown}>
            {shown ? <IEyeOff size={20} /> : <IEye size={20} />}
          </button>
        )}
      </div>
      {hint && !error && (
        <p id={`${fid}-hint`} className="group-foot">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${fid}-err`} className="group-foot" style={{ color: "var(--warn)" }} role="alert" data-testid="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function Spinner({ light = true }: { light?: boolean }) {
  return <span aria-hidden="true" className="spinner" style={{ borderColor: light ? "rgba(255,255,255,0.35)" : "var(--line)", borderTopColor: light ? "#fff" : "var(--text)" }} />;
}

/** The main button of a form. While busy it says what's happening and can't be pressed twice. */
export function Submit({ children, busy, busyText, disabled, secondary = false }: { children: React.ReactNode; busy: boolean; busyText: string; disabled?: boolean; secondary?: boolean }) {
  return (
    <button type="submit" className={`btn press ${secondary ? "secondary" : ""}`} disabled={disabled || busy} aria-busy={busy || undefined}>
      {busy ? (
        <>
          <Spinner light={!secondary} />
          {busyText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** A form-wide message (wrong password, no connection). */
export function FormError({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="note" role="alert" data-testid="form-error">
      {children}
    </p>
  );
}

/** The quiet box that says these are demo accounts, with a button to fill them in. */
export function DemoNote({ children, onFill, fillLabel = "Fill in" }: { children: React.ReactNode; onFill?: () => void; fillLabel?: string }) {
  return (
    <div className="group flex items-start justify-between gap-3 p-4" data-testid="demo-note">
      <p className="t-foot">
        <span className="eyebrow accent mb-1 block">Demo</span>
        {children}
      </p>
      {onFill && (
        <button type="button" onClick={onFill} className="chip press shrink-0">
          {fillLabel}
        </button>
      )}
    </div>
  );
}

/** A neighbourhood picker, as a native select (the iPhone shows its wheel). */
export function Select({ label, value, onChange, options, placeholder = "Choose" }: { label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="group-label block">
        {label}
      </label>
      <div className="field-box relative">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="field appearance-none bg-transparent pr-10">
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--ter)" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
