/*
 * Everything the /demo shows. All of these places are made up.
 * Do not put real business names here. Real partners come from the
 * database once the app is built.
 *
 * days: Monday first. true = the offer runs that day.
 * saving: rough menu value of the free item, used for "You saved about $X".
 */
import { PLACES, type DemoPlace } from "./places";

export type Category = "Dining" | "Spa and wellness" | "Studios" | "Hotels" | "Experiences";

export type Partner = {
  id: string;
  name: string;
  category: Category;
  kind: string;
  neighbourhood: string;
  blurb: string;
  offer: string;
  detail: string;
  days: boolean[];
  usesPerYear: number;
  saving: number;
  founding: boolean;
  /** Photo base path; files are `${image}-640.webp` and `${image}-1200.webp`. Credits: docs/IMAGE-CREDITS.md */
  image: string;
  /** Shown on the photo when the licence asks for it (CC BY). */
  credit?: string;
};

export const CATEGORIES: Category[] = ["Dining", "Spa and wellness", "Studios", "Hotels", "Experiences"];

export const NEIGHBOURHOODS = [
  "Financial District",
  "King West",
  "Queen West",
  "Ossington",
  "Yorkville",
  "Leslieville",
];

// The demo always pretends today is Tuesday, so the story is the same every time.
export const TODAY = 1;
export const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];
export const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// The place the "Partner view" belongs to.
export const HOME_PARTNER_ID = "lantern-house";

export const OFFER_PRESETS = [
  { id: "two", label: "Two-for-one", offer: "Second main, on us.", detail: "Order two mains and the second one is on the house.", saving: 32 },
  { id: "upgrade", label: "Free add-on", offer: "Dessert for the table, on us.", detail: "Order two mains and dessert for the table is on the house.", saving: 14 },
];

// The places themselves, with menus, hours and photos, live in places.ts.
export const PARTNERS: DemoPlace[] = PLACES;

export const copy = {
  banner: "Demo. The places shown are examples.",
  member: "Member",
  partner: "Partner",
  todayLabel: "Today is Tuesday",
  explore: {
    title: "Where to tonight?",
    all: "All",
    anywhere: "Anywhere",
    runsToday: "Runs today",
    notToday: "Not today",
    empty: "Nothing here yet. Try another neighbourhood.",
  },
  place: {
    back: "Back",
    days: "Days it runs",
    usesLeft: (n: number, total: number) => `${n} of ${total} uses left this year`,
    rules: ["In person only. Not for takeout or delivery.", "Food, services and non-alcoholic drinks only.", "Show your code before the bill."],
    redeem: "Redeem",
    notToday: (day: string) => `Not running today. Next: ${day}.`,
    usedUp: "You've used this one for the year.",
    founding: "Founding Partner",
  },
  redeem: {
    title: "Show this to staff",
    expires: "Code expires in",
    waiting: "Waiting for staff to confirm.",
    demoConfirm: "Staff tap Confirm on their side. For the demo, tap here.",
    cancel: "Cancel",
    doneTitle: "Redeemed.",
    doneText: (n: number) => `Confirmed. You saved about $${n}.`,
    doneOwner: "Enjoy. The owner sees this visit on their dashboard right away.",
    seeOwner: "See the owner view",
    // Nida's staff line. Keep it word for word.
    staffTitle: "For staff",
    staffLine: "Check the code matches, then tap Confirm. No scanner, no app, no login at the host stand.",
    doneBack: "Back to places",
    expired: "That code ran out. Tap Redeem to get a new one.",
  },
  pass: {
    tab: "My pass",
    exploreTab: "Places",
    title: "Your pass",
    holder: "Member since March 2027",
    saved: "Saved so far",
    used: "Offers used",
    history: "Your visits",
    none: "No visits yet. Pick a place and tap Redeem.",
  },
  staff: {
    title: "Lantern House",
    sub: "What your staff see",
    door: "At the door",
    noCode: "No codes waiting. Switch to Member, open Lantern House and tap Redeem to see one arrive.",
    confirm: "Confirm",
    confirmed: "Confirmed",
    week: "This week",
    weekNote: "Example numbers.",
    weekStats: [
      { label: "Pass tables", value: "14" },
      { label: "First-time guests", value: "9" },
      { label: "Busiest pass night", value: "Wed" },
    ],
    offer: "Your offer",
    offerNote: "Change anything here and the member view updates.",
    type: "Offer",
    days: "Days it runs",
    daysMin: "At least three days a week.",
    uses: "Uses per member a year",
    preview: "What members see",
  },
};
