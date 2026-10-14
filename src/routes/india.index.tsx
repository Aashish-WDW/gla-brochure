import { Reveal, SplitText } from "@/components/Reveal";
import { BrowseCategories } from "@/components/BrowseCategories";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Maximize2, Minimize2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { IndiaMap } from "@/components/IndiaMap";
import { Modal } from "@/components/Modal";
import { SiteHeader } from "@/components/SiteHeader";
import { StateSummary } from "@/components/StateSummary";
import { INDIVIDUAL_URL } from "@/components/IndividualLink";
import { STATES } from "@/data/content";
import { getRegion, stateSummary } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCms } from "@/lib/cms";

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
      {
        property: "og:description",
        content: "An interactive India map of curated journeys, with a destination list alongside.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IndiaPage,
});

const HOW_IT_WORKS = [
  "Select a state to see what's available and starting prices.",
  "Browse Experiences, Events and Retreats.",
  "Open a curation, edit it, and enquire on WhatsApp.",
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

  useEffect(() => {
    if (isDesktop) setFull(false);
  }, [isDesktop]);

  const cms = useCms();
  const withContent = STATES.filter((s) => cms.enabledStates[s.id] !== false).map((s) => ({ s, region: getRegion(s.id)!, sum: stateSummary(s.id) }));

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader
        className="sticky top-0 z-30 bg-background/85 backdrop-blur-md"
        showShare={false}
      />
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:px-8 sm:pb-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(19rem,0.75fr)_minmax(0,1.25fr)] lg:items-start lg:gap-12">
          <div className="animate-fade-up lg:sticky lg:top-24">
            <div className="max-w-2xl">
              <p className="eyebrow text-brand-deep">Step 1 · Choose a destination</p>
              <h1 className="mt-2 text-4xl leading-[1.05] min-[380px]:text-5xl sm:text-6xl">
                <SplitText text="Where in India?" />
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                Blue states have curated listings, with the number shown on the map. Select any
                state or use the list.
              </p>
              <a
                href="#destinations"
                className="mt-2 inline-block text-sm font-bold text-brand-deep underline-offset-4 hover:underline"
              >
                Skip map, jump to destination list
              </a>
            </div>

            <aside className="mt-8 hidden lg:block" aria-live="polite">
              <div className="space-y-6">
                <div className="rounded-3xl border bg-card p-6 shadow-sm">
                  <p className="text-base font-bold">Pick a state</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Select any blue state on the map to see its experiences, events and retreats,
                    with indicative starting prices.
                  </p>
                </div>
                <div className="rounded-3xl border bg-card p-6 shadow-sm">
                  <p className="eyebrow text-brand-deep">How it works</p>
                  <ol className="mt-4 space-y-3 text-sm">
                    {HOW_IT_WORKS.map((t, i) => (
                      <li key={t} className="flex gap-3">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-extrabold text-primary-foreground">
                          {i + 1}
                        </span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </aside>
          </div>

          <Reveal as="section" className="scroll-mt-24 outline-none lg:col-start-2" delay={100}>
            <section id="india-map" aria-label="India map" tabIndex={-1} className="outline-none">
              <div
                className={cn(
                  "relative rounded-3xl border bg-secondary p-3 sm:p-6",
                  full &&
                    "fixed inset-0 z-40 overflow-auto rounded-none border-0 bg-background p-4",
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
                    className={cn("mx-auto max-h-[78dvh] max-w-2xl", full && "max-h-[66dvh]")}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-3 rounded-sm bg-brand/80" /> Curated listings
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-3 rounded-sm bg-muted ring-1 ring-border" /> No verified
                    listings yet
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
          </Reveal>
        </div>

        <section id="destinations" className="mt-14 scroll-mt-24" aria-labelledby="dest-heading">
          <div className="flex items-end justify-between gap-4">
            <h2 id="dest-heading" className="text-3xl sm:text-4xl">
              <SplitText text="Destinations with curated plans" />
            </h2>
          </div>
          <ul className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
            {withContent.map(({ s, region, sum }, idx) => (
              <Reveal
                as="li"
                key={s.id}
                delay={(idx % 3) * 110}
                className="w-[78vw] max-w-[20rem] shrink-0 snap-start sm:w-auto sm:max-w-none"
              >
                <Link
                  to="/india/$stateId"
                  params={{ stateId: s.id }}
                  className="card-surface group relative block aspect-[3/4] overflow-hidden bg-ink"
                >
                  <div className="absolute inset-0 aspect-[3/4] overflow-hidden">
                    <img
                      src={s.image}
                      alt={`${region.name} landscape`}
                      loading="lazy"
                      width={900}
                      height={1200}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                    <h3 className="text-2xl">{region.name}</h3>
                    <p className="mt-1 text-sm text-white/80">{s.tagline}</p>
                    <p className="mt-2 text-xs font-semibold text-white/70">{sum.total} listings</p>
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-black/20 px-3 py-2 text-sm shadow-lg backdrop-blur-sm">
                      <span className="font-bold">{formatPrice(sum.from)}</span>
                      <ArrowRight
                        className="size-4 text-brand-light transition-transform group-hover:translate-x-1"
                        aria-hidden
                      />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>
        <BrowseCategories />
      </main>

      <div
        className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6 sm:hidden"
        style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
      >
        <a
          href={INDIVIDUAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-lg mx-auto flex w-full max-w-md justify-center px-4 text-sm shadow-lg"
        >
          <User className="size-5" aria-hidden /> Looking for an individual?
          <ArrowUpRight className="size-5" aria-hidden />
        </a>
      </div>

      {/* Bottom sheet on phones; centred popup on desktop. */}
      <Modal
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        title={selected ? (getRegion(selected)?.name ?? "") : ""}
        description="Destination summary"
        size={selected && stateSummary(selected).total > 0 ? "wide" : "default"}
        immersive
      >
        {selected && <StateSummary stateId={selected} immersive />}
      </Modal>
    </div>
  );
}
