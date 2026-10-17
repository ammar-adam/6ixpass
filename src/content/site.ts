/*
 * ─────────────────────────────────────────────────────────────
 *  THE 6 PASS: ALL THE WORDS ON THE WEBSITE
 * ─────────────────────────────────────────────────────────────
 *
 *  This is the only file you need to edit to change what the site says.
 *
 *  How to edit safely:
 *  - Change only the words between the quote marks "like this".
 *  - Keep the quote marks, commas and brackets exactly where they are.
 *  - To use an apostrophe inside a sentence, type it normally: "We're".
 *  - Don't use em dashes. Short sentences read better anyway.
 *  - Never mention alcohol, and don't add prices until Ammar says so.
 *
 *  After you save on GitHub, Netlify rebuilds the site in about a minute.
 */

export const site = {
  name: "The 6 Pass",
  email: "hello@the6pass.ca",
  instagram: "the6pass",
  city: "Toronto, ON",

  // Canada's anti-spam law (CASL) needs a real mailing address on every
  // email we send, and it's good to show it here too. Leave it empty ("")
  // until there is a real one: nothing shows while it's empty.
  // Example: "100 Example St, Suite 1, Toronto, ON M5V 0A1"
  mailingAddress: "",

  // Launch moment for the countdown. Keep the "-04:00" at the end:
  // that is Toronto time in March (daylight saving starts Mar 14, 2027).
  launchAt: "2027-03-16T09:00:00-04:00",
  launchLabel: "Tuesday, March 16, 2027",
  launchShort: "Mar 16, 2027",

  // Shown in Google results and when the link is shared.
  seo: {
    title: "The 6 Pass · Toronto, two for one",
    description:
      "One yearly pass. Two-for-one at hand-picked restaurants, spas, studios and more across Toronto. Join the waitlist for founding member pricing.",
  },
};

// In the same order as the home page sections.
export const nav = [
  { label: "How it works", href: "#how" },
  { label: "Offers", href: "#offers" },
  { label: "Neighbourhoods", href: "#neighbourhoods" },
  { label: "For owners", href: "#owners" },
  { label: "FAQ", href: "#faq" },
];

export const hero = {
  date: "Mar 16, 2027",
  eyebrow: "Toronto · Launching soon",
  headline: "Toronto, two for one.",
  // This word in the headline is set in italics.
  headlineItalicWord: "two",
  headlineItalic: "",
  lede: "One yearly pass. Two-for-one at hand-picked restaurants, spas, studios and more across the city. Bring someone, and come back.",
  formNote: "Waitlist members get founding member pricing.",
  // The two example places next to the headline (ids from src/demo/places.ts, made up).
  cards: ["lantern-house", "quiet-hours"],
};

// The three steps.
export const howItWorks = {
  title: "Bring someone.",
  titleItalic: "Come back.",
  intro: "No vouchers to print and no fine print to read. Each partner picks its days and how often you can use it, and the app shows you both.",
  steps: [
    { title: "Get your pass", text: "One pass, good for a year." },
    { title: "Pick a spot", text: "See each offer, the days it runs, and how many times you can use it." },
    { title: "Show your code", text: "Tap Redeem at the table or front desk. Staff confirm. The second one is on the house." },
  ],
};

// Why the list is short.
export const positioning = {
  title: "Fewer places.",
  titleItalic: "Better ones.",
  points: [
    { title: "Not a coupon site.", text: "No vouchers that run out. No fine print on every deal. Just a short list of places, and what each one offers." },
    { title: "Picked by hand.", text: "Fifty Founding Partners at launch, chosen one neighbourhood at a time. Fifty great spots beat two hundred average ones." },
    { title: "Made for coming back.", text: "Find a place you like, then go again. Bring someone new next time." },
  ],
};

export const neighbourhoods = {
  title: "Where we're starting.",
  intro: "Six neighbourhoods first. More after launch, one at a time.",
  // The photo for each one is a made-up place there (src/demo/places.ts).
  items: [
    { name: "Financial District", image: "/demo/kaito", kinds: "Lunch, ramen, cycling" },
    { name: "King West", image: "/demo/marigold-room", kinds: "Dinner, dumplings, a bathhouse" },
    { name: "Queen West", image: "/demo/comal", kinds: "Tacos, pilates, flowers" },
    { name: "Ossington", image: "/demo/fennel-ash", kinds: "Pasta, pottery, massage" },
    { name: "Yorkville", image: "/demo/quiet-hours", kinds: "A day spa, a bistro, a cooking class" },
    { name: "Leslieville", image: "/demo/half-past-nine", kinds: "Brunch, a bakery, yoga" },
  ],
};


