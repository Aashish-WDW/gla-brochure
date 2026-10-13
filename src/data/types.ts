export type Mode = "individual" | "group";
export type Category = "experience" | "event" | "retreat";
export type PriceUnit = "person" | "group" | "person_night";

export interface Price {
  amount: number;
  unit: PriceUnit;
}

export interface Listing {
  id: string;
  title: string;
  category: Category;
  stateId: string;
  location: string;
  image: string;
  description: string;
  /** Hours for a single session; null for multi-night retreats. */
  durationHours: number | null;
  durationLabel: string;
  /** null = pricing not confirmed -> "Request a quote". */
  price: Price | null;
  inclusions: string[];
  audience: Mode[];
  groupRange?: [number, number];
  /** Events only. */
  dateLabel?: string;
  dateConfirmed?: boolean;
  availability?: "open" | "limited" | "tbc";
}

export interface StateContent {
  id: string;
  tagline: string;
  blurb: string;
  image: string;
  bestSeason: string;
}

export type StopKind = "experience" | "event" | "retreat" | "food" | "stay" | "transfer";

export interface Stop {
  id: string;
  listingId?: string;
  title: string;
  kind: StopKind;
  description: string;
  location: string;
  durationHours: number;
  /** Overnight stays don't consume daytime hours. */
  overnight?: boolean;
  /** Preferred start hour (24h, decimal) */
  startAt?: number;
  price: Price | null;
  day: number;
  image?: string;
}

export interface Itinerary {
  id: string;
  title: string;
  stateId: string;
  destination: string;
  summary: string;
  image: string;
  stops: Stop[];
  /** Extra optional stops a visitor can add that aren't in the catalogue listings. */
  addOns: Omit<Stop, "day">[];
  inclusions: string[];
  exclusions: string[];
  notes: string[];
  suits: Mode[];
}
