import {
  ArrowDown,
  ArrowUp,
  BedDouble,
  Bus,
  CalendarDays,
  Check,
  Clock,
  MapPin,
  MessageCircle,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Utensils,
  Mountain,
  X as XIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { LISTINGS } from "@/data/content";
import type { Itinerary, Stop, StopKind } from "@/data/types";
import { formatClock, formatHours, formatINR, UNIT_LABEL } from "@/lib/format";
import {
  addStop,
  describeChanges,
  isCustomised,
  listingToStop,
  moveStop,
  normalise,
  removeStop,
  schedule,
  stopCost,
  summarise,
} from "@/lib/itinerary";
import { useTrip } from "@/lib/trip";
import { cn } from "@/lib/utils";
import { EnquiryDialog } from "./EnquiryDialog";
import { Modal } from "./Modal";
import { ModeSwitch } from "./ModeSwitch";
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
  const original = useMemo(() => normalise(itinerary.stops), [itinerary]);
  const [stops, setStops] = useState<Stop[]>(original);
  const [addOpen, setAddOpen] = useState(false);
  const [enquire, setEnquire] = useState(false);
  const { mode, people } = useTrip();

  const scheduled = useMemo(() => schedule(stops), [stops]);
  const sum = useMemo(() => summarise(stops, people), [stops, people]);
  const customised = isCustomised(original, stops);
  const changes = describeChanges(original, stops);
  const originalIds = new Set(original.map((s) => s.id));
  const days = Array.from({ length: sum.days }, (_, i) => i + 1);
  const suits = itinerary.suits.includes(mode);

  const enquiryContext = {
    subject: customised ? `${itinerary.title} (customised)` : itinerary.title,
    reference: itinerary.id,
    destination: itinerary.destination,
    changes,
  };

  const summaryBlock = (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip">
          <Clock className="size-3" aria-hidden /> {sum.days} {sum.days === 1 ? "day" : "days"}
        </span>
        <span className="chip chip-outline">{formatHours(sum.activityHours)} of activities</span>
        {customised && (
          <span className="chip chip-ink" data-testid="customised-badge">
            <Sparkles className="size-3" aria-hidden /> Customised
          </span>
        )}
      </div>

      <div>
        <p className="text-xs font-bold text-muted-foreground">Indicative estimate</p>
        <p className="text-4xl font-extrabold leading-none" data-testid="estimate-total">
          {formatINR(sum.knownTotal)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          for {people} {people === 1 ? "person" : "people"}
          {people > 1 && ` · about ${formatINR(sum.perPerson)} each`}
        </p>
        {sum.unconfirmed > 0 ? (
          <p className="mt-2 rounded-xl bg-brand-soft p-3 text-xs font-semibold text-brand-deep">
            {sum.unconfirmed} item{sum.unconfirmed > 1 ? "s" : ""} not yet priced — the GoLookAround team will confirm
            the full estimate.
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Estimate only. The team confirms the final quote.
          </p>
        )}
      </div>

      <div className="space-y-3">
        <ModeSwitch />
        <PartyControls compact />
      </div>

      <button type="button" className="btn btn-primary btn-lg w-full" onClick={() => setEnquire(true)}>
        <MessageCircle className="size-5" aria-hidden />
        {customised ? "Customise with GoLA" : "Enquire on WhatsApp"}
      </button>
      {customised && (
        <button type="button" className="btn btn-outline w-full" onClick={() => setStops(original)}>
          <RotateCcw className="size-4" aria-hidden /> Reset itinerary
        </button>
      )}
      <p className="text-xs text-muted-foreground">
        Prices may vary with season, dates, group size and availability. This is not a booking.
      </p>
      {mode === "group" && (
        <p className="text-xs font-semibold text-brand-deep">
          Group bookings have a minimum number of people that can vary for each experience, event, retreat or excursion
          in this plan. We confirm it when you enquire.
        </p>
      )}
    </div>
  );

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)]">
        <div>
          {!suits && (
            <p className="mb-6 rounded-2xl border p-4 text-sm font-semibold">
              This plan was designed for {mode === "group" ? "individuals" : "groups"}. You can still enquire and ask
              the team to adapt it.
            </p>
          )}

          <div className="space-y-12">
            {days.map((day) => {
              const dayStops = scheduled.filter((s) => s.day === day);
              return (
                <section key={day} aria-labelledby={`day-${day}`}>
                  <div className="mb-4 flex items-baseline gap-3">
                    <h2 id={`day-${day}`} className="text-4xl">
                      Day {day}
                    </h2>
                    <span className="text-sm font-semibold text-muted-foreground">
                      {formatHours(dayStops.reduce((t, s) => t + (s.overnight ? 0 : s.durationHours), 0))} planned
                    </span>
                  </div>
                  <ol className="relative space-y-4 border-l-2 border-brand/25 pl-6">
                    {dayStops.map((s) => {
                      const idx = stops.findIndex((x) => x.id === s.id);
                      const Icon = KIND_ICON[s.kind];
                      const cost = stopCost(s.price, people);
                      const added = !originalIds.has(s.id);
                      return (
                        <li key={s.id} className="relative">
                          <span
                            aria-hidden
                            className="absolute -left-[2.2rem] top-5 grid size-7 place-items-center rounded-full bg-brand text-primary-foreground ring-4 ring-background"
                          >
                            <Icon className="size-3.5" />
                          </span>
                          <article className="card-surface flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
                            {s.image && (
                              <img
                                src={s.image}
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
                                  {s.overnight
                                    ? "Overnight"
                                    : `${formatClock(s.start!)} – ${formatClock(s.end!)}`}
                                </span>
                                <span className="chip chip-outline">{KIND_LABEL[s.kind]}</span>
                                {added && <span className="chip chip-ink">Added by you</span>}
                              </div>
                              <h3 className="mt-2 text-2xl leading-tight">{s.title}</h3>
                              <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="size-3" aria-hidden /> {s.location}
                                </span>
                                {!s.overnight && (
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="size-3" aria-hidden /> {formatHours(s.durationHours)}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-between">
                              <div className="sm:text-right">
                                {s.price ? (
                                  <>
                                    <p className="text-lg font-extrabold leading-tight">{formatINR(cost ?? 0)}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatINR(s.price.amount)} {UNIT_LABEL[s.price.unit]}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-sm font-bold">Request a quote</p>
                                    <p className="text-xs text-muted-foreground">To be confirmed</p>
                                  </>
                                )}
                              </div>
                              <div className="flex gap-1" role="group" aria-label={`Edit ${s.title}`}>
                                <IconBtn
                                  label={`Move ${s.title} up`}
                                  disabled={idx === 0}
                                  onClick={() => setStops((p) => moveStop(p, s.id, "up"))}
                                >
                                  <ArrowUp className="size-4" />
                                </IconBtn>
                                <IconBtn
                                  label={`Move ${s.title} down`}
                                  disabled={idx === stops.length - 1}
                                  onClick={() => setStops((p) => moveStop(p, s.id, "down"))}
                                >
                                  <ArrowDown className="size-4" />
                                </IconBtn>
                                <IconBtn
                                  label={`Remove ${s.title}`}
                                  onClick={() => setStops((p) => removeStop(p, s.id))}
                                  danger
                                >
                                  <Trash2 className="size-4" />
                                </IconBtn>
                              </div>
                            </div>
                          </article>
                        </li>
                      );
                    })}
                  </ol>
                </section>
              );
            })}
            {stops.length === 0 && (
              <p className="rounded-2xl border p-8 text-center text-muted-foreground">
                Your plan is empty. Add a stop or reset to the original itinerary.
              </p>
            )}
          </div>

          <button type="button" className="btn btn-outline mt-8" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" aria-hidden /> Add a stop
          </button>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            <ListBlock title="Included" items={itinerary.inclusions} tone="in" />
            <ListBlock title="Not included" items={itinerary.exclusions} tone="out" />
          </div>
          {itinerary.notes.length > 0 && (
            <div className="mt-6 rounded-2xl border p-5">
              <p className="eyebrow mb-2">Good to know</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {itinerary.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Desktop summary */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border bg-card p-6 shadow-sm">{summaryBlock}</div>
        </aside>

        {/* Mobile summary */}
        <div className="rounded-3xl border bg-card p-5 shadow-sm lg:hidden">{summaryBlock}</div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="shadow-above fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div>
          <p className="text-xs text-muted-foreground">Estimate{customised ? " · customised" : ""}</p>
          <p className="text-lg font-extrabold leading-tight">{formatINR(sum.knownTotal)}</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setEnquire(true)}>
          <MessageCircle className="size-4" aria-hidden /> Enquire
        </button>
      </div>

      <AddStopModal
        open={addOpen}
        onOpenChange={setAddOpen}
        itinerary={itinerary}
        original={original}
        stops={stops}
        days={Math.max(sum.days, 1)}
        onAdd={(s, day) => setStops((p) => addStop(p, s, day))}
      />
      <EnquiryDialog open={enquire} onOpenChange={setEnquire} context={enquiryContext} />
    </>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid size-11 place-items-center rounded-full border transition-colors hover:bg-muted disabled:opacity-35 disabled:hover:bg-transparent",
        danger && "hover:border-destructive hover:text-destructive",
      )}
    >
      {children}
    </button>
  );
}

function ListBlock({ title, items, tone }: { title: string; items: string[]; tone: "in" | "out" }) {
  return (
    <div className="rounded-2xl border p-5">
      <p className="eyebrow mb-3">{title}</p>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            {tone === "in" ? (
              <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
            ) : (
              <XIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
            )}
            <span className={tone === "out" ? "text-muted-foreground" : undefined}>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddStopModal({
  open,
  onOpenChange,
  itinerary,
  original,
  stops,
  days,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  itinerary: Itinerary;
  original: Stop[];
  stops: Stop[];
  days: number;
  onAdd: (s: Omit<Stop, "day">, day: number) => void;
}) {
  const [day, setDay] = useState<number | null>(null);
  const target = Math.min(day ?? days, days);
  const present = new Set(stops.map((s) => s.id));

  const pool = useMemo(() => {
    const map = new Map<string, Omit<Stop, "day"> & { fromPlan?: boolean }>();
    original
      .filter((s) => !s.overnight || true)
      .forEach(({ day: _d, ...s }) => map.set(s.id, { ...s, fromPlan: true }));
    itinerary.addOns.forEach((a) => map.set(a.id, a));
    LISTINGS.filter(
      (l) => l.stateId === itinerary.stateId && l.durationHours !== null && l.category !== "retreat",
    ).forEach((l) => {
      if (!map.has(l.id)) map.set(l.id, listingToStop(l));
    });
    return [...map.values()].filter((s) => !present.has(s.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itinerary, original, stops]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add a stop"
      description="Suggested options for this destination. Prices are indicative."
      variant="side"
    >
      <div className="mb-5 flex items-center gap-3">
        <label htmlFor="add-day" className="text-sm font-bold">
          Add to
        </label>
        <select
          id="add-day"
          className="field !w-auto"
          value={target}
          onChange={(e) => setDay(Number(e.target.value))}
        >
          {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>
              Day {d}
            </option>
          ))}
        </select>
      </div>
      {pool.length === 0 ? (
        <p className="rounded-2xl border p-6 text-center text-sm text-muted-foreground">
          Everything available is already in your plan.
        </p>
      ) : (
        <ul className="space-y-3">
          {pool.map((s) => (
            <li key={s.id} className="flex items-start justify-between gap-3 rounded-2xl border p-4">
              <div className="min-w-0">
                <p className="font-bold leading-snug">{s.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {s.location} · {s.overnight ? "Overnight" : formatHours(s.durationHours)} ·{" "}
                  {s.price ? `${formatINR(s.price.amount)} ${UNIT_LABEL[s.price.unit]}` : "Request a quote"}
                </p>
                {"fromPlan" in s && s.fromPlan && (
                  <span className="chip mt-2">Originally in the plan</span>
                )}
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm shrink-0"
                aria-label={`Add ${s.title} to day ${target}`}
                onClick={() => {
                  const { fromPlan: _f, ...clean } = s as typeof s & { fromPlan?: boolean };
                  onAdd(clean, target);
                }}
              >
                <Plus className="size-4" aria-hidden /> Add
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
