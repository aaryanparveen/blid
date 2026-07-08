import type { Category, CategoryId } from "./types";

export const CATEGORIES: Category[] = [
  { id: "shorteners", label: "Shorteners", color: "#3070c4" },
  { id: "pastes", label: "Pastes", color: "#c43050" },
  { id: "images", label: "Images", color: "#a848c4" },
  { id: "audio", label: "Audio", color: "#48b098" },
  { id: "video", label: "Video", color: "#c44828" },
  { id: "files", label: "Files", color: "#1ca868" },
  { id: "social", label: "Social", color: "#c43088" },
  { id: "music", label: "Music", color: "#c48828" },
  { id: "code", label: "Code", color: "#3090c4" },
  { id: "market", label: "Market", color: "#a0a848" },
  { id: "other", label: "Other", color: "#6b6b80" },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;
