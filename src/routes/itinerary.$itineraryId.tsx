import { SplitText } from "@/components/Reveal";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { ItineraryEditor } from "@/components/ItineraryEditor";
import { SiteHeader } from "@/components/SiteHeader";
import { getItinerary, getRegion } from "@/lib/catalog";

export const Route = createFileRoute("/itinerary/$itineraryId")({
  loader: ({ params }) => {
    const it = getItinerary(params.itineraryId);
    if (!it) throw notFound();
    return { title: it.title, summary: it.summary, destination: it.destination };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.title ?? "Itinerary";
    const desc = loaderData?.summary ?? "A curated GoLookAround itinerary you can edit and enquire about.";
    return {
      meta: [
        { title: `${title} — curated itinerary | GoLookAround` },
        { name: "description", content: desc },
        { property: "og:title", content: `${title} — GoLookAround` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <h1 className="text-5xl">Itinerary not found</h1>
        <Link to="/india" className="btn btn-primary mt-6">
          Back to the India map
        </Link>
      </div>
    </div>
  ),
  component: ItineraryPage,
});

function ItineraryPage() {
  const { itineraryId } = Route.useParams();
  const itinerary = getItinerary(itineraryId)!;
  const region = getRegion(itinerary.stateId);

  return (
    <div className="relative min-h-dvh bg-background pb-24 lg:pb-0">
      <SiteHeader tone="ink" className="absolute inset-x-0 top-0" />

      <section className="on-ink relative isolate overflow-hidden bg-ink text-ink-foreground">
        <img
          src={itinerary.image}
          alt={itinerary.title}
          width={1280}
          height={853}
          className="parallax absolute inset-0 -z-10 size-full object-cover opacity-60"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-8 sm:pt-32">
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm font-semibold text-ink-muted">
            <Link to="/india" className="hover:text-ink-foreground">
              India
            </Link>
            <ChevronRight className="size-4" aria-hidden />
            <Link to="/india/$stateId" params={{ stateId: itinerary.stateId }} className="hover:text-ink-foreground">
              {region?.name}
            </Link>
            <ChevronRight className="size-4" aria-hidden />
            <span aria-current="page" className="text-ink-foreground">
              Itinerary
            </span>
          </nav>
          <p className="eyebrow text-brand-light">Curated itinerary · {itinerary.id}</p>
          <h1 className="mt-2 max-w-3xl text-balance text-5xl leading-[1.02] sm:text-7xl">
            <SplitText text={itinerary.title} />
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-muted">{itinerary.summary}</p>
          <p className="mt-2 text-sm font-semibold text-ink-muted">{itinerary.destination}</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <ItineraryEditor key={itinerary.id} itinerary={itinerary} />
      </main>
    </div>
  );
}
