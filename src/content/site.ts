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
  { label: "Offers", href: "#offers" },
  { label: "For owners", href: "#owners" },
  { label: "How it works", href: "#how" },
  { label: "FAQ", href: "#faq" },
];

export const hero = {
  eyebrow: "Toronto · March 16, 2027",
  headline: "Toronto, two for one.",
  // This word in the headline is set in italics.
  headlineItalicWord: "two",
  headlineItalic: "",
  lede: "One yearly pass. Two-for-one at hand-picked restaurants, spas, studios and more across the city. Bring someone, and come back.",
  formNote: "The waitlist gets founding member pricing.",
};

// The three steps, each on a real screen from the app (public/preview).
export const howItWorks = {
  title: "How it works",
  titleItalic: "",
  intro: "No vouchers and no fine print. Each place sets its days and how often you can use it, and the app shows you both.",
  steps: [
    {
      title: "Pick a spot",
      text: "See what runs tonight, the offer, and how many uses you have left.",
      screen: { src: "/preview/explore", alt: "The app's Explore screen: tonight's places, with photos and offers." },
    },
    {
      title: "Show your code",
      text: "Tap Redeem at the table or front desk. Staff check the code and confirm.",
      screen: { src: "/preview/code", alt: "A six-digit member code on a pass, with a ten-minute timer, ready to show staff." },
    },
    {
      title: "The second one is on us",
      text: "Confirmed in a tap. Enjoy it, and come back.",
      screen: { src: "/preview/staff", alt: "The Redeemed screen after staff confirm the code." },
    },
  ],
};

// Example places on the home page: ids from src/demo/places.ts (all made up).
export const showcase = {
  title: "A few of the places",
  intro: "Two-for-one, or a free upgrade, at places worth going back to. Tap one to see it in the app.",
  caption: "Example places from the app. Our Founding Partners are announced at launch.",
  ids: ["fennel-ash", "kaito", "quiet-hours", "comal", "little-saffron", "fernbrook"],
};

export const neighbourhoods = {
  title: "Six neighbourhoods first",
  intro: "We're starting where people already go out, one neighbourhood at a time. More follow after launch.",
};

// The full-width photo between sections.
export const band = {
  image: "/demo/half-past-nine",
  alt: "Brunch for two on a wooden table.",
  title: "Bring someone, and come back.",
  text: "A reason to go out on a Tuesday.",
};

export const offers = {
  title: "What a pass gets you",
  intro: "Two-for-one, or a free upgrade, at places worth going back to.",
  caption: "Example offers. Each partner sets its own.",
  // Photos are of made-up places from the app demo (see docs/IMAGE-CREDITS.md).
  items: [
    { category: "Restaurants", offer: "Second main, on us.", image: "/demo/lantern-house", alt: "A plate of salmon and roasted peppers." },
    { category: "Spas", offer: "A free upgrade on your treatment.", image: "/demo/quiet-hours", alt: "Folded towels, candles and stones in a spa." },
    { category: "Yoga and studios", offer: "Bring a friend to class, free.", image: "/demo/morning-light", alt: "Rows of mats in a quiet studio." },
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
  // The phone next to the headline.
  hero: { src: "/preview/place", alt: "A place in The 6 Pass app: its photo, the offer, the days it runs and a Redeem button." },
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
  // Button to the full owners page.
  more: "How it works for owners",
  contactLead: "Email us",
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
  // Shown above the countdown, under the join form.
  label: "Opens Tuesday, March 16",
  text: "Launching Tuesday, March 16, 2027 at 9 a.m. in Toronto.",
  live: "We're live.",
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
