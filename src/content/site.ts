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
      "One yearly pass. Two-for-one at hand-picked restaurants, spas, studios and more across Toronto and the GTA. Join the waitlist for founding member pricing.",
  },
};

// In the same order as the home page sections.
export const nav = [
  { label: "How it works", href: "#how" },
  { label: "Offers", href: "#offers" },
  { label: "Where", href: "#where" },
  { label: "For owners", href: "#owners" },
  { label: "FAQ", href: "#faq" },
];

export const hero = {
  eyebrow: "Toronto and the GTA",
  headline: "Toronto, two for one.",
  // This word in the headline is set in italics.
  headlineItalicWord: "two",
  headlineItalic: "",
  lede: "One yearly pass. Two-for-one at hand-picked restaurants, spas, studios and more across the city. Bring someone, and come back.",
  formNote: "No spam. One email when we open, with founding member pricing.",
  appLink: "See what the app looks like",
  // Under the form note. No dates per area.
  areasLine: "Opening across Toronto and the GTA, one neighbourhood at a time.",

  // The phone next to the headline: the app's own opening screen.
  phone: {
    src: "/preview/v2/landing",
    alt: "The 6 Pass app's opening screen: The best deals in Toronto. Create account, Sign in, Look around first.",
    caption: "The app opens to members on March 16, 2027.",
  },
};

