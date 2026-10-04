/*
 * Everything the /demo shows. All of these places are made up.
 * Do not put real business names here. Real partners come from the
 * database once the app is built.
 *
 * days: Monday first. true = the offer runs that day.
 * saving: rough menu value of the free item, used for "You saved about $X".
 */
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

export const PARTNERS: Partner[] = [
  {
    id: "lantern-house",
    image: "/demo/lantern-house",
    name: "Lantern House",
    category: "Dining",
    kind: "Dinner",
    neighbourhood: "Ossington",
    blurb: "A small room, a wood grill and a short menu that changes with the week.",
    offer: "Second main, on us.",
    detail: "Order two mains and the second one is on the house.",
    days: [false, true, true, true, false, false, true],
    usesPerYear: 2,
    saving: 32,
    founding: true,
  },
  {
    id: "marigold-room",
    image: "/demo/marigold-room",
    name: "Marigold Room",
    category: "Dining",
    kind: "Dinner",
    neighbourhood: "King West",
    blurb: "Sharing plates and a long banquette. Good for after work.",
    offer: "Second main, on us.",
    detail: "Order two mains and the second one is on the house.",
    days: [true, true, true, true, false, false, false],
    usesPerYear: 2,
    saving: 34,
    founding: true,
  },
  {
    id: "greyfield",
    image: "/demo/greyfield",
    name: "Greyfield Lunchroom",
    category: "Dining",
    kind: "Lunch",
    neighbourhood: "Financial District",
    blurb: "A proper sit-down lunch, ten minutes from the towers.",
    offer: "Second lunch plate, on us.",
    detail: "Two lunch plates, and the second one is on the house.",
    days: [true, true, true, true, true, false, false],
    usesPerYear: 4,
    saving: 24,
    founding: true,
  },
  {
    id: "half-past-nine",
    image: "/demo/half-past-nine",
    name: "Half Past Nine Café",
    category: "Dining",
    kind: "Brunch",
    neighbourhood: "Leslieville",
    blurb: "All-day brunch and big windows.",
    offer: "Second brunch plate, on us.",
    detail: "Two brunch plates, and the second one is on the house.",
    days: [false, true, true, true, true, false, false],
    usesPerYear: 3,
    saving: 21,
    founding: false,
  },
  {
    id: "juniper-table",
    image: "/demo/juniper-table",
    name: "Juniper Table",
    category: "Dining",
    kind: "Dinner",
    neighbourhood: "Queen West",
    blurb: "Seasonal cooking and a tasting menu on weeknights.",
    offer: "Second tasting menu, on us.",
    detail: "Book the tasting menu for two and the second is on the house.",
    days: [false, false, true, true, false, false, false],
    usesPerYear: 1,
    saving: 68,
    founding: true,
  },
  {
    id: "quiet-hours",
    image: "/demo/quiet-hours",
    name: "Quiet Hours Spa",
    category: "Spa and wellness",
    kind: "Day spa",
    neighbourhood: "Yorkville",
    blurb: "Massage, facials and a warm stone lounge.",
    offer: "A free upgrade on your treatment.",
    detail: "Book any 60-minute treatment and it becomes 90 minutes.",
    days: [true, true, true, true, false, false, false],
    usesPerYear: 2,
    saving: 55,
    founding: true,
  },
  {
    id: "slow-tide",
    image: "/demo/slow-tide",
    name: "Slow Tide Bathhouse",
    category: "Spa and wellness",
    kind: "Thermal circuit",
    neighbourhood: "King West",
    blurb: "Hot pool, cold plunge and a steam room.",
    offer: "Bring a guest to the circuit, free.",
    detail: "One circuit pass, and your guest comes in free.",
    days: [true, true, true, false, false, false, true],
    usesPerYear: 2,
    saving: 60,
    founding: false,
  },
  {
    id: "fieldnote",
    image: "/demo/fieldnote",
    credit: "Photo: Ajrehman, CC BY 3.0",
    name: "Fieldnote Pilates",
    category: "Studios",
    kind: "Reformer pilates",
    neighbourhood: "Queen West",
    blurb: "Small reformer classes, eight people at most.",
    offer: "Bring a friend to class, free.",
    detail: "Book a class and bring a friend to the same one, free.",
    days: [true, true, true, true, true, false, false],
    usesPerYear: 4,
    saving: 30,
    founding: true,
  },
  {
    id: "morning-light",
    image: "/demo/morning-light",
    name: "Morning Light Yoga",
    category: "Studios",
    kind: "Yoga",
    neighbourhood: "Leslieville",
    blurb: "A sunny second-floor room and unhurried classes.",
    offer: "Bring a friend to class, free.",
    detail: "Book a class and bring a friend to the same one, free.",
    days: [true, true, false, true, false, true, true],
    usesPerYear: 6,
    saving: 26,
    founding: false,
  },
  {
    id: "calloway-dining",
    image: "/demo/calloway-dining",
    name: "The Dining Room at the Calloway",
    category: "Hotels",
    kind: "Hotel restaurant",
    neighbourhood: "Financial District",
    blurb: "A quiet hotel dining room, open for lunch.",
    offer: "Lunch for two, second main on us.",
    detail: "Lunch in the dining room, and the second main is on the house.",
    days: [true, true, true, true, false, false, false],
    usesPerYear: 2,
    saving: 38,
    founding: true,
  },
  {
    id: "kiln-day",
    image: "/demo/kiln-day",
    name: "Kiln Day Pottery",
    category: "Experiences",
    kind: "Pottery class",
    neighbourhood: "Ossington",
    blurb: "Two hours at the wheel. You take home what you make.",
    offer: "A second spot, on us.",
    detail: "Book one spot in a class and the second is free.",
    days: [false, true, true, true, false, false, true],
    usesPerYear: 2,
    saving: 65,
    founding: false,
  },
  {
    id: "long-table",
    image: "/demo/long-table",
    name: "Long Table Cooking School",
    category: "Experiences",
    kind: "Cooking class",
    neighbourhood: "Yorkville",
    blurb: "Cook a three-course dinner with a chef, then sit down and eat it.",
    offer: "A second spot, on us.",
    detail: "Book one spot in a weeknight class and the second is free.",
    days: [false, true, false, true, false, false, false],
    usesPerYear: 1,
    saving: 95,
    founding: true,
  },
];

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
    doneTitle: "Enjoy.",
    doneText: (n: number) => `Confirmed. You saved about $${n}.`,
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
