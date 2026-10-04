/*
 * The "What is The 6 Pass?" page (/about).
 *
 * Written as short, plain facts so people, search engines and AI assistants
 * can all quote it accurately. Only put things here that are true today.
 * No prices, no partner names, no numbers we can't back up.
 */
import { site } from "./site";

export const about = {
  seo: {
    title: "What is The 6 Pass?",
    description:
      "The 6 Pass is a yearly Toronto membership: two-for-one, or a free upgrade, at hand-picked restaurants, spas and studios. It opens March 16, 2027.",
  },
  eyebrow: "The short version",
  title: "What is",
  titleItalic: "The 6 Pass?",
  intro:
    "The 6 Pass is a yearly membership for Toronto. Members get two-for-one, or a free upgrade, at a short list of hand-picked restaurants, spas, studios and experiences. It opens on " +
    site.launchLabel +
    ".",
  facts: [
    { label: "What it is", value: "A yearly membership pass for going out in Toronto" },
    { label: "What you get", value: "Two-for-one, or a free upgrade or add-on, at each partner" },
    { label: "Where", value: "Toronto, starting in six neighbourhoods" },
    { label: "Opens", value: site.launchLabel },
    { label: "Status", value: "Not open yet. The waitlist is open." },
    { label: "Contact", value: site.email },
  ],
  sections: [
    {
      heading: "How it works",
      body: [
        "You get one pass, and it is good for a year.",
        "You pick a place in the app. Each offer shows the days it runs and how many times you can use it.",
        "At the table or front desk you tap Redeem and show your code. Staff confirm it, and the second one is on the house.",
      ],
    },
    {
      heading: "What the offers cover",
      body: [
        "Offers cover food, services and non-alcoholic drinks. They are for when you go in person, so not takeout or delivery.",
        "At restaurants and cafés the offer is usually a second main. At spas it is usually a free upgrade or add-on to a treatment. At studios it is usually bringing a friend to class.",
        "Each partner sets its own offer, the days it runs, and how many times a member can use it in a year.",
      ],
    },
    {
      heading: "Where it starts",
      body: [
        "The first six neighbourhoods are the Financial District, King West, Queen West, Ossington, Yorkville and Leslieville. More follow after launch, one at a time.",
      ],
    },
    {
      heading: "How it is different from a coupon site",
      body: [
        "There are no vouchers to buy and none that run out. You don't pay per deal.",
        "The list is short on purpose. We are choosing 50 Founding Partners by hand, one neighbourhood at a time.",
        "Partners set how many times you can use their offer in a year, so you can go back.",
      ],
    },
    {
      heading: "What it costs",
      body: [
        "Pricing will be shared before launch. People on the waitlist hear first and get founding member pricing.",
      ],
    },
    {
      heading: "For restaurant, spa and studio owners",
      body: [
        "We are choosing 50 Founding Partners. It is free for your first 12 months, and you set the offer, the days and the limits.",
        "To talk about your place, email " + site.email + ".",
      ],
    },
  ],
  cta: {
    title: "Hear first when we open.",
    text: "Join the waitlist. You'll hear first when we open, and get founding member pricing.",
    button: "Join the waitlist",
  },
};
