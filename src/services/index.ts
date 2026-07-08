import type { Service } from "./types";
import { shorteners } from "./shorteners";
import { pastes } from "./pastes";
import { images } from "./images";
import { audio } from "./audio";
import { video } from "./video";
import { files } from "./files";
import { social } from "./social";
import { music } from "./music";
import { code } from "./code";
import { market } from "./market";
import { other } from "./other";

export const SERVICES: Service[] = [
  ...shorteners,
  ...pastes,
  ...images,
  ...audio,
  ...video,
  ...files,
  ...social,
  ...music,
  ...code,
  ...market,
  ...other,
];

export const TOTAL_LINKS = SERVICES.reduce((n, s) => n + s.templates.length, 0);

export { POPULARITY } from "./popularity";
export { CATEGORIES, CATEGORY_MAP } from "./categories";
export type { Service, Category, CategoryId, LinkTemplate } from "./types";
