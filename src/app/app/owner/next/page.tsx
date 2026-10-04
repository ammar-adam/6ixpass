import type { Metadata } from "next";
import QRCode from "qrcode";
import { SITE_URL } from "@/lib/siteUrl";
import { NextStep } from "@/mock/screens/owner/NextStep";

export const metadata: Metadata = { title: "Next step" };

export default async function Page() {
  // The owner's own copy of the terms. Drawn at build time so it works offline.
  const url = `${SITE_URL}/owners`;
  const qrSvg = await QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#0A1424", light: "#FFFFFF" } });
  const shortLink = url.replace(/^https?:\/\/(www\.)?/, "");
  return <NextStep qrSvg={qrSvg} shortLink={shortLink} url={url} />;
}
