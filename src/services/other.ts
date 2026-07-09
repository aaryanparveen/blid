import type { Service } from "./types";

export const other: Service[] = [
  { id: "onion", name: ".onion", category: "other", templates: [{ url: "http://{id}.onion" }] },
  { id: "notion", name: "Notion", category: "other", templates: [{ url: "https://notion.so/{id}" }] },
  { id: "isbn", name: "ISBN", category: "other", templates: [{ url: "https://isbnsearch.org/isbn/{id}" }] },
  { id: "doi", name: "DOI", category: "other", templates: [{ url: "https://doi.org/{id}" }] },
  { id: "keybase", name: "Keybase", category: "other", templates: [{ url: "https://keybase.io/{id}" }] },
  { id: "issuu", name: "Issuu", category: "other", templates: [{ url: "https://issuu.com/{id}" }] },
  { id: "researchgate", name: "ResearchGate", category: "other", templates: [{ url: "https://www.researchgate.net/profile/{id}" }] },
  { id: "orcid", name: "ORCID", category: "other", templates: [{ url: "https://orcid.org/{id}" }] },
  { id: "zenodo", name: "Zenodo", category: "other", templates: [{ url: "https://zenodo.org/records/{id}" }] },
  { id: "archiveorg", name: "Internet Archive", category: "other", templates: [{ url: "https://archive.org/details/{id}" }] },
  { id: "pluck", name: "Pluck", category: "other", templates: [{ url: "https://www.pluck.so/{id}" }] },
  { id: "monkeytype", name: "Monkeytype", category: "other", templates: [{ url: "https://monkeytype.com/profile/{id}" }], verify: false },
  { id: "chatgptshare", name: "ChatGPT Share", category: "other", templates: [{ url: "https://chatgpt.com/share/{id}" }], verify: false },
  { id: "osuforum", name: "osu! Forum", category: "other", templates: [{ url: "https://osu.ppy.sh/community/forums/topics/{id}" }], numeric: true },
  { id: "niconicoblog", name: "Niconico Blog", category: "other", templates: [{ url: "https://blog.nicovideo.jp/niconews/{id}" }], numeric: true },
  { id: "epicgames", name: "Epic Games", category: "other", templates: [{ url: "https://store.epicgames.com/en-US/p/{id}" }], verify: false },
  { id: "battlenet", name: "Battle.net", category: "other", templates: [{ url: "https://battle.net/{id}" }] },
  { id: "coregames", name: "Core Games", category: "other", templates: [{ url: "https://www.coregames.com/games/{id}" }], dead: true },
  { id: "ngrok", name: "ngrok", category: "other", templates: [{ url: "https://{id}.ngrok-free.dev" }] },
  { id: "trycloudflare", name: "Cloudflare Tunnel", category: "other", templates: [{ url: "https://{id}.trycloudflare.com" }] },
];
