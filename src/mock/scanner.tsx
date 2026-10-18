"use client";

/*
 * The staff camera. Two ways in:
 *
 * - iPhone app: Apple's own camera scanner through the official Capacitor
 *   plugin (@capacitor/barcode-scanner: AVFoundation, full screen, with a
 *   light button). Reads the QR and the Code 128 barcode.
 * - Browsers (and the iPhone app if the plugin is missing): the camera in the
 *   page. BarcodeDetector where the browser has it (Chrome on Android), jsQR
 *   everywhere else (Safari, WKWebView, desktop). Light button when the
 *   camera supports it.
 *
 * Calls onCode once with the six digits, then waits to be started again.
 * Never makes a sound; the success haptic is the caller's.
 */
import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import jsQR from "jsqr";
import { appCopy } from "@/content/app";
import { codeFromQr } from "./live";
import { ICamera, ITorch } from "./icons";

const C = appCopy.scan;

/** "T6P:123456" from a QR or barcode, or six digits on their own. */
export const codeFromScan = (text: string) => codeFromQr(text) ?? (/^\s*(\d{6})\s*$/.exec(text)?.[1] ?? null);

type Props = { onCode: (code: string) => void; onError: (message: string) => void; height?: number };

export function Scanner(props: Props) {
  const [web, setWeb] = useState(() => !Capacitor.isNativePlatform());
  return web ? <WebScanner {...props} /> : <NativeScanner {...props} onUnavailable={() => setWeb(true)} />;
}

/* ---------- iPhone: the native scanner ---------- */

