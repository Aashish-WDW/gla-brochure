import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Map as MapIcon, Maximize2, Minimize2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { IndiaMap } from "@/components/IndiaMap";
import { Modal } from "@/components/Modal";
import { IndividualLink } from "@/components/IndividualLink";
import { SiteHeader } from "@/components/SiteHeader";
import { StateSummary } from "@/components/StateSummary";
import { STATES } from "@/data/content";
import { getRegion, stateSummary } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/india/")({
  head: () => ({
    meta: [
      { title: "Explore India by state — GoLookAround" },
      {
        name: "description",
        content:
          "Pick a state on the India map to see curated experiences, events and retreats, with indicative starting prices.",
      },
      { property: "og:title", content: "Explore India by state — GoLookAround" },
      { property: "og:description", content: "An interactive India map of curated journeys, with a destination list alongside." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IndiaPage,
});

const HOW_IT_WORKS = [
  "Select a state to see what's available and starting prices.",
  "Browse Experiences, Events and Retreats.",
  "Open a curated itinerary, edit it, and enquire on WhatsApp.",
];

function useIsDesktop() {
  const [d, setD] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setD(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return d;
}

function IndiaPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [full, setFull] = useState(false);
  const isDesktop = useIsDesktop();

  const withContent = STATES.map((s) => ({ s, region: getRegion(s.id)!, sum: stateSummary(s.id) }));

  const viewMap = () => {
    if (full) {
      setFull(false);
      return;
    }
    const el = document.getElementById("india-map");
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    el.focus({ preventScroll: true });
  };

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader className="sticky top-0 z-30 bg-background/85 backdrop-blur-md" showShare={false} />
      <main className="mx-auto max-w-7xl px-4 pb-32 pt-8 sm:px-8 sm:pb-28">
        <div className="animate-fade-up max-w-2xl">
          <p className="eyebrow text-brand-deep">Step 1 · Choose a destination</p>
          <h1 className="mt-2 text-5xl leading-[1.05] sm:text-6xl">Where in India?</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Blue states have curated listings, with the number shown on the map. Select any state or use the list.
          </p>
          <a href="#destinations" className="mt-2 inline-block text-sm font-bold text-brand-deep underline-offset-4 hover:underline">
            Skip map, jump to destination list
          </a>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <section id="india-map" aria-label="India map" tabIndex={-1} className="scroll-mt-24 outline-none">
            <div
              className={cn(
                "relative rounded-3xl border bg-secondary p-3 sm:p-6",
                full && "fixed inset-0 z-40 overflow-auto rounded-none border-0 bg-background p-4",
              )}
            >
              <button
                type="button"
                className="btn btn-outline btn-sm absolute right-3 top-3 z-10 bg-background lg:hidden"
                onClick={() => setFull((f) => !f)}
                aria-pressed={full}
              >
                {full ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                {full ? "Exit full screen" : "Full-screen map"}
              </button>
              <div className="relative">
                <IndiaMap
                  selectedId={selected}
                  onSelect={setSelected}
                  className={cn("mx-auto max-h-[78dvh] max-w-xl", full && "max-h-[66dvh]")}
                />
                <div className="pointer-events-none absolute right-0 top-0 hidden max-w-[15rem] lg:block">
                  <div className="rounded-2xl border border-border/70 bg-background/92 p-3 shadow-sm backdrop-blur-sm">
                    <p className="eyebrow text-brand-deep">How it works</p>
                    <ol className="mt-2 space-y-2 text-xs">
                      {HOW_IT_WORKS.map((t, i) => (
                        <li key={t} className="flex gap-2">
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand text-[10px] font-extrabold text-primary-foreground">
                            {i + 1}
                          </span>
                          {t}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-3 rounded-sm bg-brand/80" /> Curated listings
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-3 rounded-sm bg-muted ring-1 ring-border" /> No verified listings yet
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="grid size-4 place-items-center rounded-full bg-ink-foreground text-[9px] font-extrabold text-ink ring-2 ring-brand-deep">
                    n
                  </span>
                Listing count
                </span>
              </div>

              <div className="mt-3 border-t border-border/70 pt-3 lg:hidden">
                <p className="eyebrow text-brand-deep">How it works</p>
                <ol className="mt-2 grid gap-2 text-xs sm:grid-cols-3">
                  {HOW_IT_WORKS.map((t, i) => (
                    <li key={t} className="flex gap-2">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand text-[10px] font-extrabold text-primary-foreground">
                        {i + 1}
                      </span>
                      {t}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start" aria-live="polite">
            {selected && isDesktop ? (
              <div className="rounded-3xl border bg-card p-6 shadow-sm">
                <div className="mb-4 flex justify-end">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setSelected(null)}>
                    <X className="size-4" /> Clear
                  </button>
                </div>
                <StateSummary stateId={selected} />
              </div>
            ) : (
              <div className="rounded-3xl border bg-card p-6">
                <p className="text-sm font-bold">Pick a state</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tap any blue state on the map to see its experiences, events and retreats, with indicative
                  starting prices.
                </p>
              </div>
            )}
          </aside>
        </div>

        <section id="destinations" className="mt-14 scroll-mt-24" aria-labelledby="dest-heading">
          <div className="flex items-end justify-between gap-4">
            <h2 id="dest-heading" className="text-4xl">
              Destinations with curated plans
            </h2>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {withContent.map(({ s, region, sum }) => (
              <li key={s.id}>
                <Link
                  to="/india/$stateId"
                  params={{ stateId: s.id }}
                  className="card-surface group block overflow-hidden"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={s.image}
                      alt={`${region.name} landscape`}
                      loading="lazy"
                      width={1280}
                      height={853}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="chip chip-ink absolute left-3 top-3">{sum.total} listings</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-2xl">{region.name}</h3>
                    <p className="text-sm text-muted-foreground">{s.tagline}</p>
                    <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm">
                      <span className="font-bold">{formatPrice(sum.from)}</span>
                      <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1" aria-hidden />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <div className="shadow-above fixed inset-x-0 bottom-0 z-40 bg-background/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <IndividualLink short />
          <button type="button" className="btn btn-primary" onClick={viewMap}>
            {full ? <Minimize2 className="size-4" aria-hidden /> : <MapIcon className="size-4" aria-hidden />}
            {full ? "Exit full screen" : "View Map"}
          </button>
        </div>
      </div>

      {/* Mobile / tablet: details open in a bottom sheet */}
      <Modal
        open={!!selected && !isDesktop}
        onOpenChange={(o) => !o && setSelected(null)}
        title={selected ? (getRegion(selected)?.name ?? "") : ""}
        description="Destination summary"
      >
        {selected && <StateSummary stateId={selected} />}
      </Modal>
    </div>
  );
}
