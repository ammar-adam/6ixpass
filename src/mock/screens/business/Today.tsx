"use client";

/* /app/business/today: the visits confirmed today at this place. Staff and owners. */
import { useEffect } from "react";
import { auth } from "@/lib/auth";
import { ICheck } from "../../icons";
import { useMock } from "../../store";
import { NavBar, splitCode, useNow } from "../../ui";
import { BusinessMark, PartnerFooter, usePartnerPlace } from "./common";

export function ago(ms: number) {
  if (ms < 60_000) return "Just now";
  const m = Math.round(ms / 60_000);
  if (m < 60) return `${m} min ago`;
  return `${Math.round(m / 60)} hr ago`;
}

export function Today() {
  const s = useMock();
  const p = usePartnerPlace();
  const now = useNow();
  useEffect(() => {
    void auth.refresh("place");
    const t = window.setInterval(() => void auth.refresh("place"), 15_000);
    return () => window.clearInterval(t);
  }, []);
  if (!p) return null;
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const visits = s.redemptions.filter((r) => r.partnerId === p.id && r.status === "confirmed" && (r.confirmedAt ?? 0) >= start.getTime()).sort((a, b) => (b.confirmedAt ?? 0) - (a.confirmedAt ?? 0));
  return (
    <div className="a-fade pb-28">
      <NavBar left={<span className="pl-3"><BusinessMark /></span>} />
      <header className="m pt-1">
        <p className="eyebrow">Today</p>
        <h1 className="display mt-1.5 text-[38px]">{p.name}</h1>
        <p className="t-sub mt-1.5" data-testid="today-count">
          {visits.length} {visits.length === 1 ? "member visit" : "member visits"} so far
        </p>
      </header>
      <div className="m mt-5">
        {visits.length ? (
          <ul className="group" data-testid="today-visits">
            {visits.map((r) => (
              <li key={r.id} className="row inset">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full" style={{ background: "var(--fill)", color: "var(--ok)" }}>
                    <ICheck size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[16px] font-semibold">{r.memberName || "Member"}</span>
                    <span className="t-foot block truncate">
                      {r.offer.replace(/\.$/, "")}
                      {r.code ? ` · ${splitCode(r.code)}` : ""}
                    </span>
                  </span>
                </span>
                <span className="v text-[15px]">{ago(now ? now - (r.confirmedAt ?? 0) : 0)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="group t-sub p-4">No visits yet today. Confirmed codes show here straight away.</p>
        )}
      </div>
      <PartnerFooter />
    </div>
  );
}
