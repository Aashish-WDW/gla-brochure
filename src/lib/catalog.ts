import { ITINERARIES, LISTINGS, STATES } from "@/data/content";
import { REGIONS } from "@/data/regions";
import type { Category, Listing, Mode, Price } from "@/data/types";

export const getRegion = (id: string) => REGIONS.find((r) => r.id === id);
export const getStateContent = (id: string) => STATES.find((s) => s.id === id);
export const getItinerary = (id: string) => ITINERARIES.find((i) => i.id === id);
export const getListing = (id: string) => LISTINGS.find((l) => l.id === id);

export const listingsFor = (stateId: string, category?: Category) =>
  LISTINGS.filter((l) => l.stateId === stateId && (!category || l.category === category));

export const itinerariesFor = (stateId: string) => ITINERARIES.filter((i) => i.stateId === stateId);

export function startingPrice(listings: Listing[]): Price | null {
  const priced = listings.filter((l) => l.price).map((l) => l.price!) ;
  if (!priced.length) return null;
  return priced.reduce((min, p) => (p.amount < min.amount ? p : min));
}

export function stateSummary(stateId: string) {
  const all = listingsFor(stateId);
  return {
    experiences: all.filter((l) => l.category === "experience").length,
    events: all.filter((l) => l.category === "event").length,
    retreats: all.filter((l) => l.category === "retreat").length,
    total: all.length,
    from: startingPrice(all),
    itineraries: itinerariesFor(stateId).length,
  };
}

/** Suitable listings first for the active mode. */
export function sortForMode(list: Listing[], mode: Mode) {
  return [...list].sort(
    (a, b) => Number(b.audience.includes(mode)) - Number(a.audience.includes(mode)),
  );
}

export const CATEGORY_LABEL: Record<Category, string> = {
  experience: "Experiences",
  event: "Events",
  retreat: "Retreats",
};
