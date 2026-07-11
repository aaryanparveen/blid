export type CategoryId =
  | "shorteners"
  | "pastes"
  | "images"
  | "audio"
  | "video"
  | "files"
  | "social"
  | "music"
  | "code"
  | "market"
  | "other";

export interface Category {
  id: CategoryId;
  label: string;
  color: string;
}

export interface LinkTemplate {
  label?: string;
  url: string;
}

export interface Service {
  id: string;
  name: string;
  category: CategoryId;
  group?: string;
  templates: LinkTemplate[];
  len?: number | [number, number];
  numeric?: boolean;
  alpha?: boolean;
  notFound?: string[];
  found?: string[];
  verify?: boolean;
  dead?: boolean;
  browser?: boolean;
  check?: string;
  checkBody?: string;
}