export const offers = {
  title: "What a pass gets you.",
  intro: "Two-for-one, or a free upgrade, at places worth going back to.",
  caption: "Example offers. Each partner sets its own.",
  // Photos are of made-up places from the app demo (see docs/IMAGE-CREDITS.md).
  items: [
    {
      category: "Restaurants",
      offer: "Second main, on us.",
      detail: "For example: Tuesday to Thursday and Sunday, 2 visits a year.",
      image: "/demo/marigold-room",
      alt: "A table of shared dishes at a restaurant.",
    },
    {
      category: "Spas",
      offer: "A free upgrade on your treatment.",
      detail: "For example: a 60-minute massage booked as 90 minutes, Monday to Thursday.",
      image: "/demo/quiet-hours",
      alt: "Folded towels, candles and stones in a spa.",
    },
    {
      category: "Yoga and studios",
      offer: "Bring a friend to class, free.",
      detail: "For example: any class on weekdays, 4 visits a year.",
      image: "/demo/morning-light",
      alt: "Rows of mats in a quiet studio.",
    },
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

// "Where we open first". The names come from the first six neighbourhoods above.
export const launchAreas = {
  title: "Where we open first.",
  text: "We start in six Toronto neighbourhoods, then grow across Toronto and the GTA, one neighbourhood at a time.",
  areas: neighbourhoodOptions.slice(0, 6),
  noteLead: "Somewhere else?",
  noteLink: "Join the waitlist and tell us where.",
  noteTail: "It helps us choose what comes next.",
};

// "How a visit works": five real app screens, one visit from start to finish.
// Screens are shot by scripts/site-shots.mjs from the app as it is today.
export const appStrip = {
  eyebrow: "The app",
  title: "How a visit works.",
  intro: "Get your pass once. Then every visit goes like this.",
  screens: [
    {
      src: "/preview/v2/explore",
      caption: "See what runs today.",
      text: "Places near you with an offer on today.",
      alt: "The app's Explore screen for Tuesday, listing places in Toronto with an offer on today.",
    },
    {
      src: "/preview/v2/place",
      caption: "Check the offer and the days.",
      text: "Each place picks its own days and how often you can use it.",
      alt: "Fennel & Ash in the app: second pasta on us, runs Tuesday to Thursday, 2 uses left this year, and a Redeem button.",
    },
    {
      src: "/preview/v2/pass",
      caption: "Show your pass at the host stand.",
      text: "A new code for each visit. It lasts 10 minutes.",
      alt: "A member pass for Fennel & Ash with a QR code, a barcode and a six-digit code valid for 10 minutes.",
    },
    {
      src: "/preview/v2/scan-confirmed",
      caption: "Staff scan it.",
      text: "Or type the six digits. No extra device at the host stand.",
      alt: "The staff scanner at Fennel & Ash showing a green Confirmed card for Alex: second pasta, on us.",
    },
    {
      src: "/preview/v2/redeemed",
      caption: "The second one is on the house.",
      text: "The app shows how many uses you have left this year.",
      alt: "The member's screen after staff confirm: Redeemed, enjoy your meal, 1 of 2 uses left this year.",
    },
  ],
  label: "Screens from the app as it is today. The places are examples, not partners yet.",
  link: "Try it in your browser",
};

export const mobileBar = {
  text: "The waitlist gets founding member pricing.",
  button: "Join the waitlist",
};

export const owners = {
  eyebrow: "For owners",
  title: "Own a restaurant, spa or studio in Toronto?",
  text: "We're choosing 50 Founding Partners. Members come in on the days you choose, and you set the offer and the limits.",
  // Link to the full owners page.
  points: [
    "Two-for-one, or a free upgrade or add-on if that suits you better.",
    "Pick your days, at least three a week, plus any blackout dates.",
    "Decide how many times each member can use it in a year.",
    "Need a break? Pause with 7 days' notice to members.",
  ],
  more: "How it works for owners",
  contactLead: "Tell us about your place",
  // The phone next to the text.
  screen: {
    src: "/preview/v2/owner-offer",
    alt: "The owner view in the app: the offer, the days, uses per member, blackout dates and a Pause switch.",
    caption: "The owner view. Change the offer or pause it any time.",
  },
};

// Plain facts only. Nothing about the founders beyond this until they say so.
export const founders = {
  eyebrow: "Who's behind it",
  title: "A note from Nida.",
  body: [
    "The 6 Pass is a Toronto family business, founded by Nida.",
    "Right now we're meeting owners and choosing the first places, one neighbourhood at a time. We'll share the places before we open.",
    "If you have a question, or a place we should know about, write to us at hello@the6pass.ca. It comes straight to us.",
  ],
  signoff: "Nida",
  signoffLine: "The 6 Pass, Toronto",
};

export const faq = {
  title: "Questions",
  // Under the title. The email address is added after it.
  more: "Something we haven't answered? Write to us at",
  items: [
    {
      q: "When does it open?",
      a: "Tuesday, March 16, 2027, at 9 a.m. Toronto time.",
    },
    {
      q: "Where can I use it?",
      a: "We start in six neighbourhoods: the Financial District, King West, Queen West, Ossington, Yorkville and Leslieville. Then we grow across Toronto and the GTA, one neighbourhood at a time.",
    },
    {
      q: "Which places are on it?",
      a: "We're choosing the first 50 partners now, and we'll share the places before we open. The places in the app screens on this page are examples.",
    },
    {
      q: "How do I use it?",
      a: "Find a place in the app and tap Redeem at the table or front desk. Staff scan your pass or type the code, and the second one is on the house.",
    },
    {
      q: "Who can I bring?",
      a: "Anyone you like. You need to be there in person with your pass.",
    },
    {
      q: "How often can I use an offer?",
      a: "Each partner sets how many times a member can use it in a year, and which days it runs. The app shows you both before you go.",
    },
    {
      q: "What do offers cover?",
      a: "Food, services and non-alcoholic drinks. Offers are for when you go in person, not takeout or delivery.",
    },
    {
      q: "How much is a pass?",
      a: "We'll share pricing before launch. People on the waitlist get founding member pricing.",
    },
    {
      q: "What does joining the waitlist do?",
      a: "You get one email when we open, with founding member pricing. Joining is free and you don't pay anything now. You can unsubscribe any time.",
    },
    {
      q: "Who runs The 6 Pass?",
      a: "Nida, its founder. It's a Toronto family business. You can reach us at hello@the6pass.ca.",
    },
    {
      q: "I own a restaurant, spa or studio.",
      a: "We'd like to hear from you. Email hello@the6pass.ca, or read how it works for owners.",
      link: { href: "/owners", label: "How it works for owners" },
    },
  ],
};

export const countdown = {
  // Shown above the countdown, under the join form.
  label: "Launching Tuesday, March 16, 2027",
  text: "Launching Tuesday, March 16, 2027 at 9 a.m. in Toronto.",
  live: "We're live.",
};

// The last join form on the home page.
export const closing = {
  title: "Hear first when we open.",
  text: "One email on March 16, with founding member pricing.",
};

export const footer = {
  teams: "For teams:",
  opening: "Opening March 16, 2027, across Toronto and the GTA.",
  columns: [
    {
      title: "The 6 Pass",
      links: [
        { label: "How it works", href: "/#how" },
        { label: "Where", href: "/#where" },
        { label: "FAQ", href: "/#faq" },
        { label: "What is The 6 Pass?", href: "/about" },
      ],
    },
    {
      title: "More",
      links: [
        { label: "For owners", href: "/owners" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ],
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
