/*
 * The owners page (/owners). This is the page Nida sends after a conversation.
 *
 * Rules: say only what is agreed. Free for the first 12 months, no commission,
 * no setup cost. Never promise anything about year 2. No alcohol in any offer.
 * The numbers in "example" are an illustration, labelled as one. Change them
 * here and the table and the totals update by themselves.
 */
import { site } from "./site";

export const ownersPage = {
  seo: {
    title: "For restaurant, spa and studio owners",
    description:
      "The 6 Pass is choosing 50 Founding Partners in Toronto. Free for your first 12 months. You set the offer, the days and the limits.",
  },
  eyebrow: "For owners",
  title: "More guests on your quiet days.",
  titleItalic: "",
  intro:
    "The 6 Pass sends members to you on the days you choose. You set the offer, the days and how often each member can use it. It is free for your first 12 months.",

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
    screen: { src: "/preview/offer", alt: "The Your offer screen in the partner app, with the offer type, wording and days it runs.", caption: "Your offer, in the partner app. Change it any time." },
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

  costs: {
    title: "What it costs you.",
    rows: [
      { label: "To join", value: "Free for your first 12 months" },
      { label: "Commission", value: "None" },
      { label: "Setup", value: "None" },
      { label: "Leaving", value: "30 days' notice, either side" },
    ],
  },

  redeem: {
    title: "How a visit works.",
    label: "Screens from the app demo. The place is made up.",
    link: "Demo for owners",
    steps: [
      {
        title: "The member taps Redeem",
        text: "They do it at the table or front desk, before the bill.",
        screen: { src: "/preview/place", alt: "A place in the member app, with its offer and a Redeem button." },
      },
      {
        title: "They show you a code",
        text: "A six-digit code that lasts ten minutes.",
        screen: { src: "/preview/code", alt: "The member's screen showing a six-digit code and a ten-minute timer." },
      },
      {
        title: "You confirm it",
        text: "One tap on your side. Take the second one off the bill as you normally would.",
        screen: { src: "/preview/staff", alt: "The staff screen, showing the same code and a Confirm button." },
      },
    ],
  },

  founding: {
    title: "Why only 50.",
    text: "Members should recognise every place on the list as somewhere worth going. Fifty Founding Partners, chosen one neighbourhood at a time, get a Founding Partner badge in the app and a place in the launch on " +
      site.launchLabel +
      ".",
  },

  contact: {
    title: "Tell us about your place.",
    text: "Email us and we'll come by. Fifteen minutes, at a time that suits you.",
  },
};
