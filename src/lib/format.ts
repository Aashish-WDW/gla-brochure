import type { Price, PriceUnit } from "@/data/types";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatINR = (n: number) => inr.format(Math.round(n));

export const UNIT_LABEL: Record<PriceUnit, string> = {
  person: "per person",
  group: "per group",
  person_night: "per person / night",
};

export function formatPrice(price: Price | null, prefix = "Starting from"): string {
  if (!price) return "Request a quote";
  return `${prefix ? prefix + " " : ""}${formatINR(price.amount)}`;
}

export function formatHours(h: number): string {
  if (h <= 0) return "—";
  const whole = Math.floor(h);
  const mins = Math.round((h - whole) * 60);
  if (!mins) return `${whole} hr${whole === 1 ? "" : "s"}`;
  return whole ? `${whole} hr ${mins} min` : `${mins} min`;
}

export function formatClock(h: number): string {
  const total = Math.round(h * 60);
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
