import paragliding from "@/assets/category-paragliding.jpg";
import scuba from "@/assets/category-scuba.jpg";
import { LISTINGS } from "./content";
import { IMAGES } from "./images";
import type { Listing } from "./types";

export interface ActivityCategory {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  listings: Listing[];
}

const byIds = (...ids: string[]) => LISTINGS.filter((listing) => ids.includes(listing.id));

// Frontend-only sample: no unconfirmed prices or occupancy numbers.
const scubaSample: Listing = {
  id: "sample-goa-scuba",
  title: "Goa Scuba Diving — Group Discovery",
  category: "experience",
  stateId: "goa",
  location: "Goa",
  image: scuba,
  description: "A sample coastal outing with an introductory dive, a safety briefing and time to explore underwater together. Dates, dive site and group arrangements are confirmed on enquiry.",
  durationHours: null,
  durationLabel: "Duration on enquiry",
  price: null,
  inclusions: ["Sample plan: introductory briefing", "Dive equipment and instructor arrangements to be confirmed"],
  audience: ["group"],
};

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  { id: "paragliding", name: "Paragliding", subtitle: "Bir Billing · Himalayan skies", image: paragliding, listings: byIds("hp-paragliding").map((listing) => ({ ...listing, image: paragliding })) },
  { id: "scuba-diving", name: "Scuba Diving", subtitle: "Goa · Underwater discovery", image: scuba, listings: [scubaSample] },
  { id: "trekking", name: "Trekking", subtitle: "Himachal Pradesh · Ridge trails", image: IMAGES.himachalMountains, listings: byIds("hp-triund") },
  { id: "yoga-wellness", name: "Yoga & Wellness", subtitle: "Uttarakhand · Riverbank resets", image: IMAGES.uttarakhandYoga, listings: byIds("uk-sunrise-yoga", "uk-yoga-week", "uk-silent-retreat") },
  { id: "food-cooking", name: "Food & Cooking", subtitle: "Local kitchens · Shared tables", image: IMAGES.foodClass, listings: byIds("raj-food-trail", "ker-spice-class", "hp-home-dining") },
  { id: "heritage", name: "Heritage Walks", subtitle: "Rajasthan & Goa · Stories on foot", image: IMAGES.rajasthanFort, listings: byIds("raj-amer-sunrise", "goa-fontainhas") },
];