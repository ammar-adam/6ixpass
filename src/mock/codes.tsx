"use client";

/*
 * The member's code, drawn so a phone camera reads it from another phone's
 * screen: a QR (what our scanner and most cameras read first) and a Code 128
 * barcode (what host-stand scanners and the iPhone's native scanner read
 * too). Both hold the same text, "T6P:" and the six digits.
 */
import { useMemo } from "react";
import CODE128B from "jsbarcode/bin/barcodes/CODE128/CODE128B.js";
import { CodeQr } from "./LiveLink";

/** Bars as a string of 1s and 0s, one per module. */
export function code128Bars(text: string) {
  try {
    const b = new CODE128B(text, {});
    return b.valid() ? b.encode().data : "";
  } catch {
    return "";
  }
}

export function CodeBarcode({ text, height = 64 }: { text: string; height?: number }) {
  const bars = useMemo(() => code128Bars(text), [text]);
  if (!bars) return null;
  // Quiet zone of 10 modules each side, as the spec asks.
  const q = 10;
  const w = bars.length + q * 2;
  const rects: React.ReactNode[] = [];
  for (let i = 0; i < bars.length; ) {
    if (bars[i] !== "1") {
      i++;
      continue;
    }
    let j = i;
    while (bars[j] === "1") j++;
    rects.push(<rect key={i} x={q + i} y={0} width={j - i} height={height} />);
    i = j;
  }
  return (
    <svg role="img" aria-label="Barcode of your member code" data-testid="barcode" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="block w-full rounded-[8px] bg-white" style={{ height, shapeRendering: "crispEdges" }} fill="#16140F">
      {rects}
    </svg>
  );
}

/** QR on top, barcode under it, on white so it scans in a dim room. */
export function ScanCodes({ text, qrSize = 236 }: { text: string; qrSize?: number }) {
  return (
    <div className="rounded-[14px] bg-white p-3" data-testid="scan-codes">
      <div className="flex justify-center">
        <CodeQr text={text} size={qrSize} />
      </div>
      <div className="mt-2 px-1">
        <CodeBarcode text={text} />
      </div>
    </div>
  );
}
