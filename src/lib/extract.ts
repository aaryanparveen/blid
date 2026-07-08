export interface Resolved {
  code: string;
  from?: string;
}

const QUERY_KEYS = ["v", "list", "id", "u", "s"];

export function resolveIdentifier(raw: string): Resolved {
  const t = raw.trim();
  if (!t) return { code: "" };

  const looksUrl =
    /^(https?:\/\/|www\.)/i.test(t) || /^[a-z0-9-]+(\.[a-z0-9-]+)+\/\S/i.test(t);
  if (!looksUrl) return { code: t };

  try {
    const u = new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`);

    if (u.hostname.endsWith(".onion")) {
      return { code: u.hostname.replace(/\.onion$/, ""), from: t };
    }

    for (const k of QUERY_KEYS) {
      const val = u.searchParams.get(k);
      if (val) return { code: val, from: t };
    }

    const segs = u.pathname.split("/").filter(Boolean);
    const hash = u.hash.replace(/^#!?/, "");
    if (hash && !segs.length) return { code: hash, from: t };
    if (segs.length) return { code: segs[segs.length - 1], from: t };

    return { code: t };
  } catch {
    return { code: t };
  }
}
