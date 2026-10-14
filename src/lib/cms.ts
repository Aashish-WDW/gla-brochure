import { useEffect, useSyncExternalStore } from "react";
import { STATES } from "@/data/content";
import { REGIONS } from "@/data/regions";

/** Frontend-only B2B portal store, persisted to localStorage (demo data). */
export type CurationCategory = "experience" | "event" | "retreat";
export type CurationStatus = "draft" | "published";

export interface Destination {
  id: string;
  name: string;
  stateId: string;
  description: string;
  /** Optional photo, stored as a compressed data URL (demo, browser-only). */
  image?: string;
}

export type StopKind = "experience" | "stay";

/** One stop on a day of a curation's itinerary (an experience or an overnight stay). */
export interface CurationStop {
  id: string;
  kind: StopKind;
  title: string;
  description: string;
  location: string;
  /** "HH:MM" — experiences only. Duration is derived from start/end. */
  start: string;
  end: string;
  /** null = "Request a quote" — never invent prices. */
  pricePerPerson: number | null;
  image?: string | undefined;
}

export interface CurationDay {
  id: string;
  stops: CurationStop[];
}

export interface Curation {
  id: string;
  title: string;
  stateId: string;
  destinationId: string | null;
  category: CurationCategory;
  /** null = "Request a quote" — never invent prices. */
  price: number | null;
  minGroup: number | null;
  description: string;
  /** Day-by-day itinerary. Missing on curations saved before itineraries existed. */
  days?: CurationDay[];
  status: CurationStatus;
  updatedAt: string;
}

export interface CmsState {
  enabledStates: Record<string, boolean>;
  destinations: Destination[];
  curations: Curation[];
}

const KEY = "gla-portal-v1";

export function defaultCms(): CmsState {
  const live = new Set(STATES.map((s) => s.id));
  return {
    enabledStates: Object.fromEntries(REGIONS.map((r) => [r.id, live.has(r.id)])),
    destinations: [
      { id: "d-jaipur", name: "Jaipur", stateId: "rajasthan", description: "The Pink City." },
      { id: "d-alleppey", name: "Alleppey", stateId: "kerala", description: "Backwater country." },
      { id: "d-rishikesh", name: "Rishikesh", stateId: "uttarakhand", description: "Yoga and the Ganga." },
    ],
    curations: [
      {
        id: "c-1",
        title: "Pink City Heritage Long Weekend",
        stateId: "rajasthan",
        destinationId: "d-jaipur",
        category: "experience",
        price: null,
        minGroup: null,
        description: "Sample curation.",
        status: "published",
        updatedAt: new Date(0).toISOString(),
      },
    ],
  };
}

let state: CmsState = defaultCms();
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...defaultCms(), ...(JSON.parse(raw) as CmsState) };
  } catch {
    /* ignore corrupt storage */
  }
  subs.forEach((f) => f());
}

export function setCms(fn: (s: CmsState) => CmsState) {
  state = fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full / blocked */
  }
  subs.forEach((f) => f());
}

export function resetCms() {
  setCms(() => defaultCms());
}

const server = defaultCms();
export function useCms(): CmsState {
  useEffect(load, []);
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => state,
    () => server,
  );
}

export const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;