function NativeScanner({ onCode, onError, onUnavailable, height = 300 }: Props & { onUnavailable: () => void }) {
  const [busy, setBusy] = useState(false);
  const open = async () => {
    setBusy(true);
    try {
      const { CapacitorBarcodeScanner } = await import("@capacitor/barcode-scanner");
      const r = await CapacitorBarcodeScanner.scanBarcode({
        hint: 17, // every format: QR and Code 128
        scanInstructions: C.point,
        scanButton: false,
        cameraDirection: 1,
        scanOrientation: 1,
        cancelButtonAccessibilityLabel: "Cancel",
        torchButtonOnAccessibilityLabel: C.torchOff,
        torchButtonOffAccessibilityLabel: C.torchOn,
      });
      const code = codeFromScan(r.ScanResult ?? "");
      if (code) onCode(code);
      else onError("That isn't a 6 Pass code. Ask the member to open their code in the app.");
    } catch (e) {
      const code = String((e as { code?: string })?.code ?? "");
      if (/0006$/.test(code)) {
        /* cancelled: stay here, they can type the code */
      } else if (/0007$/.test(code)) onError("Camera access is off. Turn it on in Settings, The 6 Pass, Camera. Or type the code.");
      else if (/UNIMPLEMENTED|not implemented/i.test(String(e)) || code === "UNIMPLEMENTED") onUnavailable();
      else onError("The camera didn't start. Type the code instead.");
    } finally {
      setBusy(false);
    }
  };
  const once = useRef(false);
  useEffect(() => {
    if (once.current) return;
    once.current = true;
    void open();
    // Open straight to the camera, once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="scanbox grid place-items-center" style={{ height }}>
      <button type="button" className="btn press w-auto px-6" style={{ background: "#fff", color: "#16140F" }} onClick={open} disabled={busy}>
        <ICamera />
        {C.openCamera}
      </button>
    </div>
  );
}

/* ---------- Browsers: the camera in the page ---------- */

type Detector = { detect: (src: CanvasImageSource) => Promise<{ rawValue: string }[]> };
type DetectorCtor = { new (o: { formats: string[] }): Detector; getSupportedFormats?: () => Promise<string[]> };

function WebScanner({ onCode, onError, height = 300 }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [torch, setTorch] = useState<null | boolean>(null);
  const [hit, setHit] = useState(false);
  const [restart, setRestart] = useState(0);
  const track = useRef<MediaStreamTrack | null>(null);
  const cb = useRef({ onCode, onError });
  useEffect(() => {
    cb.current = { onCode, onError };
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let stream: MediaStream | null = null;
    let raf = 0;
    let last = 0;
    let stopped = false;
    let busy = false;
    let detector: Detector | null = null;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const stop = () => {
      stopped = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
      track.current = null;
    };
    const found = (text: string) => {
      const code = codeFromScan(text);
      if (!code || stopped) return false;
      setHit(true);
      stop();
      cb.current.onCode(code);
      return true;
    };
    const look = async (t: number) => {
      if (stopped) return;
      raf = requestAnimationFrame(look);
      if (busy || t - last < 120 || video.readyState < 2 || !video.videoWidth) return;
      last = t;
      busy = true;
      try {
        if (detector) {
          const hits = await detector.detect(video);
          for (const h of hits) if (found(h.rawValue)) return;
        } else if (ctx) {
          const w = Math.min(640, video.videoWidth);
          const h = Math.round((video.videoHeight / video.videoWidth) * w);
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(video, 0, 0, w, h);
          const r = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: "dontInvert" });
          if (r) found(r.data);
        }
      } catch {
        detector = null; // fall back to jsQR
      } finally {
        busy = false;
      }
    };
    const start = async () => {
      if (!navigator.mediaDevices?.getUserMedia) return cb.current.onError("This phone can't open the camera here. Type the code instead.");
      try {
        const Ctor = (window as unknown as { BarcodeDetector?: DetectorCtor }).BarcodeDetector;
        if (Ctor) {
          const supported = (await Ctor.getSupportedFormats?.()) ?? [];
          const want = ["qr_code", "code_128"].filter((f) => supported.includes(f));
          if (want.length) detector = new Ctor({ formats: want });
        }
      } catch {
        detector = null;
      }
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
        if (stopped) return s.getTracks().forEach((x) => x.stop());
        stream = s;
        const tr = s.getVideoTracks()[0] ?? null;
        track.current = tr;
        const caps = (tr?.getCapabilities?.() ?? {}) as { torch?: boolean };
        setTorch(caps.torch ? false : null);
        tr?.addEventListener("ended", () => !stopped && setRestart((n) => n + 1));
        video.srcObject = s;
        video.setAttribute("playsinline", "true");
        await video.play().catch(() => {});
        raf = requestAnimationFrame(look);
      } catch (e) {
        const name = (e as Error)?.name;
        cb.current.onError(name === "NotAllowedError" || name === "SecurityError" ? "Camera access is off. Allow it in your settings, or type the code instead." : name === "NotFoundError" ? "No camera found. Type the code instead." : "The camera didn't start. Type the code instead.");
      }
    };
    void start();
    // The iPhone stops the camera when the app goes to the background: start it again on return.
    const onVis = () => {
      if (document.visibilityState === "visible" && (!track.current || track.current.readyState === "ended") && !stopped) setRestart((n) => n + 1);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      stop();
    };
  }, [restart]);

  const toggleTorch = async () => {
    const tr = track.current;
    if (!tr || torch === null) return;
    try {
      await tr.applyConstraints({ advanced: [{ torch: !torch } as MediaTrackConstraintSet] });
      setTorch(!torch);
    } catch {
      setTorch(null);
    }
  };

  return (
    <div className="scanbox" style={{ height }} data-testid="scanner">
      <video ref={videoRef} playsInline muted autoPlay aria-label="Camera, looking for the member's code" />
      <span aria-hidden="true" className={`viewfinder ${hit ? "hit" : ""}`}>
        <i />
        <i />
        <i />
        <i />
        {!hit && <span className="scanline" />}
      </span>
      <p className="absolute inset-x-0 bottom-3 text-center text-[15px] font-semibold text-white" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
        {C.point}
      </p>
      {torch !== null && (
        <button type="button" onClick={toggleTorch} className="glass absolute right-3 top-3" aria-pressed={torch} aria-label={torch ? C.torchOff : C.torchOn}>
          <ITorch />
        </button>
      )}
    </div>
  );
}
