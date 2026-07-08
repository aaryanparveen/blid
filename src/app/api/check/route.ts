import type { NextRequest } from "next/server";
import { SERVICES } from "@/services";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const HEADERS: Record<string, string> = { "user-agent": UA, accept: "*/*" };

function headersFor(host: string): Record<string, string> {
  if (/(^|\.)(google\.com|youtube\.com|youtu\.be)$/i.test(host)) {
    return { ...HEADERS, cookie: "CONSENT=YES+1" };
  }
  return HEADERS;
}

function baseDomain(host: string): string {
  return host.split(".").slice(-2).join(".");
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

function markerVerdict(finalUrl: string, body: string, markers?: string[], foundMarkers?: string[]): string {
  const hay = (finalUrl + " " + body).toLowerCase();
  if (markers && markers.some((m) => hay.includes(m.toLowerCase()))) return "notfound";
  if (foundMarkers && foundMarkers.length && !foundMarkers.some((m) => hay.includes(m.toLowerCase())))
    return "notfound";
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
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: headersFor(host),
      signal: ctrl.signal,
    });

    let state = classify(url, res);
    const status = res.status;

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

    return Response.json({ state, status });
  } catch {
    return Response.json({ state: "uncheck" });
  } finally {
    clearTimeout(timer);
  }
}
