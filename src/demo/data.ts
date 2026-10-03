/*
 * DEMO DATA. Every place here is made up. None of these are partners.
 * Names were invented for the demo; if one turns out to match a real
 * Toronto business, rename it here. Numbers (savings, weekly counts) are
 * examples for the demo only and are never shown on the public site.
 */
import type { ArtKind } from "@/components/PlaceArt";

export type Category = "Restaurants" | "Cafés" | "Spas" | "Studios" | "Hotel dining and spas" | "Experiences";
export type Neighbourhood =
  | "Financial District"
  | "King West"
  | "Queen West"
  | "Ossington"
  | "Yorkville"
  | "Leslieville";

export type OfferKind = "two_for_one" | "upgrade";

export type Offer = {
  kind: OfferKind;
  title: string;
  details: string;
  /** Monday first. At least 3 must be true. */
  days: boolean[];
  usesPerYear: number;
  /** ISO dates, YYYY-MM-DD. */
  blackoutDates: string[];
  paused: boolean;
  /** Rough value of the free item, for "You saved about $X". */
  estimatedSaving: number;
};

export type Place = {
  slug: string;
  name: string;
  category: Category;
  neighbourhood: Neighbourhood;
  blurb: string;
  art: ArtKind;
  food: boolean;
  founding: boolean;
  offer: Offer;
};

export const categories: Category[] = [
  "Restaurants",
  "Cafés",
  "Spas",
  "Studios",
  "Hotel dining and spas",
  "Experiences",
];

export const neighbourhoods: Neighbourhood[] = [
  "Financial District",
  "King West",
  "Queen West",
  "Ossington",
  "Yorkville",
  "Leslieville",
];

const d = (s: string) => "MTWTFSS".split("").map((_, i) => s[i] === "x");

