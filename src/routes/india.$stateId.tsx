import * as Tabs from "@radix-ui/react-tabs";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { EnquiryDialog } from "@/components/EnquiryDialog";
import { ItineraryCard } from "@/components/ItineraryCard";
import { ListingCard } from "@/components/ListingCard";
import { ListingDialog } from "@/components/ListingDialog";
import { SiteHeader } from "@/components/SiteHeader";
import type { Category, Listing } from "@/data/types";
import {
  CATEGORY_LABEL,
  getRegion,
  getStateContent,
  itinerariesFor,
  listingsFor,
  sortForMode,
  stateSummary,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useTrip } from "@/lib/trip";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/india/$stateId")({
  loader: ({ params }) => {
    const region = getRegion(params.stateId);
    if (!region) throw notFound();
    return { name: region.name };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Destination";
    return {
      meta: [
        { title: `${name} — curated experiences, events & retreats | GoLookAround` },
        {
          name: "description",
          content: `Browse curated experiences, events and retreats in ${name}, with indicative starting prices and sample itineraries.`,
        },
        { property: "og:title", content: `${name} — GoLookAround` },
        { property: "og:description", content: `Curated plans and indicative prices for ${name}.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <h1 className="text-5xl">Destination not found</h1>
        <Link to="/india" className="btn btn-primary mt-6">
          Back to the India map
        </Link>
      </div>
    </div>
  ),
  component: StatePage,
});

const CATEGORIES: Category[] = ["experience", "event", "retreat"];

function StatePage() {
  const { stateId } = Route.useParams();
  const region = getRegion(stateId)!;
  const content = getStateContent(stateId);
  const sum = stateSummary(stateId);
  const itineraries = itinerariesFor(stateId);
  const { mode, people } = useTrip();
  const [tab, setTab] = useState<Category>("experience");
  const [open, setOpen] = useState<Listing | null>(null);
  const [ask, setAsk] = useState(false);

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader className="sticky top-0" />

      {/* Hero */}
      <section className="on-ink relative isolate overflow-hidden bg-ink text-ink-foreground">
        {content && (
          <img
            src={content.image}
            alt={`${region.name} landscape`}
            width={1280}
            height={853}
            className="absolute inset-0 -z-10 size-full object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-8 sm:pt-36">
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1 text-sm font-semibold text-ink-muted">
            <Link to="/india" className="hover:text-ink-foreground">
              India
            </Link>
            <ChevronRight className="size-4" aria-hidden />
            <span aria-current="page" className="text-ink-foreground">
              {region.name}
            </span>
          </nav>
          <h1 className="text-6xl leading-none sm:text-8xl">{region.name}</h1>
          {content && <p className="mt-3 max-w-xl text-xl text-ink-muted">{content.tagline}</p>}
          {content && (
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="chip">{formatPrice(sum.from)}</span>
              <span className="chip bg-ink-foreground/15 text-ink-foreground">
                Best season: {content.bestSeason}
              </span>
              <span className="chip bg-ink-foreground/15 text-ink-foreground">{sum.total} curated listings</span>
            </div>
          )}
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-8">
        {!content || sum.total === 0 ? (
          <div className="mx-auto max-w-xl rounded-3xl border p-8 text-center">
            <Sparkles className="mx-auto size-8 text-brand" aria-hidden />
            <h2 className="mt-4 text-3xl">No verified listings for {region.name} yet</h2>
            <p className="mt-2 text-muted-foreground">
              We only show confirmed content. The GoLookAround team can still plan something with you.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" className="btn btn-primary" onClick={() => setAsk(true)}>
                <MessageCircle className="size-4" aria-hidden /> Ask about {region.name}
              </button>
              <Link to="/india" className="btn btn-outline">
                Back to the map
              </Link>
            </div>
            <EnquiryDialog
              open={ask}
              onOpenChange={setAsk}
              context={{ subject: "a custom plan", destination: region.name }}
            />
          </div>
        ) : (
          <>
            <p className="rounded-2xl bg-brand-soft p-4 text-sm font-semibold text-brand-deep">
              {mode === "group"
                ? `Group view · pricing shown for ${people} people where per-group rates apply. Listings suited to groups appear first.`
                : `Individual view · prices shown per person. Listings suited to individuals and small parties appear first.`}
            </p>

            {itineraries.length > 0 && (
              <section className="mt-12" aria-labelledby="itins">
                <p className="eyebrow text-brand-deep">The playbook</p>
                <h2 id="itins" className="mt-1 text-4xl">
                  Complete curated itineraries
                </h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  A coherent plan from first stop to last — and every piece of it can be edited.
                </p>
                <div className="mt-6 grid gap-5">
                  {itineraries.map((i) => (
                    <ItineraryCard key={i.id} itinerary={i} />
                  ))}
                </div>
              </section>
            )}

            <section className="mt-16" aria-labelledby="browse">
              <h2 id="browse" className="text-4xl">
                Browse by category
              </h2>
              <Tabs.Root value={tab} onValueChange={(v) => setTab(v as Category)} className="mt-6">
                <Tabs.List className="flex flex-wrap items-center gap-2" aria-label="Listing categories">
                  {CATEGORIES.map((c) => {
                    const n = listingsFor(stateId, c).length;
                    const primary = c === "experience";
                    return (
                      <Tabs.Trigger
                        key={c}
                        value={c}
                        className={cn(
                          "inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm font-bold transition-colors data-[state=active]:border-brand data-[state=active]:bg-brand data-[state=active]:text-primary-foreground",
                          primary ? "text-base sm:px-7" : "text-muted-foreground hover:text-foreground",
                          primary && "ring-2 ring-brand/20 data-[state=active]:ring-brand/40",
                        )}
                      >
                        {CATEGORY_LABEL[c]}
                        <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs">{n}</span>
                      </Tabs.Trigger>
                    );
                  })}
                </Tabs.List>

                {CATEGORIES.map((c) => {
                  const list = sortForMode(listingsFor(stateId, c), mode);
                  return (
                    <Tabs.Content key={c} value={c} className="mt-6 outline-none">
                      {list.length === 0 ? (
                        <p className="rounded-2xl border p-8 text-center text-muted-foreground">
                          No confirmed {CATEGORY_LABEL[c].toLowerCase()} here yet.
                        </p>
                      ) : (
                        <ul
                          className={cn(
                            "grid gap-5",
                            c === "experience" ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3",
                          )}
                        >
                          {list.map((l, idx) => (
                            <li
                              key={l.id}
                              className={cn(c === "experience" && idx === 0 && list.length > 2 && "sm:col-span-2 lg:col-span-1")}
                            >
                              <ListingCard listing={l} featured={c === "experience" && idx === 0} onOpen={setOpen} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </Tabs.Content>
                  );
                })}
              </Tabs.Root>
            </section>

            <p className="mt-12 text-xs text-muted-foreground">
              Sample content for prototype purposes. Prices are indicative and may change with dates, season and group
              size. Nothing here is a confirmed booking.
            </p>
          </>
        )}
      </main>

      <ListingDialog listing={open} onClose={() => setOpen(null)} />
    </div>
  );
}
