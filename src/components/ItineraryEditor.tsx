import {
  BedDouble,
  Bus,
  CalendarDays,
  Check,
  Clock,
  MapPin,
  MessageCircle,
  Mountain,
  Utensils,
  X as XIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Itinerary, StopKind } from "@/data/types";
import { formatClock, formatHours, formatINR, UNIT_LABEL } from "@/lib/format";
import { normalise, schedule, stopCost, summarise } from "@/lib/itinerary";
import { useTrip } from "@/lib/trip";
import { EnquiryDialog } from "./EnquiryDialog";
import { IndividualLink } from "./IndividualLink";
import { PartyControls } from "./PartyControls";

const KIND_ICON: Record<StopKind, typeof Mountain> = {
  experience: Mountain,
  event: CalendarDays,
  retreat: BedDouble,
  food: Utensils,
  stay: BedDouble,
  transfer: Bus,
};

const KIND_LABEL: Record<StopKind, string> = {
  experience: "Experience",
  event: "Event",
  retreat: "Retreat",
  food: "Food",
  stay: "Stay",
  transfer: "Transfer",
};

export function ItineraryEditor({ itinerary }: { itinerary: Itinerary }) {
  const stops = useMemo(() => normalise(itinerary.stops), [itinerary]);
  const [enquire, setEnquire] = useState(false);
  const { mode, people } = useTrip();
  const scheduled = useMemo(() => schedule(stops), [stops]);
  const sum = useMemo(() => summarise(stops, people), [stops, people]);
  const days = Array.from({ length: sum.days }, (_, i) => i + 1);
  const suits = itinerary.suits.includes(mode);

  const summaryBlock = (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip">
          <Clock className="size-3" aria-hidden /> {sum.days} {sum.days === 1 ? "day" : "days"}
        </span>
        <span className="chip chip-outline">{formatHours(sum.activityHours)} of activities</span>
      </div>

      <div className="rounded-2xl bg-muted/55 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Indicative estimate
        </p>
        <p className="mt-1 text-4xl font-extrabold leading-none" data-testid="estimate-total">
          {formatINR(sum.knownTotal)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          for {people} {people === 1 ? "person" : "people"}
          {people > 1 && ` · about ${formatINR(sum.perPerson)} each`}
        </p>
        {sum.unconfirmed > 0 ? (
          <p className="mt-3 rounded-xl bg-brand-soft p-3 text-xs font-semibold leading-relaxed text-brand-deep">
            {sum.unconfirmed} item{sum.unconfirmed > 1 ? "s" : ""} not yet priced — the GoLookAround
            team will confirm the full estimate.
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Estimate only. The team confirms the final quote.
          </p>
        )}
      </div>

      <PartyControls compact />

      <div className="grid gap-2">
        <p className="text-left text-sm font-bold text-foreground">Customise with GoLookAround</p>
        <button
          type="button"
          className="btn btn-primary btn-lg w-full"
          onClick={() => setEnquire(true)}
        >
          <MessageCircle className="size-5" aria-hidden />
          Enquire on WhatsApp
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-background">
        <p className="p-4 text-xs leading-relaxed text-muted-foreground">
          Prices may vary with season, dates, group size and availability. This is not a booking.
        </p>
        <div className="border-t p-4">
          <IndividualLink short className="w-full justify-between" />
        </div>
        {mode === "group" && (
          <p className="border-t bg-brand-soft/60 p-4 text-xs font-semibold leading-relaxed text-brand-deep">
            Group minimums vary by experience, event, retreat or excursion. We confirm them when you
            enquire.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)]">
        <div>
          {!suits && (
            <p className="mb-6 rounded-2xl border p-4 text-sm font-semibold">
              This plan was designed for individuals. You can still enquire and ask the team to
              adapt it for your group.
            </p>
          )}

          <div className="space-y-12">
            {days.map((day) => {
              const dayStops = scheduled.filter((stop) => stop.day === day);
              return (
                <section key={day} aria-labelledby={`day-${day}`}>
                  <div className="mb-4 flex items-baseline justify-between gap-3">
                    <h2 id={`day-${day}`} className="text-4xl">
                      Day {day}
                    </h2>
                    <span className="shrink-0 text-right text-sm font-semibold text-muted-foreground">
                      {formatHours(
                        dayStops.reduce(
                          (total, stop) => total + (stop.overnight ? 0 : stop.durationHours),
                          0,
                        ),
                      )}{" "}
                      planned
                    </span>
                  </div>
                  <ol className="relative space-y-4 border-l-2 border-brand/25 pl-6">
                    {dayStops.map((stop) => {
                      const Icon = KIND_ICON[stop.kind];
                      const cost = stopCost(stop.price, people);
                      return (
                        <li key={stop.id} className="relative">
                          <span
                            aria-hidden
                            className="absolute -left-[2.2rem] top-5 grid size-7 place-items-center rounded-full bg-brand text-primary-foreground ring-4 ring-background"
                          >
                            <Icon className="size-3.5" />
                          </span>
                          <article className="card-surface flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
                            {stop.image && (
                              <img
                                src={stop.image}
                                alt=""
                                loading="lazy"
                                width={1280}
                                height={853}
                                className="aspect-[16/10] w-full rounded-xl object-cover sm:aspect-square sm:size-28 sm:w-28"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="chip">
                                  {stop.overnight
                                    ? "Overnight"
                                    : `${formatClock(stop.start!)} – ${formatClock(stop.end!)}`}
                                </span>
                                <span className="chip chip-outline">{KIND_LABEL[stop.kind]}</span>
                              </div>
                              <h3 className="mt-2 text-2xl leading-tight">{stop.title}</h3>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {stop.description}
                              </p>
                              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="size-3" aria-hidden /> {stop.location}
                                </span>
                                {!stop.overnight && (
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="size-3" aria-hidden />{" "}
                                    {formatHours(stop.durationHours)}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="shrink-0 sm:text-right">
                              {stop.price ? (
                                <>
                                  <p className="text-lg font-extrabold leading-tight">
                                    {formatINR(cost ?? 0)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatINR(stop.price.amount)} {UNIT_LABEL[stop.price.unit]}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="text-sm font-bold">Request a quote</p>
                                  <p className="text-xs text-muted-foreground">To be confirmed</p>
                                </>
                              )}
                            </div>
                          </article>
                        </li>
                      );
                    })}
                  </ol>
                </section>
              );
            })}
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            <ListBlock title="Included" items={itinerary.inclusions} tone="in" />
            <ListBlock title="Not included" items={itinerary.exclusions} tone="out" />
          </div>
          {itinerary.notes.length > 0 && (
            <div className="mt-6 rounded-2xl border p-5">
              <p className="eyebrow mb-2">Good to know</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {itinerary.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border bg-card p-6 shadow-sm">
            {summaryBlock}
          </div>
        </aside>

        <div className="rounded-3xl border bg-card p-4 shadow-sm sm:p-5 lg:hidden">
          {summaryBlock}
        </div>
      </div>

      <div className="shadow-above fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div>
          <p className="text-xs text-muted-foreground">Estimate</p>
          <p className="text-lg font-extrabold leading-tight">{formatINR(sum.knownTotal)}</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setEnquire(true)}>
          <MessageCircle className="size-4" aria-hidden /> Enquire
        </button>
      </div>

      <EnquiryDialog
        open={enquire}
        onOpenChange={setEnquire}
        context={{
          subject: itinerary.title,
          reference: itinerary.id,
          destination: itinerary.destination,
        }}
      />
    </>
  );
}

function ListBlock({ title, items, tone }: { title: string; items: string[]; tone: "in" | "out" }) {
  return (
    <div className="rounded-2xl border p-5">
      <p className="eyebrow mb-3">{title}</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            {tone === "in" ? (
              <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
            ) : (
              <XIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
            )}
            <span className={tone === "out" ? "text-muted-foreground" : undefined}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
