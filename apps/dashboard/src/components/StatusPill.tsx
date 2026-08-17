import { statusTone } from "@/lib/status";

const TONE_CLASS: Record<ReturnType<typeof statusTone>, string> = {
  ok: "border-blue-border bg-bg-blue-tint text-blue-primary",
  warn: "border-amber-border bg-amber-bg text-crimson-threat",
  danger: "border-crimson-border bg-crimson-bg text-crimson-threat",
  muted: "border-border-subtle bg-white/80 text-text-secondary",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-pill border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${TONE_CLASS[statusTone(status)]}`}
    >
      {status}
    </span>
  );
}
