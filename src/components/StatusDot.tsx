import type { ProbeResult } from "@/lib/probe";
import Icon from "./Icon";

const COLOR: Record<string, string> = {
  found: "var(--color-up)",
  notfound: "var(--color-down)",
  other: "var(--color-unknown)",
  error: "var(--color-tx-3)",
};

const TITLE: Record<string, string> = {
  pending: "checking",
  found: "reachable",
  notfound: "not found",
  other: "responded",
  error: "no response",
  uncheck: "can't verify from server",
};

export default function StatusDot({ result }: { result: ProbeResult }) {
  if (result.state === "pending") {
    return <Icon name="spinner" className="h-3 w-3 flex-none animate-spin text-tx-3" />;
  }
  if (result.state === "uncheck") {
    return (
      <span
        title={TITLE.uncheck}
        className="inline-flex h-2 w-2 flex-none rounded-full border border-tx-2"
      />
    );
  }
  return (
    <span
      title={TITLE[result.state]}
      className="inline-flex h-2 w-2 flex-none rounded-full"
      style={{ background: COLOR[result.state] }}
    />
  );
}
