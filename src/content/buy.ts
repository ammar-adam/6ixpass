/*
 * The "choose your pass" screen (/pass). PREVIEW ONLY: not linked, not indexed.
 * Tier names and prices are private decisions. Prices stay [PRICE] until
 * they're signed off, and the button only opens the waitlist until passes go on sale.
 * The renewal box is legal wording (Ontario consumer law): have it reviewed before real sales.
 */
export const buy = {
  seo: {
    title: "Choose your pass",
    description: "One yearly pass. Two-for-one at hand-picked places across Toronto.",
  },
  eyebrow: "Founding member pricing",
  title: "Choose your pass.",
  sub: "One year of two-for-one, on the days each place chooses. Bring someone, and come back.",
  plansLabel: "Your pass",
  plans: [
    {
      id: "pass",
      name: "6 Pass",
      line: "Restaurants and cafés",
      price: "[PRICE]",
      regular: "[PRICE]",
      includes: ["Restaurants and cafés", "Two-for-one on each place's days", "One year from the day you buy"],
    },
    {
      id: "plus",
      name: "6 Pass Plus",
      line: "Adds spas, yoga, gyms and studios",
      price: "[PRICE]",
      regular: "[PRICE]",
      includes: ["Everything in 6 Pass", "Spas: a free upgrade on your treatment", "Yoga, gyms and studios: bring a friend, free"],
    },
    {
      id: "black",
      name: "6 Pass Black",
      line: "Adds hotel restaurants and spas, experiences, first access",
      price: "[PRICE]",
      regular: "[PRICE]",
      includes: ["Everything in 6 Pass Plus", "Hotel restaurants and spas", "Experiences, and first access to new places"],
    },
  ],
  perYear: "a year",
  foundingTag: "Founding price",
  renewal: (name: string, price: string) =>
    `Your ${name} lasts one year from the day you buy it. It renews at ${price} a year, plus HST, until you turn renewal off. We'll email you 30 days before it renews. Turn renewal off any time in your account, in the app or on the website.`,
  renewalConsent: "I understand my pass renews each year until I turn renewal off.",
  renewalError: "Please tick the box to continue.",
  refund: "[REFUND TERMS: to confirm before passes go on sale]",
  cta: "Get my pass",
  notYet: "Passes go on sale soon. Join the waitlist and we'll email you first, with founding member pricing.",
  notYetButton: "Join the waitlist",
  secure: "Secure checkout. Your card details never touch our servers.",
  includedTitle: "What's in your pass",
  screens: [
    { src: "/preview/v2/explore", caption: "See what runs today", alt: "The app's Explore screen, listing places in Toronto with an offer on today." },
    { src: "/preview/v2/place", caption: "Check the offer and the days", alt: "A place in the app: second pasta on us, Tuesday to Thursday, 2 uses left this year." },
    { src: "/preview/v2/pass", caption: "Show your pass", alt: "A member pass with a QR code and a six-digit code valid for 10 minutes." },
    { src: "/preview/v2/redeemed", caption: "The second one is on the house", alt: "The member's screen after staff confirm: Redeemed, 1 of 2 uses left this year." },
  ],
  screensLabel: "Screens from the app as it is today. The places are examples, not partners yet.",
};
