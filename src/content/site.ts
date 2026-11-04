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
  // No dates or timelines in public copy (Ammar, Nov 4): only "early next year".
  launchLabel: "early next year",
  launchShort: "Launching early next year",

  // Shown in Google results and when the link is shared.
  seo: {
    title: "The 6 Pass · Toronto, two for one",
    description:
      "One yearly pass. Two-for-one at hand-picked restaurants, spas, studios and more across Toronto and the GTA. Go out more, for less. Join the waitlist for founding member pricing.",
  },
};

// In the same order as the home page sections.
export const nav = [
  { label: "For members", href: "/#how" },
  { label: "For business", href: "/owners" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/#faq" },
];

// The thin bar above the header (after ClassPass's partner banner).
export const topBanner = {
  text: "Own a restaurant, spa or studio?",
  link: "Join as a partner for free",
  href: "/owners#apply",
};

// "Get the app": a QR code to the web app, and the store badges as coming soon.
export const getApp = {
  button: "Get the app",
  title: "Get The 6 Pass app",
  text: "The app isn't open yet. Scan with your phone's camera to try the demo, with example places.",
  url: "https://the6pass.ca/app",
  soon: "On the App Store and Google Play early next year.",
};

export const hero = {
  eyebrow: "Toronto and the GTA",
  headline: "Toronto, two for one.",
  // This word in the headline is set in italics.
  headlineItalicWord: "two",
  headlineItalic: "",
  lede: "The 6 Pass is a yearly membership. At every restaurant, spa and studio on it, you pay for one and the second is on the house.",
  // Three short facts under the form: what it is, at a glance.
  facts: ["One yearly pass", "Two-for-one at every partner", "Hand-picked places across the GTA"],
  formNote: "No spam. A welcome email and a few updates before we open.",
  appLink: "See what the app looks like",
  // Under the form note. No dates per area.
  areasLine: "Opening across Toronto and the GTA.",

  // The phone next to the headline: the app's own opening screen.
  phone: {
    src: "/preview/v2/landing",
    alt: "The 6 Pass app's opening screen: Two for one, across Toronto. Create account, Sign in, Look around first.",
    caption: "",
  },
};

export const offers = {
  title: "What a pass gets you.",
  intro: "Bring someone and the second one is free, or get a free upgrade. Each place sets its days and how often you can use it, and the app shows you both.",
  caption: "Example offers. Each partner sets its own.",
  // Photos are of made-up places from the app demo (see docs/IMAGE-CREDITS.md).
  items: [
    {
      category: "Restaurants",
      offer: "A second dish, on us.",
      detail: "Each place picks the dish and the days. For example: Tuesday to Thursday, 2 visits a year.",
      image: "/demo/comal-2",
      alt: "Two tacos with fresh herbs, lime and radish.",
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
  "Downtown Toronto",
  "Midtown or North York",
  "Scarborough",
  "Etobicoke",
  "Mississauga",
  "Brampton",
  "Vaughan",
  "Markham or Richmond Hill",
  "Oakville or Burlington",
  "Durham Region",
  "Somewhere else",
];

// "Where we open". The whole GTA from day one.
export const launchAreas = {
  title: "Opening across the GTA.",
  text: "The 6 Pass opens across Toronto and the GTA. One pass works at every partner, wherever you are.",
  areas: ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill", "Oakville", "Durham Region"],
  noteLead: "Want a place near you on it?",
  noteLink: "Join the waitlist and tell us where you are.",
  noteTail: "It helps us choose the first partners.",
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
      caption: "Show your code.",
      text: "A new code for each visit. It lasts 10 minutes.",
      alt: "A member pass for Fennel & Ash with a QR code, a barcode and a six-digit code valid for 10 minutes.",
    },
    {
      src: "/preview/v2/scan-confirmed",
      caption: "Staff confirm it.",
      text: "They scan it, or type the six digits. No extra device needed.",
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
  link: "Join the waitlist",
};

// "Your new regulars": three example places from the app demo (src/demo/places.ts).
export const placesPreview = {
  eyebrow: "A taste of it",
  title: "What a place on the pass looks like.",
  text: "Each partner picks its own offer and the days it runs. This one is a sample, so you can picture it. Real partners show up here as they join.",
  link: "Join the waitlist",
  ids: ["fennel-ash"],
};

export const mobileBar = {
  text: "The waitlist gets founding member pricing.",
  button: "Join the waitlist",
};

export const owners = {
  eyebrow: "For business owners",
  title: "Own a restaurant, spa or studio in the GTA?",
  text: "We're choosing our Founding Partners now. Members come in on the days you choose, and you set the offer and the limits.",
  // Link to the full owners page.
  points: [
    "Two-for-one, or a free upgrade or add-on if that suits you better.",
    "Pick your days, at least three a week, plus any blackout dates.",
    "Decide how many times each member can use it in a year.",
    "Need a break? Pause with 7 days' notice to members.",
  ],
  more: "How it works for owners",
  apply: "Join as a partner for free",
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
  eyebrow: "Why we're building it",
  title: "Made in the 6, by a family.",
  // From Nida's post, /blog/why-were-building-the-6-pass
  quote: "This city is full of great local places. But a lot of the time, we don't go. We mean to, and then the week gets busy.",
  text: "So we made it simple: bring someone, pay for one, and the second is on the house. Nida is walking into every place herself and choosing the first ones now.",
  signoff: "Nida",
  signoffLine: "Founder, The 6 Pass",
  storyLink: "Read Nida's story",
  storyHref: "/blog/why-were-building-the-6-pass",
  image: "/demo/kiln-day",
  imageAlt: "Hands shaping clay on a pottery wheel",
  caption: "Two-for-one at restaurants, spas, studios and classes across the GTA.",
};

export const faq = {
  title: "Questions",
  // Under the title. The email address is added after it.
  more: "Something we haven't answered? Write to us at",
  items: [
    {
      q: "When does it open?",
      a: "Early next year. Join the waitlist and you'll be the first to hear, with founding member pricing.",
    },
    {
      q: "Where can I use it?",
      a: "Across Toronto and the GTA, including Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville and Durham Region. One pass works at every partner.",
    },
    {
      q: "Which places are on it?",
      a: "Hand-picked restaurants, spas, studios and more, across Toronto and the GTA. We're choosing the first partners now, and we'll share the places before we open. The places in the app screens on this page are examples.",
    },
    {
      q: "How do I use it?",
      a: "Find a place in the app and tap Redeem at the table or front desk. Staff scan your pass or type the code, and the second one is on the house.",
    },
    {
      q: "How does it save me money?",
      a: "Pay for one main, class or treatment, and the second is free. Or you get a free upgrade. Most offers can be used more than once a year, so it adds up the more you go out.",
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
      a: "You get a short welcome email now, a few updates as we get ready to launch, and founding member pricing before we open. Joining is free and you don't pay anything now. You can unsubscribe any time.",
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
  eyebrow: "Opening day",
  // Shown beside the countdown.
  label: "Launching early next year",
  text: "Launching early next year across Toronto and the GTA.",
  live: "We're live.",
};

// The last join form on the home page.
export const closing = {
  title: "Hear first when we open.",
  text: "A welcome email now, a few updates as we get ready, and founding member pricing before we open.",
};

export const footer = {
  tagline: "A Toronto family business. One yearly pass, two-for-one at hand-picked places across the city and the GTA.",
  opening: "Launching early next year, across Toronto and the GTA.",
  contactTitle: "Contact us",
  contactText: "Questions, a place we should know about, or you run a business? Email us. It comes straight to Nida.",
  madeWith: "Made with care in the 6.",
  columns: [
    {
      title: "Members",
      links: [
        { label: "How it works", href: "/#how" },
        { label: "Join the waitlist", href: "/#join" },
        { label: "What is The 6 Pass?", href: "/about" },
      ],
    },
    {
      title: "For business",
      links: [
        { label: "Work with us", href: "/owners" },
        { label: "How it works for owners", href: "/owners/how-it-works" },
        { label: "Estimate your earnings", href: "/owners/earnings" },
        { label: "Join as a partner", href: "/owners#apply" },
      ],
    },
    {
      title: "The 6 Pass",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "FAQ", href: "/#faq" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ],
  // Only accounts that exist. Add TikTok or LinkedIn here once claimed.
  socials: [{ name: "Instagram", href: "https://www.instagram.com/the6pass/" }] as { name: "Instagram" | "TikTok" | "LinkedIn"; href: string }[],
};

// The Founding Partner wall: real places, added by Nida at /admin. The
// section only appears once at least one is published.
export const partnerWall = {
  eyebrow: "Founding Partners",
  title: "Signed on, and real.",
  text: "These places have joined The 6 Pass as Founding Partners.",
  visit: "Visit",
};

// The places page (/places) and each place's page. Every place is an example.
export const placesPage = {
  seo: {
    title: "Places",
    description: "A preview of the kind of restaurants, spas and studios on The 6 Pass. These are examples while we choose our Founding Partners.",
  },
  eyebrow: "Places",
  title: "Go out more, for less.",
  intro: "A taste of the kind of places on the pass.",
  all: "Everything",
  today: "On today",
  allAreas: "All neighbourhoods",
  empty: "Nothing matches that yet. Try another filter.",
  example: "Example",
  back: "All places",
  yourOffer: "Your offer",
  redeem: "Join the waitlist to redeem",
  redeemNote: "When we open, tap Redeem at the table or front desk. Your code lasts 10 minutes.",
  exampleNote: "Made-up example. This is how a place page will look.",
  // Category names as members see them.
  labels: { Dining: "Restaurants", "Spa and wellness": "Spas", Studios: "Studios", Hotels: "Hotels", Experiences: "Experiences" } as Record<string, string>,
  singular: { Dining: "Restaurant", "Spa and wellness": "Spa", Studios: "Studio", Hotels: "Hotel", Experiences: "Experience" } as Record<string, string>,
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
  neighbourhoodLabel: "Where you are",
  optional: "optional",
  neighbourhoodPlaceholder: "Choose one",
  submit: "Join the waitlist",
  submitting: "Joining…",
  // The popup: a photo panel with what you get (after ClassPass and The
  // Entertainer: say the benefit first, then the form).
  popupLabel: "Founding members",
  popupTitle: "Go out more. Pay for one.",
  popupText: "One yearly pass for two-for-one at hand-picked places across Toronto and the GTA.",
  popupImage: { src: "/demo/fennel-ash", alt: "" },
  popupPerks: [
    "Two-for-one or a free upgrade at every partner",
    "Hand-picked restaurants, spas and studios",
    "Founding member pricing, before anyone else",
  ],
  popupFormTitle: "Join the waitlist",
  popupFormText: "Be first in when we launch early next year.",
  popupLater: "Maybe later",
  popupChip: { place: "Fennel & Ash", offer: "Second pasta, on us" },
  popupFormNote: "Free to join. A welcome email and a few updates before we open.",
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
  // Invite-a-friend, shown after joining and on /invite.
  // The reward is first access to the beta, which we control. No prices.
  invite: {
    title: "Bring your friends in first.",
    text: "Share your link. When 3 friends join, you're first in line for our beta early next year.",
    copy: "Copy link",
    copied: "Copied",
    share: "Share",
    shareText: "I just joined the waitlist for The 6 Pass: two-for-one at hand-picked places across Toronto and the GTA. Join with my link:",
    progress: (n: number, goal: number) => `${Math.min(n, goal)} of ${goal} friends joined`,
    done: "You're first in line for the beta.",
    already: "Your invite link is in your welcome email.",
    pageTitle: "Your invites",
    pageMissing: "We couldn't find that invite link. Check the link in your welcome email.",
    getYours: "Join the waitlist to get your own link",
  },
  // Under the success and already-on-the-list messages.
  follow: {
    lead: "In the meantime, follow along on Instagram for new places as we add them.",
    button: "Follow @the6pass",
  },
  already: {
    title: "You're already on the list.",
    text: "Nothing more to do. We'll be in touch before launch.",
  },
};
