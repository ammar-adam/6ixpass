export type BlogPost = {
  slug: string;
  title: string;
  dek: string;
  date: string;
  readMinutes: number;
  tag: "Members" | "Owners" | "Our story";
  image: string;
  imageAlt: string;
  body: { h?: string; p: string[]; list?: string[] }[];
};

export const blogIndex = {
  title: "Notes from The 6 Pass",
  intro: "Short, useful reads about going out in Toronto and the GTA.",
};

export const posts: BlogPost[] = [
  {
    slug: "quiet-tuesday-plan-going-out-midweek-toronto",
    title: "The case for going out on a Tuesday",
    dek: "Saturday gets all the attention. Midweek is when the city is easiest to enjoy. A short guide to making one weeknight count.",
    date: "2026-11-04",
    readMinutes: 4,
    tag: "Members",
    image: "/demo/juniper-table",
    imageAlt: "A plated dessert with berries on a dark table",
    body: [
      {
        p: [
          "Most of us save going out for the weekend. Then the weekend arrives with errands, family, a wait for a table and a line at the door, and the plan turns into takeout.",
          "There's a better slot hiding in plain sight. Tuesday, Wednesday and Thursday evenings are when Toronto is easiest to enjoy. Here's why, and how to make one of them count.",
        ],
      },
      {
        h: "Why midweek works",
        p: [
          "Rooms are calmer. You can usually walk in, or book the same day. You get a better table, a slower meal, and staff with time to tell you what's good tonight.",
          "The same goes for spas and studios. A Wednesday class has space on the floor and a teacher who can actually correct your form. A midweek treatment means a quiet change room and nobody rushing you out.",
          "And a small plan in the middle of the week changes how the week feels. Thursday stops being a blur between two Mondays.",
        ],
      },
      {
        h: "Keep it to one thing",
        p: [
          "The midweek plan that happens is the simple one. One place, one person, one evening. Don't stack dinner, a show and a late stop on a work night. Pick the thing you actually want and leave room to linger.",
          "A good rule: if it needs more than one message to organise, it's a weekend plan.",
        ],
      },
      {
        h: "Go a little early",
        p: [
          "Aim for 6 or 6:30. Kitchens are fresh, rooms are settling in, and you'll be home at a reasonable hour. If you're coming straight from work, pick somewhere near your commute instead of across the city.",
        ],
      },
      {
        h: "Try one neighbourhood you skip",
        p: [
          "Everyone has a part of the city they only drive through. Midweek is the time to stop there. If you live downtown, try the Danforth or Scarborough. If you're in Mississauga or Markham, give a weeknight to the west end. The GTA is full of places that are only a short trip from home and completely new to you.",
        ],
      },
      {
        h: "Ideas that fit a weeknight",
        p: [],
        list: [
          "Dinner somewhere new, ordered to share, so you both try more.",
          "An early yoga or spin class with a friend, then a coffee after.",
          "A massage or facial booked for right after work.",
          "A pottery or cooking workshop, where midweek groups are smaller and you get more hands-on time.",
          "A long breakfast on a day off, when brunch spots are half empty.",
        ],
      },
      {
        h: "Bring someone",
        p: [
          "Plans with another person actually happen. You're less likely to cancel on a friend than on yourself, and most of these things are better shared anyway.",
          "That's the idea behind The 6 Pass. At hand-picked independent places across Toronto and the GTA, you bring someone and the second is on the house. Partners choose the days their offer runs, and quieter weeknights are the natural fit, so midweek is where the pass will work best.",
        ],
      },
    ],
  },
];
