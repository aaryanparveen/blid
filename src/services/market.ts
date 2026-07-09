import type { Service } from "./types";

export const market: Service[] = [
  { id: "gumroad", name: "Gumroad", category: "market", templates: [{ url: "https://{id}.gumroad.com" }] },
  { id: "kofi", name: "Ko-fi", category: "market", templates: [{ url: "https://ko-fi.com/{id}" }] },
  { id: "buymeacoffee", name: "Buy Me a Coffee", category: "market", templates: [{ url: "https://www.buymeacoffee.com/{id}" }] },
  { id: "patreon", name: "Patreon", category: "market", templates: [{ url: "https://www.patreon.com/{id}" }] },
  { id: "itchio", name: "itch.io", category: "market", templates: [{ url: "https://{id}.itch.io" }] },
  { id: "gamejolt", name: "Game Jolt", category: "market", templates: [{ url: "https://gamejolt.com/@{id}" }], notFound: ["share your creations"] },
  { id: "lemonsqueezy", name: "Lemon Squeezy", category: "market", templates: [{ url: "https://{id}.lemonsqueezy.com" }] },
  { id: "etsy", name: "Etsy", category: "market", templates: [{ url: "https://www.etsy.com/shop/{id}" }] },
  { id: "moddb", name: "ModDB", category: "market", templates: [{ url: "https://www.moddb.com/mods/{id}" }] },
  { id: "nexusmods", name: "Nexus Mods", category: "market", templates: [{ url: "https://www.nexusmods.com/games/{id}" }] },
  { id: "curseforge", name: "CurseForge", category: "market", templates: [{ url: "https://www.curseforge.com/members/{id}" }] },
  { id: "gamebanana", name: "GameBanana", category: "market", templates: [{ url: "https://gamebanana.com/members/{id}" }], notFound: ["not found"] },
  { id: "blinkit", name: "Blinkit", category: "market", templates: [{ url: "https://blinkit.com/prn/x/prid/{id}" }], numeric: true, notFound: ["products delivered to your doorstep"] },
  { id: "amazon", name: "Amazon", group: "Amazon", category: "market", templates: [
    { label: "com", url: "https://www.amazon.com/x/dp/{id}" },
    { label: "in", url: "https://www.amazon.in/x/dp/{id}" },
  ], len: 10, browser: true, found: ["producttitle"] },
];
