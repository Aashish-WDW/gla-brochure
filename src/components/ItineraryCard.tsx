import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Route as RouteIcon, Users, User } from "lucide-react";
import type { Itinerary } from "@/data/types";
import { formatHours, formatINR } from "@/lib/format";
import { summarise } from "@/lib/itinerary";
import { useTrip } from "@/lib/trip";

export function ItineraryCard({ itinerary }: { itinerary: Itinerary }) {
  const { people, mode } = useTrip();
  const s = summarise(itinerary.stops, people);
  const suits = itinerary.suits.includes(mode);
  return (
    <Link
      to="/itinerary/$itineraryId"
      params={{ itineraryId: itinerary.id }}
      className="card-surface group grid overflow-hidden sm:grid-cols-[2fr_3fr]"
    >
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:min-h-full">
        <img
          src={itinerary.image}
          alt={`${itinerary.title}`}
          width={1280}
          height={853}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="chip chip-ink absolute left-3 top-3">
          <RouteIcon className="size-3" aria-hidden /> Curated itinerary
        </span>
      </div>
      <div className="flex flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <span className="chip">
            <Clock className="size-3" aria-hidden /> {s.days} days · {formatHours(s.activityHours)} of activities
          </span>
          {itinerary.suits.map((m) => (
            <span key={m} className="chip chip-outline">
              {m === "group" ? <Users className="size-3" aria-hidden /> : <User className="size-3" aria-hidden />}
              {m === "group" ? "Groups" : "Individuals"}
            </span>
          ))}
        </div>
        <h3 className="text-3xl leading-tight">{itinerary.title}</h3>
        <p className="text-sm text-muted-foreground">{itinerary.summary}</p>
        {!suits && (
          <p className="text-xs font-bold text-muted-foreground">
            Designed for individuals — can be adapted for groups.
          </p>
        )}
        <div className="mt-auto flex items-end justify-between border-t pt-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Indicative estimate for {people} {people === 1 ? "person" : "people"}
            </p>
            <p className="text-xl font-extrabold">
              {formatINR(s.knownTotal)}
              {s.unconfirmed > 0 && <span className="text-xs font-semibold text-muted-foreground"> + items to confirm</span>}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-deep">
            Open plan <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
