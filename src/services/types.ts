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
  templates: LinkTemplate[];
  len?: number | [number, number];
  notFound?: string[];
  found?: string[];
  verify?: boolean;
  dead?: boolean;
  check?: string;
}
