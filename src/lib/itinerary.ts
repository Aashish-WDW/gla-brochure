import type { Listing, Mode, Price, Stop } from "@/data/types";

export const DEFAULT_DAY_START = 9;
export const TRANSFER_BUFFER = 0.5;

export function peopleCount(mode: Mode, travellers: number, groupSize: number): number {
  return mode === "group" ? groupSize : travellers;
}

/** Cost of a stop for N people, or null when the price is not confirmed. */
export function stopCost(price: Price | null, people: number): number | null {
  if (!price) return null;
  return price.unit === "group" ? price.amount : price.amount * people;
}

export interface ScheduledStop extends Stop {
  start: number | null;
  end: number | null;
}

/** Assigns a running clock within each day. Overnight stays have no clock time. */
export function schedule(stops: Stop[]): ScheduledStop[] {
  const cursors = new Map<number, number>();
  return stops.map((s) => {
    if (s.overnight) return { ...s, start: null, end: null };
    const cursor = cursors.get(s.day);
    const start = Math.max(cursor ?? s.startAt ?? DEFAULT_DAY_START, s.startAt ?? 0);
    const end = start + s.durationHours;
    cursors.set(s.day, end + TRANSFER_BUFFER);
    return { ...s, start, end };
  });
}

export interface Summary {
  days: number;
  activityHours: number;
  knownTotal: number;
  unconfirmed: number;
  perPerson: number;
  people: number;
}

export function summarise(stops: Stop[], people: number): Summary {
  const days = stops.reduce((m, s) => Math.max(m, s.day), 0);
  let activityHours = 0;
  let knownTotal = 0;
  let unconfirmed = 0;
  for (const s of stops) {
    if (!s.overnight) activityHours += s.durationHours;
    const c = stopCost(s.price, people);
    if (c === null) unconfirmed += 1;
    else knownTotal += c;
  }
  return {
    days,
    activityHours,
    knownTotal,
    unconfirmed,
    perPerson: people > 0 ? knownTotal / people : 0,
    people,
  };
}

/** Keep days contiguous (1..n) and stops ordered by day. */
export function normalise(stops: Stop[]): Stop[] {
  const sorted = stops
    .map((s, i) => ({ s, i }))
    .sort((a, b) => a.s.day - b.s.day || a.i - b.i)
    .map((x) => x.s);
  const days = [...new Set(sorted.map((s) => s.day))];
  return sorted.map((s) => ({ ...s, day: days.indexOf(s.day) + 1 }));
}

export function moveStop(stops: Stop[], id: string, dir: "up" | "down"): Stop[] {
  const i = stops.findIndex((s) => s.id === id);
  if (i < 0) return stops;
  const next = stops.map((s) => ({ ...s }));
  if (dir === "up") {
    if (i === 0) return stops;
    const prev = next[i - 1]!;
    const cur = next[i]!;
    if (prev.day !== cur.day) cur.day = prev.day;
    else {
      next[i - 1] = cur;
      next[i] = prev;
    }
  } else {
    if (i === next.length - 1) return stops;
    const after = next[i + 1]!;
    const cur = next[i]!;
    if (after.day !== cur.day) cur.day = after.day;
    else {
      next[i + 1] = cur;
      next[i] = after;
    }
  }
  return normalise(next);
}

export function removeStop(stops: Stop[], id: string): Stop[] {
  return normalise(stops.filter((s) => s.id !== id));
}

export function addStop(stops: Stop[], stop: Omit<Stop, "day">, day?: number): Stop[] {
  if (stops.some((s) => s.id === stop.id)) return stops;
  const last = stops.reduce((m, s) => Math.max(m, s.day), 1);
  return normalise([...stops, { ...stop, day: day ?? last }]);
}

export function listingToStop(l: Listing): Omit<Stop, "day"> {
  return {
    id: l.id,
    listingId: l.id,
    title: l.title,
    kind: l.category === "retreat" ? "retreat" : l.category,
    description: l.description,
    location: l.location,
    durationHours: l.durationHours ?? 0,
    price: l.price,
    image: l.image,
  };
}

const signature = (stops: Stop[]) => stops.map((s) => `${s.id}@${s.day}`).join("|");

export function isCustomised(original: Stop[], current: Stop[]): boolean {
  return signature(normalise(original)) !== signature(current);
}

/** Plain-language list of what the visitor changed — used in the WhatsApp enquiry. */
export function describeChanges(original: Stop[], current: Stop[]): string[] {
  const origIds = new Set(original.map((s) => s.id));
  const curIds = new Set(current.map((s) => s.id));
  const out: string[] = [];
  const added = current.filter((s) => !origIds.has(s.id));
  const removed = original.filter((s) => !curIds.has(s.id));
  if (added.length) out.push(`add ${added.map((s) => s.title).join(", ")}`);
  if (removed.length) out.push(`remove ${removed.map((s) => s.title).join(", ")}`);

  const keptOrig = normalise(original).filter((s) => curIds.has(s.id));
  const keptCur = current.filter((s) => origIds.has(s.id));
  const orderChanged = keptOrig.map((s) => s.id).join() !== keptCur.map((s) => s.id).join();
  const dayChanged = keptCur.some((s) => {
    const o = keptOrig.find((x) => x.id === s.id);
    return o && o.day !== s.day;
  });
  if (orderChanged || dayChanged) out.push("reorder stops");
  return out;
}
