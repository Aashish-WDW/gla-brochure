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

const isSample = (listing: Listing) => listing.id.startsWith("sample-");

// Frontend-only samples: no unconfirmed prices or occupancy numbers.
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

const balloonSample: Listing = {
  id: "sample-raj-balloon",
  title: "Sunrise Hot-Air Balloon over Amer",
  category: "experience",
  stateId: "rajasthan",
  location: "Jaipur",
  image: paragliding,
  description: "A sample dawn flight over the fort and surrounding countryside, with a landing toast afterwards. Season, launch field and group size are confirmed on enquiry.",
  durationHours: null,
  durationLabel: "Duration on enquiry",
  price: null,
  inclusions: ["Sample plan: dawn launch and landing toast", "Pilot, transfer and flight arrangements to be confirmed"],
  audience: ["group"],
};

/** Category names mirror the GoLookAround website so both browsing paths agree. */
export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  {
    id: "for-the-fam",
    name: "For The Fam",
    subtitle: "Kitchens, farms & easy days out",
    image: IMAGES.foodClass,
    listings: byIds("raj-food-trail", "ker-spice-class", "ka-coracle", "hp-home-dining", "raj-block-print"),
  },
  {
    id: "for-the-soul",
    name: "For The Soul",
    subtitle: "Rishikesh, Kovalam & quiet nights",
    image: IMAGES.uttarakhandYoga,
    listings: byIds("uk-sunrise-yoga", "uk-yoga-week", "uk-silent-retreat", "ker-ayurveda", "raj-desert-retreat"),
  },
  {
    id: "in-the-roots",
    name: "In The Roots",
    subtitle: "Forts, ghats & old-quarter walks",
    image: IMAGES.rajasthanFort,
    listings: byIds("raj-amer-sunrise", "goa-fontainhas", "ka-hampi-sunrise", "ker-kathakali", "ka-heritage-dance", "uk-aarti"),
  },
  {
    id: "in-the-sky",
    name: "In The Sky",
    subtitle: "Bir tandem flights & dawn balloons",
    image: paragliding,
    listings: [...byIds("hp-paragliding"), balloonSample],
  },
  {
    id: "on-the-edge",
    name: "On The Edge",
    subtitle: "Rapids, ridges & boulders",
    image: IMAGES.karnatakaHampi,
    listings: byIds("uk-rafting", "hp-triund"),
  },
  {
    id: "on-the-land",
    name: "On The Land",
    subtitle: "Dunes, estates & pine valleys",
    image: IMAGES.himachalMountains,
    listings: byIds("raj-dune-sunset", "ka-coffee-estate", "hp-pine-offsite"),
  },
  {
    id: "under-the-water",
    name: "Under The Water",
    subtitle: "Dives, kayals & backwaters",
    image: scuba,
    listings: [scubaSample, ...byIds("goa-sunset-sail", "goa-mangrove-kayak", "ker-houseboat")],
  },
  {
    id: "hidden-gems",
    name: "Hidden Gems",
    subtitle: "Lantern nights & riverbank secrets",
    image: IMAGES.keralaBackwaters,
    listings: byIds("raj-lantern-fest", "ker-snake-boat", "hp-folk-gathering", "goa-sunset-sessions", "goa-writers-retreat"),
  },
];

/** True when a category mixes in a frontend-only sample plan. */
export const categoryHasSample = (category: ActivityCategory) => category.listings.some(isSample);
