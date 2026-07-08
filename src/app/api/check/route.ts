import type { NextRequest } from "next/server";
import net from "node:net";
import type { LookupFunction } from "node:net";
import { Agent, fetch as uFetch } from "undici";
import { Impit } from "impit";
import { SERVICES } from "@/services";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const HEADERS = { "user-agent": UA, accept: "*/*" };

function headersFor(host: string) {
  if (/(^|\.)(google\.com|youtube\.com|youtu\.be)$/i.test(host)) {
    return { ...HEADERS, cookie: "CONSENT=YES+1" };
  }
  return HEADERS;
}

const dnsCache = new Map<string, string | null>();

async function resolveHost(host: string): Promise<string | null> {
  if (net.isIP(host)) return host;
  const cached = dnsCache.get(host);
  if (cached !== undefined) return cached;
  let ip: string | null = null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const r = await fetch(`https://1.1.1.1/dns-query?name=${encodeURIComponent(host)}&type=A`, {
      headers: { accept: "application/dns-json" },
      signal: ctrl.signal,
    });
    clearTimeout(t);
    const j = (await r.json()) as { Answer?: { type: number; data: string }[] };
    const answers = (j.Answer || []).filter((x) => x.type === 1).map((x) => x.data);
    ip = answers[0] ?? null;
  } catch {
    ip = null;
  }
  dnsCache.set(host, ip);
  return ip;
}

const lookup: LookupFunction = (hostname, options, cb) => {
  resolveHost(hostname)
    .then((ip) => {
      if (!ip) return cb(new Error("dns"), "", 4);
      if (options && options.all) cb(null, [{ address: ip, family: 4 }]);
      else cb(null, ip, 4);
    })
    .catch((e) => cb(e as NodeJS.ErrnoException, "", 4));
};

const dispatcher = new Agent({
  connect: { lookup, timeout: 8000 },
  headersTimeout: 9000,
  bodyTimeout: 9000,
});

const impit = new Impit({ browser: "chrome", followRedirects: true });

function baseDomain(host: string): string {
  return host.split(".").slice(-2).join(".");
}

function markerVerdict(finalUrl: string, body: string, markers?: string[], foundMarkers?: string[]): string {
  const hay = (finalUrl + " " + body).toLowerCase();
  if (markers && markers.some((m) => hay.includes(m.toLowerCase()))) return "notfound";
  if (foundMarkers && foundMarkers.length && !foundMarkers.some((m) => hay.includes(m.toLowerCase())))
    return "notfound";
  return "found";
}

async function viaImpit(
  url: string,
  wantBody: boolean,
  markers?: string[],
  foundMarkers?: string[],
): Promise<{ state: string; status: number } | null> {
  try {
    const ir = await Promise.race([
      impit.fetch(url),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 10000)),
    ]);
    const finalUrl = ir.url || url;
    let state = classify(url, { status: ir.status, url: finalUrl, redirected: finalUrl !== url });
    if (state === "found" && wantBody) {
      let body = "";
      try {
        body = (await ir.text()).slice(0, 2_000_000);
      } catch {}
      state = markerVerdict(finalUrl, body, markers, foundMarkers);
    }
    return state === "uncheck" ? null : { state, status: ir.status };
  } catch {
    return null;
  }
}

function classify(reqUrl: string, res: { status: number; url: string; redirected: boolean }): string {
  const status = res.status;
  if (status === 404 || status === 410) return "notfound";
  if (status === 401 || status === 403 || status === 429 || status === 451 || status === 503 || status === 999)
    return "uncheck";
  if (status < 200 || status >= 400) return "other";

  try {
    const req = new URL(reqUrl);
    const fin = new URL(res.url);
    const finPath = fin.pathname.replace(/\/+$/, "");
    const sameSite = baseDomain(fin.hostname) === baseDomain(req.hostname);
    const wentHome =
      finPath === "" ||
      /^\/(404|410|error|not-?found|home|log-?in|sign-?in|sign-?up|explore|broken-links|lost-owly|paste-not-found)(\/|$)/i.test(finPath);
    if (res.redirected && sameSite && wentHome) return "notfound";
  } catch {}

  return "found";
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const id = req.nextUrl.searchParams.get("id") || "";
  if (!url || !/^https?:\/\//i.test(url)) {
    return Response.json({ state: "error" });
  }

  const svc = SERVICES.find((s) => s.id === id);
  const markers = svc?.notFound;
  const foundMarkers = svc?.found;
  const wantBody = !!((markers && markers.length) || (foundMarkers && foundMarkers.length));
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 11000);

  try {
    let host = "";
    try {
      host = new URL(url).hostname;
    } catch {}
    const res = await uFetch(url, {
      method: "GET",
      redirect: "follow",
      headers: headersFor(host),
      dispatcher,
      signal: ctrl.signal,
    });

    let state = classify(url, res);
    let status = res.status;

    if (wantBody && state === "found") {
      let body = "";
      try {
        body = (await res.text()).slice(0, 2_000_000);
      } catch {}
      state = markerVerdict(res.url, body, markers, foundMarkers);
    } else {
      try {
        await res.body?.cancel();
      } catch {}
    }

    if (state === "uncheck" && (status === 401 || status === 403 || status === 429 || status === 503)) {
      const alt = await viaImpit(url, wantBody, markers, foundMarkers);
      if (alt) {
        state = alt.state;
        status = alt.status;
      }
    }

    return Response.json({ state, status });
  } catch {
    return Response.json({ state: "uncheck" });
  } finally {
    clearTimeout(timer);
  }
}
