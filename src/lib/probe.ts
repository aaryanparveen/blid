export type ProbeState = "pending" | "found" | "notfound" | "other" | "error" | "uncheck";

export interface ProbeResult {
  state: ProbeState;
  status?: number;
}

export async function probe(url: string, id: string): Promise<ProbeResult> {
  try {
    const res = await fetch(`/api/check?url=${encodeURIComponent(url)}&id=${encodeURIComponent(id)}`);
    const data = (await res.json()) as ProbeResult;
    if (!data || !data.state) return { state: "error" };
    return data;
  } catch {
    return { state: "error" };
  }
}

export async function runPool<T>(
  items: T[],
  worker: (item: T) => Promise<void>,
  limit = 10,
): Promise<void> {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const item = items[cursor++];
      await worker(item);
    }
  });
  await Promise.all(runners);
}
