"use client";

import { useState } from "react";
import type { Category } from "@/services/types";
import type { ProbeResult } from "@/lib/probe";
import StatusDot from "./StatusDot";
import Icon from "./Icon";

export interface LinkRow {
  label?: string;
  url: string;
}

const STATE_COLOR: Record<string, string> = {
  found: "var(--color-up)",
  notfound: "var(--color-down)",
  other: "var(--color-unknown)",
  error: "var(--color-tx-3)",
  pending: "var(--color-tx-3)",
  uncheck: "var(--color-tx-3)",
};

export default function LinkCard({
  name,
  category,
  rows,
  statuses,
  showStatus,
  index,
}: {
  name: string;
  category: Category;
  rows: LinkRow[];
  statuses: Record<string, ProbeResult>;
  showStatus: boolean;
  index: number;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied((c) => (c === url ? null : c)), 1200);
    } catch {}
  };

  return (
    <div
      onClick={() => {
        const u = rows[0]?.url;
        if (u) window.open(u, "_blank", "noopener,noreferrer");
      }}
      className="group rise relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-line bg-white/[0.015] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-2 hover:bg-white/[0.028] hover:shadow-[0_22px_44px_-26px_rgba(0,0,0,0.85)]"
      style={{ animationDelay: `${Math.min(index * 14, 320)}ms` }}
    >
      <span
        className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
        style={{ background: category.color }}
      />
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-[0.92rem] font-semibold lowercase tracking-tight text-white">{name}</h3>
        <span
          className="font-mono text-[0.55rem] font-medium lowercase tracking-[0.14em]"
          style={{ color: category.color }}
        >
          {category.label}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((r) => {
          const res = statuses[r.url] ?? { state: "pending" as const };
          const codeText =
            res.state === "pending"
              ? ""
              : res.state === "uncheck"
                ? "n/a"
                : res.status
                  ? String(res.status)
                  : res.state === "error"
                    ? "err"
                    : "";
          return (
            <div key={r.url} className="flex items-center gap-2.5">
              {showStatus ? <StatusDot result={res} /> : null}
              {showStatus ? (
                <span
                  className="w-7 flex-none font-mono text-[0.58rem] tabular-nums"
                  style={{ color: STATE_COLOR[res.state] }}
                >
                  {codeText}
                </span>
              ) : null}
              {r.label ? (
                <span className="w-11 flex-none font-mono text-[0.55rem] lowercase tracking-wider text-tx-3">
                  {r.label}
                </span>
              ) : null}
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                title={r.url}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 truncate font-mono text-[0.72rem] text-tx-1 transition-colors hover:text-red-soft"
              >
                {r.url}
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copy(r.url);
                }}
                aria-label="copy"
                className={`flex-none rounded-md p-1 transition-colors ${
                  copied === r.url ? "text-up" : "text-tx-3 hover:bg-white/[0.05] hover:text-red"
                }`}
              >
                <Icon name="copy" className="h-3.5 w-3.5" />
              </button>
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                aria-label="open"
                onClick={(e) => e.stopPropagation()}
                className="flex-none rounded-md p-1 text-tx-3 transition-colors hover:bg-white/[0.05] hover:text-red"
              >
                <Icon name="open" className="h-3.5 w-3.5" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
