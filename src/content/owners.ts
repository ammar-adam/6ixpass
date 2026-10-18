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
      "The 6 Pass is choosing 50 Founding Partners across Toronto and the GTA. Members come in on the days you choose. You set the offer, the days and the limits.",
  },
  eyebrow: "For owners",
  title: "More guests on your quiet days.",
  titleItalic: "",
  intro:
    "The 6 Pass sends members to you on the days you choose. You set the offer, the days and how often each member can use it.",

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
    title: "How a visit works.",
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
    title: "Why only 50.",
    text: "Members should recognise every place on the list as somewhere worth going. Fifty Founding Partners, chosen one neighbourhood at a time, get a Founding Partner badge in the app and a place in the launch on " +
      site.launchLabel +
      ".",
  },

  // Beside "Why only 50." No cost, fees, terms or notice periods here.
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
};
