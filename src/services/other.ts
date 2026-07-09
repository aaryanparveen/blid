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
];
