"use client";

/*
 * Keeps the two-phone link running while the app is open (mounted once in the
 * app shell), and tells the other phone when something here changes.
 */
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { announceCodes, codeFromQr, sharePlace, startLink, useLiveSettings, useLiveView } from "./live";
import { OWNER_ID } from "./owner";
import { useMock } from "./store";

export function LiveLink() {
  const settings = useLiveSettings();
  const s = useMock();
  const role = settings?.role;
  const room = settings?.room;

  useEffect(() => startLink(role && room ? { role, room } : null), [role, room]);

  // Staff: the place or its offer changed here, so send it to the member phone.
  const placeSig = role === "staff" ? JSON.stringify([s.owner, s.offers[OWNER_ID]]) : "";
  useEffect(() => {
    if (placeSig) sharePlace();
  }, [placeSig]);

  // Member: a code just appeared on this phone, so tell the staff phone straight away.
  const codeSig = role === "member" ? s.redemptions.filter((r) => r.partnerId === OWNER_ID && r.status === "issued").map((r) => r.code).join(",") : "";
  useEffect(() => {
    if (codeSig) announceCodes();
  }, [codeSig]);

  return null;
}

/** A small "Connected" line with a dot, for the live screens. */
export function LiveStatus({ className = "" }: { className?: string }) {
  const v = useLiveView();
  const settings = useLiveSettings();
  if (!settings) return null;
  const other = settings.role === "staff" ? "member phone" : "staff phone";
  const [text, colour] =
    v.status === "live"
      ? v.peer
        ? [`Connected to the ${other}`, "var(--ok)"]
        : [`Waiting for the ${other}`, "var(--accent)"]
      : v.status === "connecting"
        ? ["Connecting", "var(--sec)"]
        : ["No signal. Trying again", "var(--warn)"];
  return (
    <p className={`t-foot flex items-center gap-2 ${className}`} role="status" data-testid="live-status">
      <span aria-hidden="true" className="inline-block size-2 rounded-full" style={{ background: colour }} />
      {text}
    </p>
  );
}

/** The member's code as a QR, for staff to scan. */
export function CodeQr({ text, size = 168 }: { text: string; size?: number }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    let on = true;
    QRCode.toString(text, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#16140F", light: "#FFFFFF" } })
      .then((s) => on && setSvg(s))
      .catch(() => {});
    return () => {
      on = false;
    };
  }, [text]);
  return <span role="img" aria-label="QR code of your member code" data-testid="qr" className="block rounded-[10px] bg-white p-1.5" style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: svg.replace("<svg", '<svg width="100%" height="100%"') }} />;
}

/**
 * The staff phone's camera, looking for a member's QR code. Calls onCode
 * with the 6 digits once, then stops the camera.
 */
export function QrScanner({ onCode, onError }: { onCode: (code: string) => void; onError: (message: string) => void }) {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (!video) return;
    let stream: MediaStream | null = null;
    let raf = 0;
    let last = 0;
    let stopped = false;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const stop = () => {
      stopped = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
    const look = (t: number) => {
      if (stopped) return;
      raf = requestAnimationFrame(look);
      if (t - last < 140 || video.readyState < 2 || !ctx) return;
      last = t;
      const w = 480;
      const h = Math.round((video.videoHeight / video.videoWidth) * w) || 480;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(video, 0, 0, w, h);
      const hit = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: "dontInvert" });
      const code = hit ? codeFromQr(hit.data) : null;
      if (code) {
        stop();
        onCode(code);
      }
    };
    if (!navigator.mediaDevices?.getUserMedia) {
      onError("This phone can't open the camera here. Type the code instead.");
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((s) => {
        if (stopped) return s.getTracks().forEach((t) => t.stop());
        stream = s;
        video.srcObject = s;
        video.play().catch(() => {});
        raf = requestAnimationFrame(look);
      })
      .catch((e: Error) => onError(e?.name === "NotAllowedError" ? "Camera access is off. Allow it in Settings, or type the code instead." : "The camera didn't start. Type the code instead."));
    return stop;
  }, [video, onCode, onError]);
  return (
    <div className="relative overflow-hidden rounded-[14px] bg-black" style={{ aspectRatio: "1" }}>
      <video ref={setVideo} playsInline muted autoPlay className="absolute inset-0 size-full object-cover" aria-label="Camera, looking for the member's QR code" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-[18%] rounded-[18px]" style={{ boxShadow: "0 0 0 2px rgba(255,255,255,0.9), 0 0 0 999px rgba(0,0,0,0.35)" }} />
    </div>
  );
}
