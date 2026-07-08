const KEY = "blid.history";
const MAX = 12;

export function readHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function pushHistory(code: string): string[] {
  const c = code.trim();
  if (!c) return readHistory();
  const next = [c, ...readHistory().filter((x) => x !== c)].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  return next;
}

export function clearHistory(): string[] {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  return [];
}
