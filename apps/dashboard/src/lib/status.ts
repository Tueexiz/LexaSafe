export type StatusTone = "ok" | "warn" | "danger" | "muted";

export function statusTone(status: string): StatusTone {
  const value = status.toLowerCase();
  if (/(refus|reject|error|fail|inval|expire)/.test(value)) return "danger";
  if (/(urgent|pending|attente|draft|queue|ouvert)/.test(value)) return "warn";
  if (/(seal|scell|complete|done|valid|active|livr|ok)/.test(value)) return "ok";
  return "muted";
}

export function formatHash(hash: string) {
  if (hash.length <= 20) return hash;
  return `${hash.slice(0, 12)}…${hash.slice(-6)}`;
}

export function formatDeadline(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
