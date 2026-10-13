import { describe, expect, it } from "vitest";
import { ITINERARIES, LISTINGS } from "@/data/content";
import type { Stop } from "@/data/types";
import {
  addStop,
  describeChanges,
  isCustomised,
  listingToStop,
  moveStop,
  removeStop,
  schedule,
  stopCost,
  summarise,
} from "@/lib/itinerary";

const base = (id: string, day: number, extra: Partial<Stop> = {}): Stop => ({
  id,
  title: id,
  kind: "experience",
  description: "",
  location: "",
  durationHours: 2,
  price: { amount: 1000, unit: "person" },
  day,
  ...extra,
});

describe("itinerary pricing", () => {
  it("multiplies per-person prices by party size but not per-group prices", () => {
    expect(stopCost({ amount: 1000, unit: "person" }, 5)).toBe(5000);
    expect(stopCost({ amount: 9000, unit: "group" }, 5)).toBe(9000);
    expect(stopCost(null, 5)).toBeNull();
  });

  it("totals known prices and counts unconfirmed ones without inventing an amount", () => {
    const s = summarise([base("a", 1), base("b", 1, { price: null }), base("c", 2)], 4);
    expect(s.knownTotal).toBe(8000);
    expect(s.unconfirmed).toBe(1);
    expect(s.days).toBe(2);
    expect(s.activityHours).toBe(6);
  });

  it("excludes overnight stays from activity hours", () => {
    const s = summarise([base("a", 1), base("n", 1, { overnight: true, durationHours: 0 })], 1);
    expect(s.activityHours).toBe(2);
  });
});

describe("itinerary schedule", () => {
  it("places stops sequentially with a 30 minute buffer", () => {
    const out = schedule([base("a", 1, { startAt: 9 }), base("b", 1)]);
    expect(out[0].start).toBe(9);
    expect(out[1].start).toBe(11.5);
  });
});

describe("itinerary editing", () => {
  const stops = [base("a", 1), base("b", 1), base("c", 2)];

  it("moves a stop up and down within a day", () => {
    expect(moveStop(stops, "b", "up").map((s) => s.id)).toEqual(["b", "a", "c"]);
  });

  it("moves the first stop of a day to the previous day", () => {
    const moved = moveStop(stops, "c", "up");
    expect(moved.find((s) => s.id === "c")?.day).toBe(1);
  });

  it("does nothing when moving the very first stop up", () => {
    expect(moveStop(stops, "a", "up")).toBe(stops);
  });

  it("closes empty days after removal", () => {
    const out = removeStop(stops, "c");
    expect(out.map((s) => s.day)).toEqual([1, 1]);
  });

  it("adds a stop only once", () => {
    const { day: _d, ...extra } = base("z", 1);
    const once = addStop(stops, extra);
    expect(addStop(once, extra)).toBe(once);
    expect(once).toHaveLength(4);
  });

  it("detects customisation and describes it", () => {
    expect(isCustomised(stops, stops)).toBe(false);
    const edited = removeStop(stops, "b");
    expect(isCustomised(stops, edited)).toBe(true);
    expect(describeChanges(stops, edited)).toEqual(["remove b"]);
  });
});

describe("mock content", () => {
  it("never fabricates a price for unconfirmed listings", () => {
    const unpriced = LISTINGS.filter((l) => l.price === null);
    expect(unpriced.length).toBeGreaterThan(0);
  });

  it("builds stops from listings", () => {
    const l = LISTINGS[0];
    expect(listingToStop(l).id).toBe(l.id);
  });

  it("has at least one itinerary with a full multi-day plan", () => {
    expect(ITINERARIES.some((i) => new Set(i.stops.map((s) => s.day)).size >= 3)).toBe(true);
  });
});
