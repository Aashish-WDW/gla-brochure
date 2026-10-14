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
  onOpen,
  portrait = false,
}: {
  listing: Listing;
  onOpen: (l: Listing) => void;
  portrait?: boolean;
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
        !suits && "opacity-75",
      )}
      aria-label={`${listing.title}, ${listing.location}. Open details`}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-muted",
          portrait ? "aspect-[3/4] w-full" : "aspect-[16/10]",
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5" aria-hidden />
        <span className="chip chip-ink absolute left-3 top-3">
          <MapPin className="size-3" aria-hidden /> {listing.location}
        </span>
      </div>
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          portrait ? "gap-2 p-4" : "gap-3 p-5",
        )}
      >
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
        <h3 className={cn("line-clamp-2 font-bold leading-tight", portrait ? "text-lg" : "text-xl")}>{listing.title}</h3>
        {isEvent && (
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <CalendarDays className="size-4 text-brand" aria-hidden />
            {listing.dateLabel}
            {listing.availability && (
              <span className="chip chip-outline ml-1">{AVAIL[listing.availability]}</span>
            )}
          </p>
        )}
        <p className={cn("text-sm text-muted-foreground", portrait ? "line-clamp-2" : "line-clamp-3")}>
          {listing.description}
        </p>
        {mode === "group" && listing.audience.includes("group") && (
          <p className={cn("flex items-center gap-1.5 text-xs font-bold text-brand-deep", portrait && "line-clamp-1")}>
            <Users className="size-3.5" aria-hidden /> Minimum group size applies — varies by listing
          </p>
        )}
        {!suits && (
          <p className="text-xs font-bold text-muted-foreground">
            Individual experience — find it on golookaround.com
          </p>
        )}
        <div className="mt-auto flex flex-col items-start gap-3 border-t pt-4 min-[360px]:flex-row min-[360px]:items-end min-[360px]:justify-between">
          <PriceTag price={listing.price} />
          <span className="shrink-0 text-sm font-bold text-brand-deep group-hover:underline">View details →</span>
        </div>
      </div>
    </button>
  );
}
