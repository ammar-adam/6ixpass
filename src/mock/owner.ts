/*
 * The owner's own place in the demo: what the onboarding (and Nida's quick
 * setup sheet) collects, and the wording each step starts from. The owner
 * types their own name; nothing here is a real business.
 */
import type { Category } from "@/demo/data";
import type { OfferKind } from "./store";

/** The owner's place always has this id, so its pages exist in the static export. */
export const OWNER_ID = "your-place";

export type OwnerCategory = "restaurant" | "cafe" | "spa" | "studio" | "hotel" | "experience";

export const OWNER_CATEGORIES: { id: OwnerCategory; label: string; appCategory: Category }[] = [
  { id: "restaurant", label: "Restaurant", appCategory: "Dining" },
  { id: "cafe", label: "Café", appCategory: "Dining" },
  { id: "spa", label: "Spa", appCategory: "Spa and wellness" },
  { id: "studio", label: "Studio", appCategory: "Studios" },
  { id: "hotel", label: "Hotel restaurant or spa", appCategory: "Hotels" },
  { id: "experience", label: "Experience", appCategory: "Experiences" },
];

export const categoryLabel = (c: OwnerCategory) => OWNER_CATEGORIES.find((x) => x.id === c)?.label ?? "Restaurant";

/** "Elsewhere in Toronto" covers anyone outside the six launch neighbourhoods. */
export const OWNER_HOODS = ["Financial District", "King West", "Queen West", "Ossington", "Yorkville", "Leslieville", "Elsewhere in Toronto"];

type Preset = { offer: string; detail: string };

/*
 * The offer line each category starts with. Spas start on the upgrade: the
 * pass gives a free upgrade on a bigger treatment, not a second treatment.
 * Food, services and non-alcoholic drinks only.
 */
export const OFFER_START: Record<OwnerCategory, { kind: OfferKind } & Record<OfferKind, Preset>> = {
  restaurant: {
    kind: "two_for_one",
    two_for_one: { offer: "Second main, on us.", detail: "Order two mains and the second one is on the house." },
    upgrade: { offer: "Dessert for the table, on us.", detail: "Order two mains and dessert for the table is on the house." },
  },
  cafe: {
    kind: "two_for_one",
    two_for_one: { offer: "Second coffee, on us.", detail: "Order two coffees and the second one is on the house." },
    upgrade: { offer: "A free pastry with your coffee.", detail: "Order a coffee and a pastry is on the house." },
  },
  spa: {
    kind: "upgrade",
    two_for_one: { offer: "Bring a guest, free.", detail: "Book a circuit or class pass and your guest comes in free." },
    upgrade: { offer: "A free upgrade on your treatment.", detail: "Book a 60-minute treatment and it becomes 90 minutes." },
  },
  studio: {
    kind: "two_for_one",
    two_for_one: { offer: "Bring a friend to class, free.", detail: "Book a class and bring a friend to the same one, free." },
    upgrade: { offer: "A free add-on with your class.", detail: "Book a class and a small extra is on the house." },
  },
  hotel: {
    kind: "two_for_one",
    two_for_one: { offer: "Lunch in the dining room, second main on us.", detail: "Lunch for two, and the second main is on the house." },
    upgrade: { offer: "A free upgrade on your spa treatment.", detail: "Book a 60-minute treatment and it becomes 90 minutes." },
  },
  experience: {
    kind: "two_for_one",
    two_for_one: { offer: "A second spot, on us.", detail: "Book one spot and the second is free." },
    upgrade: { offer: "A free add-on with your booking.", detail: "Book a spot and a small extra is on the house." },
  },
};

/** The detail line only shows while the offer is still the suggested wording, so it never contradicts what the owner typed. */
export function detailFor(category: OwnerCategory, kind: OfferKind, offer: string) {
  const p = OFFER_START[category][kind];
  return offer.trim() === p.offer ? p.detail : "";
}

/** Nida's five colours. Names are for screen readers. */
export const OWNER_COLOURS = [
  { hex: "#C8372A", name: "Red" },
  { hex: "#2E5E4E", name: "Green" },
  { hex: "#3B4A8C", name: "Blue" },
  { hex: "#8A5A2B", name: "Brown" },
  { hex: "#6B3A5E", name: "Plum" },
];

export type OwnerPlace = {
  name: string;
  category: OwnerCategory;
  neighbourhood: string;
  /** A JPEG data URL made in the browser, or "" for the colour and initial. */
  photo: string;
  colour: string;
};

/** Everything the onboarding collects, kept while it's in progress so a refresh doesn't lose it. */
export type OwnerDraft = OwnerPlace & {
  kind: OfferKind;
  offer: string;
  days: boolean[];
  usesPerYear: number;
  blackoutDates: string[];
};

export function blankDraft(): OwnerDraft {
  return {
    name: "",
    category: "restaurant",
    neighbourhood: "Ossington",
    photo: "",
    colour: OWNER_COLOURS[0].hex,
    kind: OFFER_START.restaurant.kind,
    offer: OFFER_START.restaurant.two_for_one.offer,
    days: [true, true, true, true, false, false, false],
    usesPerYear: 2,
    blackoutDates: [],
  };
}

/** First letter or digit of the name, for the colour tile when there's no photo. */
export const initialOf = (name: string) => (name.replace(/[^\p{L}\p{N}]/gu, "").charAt(0) || "?").toUpperCase();

const SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** "Mon to Thu", "Every day", or "Mon, Wed, Fri". */
export function daysText(days: boolean[]) {
  const on = days.map((d, i) => (d ? i : -1)).filter((i) => i >= 0);
  if (on.length === 0) return "No days yet";
  if (on.length === 7) return "Every day";
  const runs: number[][] = [];
  for (const i of on) {
    const last = runs[runs.length - 1];
    if (last && last[last.length - 1] === i - 1) last.push(i);
    else runs.push([i]);
  }
  return runs.map((r) => (r.length >= 3 ? `${SHORT[r[0]]} to ${SHORT[r[r.length - 1]]}` : r.map((i) => SHORT[i]).join(", "))).join(", ");
}

// Ontario doesn't allow two-for-one on alcohol, so offers never mention it.
export const ALCOHOL = /\b(wine|beer|cocktails?|sake|spirits|prosecco|champagne|liquor|booze|happy hour|pints?|alcohol)\b/i;
export const ALCOHOL_NOTE = "Offers can't include alcohol. Food, services and non-alcoholic drinks only.";

/** Shrinks a photo from the phone to 900px on the long side, as a JPEG data URL. It never leaves the browser. */
export function resizePhoto(file: File, max = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file isn't a photo we can read."));
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
