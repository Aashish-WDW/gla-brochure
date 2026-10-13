import { CalendarDays, Clock, MapPin, User, Users } from "lucide-react";
import type { Listing } from "@/data/types";
import { useTrip } from "@/lib/trip";
import { cn } from "@/lib/utils";
import { PriceTag } from "./PriceTag";

const AVAIL: Record<NonNullable<Listing["availability"]>, string> = {
  open: "Open for enquiry",
  limited: "Limited spots",
  tbc: "Dates to be confirmed",
};

export function ListingCard({
  listing,
  featured = false,
  onOpen,
}: {
  listing: Listing;
  featured?: boolean;
  onOpen: (l: Listing) => void;
}) {
  const { mode } = useTrip();
  const suits = listing.audience.includes(mode);
  const isEvent = listing.category === "event";

  return (
    <button
      type="button"
      onClick={() => onOpen(listing)}
      className={cn(
        "card-surface group flex h-full w-full flex-col overflow-hidden text-left",
        featured && "sm:flex-row lg:flex-col",
        !suits && "opacity-75",
      )}
      aria-label={`${listing.title}, ${listing.location}. Open details`}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          featured ? "aspect-[4/3] sm:aspect-auto sm:w-2/5 lg:aspect-[4/3] lg:w-full" : "aspect-[16/10]",
        )}
      >
        <img
          src={listing.image}
          alt={`${listing.title} in ${listing.location}`}
          loading="lazy"
          width={1280}
          height={853}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="chip chip-ink absolute left-3 top-3">
          <MapPin className="size-3" aria-hidden /> {listing.location}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip">
            <Clock className="size-3" aria-hidden /> {listing.durationLabel}
          </span>
          {listing.audience.map((a) => (
            <span key={a} className="chip chip-outline">
              {a === "group" ? <Users className="size-3" aria-hidden /> : <User className="size-3" aria-hidden />}
              {a === "group" ? "Groups" : "Individuals"}
            </span>
          ))}
        </div>
        <h3 className={cn("leading-tight", featured ? "text-2xl" : "text-xl")}>{listing.title}</h3>
        {isEvent && (
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <CalendarDays className="size-4 text-brand" aria-hidden />
            {listing.dateLabel}
            {listing.availability && (
              <span className="chip chip-outline ml-1">{AVAIL[listing.availability]}</span>
            )}
          </p>
        )}
        <p className="line-clamp-3 text-sm text-muted-foreground">{listing.description}</p>
        {mode === "group" && listing.audience.includes("group") && (
          <p className="flex items-center gap-1.5 text-xs font-bold text-brand-deep">
            <Users className="size-3.5" aria-hidden /> Minimum group size applies — varies by listing
          </p>
        )}
        {!suits && (
          <p className="text-xs font-bold text-muted-foreground">
            Looking for an individual? Open for the golookaround.com link
          </p>
        )}
        <div className="mt-auto flex items-end justify-between border-t pt-4">
          <PriceTag price={listing.price} />
          <span className="text-sm font-bold text-brand-deep group-hover:underline">View details →</span>
        </div>
      </div>
    </button>
  );
}
