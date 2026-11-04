export type BlogPost = {
  slug: string;
  title: string;
  dek: string;
  date: string;
  readMinutes: number;
  tag: "Members" | "Owners" | "Our story";
  image: string;
  imageAlt: string;
  body: { h?: string; p: string[] }[];
};

export const blogIndex = {
  title: "Notes from The 6 Pass",
  intro: "Short reads about going out in Toronto, the places we love, and how The 6 Pass works.",
};

export const posts: BlogPost[] = [
  {
    slug: "why-were-building-the-6-pass",
    title: "Why we're building The 6 Pass",
    dek: "A note from Nida on going out more, bringing someone along, and coming back to the places you love.",
    date: "2026-11-04",
    readMinutes: 3,
    tag: "Our story",
    image: "/demo/fennel-ash",
    imageAlt: "A white bowl of ribbon pasta with mushrooms, sage and grated cheese",
    body: [
      {
        p: [
          "Hi, I'm Nida. I'm a Toronto mom, and one of my favourite things is finding a local place I didn't know about. A small café on a side street. A family kitchen that has been feeding the same block for years. A studio where the teacher learns your name on the first visit.",
          "This city is full of places like that. But a lot of the time, we don't go. We mean to. We save the spot on our phone, we tell a friend we should try it, and then the week gets busy and we end up at home again.",
        ],
      },
      {
        h: "Two-for-one makes the yes easier",
        p: [
          "I started thinking about what actually gets people out the door. For me, it's usually a small nudge. A reason to say yes tonight instead of someday.",
          "That's the idea behind The 6 Pass. It's a yearly membership for Toronto and the GTA. At hand-picked restaurants, cafés, spas, yoga and fitness studios, and experiences, members get two-for-one: you pay for one, and the second is on the house. Some places offer a free upgrade instead. Either way, it's a simple, friendly reason to go.",
          "Using it is easy. You tap Redeem in the app, show your code, and the staff scan it or type in six digits. No coupons to print, no awkward moment at the counter.",
        ],
      },
      {
        h: "It's better with someone",
        p: [
          "Two-for-one has a nice side effect. It makes you think about who to bring. Your sister you haven't seen in a month. A neighbour who just moved in. Your partner, on a night when you both need a break. A friend who keeps saying she wants to try a yoga class but never goes alone.",
          "Going out is rarely about the food or the massage on its own. It's about the hour you get to spend with a person you like. I wanted to build something that makes that hour easier to plan.",
        ],
      },
      {
        h: "Coming back matters most",
        p: [
          "The other thing I care about is coming back. A first visit is lovely, but the second and third visits are where a place becomes yours. You know what to order. They know you. That's how neighbourhoods feel like home.",
          "Owners decide how many times each member can use their offer in a year, so there's room to return. I hope members find a few places they keep going back to, long after the first try.",
        ],
      },
      {
        h: "Built with owners, not around them",
        p: [
          "We're a Toronto family business, and we want this to work for the people who run these places too. Owners choose their own offer, which days it runs, and when it doesn't. They can pause it with seven days' notice. Nobody knows their business better than they do.",
          "Right now I'm choosing our Founding Partners. I'm doing it the old way, by walking in, saying hello, and meeting owners in person. If you run a place you're proud of, I'd love to visit.",
          "The 6 Pass launches early next year. Until then, thank you for reading, and for caring about the local places that make this city what it is.",
        ],
      },
    ],
  },
  {
    slug: "how-we-choose-places",
    title: "How we choose places",
    dek: "What hand-picked means to us, and why every place on The 6 Pass gets a visit in person first.",
    date: "2026-11-04",
    readMinutes: 3,
    tag: "Our story",
    image: "/demo/kiln-day",
    imageAlt: "Two clay-covered hands shaping a small bowl on a pottery wheel",
    body: [
      {
        p: [
          "When we say every place on The 6 Pass is hand-picked, we mean it plainly. Someone from our family has walked through the door, looked around, and talked with the owner. We don't add places from a list or a spreadsheet.",
          "Here is what we look for, and what we don't.",
        ],
      },
      {
        h: "Independent and local",
        p: [
          "We focus on independent places run by people who live and work here. Family restaurants, neighbourhood cafés, small spas, yoga and fitness studios, and local experiences like a pottery class or a cooking workshop.",
          "These are the places that give a street its character, whether that's in Leslieville, along Ossington, out in Scarborough or over in Mississauga. We'd rather send you somewhere with a story than somewhere you could find in any city.",
        ],
      },
      {
        h: "Welcoming to everyone",
        p: [
          "A good place makes you feel welcome before you've ordered anything. We pay attention to how staff greet people, how they treat a first-timer, and whether the room feels easy to be in.",
          "We also think about members who use the pass. Showing a code should never feel awkward. We only partner with owners who are glad to see our members and want them to come back.",
        ],
      },
      {
        h: "Worth the trip",
        p: [
          "Toronto and the GTA are big. If we ask you to cross the city, the place should be worth it. That might be a dish you think about for days, a massage that actually fixes your shoulders, or a class that leaves you feeling better than when you walked in.",
          "It doesn't have to be fancy. Some of our favourite spots are small and simple. What matters is that they do something well and care about doing it.",
        ],
      },
      {
        h: "Good on a weeknight",
        p: [
          "Many offers on The 6 Pass run on quieter days, so we look for places that are just as good on a Tuesday as on a Saturday. Same care in the kitchen, same attention at the front desk.",
          "A weeknight visit is often the nicest one. It's calmer, you get more time with the staff, and you can usually walk in without much planning.",
        ],
      },
      {
        h: "Owners set their own offer",
        p: [
          "Once we've found a place we love, the owner decides how their offer works. They choose what's included, whether it's two-for-one or a free upgrade, and which days it runs, with at least three days a week. They set how many times each member can use it in a year, pick any blackout dates, and can pause it with seven days' notice.",
          "We think this is fair. Owners know their busy nights, their slow afternoons, and what they can comfortably give. Our job is to send them good guests, not to tell them how to run their business.",
        ],
      },
      {
        h: "Still walking in",
        p: [
          "Nida is choosing our Founding Partners right now, one visit at a time. It's slower than sending emails, but it's the only way we know to be sure. When The 6 Pass launches early next year, every place you see will be one we've met.",
        ],
      },
    ],
  },
  {
    slug: "quiet-tuesday-plan-going-out-midweek-toronto",
    title: "Your quiet Tuesday plan: ideas for going out midweek in Toronto",
    dek: "Weekdays are calmer, friendlier and easier to plan. Here are a few simple ways to make the most of one.",
    date: "2026-11-04",
    readMinutes: 3,
    tag: "Members",
    image: "/demo/quiet-hours",
    imageAlt: "Folded orange towels, white orchids, smooth stones and two lit candles at a spa",
    body: [
      {
        p: [
          "Weekends in Toronto can feel crowded. Long waits, full rooms, and plans that need booking a week ahead. Midweek is different. A Tuesday or Wednesday evening is often the easiest time to go out and actually enjoy it.",
          "Here are a few ideas for a quiet midweek plan. None of them need much planning, and all of them are better with someone.",
        ],
      },
      {
        h: "Why weekdays are nicer",
        p: [
          "On a weeknight, there's usually room. You can walk in, pick a good table, and take your time. Staff have a moment to chat, recommend something, or tell you about the dish they're proud of.",
          "Spas and studios are calmer too. Fewer people means a quieter change room, more space on the floor, and a teacher who can give you a little more attention.",
          "And a small plan in the middle of the week gives you something to look forward to. It breaks up the routine without taking over your weekend.",
        ],
      },
      {
        h: "Try a new dinner spot",
        p: [
          "Pick a neighbourhood you don't usually eat in. If you live near King West, try somewhere in the east end. If you're in Mississauga, head to a part of town you only ever drive through.",
          "Go early, around six, when the room is settling in. Order something you can't make at home. Share a few plates so you both get to try more. If you love it, make a note to come back, because the second visit is often even better.",
        ],
      },
      {
        h: "Book a spa afternoon",
        p: [
          "If you can take an afternoon off, a midweek spa visit is one of the most relaxing things you can do in the city. It's quieter than a Saturday, and you'll walk out ready for the rest of the week.",
          "Bring a friend, your mom, or your partner. Book side by side if you can. Leave your phone in the locker and give yourselves an extra half hour afterward for tea and a slow walk home.",
        ],
      },
      {
        h: "Take a class with a friend",
        p: [
          "A yoga, pilates or fitness class is easier to show up for when someone is expecting you. Choose a weeknight class, meet at the door, and try something neither of you has done before.",
          "Afterward, find a nearby café for a coffee or a light bite. That hour of talking is half the fun.",
        ],
      },
      {
        h: "Do something with your hands",
        p: [
          "Toronto has lots of small local experiences, like pottery, painting or cooking workshops. Midweek sessions tend to be smaller, so you get more help and more time at the wheel or the stove. You also go home with something you made.",
        ],
      },
      {
        h: "Making it easy with The 6 Pass",
        p: [
          "Many places on The 6 Pass choose quieter days for their offers, which makes midweek a natural fit. With two-for-one, you pay for one and the second is on the house, so inviting someone is an easy yes. Some places offer a free upgrade instead.",
          "When you get there, tap Redeem, show your code, and the staff scan it or type in six digits. Then you can relax and enjoy your Tuesday. The 6 Pass launches early next year.",
        ],
      },
    ],
  },
  {
    slug: "for-owners-what-a-two-for-one-actually-costs-you",
    title: "For owners: what a two-for-one actually costs you",
    dek: "A plain look at the real cost of a free second item, and how to set up an offer that works for your business.",
    date: "2026-11-04",
    readMinutes: 3,
    tag: "Owners",
    image: "/demo/marigold-room",
    imageAlt: "A cast-iron dish of golden stew topped with greens, served with a bowl of white rice",
    body: [
      {
        p: [
          "When owners first hear two-for-one, a common worry is that they'll be giving away half their sales. It's a fair question. The answer depends on a few things you control, so here is a plain way to think it through.",
        ],
      },
      {
        h: "The free item costs ingredients, not menu price",
        p: [
          "The price on your menu covers a lot: rent, wages, equipment, and your profit. But when you make one extra plate for a guest who is already sitting down, most of those costs don't go up. The room is already open. The staff are already on shift.",
          "What you actually spend on that second item is mostly the ingredients and a bit of time. For a spa or studio, it's similar. If a treatment room or a class spot would otherwise sit empty, filling it costs far less than its listed price.",
        ],
      },
      {
        h: "Pick your quiet days",
        p: [
          "You choose which days your offer runs, with at least three days a week. Most owners pick the days when they have empty tables, open appointments or spare spots in class. That way, the offer fills seats you weren't going to fill anyway, instead of replacing guests who would have paid full price.",
          "You can also set blackout dates for holidays and busy events, and pause your offer with seven days' notice if something changes.",
        ],
      },
      {
        h: "Cap how often it's used",
        p: [
          "You decide how many times each member can use your offer in a year. A lower number keeps your cost predictable. A higher number gives members a reason to make you a regular. Many owners start small and adjust once they see how it goes.",
        ],
      },
      {
        h: "Guests come in pairs, and they spend on extras",
        p: [
          "A two-for-one means members almost always bring someone. That's two people in your space, and often two people who have never been before. They may add a side, a dessert, a coffee or a tea. At a spa, they might add a longer session or pick up a product on the way out. At a studio, a first class can turn into a regular habit.",
          "Most importantly, a good first visit is how regulars start. A guest who loves your place will come back, tell friends, and bring other people on nights when there's no offer at all.",
        ],
      },
      {
        h: "A simple example",
        p: [
          "Say two guests come in on a quiet Tuesday. One main is paid in full. The second is on the house, so your real cost is what went into making it. If they also order a shared starter and dessert, those are paid as usual. Compare that to the alternative: an empty table and no sale at all.",
          "This is only an example. Every business is different, so please use your own numbers, your own ingredient costs and your own quiet days when you think it through.",
        ],
      },
      {
        h: "Run your own estimate",
        p: [
          "To make this easier, we built a simple earnings estimate tool at /owners/earnings. You put in your own figures and it shows how an offer might work for you. It's a starting point for your own thinking, not a promise.",
          "Nida is meeting owners in person now to choose our Founding Partners ahead of our launch early next year. If you'd like to talk it through face to face, we'd be glad to visit.",
        ],
      },
    ],
  },
];
