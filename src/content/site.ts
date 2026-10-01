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

export const nav = [
  { label: "How it works", href: "#how" },
  { label: "Offers", href: "#offers" },
  { label: "Neighbourhoods", href: "#neighbourhoods" },
  { label: "For owners", href: "#owners" },
  { label: "FAQ", href: "#faq" },
];

export const hero = {
  eyebrow: "Toronto first",
  headline: "Toronto, two for one.",
  headlineItalic: "Even on a Tuesday.",
  lede: "One yearly pass. Two-for-one at hand-picked restaurants, spas, studios and more across the city. Bring someone, and come back.",
  formNote: "The list hears first, and gets founding member pricing.",

  // The example card next to the headline. "Lantern House" is made up.
  card: {
    neighbourhood: "Ossington",
    badge: "Founding Partner",
    name: "Lantern House",
    kind: "Example only · Dinner",
    offer: "Second main, on us.",
    // Days the example offer runs, Monday first. true = runs that day.
    days: [false, true, true, true, false, false, true],
    uses: "2 uses this year",
  },
};

export const howItWorks = {
  title: "Bring someone.",
  titleItalic: "Come back.",
  intro:
    "No vouchers to print and no fine print to read. Each partner picks its days and how often you can use it, and the app shows you both.",
  steps: [
    { title: "Get your pass", text: "One pass, good for a year." },
    {
      title: "Pick a spot",
      text: "See each offer, the days it runs, and how many times you can use it.",
    },
    {
      title: "Show your code",
      text: "Tap Redeem at the table or front desk. Staff confirm. The second one is on the house.",
    },
  ],
};

export const offers = {
  title: "What a pass gets you.",
  intro: "Two-for-one, or a free upgrade, at places worth going back to.",
  caption: "Example offers. Each partner sets its own.",
  items: [
    { category: "Restaurants and cafés", offer: "Second main, on us." },
    { category: "Spas", offer: "A free upgrade on your treatment." },
    { category: "Yoga and studios", offer: "Bring a friend to class, free." },
    {
      category: "Hotel restaurants and spas",
      offer: "Lunch in the dining room, second main on us.",
    },
    { category: "Experiences", offer: "A second spot, on us." },
  ],
};

export const positioning = {
  title: "Fewer places.",
  titleItalic: "Better ones.",
  points: [
    {
      title: "Not a coupon site.",
      text: "No vouchers that run out. No fine print on every deal. Just a short list of places, and what each one offers.",
    },
    {
      title: "Picked by hand.",
      text: "Fifty Founding Partners at launch, chosen one neighbourhood at a time. Fifty great spots beat two hundred average ones.",
    },
    {
      title: "Made for coming back.",
      text: "Find a place you like, then go again. Bring someone new next time.",
    },
  ],
};

export const neighbourhoods = {
  title: "Where we're starting.",
  intro: "Six neighbourhoods first. More after launch, one at a time.",
  items: [
    { name: "Financial District", line: "Lunch that isn't at your desk." },
    { name: "King West", line: "Dinner after a long day." },
    { name: "Queen West", line: "A Saturday with no plan." },
    { name: "Ossington", line: "A table you'd book twice." },
    { name: "Yorkville", line: "A spa afternoon, done properly." },
    { name: "Leslieville", line: "Brunch, then a long walk." },
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

export const owners = {
  eyebrow: "For owners",
  title: "We're choosing 50 Founding Partners.",
  text: "Free for your first 12 months, and you set the offer, the days and the limits.",
  points: [
    "Two-for-one, or a free upgrade or add-on if that suits you better.",
    "Pick your days, at least three a week, plus any blackout dates.",
    "Decide how many times each member can use it in a year.",
    "Need a break? Pause with 7 days' notice to members.",
  ],
  contactLead: "Tell us about your place:",
  // Example settings panel shown next to the text.
  panel: {
    title: "Your offer",
    rows: [
      { label: "Offer", value: "Second main, on us" },
      { label: "Days", value: "Tue, Wed, Thu, Sun" },
      { label: "Uses per member a year", value: "2" },
      { label: "Blackout dates", value: "Dec 24 to 26" },
    ],
    note: "Example settings. You choose every one.",
  },
};

export const faq = {
  title: "Questions",
  items: [
    {
      q: "When does it launch?",
      a: "Tuesday, March 16, 2027, in Toronto first. People on the waitlist hear first and get founding member pricing.",
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
      a: "We'll share pricing before launch. The waitlist gets founding member pricing first.",
    },
  ],
};

export const countdown = {
  title: "Opening day.",
  text: "Launching Tuesday, March 16, 2027 at 9 a.m. in Toronto.",
  live: "We're live. Welcome in.",
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
  popupTitle: "Get in early.",
  popupText:
    "Join the waitlist. You'll hear first when we launch, and get founding member pricing.",
  errors: {
    emailMissing: "Enter your email address.",
    emailInvalid: "That email doesn't look right. Check it and try again.",
    consentMissing: "Tick the box so we can email you.",
    generic:
      "Something went wrong on our end. Try again in a minute, or email hello@the6pass.ca.",
  },
  success: {
    title: "You're on the list.",
    text: "We'll email you before launch, with founding member pricing.",
  },
  already: {
    title: "You're already on the list.",
    text: "Nothing more to do. We'll be in touch before launch.",
  },
};