export const offers = {
  title: "What a pass gets you.",
  intro: "Two-for-one, or a free upgrade, at places worth going back to.",
  caption: "Example offers. Each partner sets its own.",
  // Photos are of made-up places from the app demo (see docs/IMAGE-CREDITS.md).
  items: [
    { category: "Restaurants and cafés", offer: "Second main, on us.", image: "/demo/lantern-house", alt: "A plate of salmon and roasted peppers." },
    { category: "Spas", offer: "A free upgrade on your treatment.", image: "/demo/quiet-hours", alt: "Folded towels, candles and stones in a spa." },
    { category: "Yoga and studios", offer: "Bring a friend to class, free.", image: "/demo/morning-light", alt: "Rows of mats in a quiet studio." },
    { category: "Hotel restaurants and spas", offer: "Lunch in the dining room, second main on us.", image: "/demo/calloway-dining", alt: "Armchairs and tables in a hotel dining room." },
    { category: "Experiences", offer: "A second spot, on us.", image: "/demo/kiln-day", alt: "Hands shaping clay on a pottery wheel." },
  ],
};

// Neighbourhood choices in the waitlist form.
export const neighbourhoodOptions = [
  "Financial District",
  "King West",
  "Queen West",
  "Ossington",
  "Yorkville",
  "Leslieville",
  "Somewhere else in Toronto",
  "Outside Toronto",
];

export const appPreview = {
  eyebrow: "The app",
  title: "What it looks like in the app.",
  text: "Find a spot that runs today, tap Redeem, and show the code. Staff confirm it, and the second one is on the house.",
  label: "Screens from the app, which opens to members in March. Places shown are examples.",
  screens: [
    { src: "/preview/explore", caption: "Find a spot that runs today.", alt: "The app's Explore screen, listing places with today's offers." },
    { src: "/preview/place", caption: "See the offer, the days and your uses.", alt: "A place in the app, with its offer, the days it runs and a Redeem button." },
    { src: "/preview/code", caption: "Show your code. Staff confirm it.", alt: "A six-digit code on a pass, with a ten-minute timer, ready to show staff." },
  ],
  link: "Try it in your browser",
};

export const owners = {
  eyebrow: "For owners",
  title: "Own a restaurant, spa or studio in Toronto?",
  text: "We're choosing 50 Founding Partners. Free for your first 12 months, and you set the offer, the days and the limits.",
  points: [
    "Two-for-one, or a free upgrade or add-on if that suits you better.",
    "Pick your days, at least three a week, plus any blackout dates.",
    "Decide how many times each member can use it in a year.",
    "Need a break? Pause with 7 days' notice to members.",
  ],
  // Button to the full owners page.
  more: "See what a two-for-one costs you",
  contactLead: "Tell us about your place",
  screen: { src: "/preview/owner", alt: "The owner view in the app: tonight's member visits, and You pay $0." },
};

export const faq = {
  title: "Questions",
  items: [
    {
      q: "When does it launch?",
      a: "Tuesday, March 16, 2027, in Toronto first.",
    },
    {
      q: "What do offers cover?",
      a: "Food, services and non-alcoholic drinks only.",
    },
    {
      q: "How do I use it?",
      a: "Open the app, tap Redeem, and show the code at the table or front desk. Staff confirm, and the second one is on the house.",
    },
    {
      q: "Can I use it for takeout or delivery?",
      a: "No. Offers are for when you go in person.",
    },
    {
      q: "How often can I use an offer?",
      a: "Each partner sets how many times a member can use it in a year, and which days it runs. The app shows you both before you go.",
    },
    {
      q: "How much is a pass?",
      a: "We'll share pricing before launch.",
    },
  ],
};

export const countdown = {
  // Above the countdown in the hero.
  label: "Until launch day, March 16, 2027",
  title: "Opening day.",
  text: "Tuesday, March 16, 2027 at 9 a.m. in Toronto. The waitlist hears first.",
  live: "We're live.",
  cta: "Join the waitlist",
};

export const footer = {
  teams: "For teams:",
};

/*
 * Waitlist form words.
 * IMPORTANT: consentLabel is legal wording (CASL). It is saved with every
 * signup exactly as written. Ask Ammar before changing it.
 */
export const waitlist = {
  consentLabel:
    "Yes, email me about The 6 Pass launch and founding member pricing. I can unsubscribe any time.",
  emailLabel: "Email",
  firstNameLabel: "First name",
  neighbourhoodLabel: "Neighbourhood",
  optional: "optional",
  neighbourhoodPlaceholder: "Choose one",
  submit: "Join the waitlist",
  submitting: "Joining…",
  popupLabel: "Founding members",
  popupTitle: "Be first in the 6.",
  popupText:
    "Join the waitlist. You'll hear before anyone else and lock in founding member pricing.",
  errors: {
    emailMissing: "Enter your email address.",
    emailInvalid: "That email doesn't look right. Check it and try again.",
    consentMissing: "Tick the box so we can email you.",
    generic:
      "Something went wrong on our end. Try again in a minute, or email hello@the6pass.ca.",
  },
  success: {
    title: "You're on the list.",
    text: "We'll email you before launch with founding member pricing.",
  },
  already: {
    title: "You're already on the list.",
    text: "Nothing more to do. We'll be in touch before launch.",
  },
};
