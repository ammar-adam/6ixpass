/*
 * Privacy policy and terms. DRAFTS: have a lawyer review before launch.
 * Each section is a heading plus paragraphs. Edit the words, keep the shape.
 *
 * The privacy policy describes exactly what the site does today. If the
 * site starts collecting something new (analytics, a new form field,
 * payments), this page has to change first.
 */
import { site } from "./site";

const contactLine = [site.name, site.mailingAddress || site.city, site.email].join(". ");

export const privacy = {
  title: "Privacy policy",
  updated: "Draft, October 4, 2026",
  intro:
    "This covers this website and its waitlist. We'll update it before passes go on sale, because membership will need more than an email address.",
  sections: [
    {
      heading: "What we collect when you join the waitlist",
      body: [
        "Your email address. Your first name and neighbourhood, only if you fill them in.",
        "A record of your consent: that you ticked the box, the exact wording you agreed to, and the date and time.",
        "How you found us: the campaign or website that sent you, if there was one. For example, a link from Instagram. If nothing sent you, we note \"direct\".",
        "That's all. We don't ask for your phone number, address, birthday or payment details.",
      ],
    },
    {
      heading: "What we use it for",
      body: [
        "To email you about The 6 Pass launch and founding member pricing. That's what you agreed to, and we only email people who ticked the box.",
        "Your neighbourhood helps us decide where to add places first. How you found us tells us which posts and partners are working.",
      ],
    },
    {
      heading: "Where it's kept, and who can see it",
      body: [
        "The waitlist is stored in Canada, with our database provider (Supabase) in its Canada (Central) region. It can't be read from the website. Only The 6 Pass team can see it.",
        "Our web host (Netlify) delivers the pages of this site. Like any host, it and our database provider keep short-term technical logs, such as IP addresses, to run and protect their services.",
      ],
    },
    {
      heading: "Cookies and tracking",
      body: [
        "This site doesn't use cookies, ads or tracking tools.",
        "It saves a few small notes in your own browser, which never leave your device: whether you've joined, so we don't ask again; when you closed the waitlist popup, so it stays away for 3 days; and the link that brought you here, until you close the tab.",
        "The app demo at /app saves your clicks in your browser too, so it remembers where you were. Nothing in the demo is sent to us.",
      ],
    },
    {
      heading: "We never sell it",
      body: ["We never sell, rent or trade your personal information."],
    },
    {
      heading: "How long we keep it",
      body: [
        "Until you unsubscribe or ask us to delete it. If we never launch, we'll delete the waitlist.",
      ],
    },
    {
      heading: "Unsubscribing and your rights",
      body: [
        "Every email we send has an unsubscribe link, and we act on it within 10 business days.",
        `You can also email ${site.email} to unsubscribe, see what we hold about you, correct it, or ask us to delete it.`,
        "If you're not happy with how we've handled your information, tell us first. You can also contact the Office of the Privacy Commissioner of Canada at priv.gc.ca.",
      ],
    },
    {
      heading: "Contact",
      body: [contactLine],
    },
  ],
};

export const terms = {
  title: "Terms",
  updated: "Draft, October 4, 2026",
  intro:
    "These cover this website and the waitlist. Full membership terms will be published before passes go on sale.",
  sections: [
    {
      heading: "The waitlist",
      body: [
        "Joining the waitlist is free and doesn't commit you to buying anything. It means we'll email you about the launch and founding member pricing. You can leave any time.",
      ],
    },
    {
      heading: "Launch details can change",
      body: [
        `We plan to launch on ${site.launchLabel}. Dates, partners and pricing may change before then, and we'll tell the waitlist first.`,
      ],
    },
    {
      heading: "Offers",
      body: [
        "Offers shown on this site are examples. Each partner sets its own offer, the days it runs, and how many times a member can use it. Offers cover food, services and non-alcoholic drinks only, and are for use in person.",
      ],
    },
    {
      heading: "The app demo",
      body: [
        "The app at /app is a demo. The places in it are made up, and its codes can't be used anywhere.",
      ],
    },
    {
      heading: "Contact",
      body: [contactLine],
    },
  ],
};
