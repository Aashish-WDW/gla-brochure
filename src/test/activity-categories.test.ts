import { describe, expect, it } from "vitest";
import { ACTIVITY_CATEGORIES } from "@/data/activity-categories";
import { LISTINGS } from "@/data/content";

/** Mirrors the CATEGORIES list published on golookaround.com. */
const WEBSITE_CATEGORIES = [
  "For The Fam",
  "For The Soul",
  "In The Roots",
  "In The Sky",
  "On The Edge",
  "On The Land",
  "Under The Water",
  "Hidden Gems",
];

const knownIds = new Set(LISTINGS.map((l) => l.id));

describe("Browse by Category", () => {
  it("uses exactly the GoLookAround website categories", () => {
    expect(ACTIVITY_CATEGORIES.map((c) => c.name)).toEqual(WEBSITE_CATEGORIES);
  });

  it("only attaches listings that exist in the catalogue or are marked samples", () => {
    for (const category of ACTIVITY_CATEGORIES) {
      for (const listing of category.listings) {
        expect(knownIds.has(listing.id) || listing.id.startsWith("sample-")).toBe(true);
      }
    }
  });

  it("never invents a price for a sample plan", () => {
    for (const category of ACTIVITY_CATEGORIES) {
      for (const listing of category.listings) {
        if (listing.id.startsWith("sample-")) expect(listing.price).toBeNull();
      }
    }
  });
});
