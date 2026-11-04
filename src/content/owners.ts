/*
 * The owners page (/owners). This is the page Nida sends after a conversation.
 *
 * Rules: explain what we do, how it works for the owner and why it helps.
 * Never state cost or terms for owners (not decided). No alcohol in any offer.
 * The numbers in "example" are an illustration, labelled as one. Change them
 * here and the table and the totals update by themselves.
 */
import { site } from "./site";

export const ownersPage = {
  seo: {
    title: "For restaurant, spa and studio owners",
    description:
      "The 6 Pass is choosing its Founding Partners across Toronto and the GTA. Members come in on the days you choose. You set the offer, the days and the limits.",
  },
  eyebrow: "For owners",
  title: "Fill your quiet days with",
  titleItalic: "new regulars.",
  intro:
    "The 6 Pass brings members to hand-picked restaurants, spas and studios across Toronto and the GTA, on the days you choose. You set the offer and the limits. We're choosing our Founding Partners now.",
  heroImage: { src: "/demo/marigold-room", alt: "A bowl of curry topped with fresh herbs, next to a plate of rice." },
  heroScreen: { src: "/preview/v2/scan-confirmed", alt: "The staff scanner showing a green Confirmed card: second pasta, on us." },
  applyButton: "Let's get started",
  signIn: { label: "Partner sign in", href: "/app/business" },

  // Four short cards under the hero.
  terms: {
    title: "On your terms, always.",
    items: [
      { title: "New regulars", text: "Members come in pairs, find you, and come back. Most offers allow more than one visit a year." },
      { title: "Your days", text: "Pick at least three days a week that suit you, plus any blackout dates for holidays or busy nights." },
      { title: "Your limits", text: "Decide how many times each member can use your offer in a year. The app keeps count for you." },
      { title: "Your call", text: "Need a break? Pause with 7 days' notice to members. Change your offer whenever you like." },
    ],
  },

  // What The 6 Pass does for a business (after The Entertainer's "We build
  // partnerships"). Nothing here states a cost or a number we don't have.
  benefits: {
    eyebrow: "How we help",
    title: "More guests, and more revenue.",
    intro: "Thinking about joining? Here is what The 6 Pass does for your business.",
    items: [
      { title: "New customers", text: "Members are people across the GTA looking for somewhere new to go. They find you in the app, see your offer and come in." },
      { title: "Busier quiet days", text: "Your offer only runs on the days you pick, so new guests arrive when you have room for them." },
      { title: "Marketing for you", text: "Founding Partners are featured in the app, on our Instagram and in our launch email to everyone on the waitlist." },
      { title: "Brand awareness", text: "Your place, your photos and your offer in front of people who love going out. We share new partners on Instagram as they join." },
      { title: "Guests who come back", text: "Members bring someone every time. Most offers allow more than one visit a year, and the people who like you come back again." },
    ],
  },

  // "Calculate my earnings" (after ClassPass). Every number is the owner's own.
  calculator: {
    eyebrow: "Estimate your earnings",
    title: "What could it bring in?",
    intro: "Put in your own numbers. This is an estimate to think with, not a promise of visits: how many members come depends on the offer, the days and the area.",
    type: "Type of place",
    types: [
      { id: "restaurant", label: "Restaurant or café", spend: 35, item: 24, cost: 32 },
      { id: "spa", label: "Spa", spend: 140, item: 30, cost: 30 },
      { id: "studio", label: "Yoga or fitness studio", spend: 30, item: 30, cost: 10 },
    ],
    spend: "Average spend per guest",
    item: "What you give on the house, per pair",
    guests: "New 6 Pass guests on each offer day",
    days: "Days a week the offer runs",
    cost: "Your cost of what you serve (% of price)",
    month: "Extra sales a month",
    net: "Left after your costs, a month",
    year: "Left after your costs, a year",
    guestsMonth: "new guests a month",
    note: "How it works out: members come in pairs and one of the pair gets the offer. Sales are your spend per guest times the guests, minus what you give on the house. What's left takes off your cost of everything served, including the free item. About 4.3 weeks a month. Rent and wages are the same with or without these guests, which is why quiet days are the ones to fill.",
    cta: "Let's get started",
  },

  // The application form at the bottom (#apply). Saved to the database; Nida
  // sees every application at /admin.
  apply: {
    eyebrow: "Founding Partners",
    title: "Tell us about your place.",
    text: "Nida reads every one and will be in touch. Prefer to write yourself? Email",
    fields: {
      business: "Business name",
      name: "Your name",
      email: "Email",
      phone: "Phone",
      type: "Type of place",
      area: "Where you are",
      web: "Website or Instagram",
      message: "Anything you'd like us to know?",
      optional: "optional",
      choose: "Choose one",
    },
    types: ["Restaurant", "Café or bakery", "Spa", "Yoga or fitness studio", "Experience or class", "Something else"],
    submit: "Send my application",
    sending: "Sending...",
    thanksTitle: "Thank you. We have it.",
    thanksText: "Nida reads every application and will be in touch within a few days, by email or phone.",
    failed: "That didn't go through. Try again in a minute, or email us at",
  },

  control: {
    title: "You set every part of it.",
    // Example settings panel, under the list.
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
    screen: { src: "/preview/v2/owner-offer", alt: "The owner view in the app: the offer, the days, uses per member, blackout dates and a Pause switch.", caption: "Your offer, in the owner view. Change it any time." },
    items: [
      {
        title: "The offer",
        text: "Two-for-one, or a free upgrade or add-on if that suits you better. Food, services and non-alcoholic drinks only.",
      },
      {
        title: "The days",
        text: "Pick the days it runs, at least three a week. Leave Friday and Saturday out if you don't need help there.",
      },
      {
        title: "The limit",
        text: "Decide how many times each member can use it in a year. The default is two.",
      },
      {
        title: "Blackout dates",
        text: "Block any dates you like: holidays, events, your busiest weeks.",
      },
      {
        title: "A pause button",
        text: "Need a break? Pause your offer with 7 days' notice to members.",
      },
    ],
  },

  // A worked example. Every number here is an assumption you can change.
  example: {
    title: "What a two-for-one costs you.",
    intro:
      "Here is one table of two on a quiet weeknight. These are example numbers. Swap in your own.",
    mainPrice: 32, // menu price of one main
    otherFood: 30, // shared starter and dessert
    drinks: 40, // drinks, always full price
    foodCostRate: 0.32, // ingredients as a share of menu price
    drinkCostRate: 0.25,
    labels: {
      bill: "The bill",
      cost: "Food and drink cost",
      left: "Left over before wages and rent",
      full: "Full price",
      pass: "With the pass",
    },
    takeaways: [
      {
        title: "On a table that would have been empty",
        text: "You are ahead by the amount in the last row. Two guests came in who weren't coming.",
      },
      {
        title: "On a table that was coming anyway",
        text: "You gave away one main. That is why you pick your quiet days and cap the uses.",
      },
    ],
    note: "Example only. Food cost of 28 to 35 percent of menu price is a common range for restaurants. Yours may differ.",
  },


  redeem: {
    title: "How it works at your door.",
    label: "Screens from the app. The place is made up.",
    link: "Demo for owners",
    steps: [
      {
        title: "The member taps Redeem",
        text: "They do it at the table or front desk, before the bill.",
        screen: { src: "/preview/v2/place", alt: "Fennel & Ash in the member app: second pasta on us, runs Tuesday to Thursday, 2 uses left this year, and a Redeem button." },
      },
      {
        title: "They show you a code",
        text: "A QR code and a six-digit code. It lasts ten minutes.",
        screen: { src: "/preview/v2/pass", alt: "A member pass for Fennel & Ash with a QR code, a barcode and a six-digit code valid for 10 minutes." },
      },
      {
        title: "You confirm it",
        text: "Scan it with the app on any phone, or type the six digits. Take the second one off the bill as you normally would.",
        screen: { src: "/preview/v2/scan-confirmed", alt: "The staff scanner at Fennel & Ash showing a green Confirmed card for Alex: second pasta, on us." },
      },
    ],
  },

  founding: {
    title: "Why hand-picked.",
    text: "Members should recognise every place on the list as somewhere worth going, so we choose each one by hand. Our first partners are Founding Partners, with a badge in the app and a place in the launch on " +
      site.launchLabel +
      ".",
  },

  // Beside "Why hand-picked." No cost, fees, terms or notice periods here.
  next: {
    title: "What happens next",
    steps: [
      { title: "You email us.", text: "Tell us your place and the best time to reach you." },
      { title: "We come by.", text: "Fifteen minutes, at a time that suits you. We show you the app on a phone." },
      { title: "You choose your offer.", text: "The offer, the days, the limits and any blackout dates. You can change them later." },
      { title: "You're in the launch.", text: "Founding Partners get the badge in the app and a place in the launch on " + site.launchLabel + "." },
    ],
  },

  contact: {
    title: "Tell us about your place.",
    text: "Email us and we'll come by. Fifteen minutes, at a time that suits you.",
  },

  // PDFs in public/files, to read or forward.
  downloads: {
    title: "To read or forward",
    items: [
      { label: "The partner deck", file: "/files/the-6-pass-partner-deck.pdf", note: "12 slides, PDF" },
      { label: "The one-pager", file: "/files/the-6-pass-one-pager.pdf", note: "1 page, PDF" },
      { label: "The letter of intent", file: "/files/the-6-pass-letter-of-intent.pdf", note: "1 page, PDF. Not a contract." },
    ],
  },
};
