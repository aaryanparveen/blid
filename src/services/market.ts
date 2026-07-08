import type { Service } from "./types";

export const market: Service[] = [
  { id: "gumroad", name: "Gumroad", category: "market", templates: [{ url: "https://{id}.gumroad.com" }] },
  { id: "kofi", name: "Ko-fi", category: "market", templates: [{ url: "https://ko-fi.com/{id}" }] },
  { id: "buymeacoffee", name: "Buy Me a Coffee", category: "market", templates: [{ url: "https://www.buymeacoffee.com/{id}" }] },
  { id: "patreon", name: "Patreon", category: "market", templates: [{ url: "https://www.patreon.com/{id}" }] },
  { id: "itchio", name: "itch.io", category: "market", templates: [{ url: "https://{id}.itch.io" }] },
  { id: "gamejolt", name: "Game Jolt", category: "market", templates: [{ url: "https://gamejolt.com/@{id}" }], notFound: ["share your creations"] },
  { id: "lemonsqueezy", name: "Lemon Squeezy", category: "market", templates: [{ url: "https://{id}.lemonsqueezy.com" }], verify: false },
  { id: "etsy", name: "Etsy", category: "market", templates: [{ url: "https://www.etsy.com/shop/{id}" }] },
  { id: "moddb", name: "ModDB", category: "market", templates: [{ url: "https://www.moddb.com/mods/{id}" }] },
  { id: "nexusmods", name: "Nexus Mods", category: "market", templates: [{ url: "https://www.nexusmods.com/games/{id}" }] },
  { id: "curseforge", name: "CurseForge", category: "market", templates: [{ url: "https://www.curseforge.com/members/{id}" }] },
  { id: "gamebanana", name: "GameBanana", category: "market", templates: [{ url: "https://gamebanana.com/members/{id}" }], verify: false },
];
