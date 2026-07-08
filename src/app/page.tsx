"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SERVICES, TOTAL_LINKS, CATEGORIES, CATEGORY_MAP, POPULARITY } from "@/services";
import type { CategoryId, Service, Category } from "@/services/types";
import type { ProbeResult } from "@/lib/probe";
import { probe, runPool } from "@/lib/probe";
import { resolveIdentifier } from "@/lib/extract";
import { readHistory, pushHistory, clearHistory } from "@/lib/history";
import LinkCard, { type LinkRow } from "@/components/LinkCard";
import Icon from "@/components/Icon";

interface Candidate {
  service: Service;
  category: Category;
  rows: LinkRow[];
}

const fill = (tpl: string, code: string) => tpl.split("{id}").join(code);

const POP_RANK = new Map(POPULARITY.map((id, i) => [id, i]));
const popRank = (id: string) => POP_RANK.get(id) ?? Infinity;

function lenOk(s: Service, code: string) {
  if (s.numeric && /[a-z]/i.test(code)) return false;
  const len = s.len;
  if (len == null) return true;
  const L = code.length;
  return Array.isArray(len) ? L >= len[0] && L <= len[1] : L === len;
}

export default function Page() {
  const [raw, setRaw] = useState("");
  const [autoTest, setAutoTest] = useState(true);
  const [extract, setExtract] = useState(true);
  const [onlyFound, setOnlyFound] = useState(true);
  const [onlyNa, setOnlyNa] = useState(false);
  const [disabled, setDisabled] = useState<Set<CategoryId>>(new Set());
  const [statuses, setStatuses] = useState<Record<string, ProbeResult>>({});
  const [history, setHistory] = useState<string[]>([]);
  const [histOpen, setHistOpen] = useState(false);
  const [manual, setManual] = useState(false);
  const runId = useRef(0);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  const resolved = useMemo(
    () => (extract ? resolveIdentifier(raw) : { code: raw.trim(), from: undefined as string | undefined }),
    [raw, extract],
  );
  const code = resolved.code;

  const built = useMemo(() => {
    const empty = {
      list: [] as Candidate[],
      skipped: 0,
      targets: [] as { probe: string; urls: string[]; id: string }[],
      uncheckUrls: [] as string[],
      deadUrls: [] as string[],
    };
    if (!code) return empty;
    const list: Candidate[] = [];
    let skipped = 0;
    for (const s of SERVICES) {
      if (disabled.has(s.category)) continue;
      if (!lenOk(s, code)) {
        skipped += s.templates.length;
        continue;
      }
      list.push({
        service: s,
        category: CATEGORY_MAP[s.category],
        rows: s.templates.map((t) => ({ label: t.label, url: fill(t.url, code) })),
      });
    }
    list.sort((a, b) => popRank(a.service.id) - popRank(b.service.id));
    const targets: { probe: string; urls: string[]; id: string }[] = [];
    const uncheckUrls: string[] = [];
    const deadUrls: string[] = [];
    for (const c of list) {
      const rowUrls = c.rows.map((r) => r.url);
      if (c.service.dead) deadUrls.push(...rowUrls);
      else if (c.service.verify === false) uncheckUrls.push(...rowUrls);
      else if (c.service.check) targets.push({ probe: fill(c.service.check, code), urls: rowUrls, id: c.service.id });
      else for (const u of rowUrls) targets.push({ probe: u, urls: [u], id: c.service.id });
    }
    return { list, skipped, targets, uncheckUrls, deadUrls };
  }, [code, disabled]);
  const candidates = built.list;
  const skipped = built.skipped;
  const targets = built.targets;
  const uncheckUrls = built.uncheckUrls;
  const deadUrls = built.deadUrls;
  const allUrls = useMemo(
    () => [...targets.flatMap((t) => t.urls), ...uncheckUrls, ...deadUrls],
    [targets, uncheckUrls, deadUrls],
  );
  const seedBase = useMemo(() => {
    const b: Record<string, ProbeResult> = {};
    for (const u of uncheckUrls) b[u] = { state: "uncheck" };
    for (const u of deadUrls) b[u] = { state: "notfound" };
    return b;
  }, [uncheckUrls, deadUrls]);

  const runProbes = useCallback(
    (items: { probe: string; urls: string[]; id: string }[], base: Record<string, ProbeResult> = {}) => {
      const rid = ++runId.current;
      const pending: Record<string, ProbeResult> = { ...base };
      for (const t of items) for (const u of t.urls) pending[u] = { state: "pending" };
      setStatuses(pending);
      runPool(
        items,
        async (t) => {
          const res = await probe(t.probe, t.id);
          if (runId.current !== rid) return;
          setStatuses((prev) => {
            const next = { ...prev };
            for (const u of t.urls) next[u] = res;
            return next;
          });
        },
        24,
      );
    },
    [],
  );

  useEffect(() => {
    setManual(false);
  }, [code]);

  useEffect(() => {
    if (!code) {
      runId.current++;
      setStatuses({});
      return;
    }
    const t = setTimeout(() => {
      if (code.length >= 3) setHistory(pushHistory(code));
      if (autoTest) runProbes(targets, seedBase);
      else {
        runId.current++;
        setStatuses(seedBase);
      }
    }, 450);
    return () => clearTimeout(t);
  }, [code, autoTest, targets, seedBase, runProbes]);

  const showStatus = autoTest || manual;

  const counts = useMemo(() => {
    let found = 0;
    let notfound = 0;
    let other = 0;
    let uncheck = 0;
    let pending = 0;
    for (const u of allUrls) {
      const s = statuses[u]?.state;
      if (s === "found") found++;
      else if (s === "notfound") notfound++;
      else if (s === "other" || s === "error") other++;
      else if (s === "uncheck") uncheck++;
      else pending++;
    }
    return { found, notfound, other, uncheck, pending };
  }, [allUrls, statuses]);

  const shown = useMemo<Candidate[]>(() => {
    const base =
      !onlyFound && !onlyNa
        ? candidates
        : candidates
            .map((c) => ({
              ...c,
              rows: c.rows.filter((r) => {
                const st = statuses[r.url]?.state;
                return (onlyFound && st === "found") || (onlyNa && st === "uncheck");
              }),
            }))
            .filter((c) => c.rows.length > 0);
    if (!showStatus) return base;
    const bucket = (st?: string) =>
      st === "found" ? 0 : st === "uncheck" ? 1 : st === "other" || st === "error" ? 2 : st === "notfound" ? 3 : 4;
    const rank = (rows: LinkRow[]) => {
      let best = 4;
      for (const r of rows) {
        const b = bucket(statuses[r.url]?.state);
        if (b < best) best = b;
      }
      return best;
    };
    return [...base].sort((a, b) => rank(a.rows) - rank(b.rows));
  }, [candidates, onlyFound, onlyNa, statuses, showStatus]);

  const toggleCategory = (id: CategoryId) =>
    setDisabled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const copyAll = async () => {
    const urls = shown.flatMap((c) => c.rows.map((r) => r.url));
    if (!urls.length) return;
    try {
      await navigator.clipboard.writeText(urls.join("\n"));
    } catch {}
  };

  const applyHistory = (h: string) => {
    setRaw(h);
    setHistOpen(false);
  };

  return (
    <>
      <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
        {code && showStatus ? (
          <span className="border border-line bg-bg-1/80 px-2.5 py-1.5 font-mono text-[0.66rem] backdrop-blur-md">
            <span className="text-up">{counts.found}</span>
            <span className="text-tx-3">/{TOTAL_LINKS}</span>
          </span>
        ) : null}
        <button
          onClick={() => setHistOpen((v) => !v)}
          aria-label="history"
          className={`border p-2 backdrop-blur-md transition-colors ${
            histOpen ? "border-red/50 text-red" : "border-line bg-bg-1/80 text-tx-2 hover:text-red"
          }`}
        >
          <Icon name="clock" className="h-3.5 w-3.5" />
        </button>
      </div>

      {histOpen ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setHistOpen(false)} />
          <div className="fixed right-4 top-[3.4rem] z-50 w-60 border border-line bg-bg-1/95 p-1.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="font-mono text-[0.58rem] lowercase tracking-wider text-tx-3">history</span>
              {history.length ? (
                <button
                  onClick={() => setHistory(clearHistory())}
                  aria-label="clear history"
                  className="p-0.5 text-tx-3 transition-colors hover:text-red"
                >
                  <Icon name="trash" className="h-3 w-3" />
                </button>
              ) : null}
            </div>
            {history.length ? (
              <div className="flex max-h-64 flex-col overflow-y-auto">
                {history.map((h) => (
                  <button
                    key={h}
                    onClick={() => applyHistory(h)}
                    title={h}
                    className="truncate px-2 py-1.5 text-left font-mono text-[0.7rem] text-tx-1 transition-colors hover:bg-white/[0.04] hover:text-red"
                  >
                    {h}
                  </button>
                ))}
              </div>
            ) : (
              <p className="px-2 py-3 text-center font-mono text-[0.62rem] text-tx-3">nothing yet</p>
            )}
          </div>
        </>
      ) : null}

      <div className="flex min-h-screen flex-col">
      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-5 pb-16">
        <header className="animate-[fadeUp_0.7s_ease-out_both] pt-16 pb-10 text-center">
          <h1 className="text-6xl font-extrabold -tracking-[0.04em] text-white sm:text-7xl">
            bl
            <span className="text-red" style={{ textShadow: "0 0 45px rgba(196,48,80,0.45)" }}>
              id.
            </span>
          </h1>
          <p className="mt-5 font-mono text-[0.78rem] lowercase tracking-[0.32em] text-tx-2">
            backlink identifier
          </p>
        </header>

        <section className="animate-[fadeUp_0.7s_ease-out_0.08s_both]">
          <div className="flex items-center border border-line bg-white/[0.02] shadow-[0_30px_80px_-45px_rgba(0,0,0,0.95)] transition-colors focus-within:border-red/40">
            <Icon name="search" className="ml-4 h-4 w-4 flex-none text-tx-3" />
            <input
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && code) {
                  if (code.length >= 3) setHistory(pushHistory(code));
                  setManual(true);
                  runProbes(targets, seedBase);
                }
              }}
              autoFocus
              spellCheck={false}
              placeholder="paste a backlink or code"
              className="min-w-0 flex-1 bg-transparent px-3 py-4 font-mono text-sm text-tx-0 outline-none placeholder:text-tx-3"
            />
            {raw ? (
              <button
                onClick={() => setRaw("")}
                aria-label="clear"
                className="mr-3 flex-none p-1 text-tx-3 transition-colors hover:text-red"
              >
                <Icon name="times" className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          {resolved.from ? (
            <div className="mt-2 flex items-center gap-2 px-1 font-mono text-[0.62rem] text-tx-3">
              <Icon name="link" className="h-3 w-3 text-tx-3" />
              <span>
                code <span className="text-red-soft">{code}</span>
              </span>
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Toggle on={autoTest} onClick={() => setAutoTest((v) => !v)} label="Auto-test" icon="bolt" />
            <Toggle on={extract} onClick={() => setExtract((v) => !v)} label="Extract code" icon="link" />
            <Toggle on={onlyFound} onClick={() => setOnlyFound((v) => !v)} label="Only found" icon="filter" />
            <Toggle on={onlyNa} onClick={() => setOnlyNa((v) => !v)} label="Only n/a" icon="info" />
            {!autoTest && code ? (
              <IconButton onClick={() => { setManual(true); runProbes(targets, seedBase); }} label="Test all" icon="refresh" />
            ) : null}
            {code ? <IconButton onClick={copyAll} label="Copy all" icon="copy" /> : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const off = disabled.has(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[0.6rem] lowercase tracking-wider transition-colors ${
                    off ? "border-line text-tx-3 line-through" : "border-line-2 text-tx-1 hover:text-tx-0"
                  }`}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: off ? "var(--color-tx-3)" : cat.color }}
                  />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </section>

        {code ? (
          <section className="mt-14 animate-[fadeUp_0.5s_ease-out_both]">
            {showStatus || skipped || counts.uncheck ? (
              <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-line pb-2">
                {showStatus ? (
                  <>
                    <Stat color="var(--color-up)" label="found" n={counts.found} />
                    <Stat color="var(--color-down)" label="404" n={counts.notfound} />
                    {counts.other ? <Stat color="var(--color-unknown)" label="other" n={counts.other} /> : null}
                    {counts.pending ? <Stat color="var(--color-tx-3)" label="checking" n={counts.pending} /> : null}
                  </>
                ) : null}
                {counts.uncheck ? <StatHollow label="n/a" n={counts.uncheck} /> : null}
                {skipped ? <Stat color="var(--color-tx-3)" label="len-skip" n={skipped} /> : null}
              </div>
            ) : null}

            {shown.length ? (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((c, i) => (
                  <LinkCard
                    key={c.service.id}
                    index={i}
                    service={c.service}
                    category={c.category}
                    rows={c.rows}
                    statuses={statuses}
                    showStatus={showStatus}
                  />
                ))}
              </div>
            ) : (
              <p className="py-10 text-center font-mono text-xs text-tx-3">
                {onlyFound ? (counts.pending ? "checking…" : "no 200s") : "all categories disabled"}
              </p>
            )}
          </section>
        ) : null}
      </main>
      <footer className="relative z-10 border-t border-line px-5 py-3">
        <p className="flex items-center justify-center gap-2 font-mono text-[0.62rem] tracking-wide text-tx-3">
          <span>{TOTAL_LINKS} sites</span>
          <span>| n/a means you have to check manually because the site doesn't return clean identifiers</span>
        </p>
      </footer>
      </div>
    </>
  );
}

function Toggle({
  on,
  onClick,
  label,
  icon,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 border px-3 py-1.5 font-mono text-[0.62rem] lowercase tracking-wider transition-colors ${
        on ? "border-red/50 text-tx-0" : "border-line text-tx-3"
      }`}
    >
      <Icon name={icon} className={`h-3.5 w-3.5 ${on ? "text-red" : "text-tx-3"}`} />
      {label}
    </button>
  );
}

function IconButton({ onClick, label, icon }: { onClick: () => void; label: string; icon: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 border border-line px-3 py-1.5 font-mono text-[0.62rem] lowercase tracking-wider text-tx-2 transition-colors hover:border-red hover:text-red"
    >
      <Icon name={icon} className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function Stat({ color, label, n }: { color: string; label: string; n: number }) {
  return (
    <span className="flex items-center gap-1.5 font-mono text-[0.62rem] lowercase tracking-wider">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      <span className="text-tx-1">{n}</span>
      <span className="text-tx-3">{label}</span>
    </span>
  );
}

function StatHollow({ label, n }: { label: string; n: number }) {
  return (
    <span className="flex items-center gap-1.5 font-mono text-[0.62rem] lowercase tracking-wider">
      <span className="h-1.5 w-1.5 rounded-full border border-tx-2" />
      <span className="text-tx-1">{n}</span>
      <span className="text-tx-3">{label}</span>
    </span>
  );
}