export const places: Place[] = [
  {
    slug: "lantern-house",
    name: "Lantern House",
    category: "Restaurants",
    neighbourhood: "Ossington",
    blurb: "A small dining room with a wood oven and a short, seasonal menu.",
    art: "restaurant",
    food: true,
    founding: true,
    offer: {
      kind: "two_for_one",
      title: "Second main, on us.",
      details: "Order two mains and the lower-priced one is free.",
      days: d(".xxx..x"),
      usesPerYear: 2,
      blackoutDates: ["2026-12-24", "2026-12-25", "2026-12-26"],
      paused: false,
      estimatedSaving: 28,
    },
  },
  {
    slug: "ledger-kitchen",
    name: "Ledger Kitchen",
    category: "Restaurants",
    neighbourhood: "Financial District",
    blurb: "Lunch for people with an hour, not three. Bowls, grills and good bread.",
    art: "restaurant",
    food: true,
    founding: true,
    offer: {
      kind: "two_for_one",
      title: "Bring a colleague. Their lunch is on us.",
      details: "Two lunch mains, the second one free. Dine in only.",
      days: d("xxxxx.."),
      usesPerYear: 4,
      blackoutDates: [],
      paused: false,
      estimatedSaving: 22,
    },
  },
  {
    slug: "fennel-and-salt",
    name: "Fennel & Salt",
    category: "Restaurants",
    neighbourhood: "King West",
    blurb: "Vegetables first, a few fish dishes, and a long table by the window.",
    art: "restaurant",
    food: true,
    founding: false,
    offer: {
      kind: "two_for_one",
      title: "Second main, on us.",
      details: "Two mains, the lower-priced one free.",
      days: d("xxx...x"),
      usesPerYear: 2,
      blackoutDates: [],
      paused: false,
      estimatedSaving: 31,
    },
  },
  {
    slug: "halfmoon-noodle-room",
    name: "Halfmoon Noodle Room",
    category: "Restaurants",
    neighbourhood: "Queen West",
    blurb: "Hand-pulled noodles and broths that take all day.",
    art: "restaurant",
    food: true,
    founding: true,
    offer: {
      kind: "two_for_one",
      title: "Two bowls for the price of one.",
      details: "Any two noodle bowls, the second one free.",
      days: d("xxxx..."),
      usesPerYear: 3,
      blackoutDates: [],
      paused: false,
      estimatedSaving: 19,
    },
  },
  {
    slug: "copperleaf-cafe",
    name: "Copperleaf Café",
    category: "Cafés",
    neighbourhood: "Leslieville",
    blurb: "Weekday breakfast, pastries baked in the back, and a quiet corner.",
    art: "cafe",
    food: true,
    founding: false,
    offer: {
      kind: "two_for_one",
      title: "Second breakfast plate, on us.",
      details: "Two breakfast plates, the second one free. Coffee and juice at the usual price.",
      days: d("xxxx..."),
      usesPerYear: 4,
      blackoutDates: [],
      paused: false,
      estimatedSaving: 16,
    },
  },
  {
    slug: "quiet-hours-spa",
    name: "Quiet Hours Spa",
    category: "Spas",
    neighbourhood: "Yorkville",
    blurb: "Six treatment rooms, a long menu of massages, and no rush.",
    art: "spa",
    food: false,
    founding: true,
    offer: {
      kind: "upgrade",
      title: "A free upgrade on your treatment.",
      details: "Book a 60-minute massage and get 90 minutes.",
      days: d("xxx.x.."),
      usesPerYear: 2,
      blackoutDates: [],
      paused: false,
      estimatedSaving: 45,
    },
  },
  {
    slug: "saltlight-spa",
    name: "Saltlight Spa",
    category: "Spas",
    neighbourhood: "Leslieville",
    blurb: "Facials and body treatments in a converted storefront.",
    art: "spa",
    food: false,
    founding: false,
    offer: {
      kind: "upgrade",
      title: "A free add-on with any facial.",
      details: "Add a hand and arm treatment to any 60-minute facial, free.",
      days: d("..xxx.x"),
      usesPerYear: 2,
      blackoutDates: [],
      paused: false,
      estimatedSaving: 30,
    },
  },
  {
    slug: "northline-yoga",
    name: "Northline Yoga",
    category: "Studios",
    neighbourhood: "Queen West",
    blurb: "Slow flow and yin classes in a bright second-floor room.",
    art: "studio",
    food: false,
    founding: true,
    offer: {
      kind: "two_for_one",
      title: "Bring a friend to class, free.",
      details: "Your friend's drop-in class is free when you come together.",
      days: d("xxxxx.."),
      usesPerYear: 6,
      blackoutDates: [],
      paused: false,
      estimatedSaving: 25,
    },
  },
  {
    slug: "low-tide-pilates",
    name: "Low Tide Pilates",
    category: "Studios",
    neighbourhood: "King West",
    blurb: "Reformer classes, eight people at most.",
    art: "studio",
    food: false,
    founding: false,
    offer: {
      kind: "two_for_one",
      title: "Bring a friend to class, free.",
      details: "Book two spots in a reformer class, the second one free.",
      days: d("x.x.x.x"),
      usesPerYear: 3,
      blackoutDates: [],
      paused: false,
      estimatedSaving: 35,
    },
  },
  {
    slug: "second-breath-studio",
    name: "Second Breath Studio",
    category: "Studios",
    neighbourhood: "Ossington",
    blurb: "Strength and mobility classes for people who sit all day.",
    art: "studio",
    food: false,
    founding: false,
    offer: {
      kind: "two_for_one",
      title: "Bring a friend to class, free.",
      details: "Your friend's first class with you is free.",
      days: d("xxx.x.."),
      usesPerYear: 2,
      blackoutDates: [],
      paused: false,
      estimatedSaving: 28,
    },
  },
  {
    slug: "the-aldine-dining-room",
    name: "The Aldine, Dining Room",
    category: "Hotel dining and spas",
    neighbourhood: "Yorkville",
    blurb: "A hotel dining room that's quiet at lunch and good for long talks.",
    art: "hotel",
    food: true,
    founding: true,
    offer: {
      kind: "two_for_one",
      title: "Lunch for two, second main on us.",
      details: "Two lunch mains in the dining room, the second one free.",
      days: d("xxxx..."),
      usesPerYear: 2,
      blackoutDates: [],
      paused: false,
      estimatedSaving: 34,
    },
  },
  {
    slug: "clay-hour",
    name: "Clay Hour",
    category: "Experiences",
    neighbourhood: "Leslieville",
    blurb: "Two-hour wheel classes for beginners. You keep what you make.",
    art: "experience",
    food: false,
    founding: false,
    offer: {
      kind: "two_for_one",
      title: "A second spot in class, on us.",
      details: "Book two spots in a beginner wheel class, the second one free.",
      days: d(".xx.x.x"),
      usesPerYear: 2,
      blackoutDates: [],
      paused: false,
      estimatedSaving: 55,
    },
  },
];

/** The demo member. */
export const member = {
  firstName: "Alex",
  since: "March 2027",
};

/** A couple of past visits so "My pass" isn't empty. */
export const seedHistory = [
  { slug: "halfmoon-noodle-room", date: "2027-03-19", saving: 19 },
  { slug: "northline-yoga", date: "2027-03-24", saving: 25 },
];

/** Example week for the staff view. */
export const exampleWeek = {
  redemptions: [0, 4, 6, 5, 0, 0, 7],
  firstTime: [0, 3, 3, 2, 0, 0, 5],
};
