import type { Service } from "./types";

export const pastes: Service[] = [
  { id: "pastebin", name: "Pastebin", category: "pastes", templates: [{ url: "https://pastebin.com/{id}" }], len: 8 },
  { id: "hastebin", name: "Hastebin", category: "pastes", templates: [{ url: "https://hastebin.com/{id}" }] },
  { id: "ghostbin", name: "Ghostbin", category: "pastes", templates: [{ url: "https://ghostbin.com/{id}" }] },
  { id: "rentry", name: "Rentry", category: "pastes", templates: [{ url: "https://rentry.co/{id}" }] },
  { id: "dpaste", name: "dpaste", category: "pastes", templates: [{ url: "https://dpaste.org/{id}" }], dead: true },
  { id: "pasteee", name: "Pastee", category: "pastes", templates: [{ url: "https://pastee.dev/p/{id}" }], notFound: ["<textarea"] },
  { id: "controlc", name: "ControlC", category: "pastes", templates: [{ url: "https://controlc.com/{id}" }] },
  { id: "justpaste", name: "JustPaste.it", category: "pastes", templates: [{ url: "https://justpaste.it/{id}" }] },
  { id: "pastelink", name: "Pastelink", category: "pastes", templates: [{ url: "https://pastelink.net/{id}" }] },
  { id: "zerobin", name: "0bin", category: "pastes", templates: [{ url: "https://0bin.net/paste/{id}" }], notFound: ["paste-not-found", "paste not found"] },
  { id: "privatebin", name: "PrivateBin", category: "pastes", templates: [{ url: "https://privatebin.net/?{id}" }], verify: false },
  { id: "writeas", name: "Write.as", category: "pastes", templates: [{ url: "https://write.as/{id}" }] },
  { id: "cryptobin", name: "Cryptobin", category: "pastes", templates: [{ url: "https://cryptobin.co/{id}" }] },
  { id: "ctxt", name: "ctxt.io", category: "pastes", templates: [{ url: "https://ctxt.io/2/{id}" }], notFound: ["paste expired or not found"] },
];
