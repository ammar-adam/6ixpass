"use client";

/*
 * /app/live: pair two phones. One is the place's staff, the other the member.
 * Reached from Nida's start screen ("Two phones").
 */
import Link from "next/link";
import { useMeetingDemo } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cleanRoom, liveAvailable, newRoom, setLive, useLiveSettings, useLiveView } from "../live";
import { LiveStatus } from "../LiveLink";
import { OWNER_ID } from "../owner";
import { place, useMock } from "../store";
import { IBack, IChev } from "../icons";
import { NavBar } from "../ui";
import { Note } from "./owner/controls";

export function LiveSetup() {
  const router = useRouter();
  useMeetingDemo();
  const s = useMock();
  const settings = useLiveSettings();
  const view = useLiveView();
  const own = place(s, OWNER_ID);
  const [joining, setJoining] = useState(false);
  const [room, setRoom] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const back = (
    <Link href="/partners-demo" aria-label="Back" className="iconbtn">
      <IBack />
    </Link>
  );

  if (!liveAvailable()) {
    return (
      <div className="a-fade pb-10">
        <NavBar left={back} title="Two phones" />
        <p className="m t-sub mt-4">Two phones needs the live connection, which isn’t set up in this build.</p>
      </div>
    );
  }

  if (settings) {
    const staff = settings.role === "staff";
    return (
      <div className="a-fade pb-10">
        <NavBar left={back} title="Two phones" />
        <header className="m pt-2">
          <p className="eyebrow">{staff ? "This phone is the place" : "This phone is the member"}</p>
          <h1 className="t-large mt-1">{staff ? (own?.name ?? "The place") : (view.placeName ?? own?.name ?? "Joining")}</h1>
          <LiveStatus className="mt-2" />
        </header>
        <div className="m mt-5">
          <div className="card p-5 text-center">
            <p className="eyebrow">Room</p>
            <p className="tnum mt-1 text-[52px] font-bold tracking-[0.18em]" data-testid="room">
              {settings.room}
            </p>
            <p className="t-sub mt-1">{staff ? "On the member phone: hold the logo, Two phones, This phone is the member, then type this room." : "Joined. The place shows first in the app."}</p>
          </div>
        </div>
        <div className="m mt-5 space-y-2.5">
          {staff ? (
            <Link href="/app/staff" className="btn press">
              Check a code
            </Link>
          ) : (
            <Link href="/app" className="btn press">
              Open the app
            </Link>
          )}
          <button type="button" className="btn secondary press" onClick={() => setLive(null)}>
            Stop two phones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="a-fade pb-10">
      <NavBar left={back} title="Two phones" />
      <header className="m pt-2">
        <h1 className="t-large">Two phones</h1>
        <p className="t-sub mt-1.5 text-[17px] leading-[1.4]">One phone is the member. The other is the place’s staff. The member shows a code, staff scan it, and the visit lands on the owner’s dashboard. Both phones need signal.</p>
      </header>
      <div className="m mt-5">
        <div className="group">
          <button
            type="button"
            className="row press"
            onClick={() => {
              if (!own) return setErr("Set up the place on this phone first: the gear on the start screen.");
              setLive({ role: "staff", room: newRoom() });
            }}
          >
            <span className="min-w-0">
              <span className="block">This phone is the place</span>
              <span className="t-foot block">Staff check codes here. Shows the room to join.</span>
            </span>
            <IChev className="chev" />
          </button>
          <button type="button" className="row press" aria-expanded={joining} onClick={() => setJoining(true)}>
            <span className="min-w-0">
              <span className="block">This phone is the member</span>
              <span className="t-foot block">Type the room from the other phone.</span>
            </span>
            <IChev className="chev" />
          </button>
        </div>
      </div>
      {joining && (
        <form
          className="m mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (room.length !== 4) return setErr("The room is 4 letters and numbers, on the other phone.");
            setLive({ role: "member", room });
            router.push("/app/live");
          }}
        >
          <label htmlFor="live-room" className="group-label block">
            Room
          </label>
          <div className="field-box">
            <input
              id="live-room"
              value={room}
              onChange={(e) => {
                setErr(null);
                setRoom(cleanRoom(e.target.value));
              }}
              autoCapitalize="characters"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              maxLength={4}
              placeholder="K7QD"
              className="field tnum text-[22px] tracking-[0.2em]"
              autoFocus
            />
          </div>
          <button type="submit" className="btn press mt-4" disabled={room.length !== 4}>
            Join
          </button>
        </form>
      )}
      <div role="status" aria-live="polite" className="m mt-4">
        {err && <Note>{err}</Note>}
      </div>
    </div>
  );
}
