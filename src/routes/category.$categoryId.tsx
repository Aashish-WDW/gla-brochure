import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { ListingDialog } from "@/components/ListingDialog";
import { Reveal, SplitText } from "@/components/Reveal";
import { SiteHeader } from "@/components/SiteHeader";
import { categoryHasSample, getActivityCategory } from "@/data/activity-categories";
import type { Listing } from "@/data/types";
import { sortForMode, startingPrice } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useTrip } from "@/lib/trip";

export const Route = createFileRoute("/category/$categoryId")({
  loader: ({ params }) => {
    const category = getActivityCategory(params.categoryId);
    if (!category) throw notFound();
    return { name: category.name, subtitle: category.subtitle };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Category";
    const subtitle = loaderData?.subtitle ?? "Curated group experiences across India.";
    return {
      meta: [
        { title: `${name} — curated India experiences | GoLookAround` },
        { name: "description", content: subtitle },
        { property: "og:title", content: `${name} — GoLookAround` },
        { property: "og:description", content: subtitle },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <h1 className="text-5xl">Category not found</h1>
        <Link to="/india" className="btn btn-primary mt-6">
          Browse India
        </Link>
      </div>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { categoryId } = Route.useParams();
  const category = getActivityCategory(categoryId)!;
  const { mode } = useTrip();
  const listings = sortForMode(category.listings, mode);
  const [open, setOpen] = useState<Listing | null>(null);

  return (
    <div className="relative min-h-dvh bg-background">
      <SiteHeader tone="ink" className="absolute inset-x-0 top-0" />

      <section className="on-ink relative isolate overflow-hidden bg-ink text-ink-foreground">
        <img
          src={category.image}
          alt={category.name}
          width={1600}
          height={1200}
          className="parallax absolute inset-0 -z-10 size-full object-cover opacity-75"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/45 to-ink/20" />
        <div className="mx-auto flex min-h-[34rem] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:min-h-[40rem] sm:px-8 sm:pb-14 sm:pt-32">
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-1 text-sm font-semibold text-ink-muted"
          >
            <Link to="/india" className="hover:text-ink-foreground">
              India
            </Link>
            <ChevronRight className="size-4" aria-hidden />
            <span>Browse by category</span>
            <ChevronRight className="size-4" aria-hidden />
            <span aria-current="page" className="text-ink-foreground">
              {category.name}
            </span>
          </nav>
          <p className="eyebrow text-brand-light">Browse by category</p>
          <h1 className="mt-2 break-words text-5xl leading-none sm:text-7xl">
            <SplitText text={category.name} />
          </h1>
          <p className="animate-fade-up mt-3 max-w-2xl text-lg text-ink-muted [animation-delay:0.35s] sm:text-xl">
            {category.subtitle}
          </p>
          <div className="animate-fade-up mt-6 flex flex-wrap gap-2 [animation-delay:0.5s]">
            <span className="chip bg-ink-foreground/15 text-ink-foreground">
              {category.listings.length} {category.listings.length === 1 ? "listing" : "listings"}
            </span>
            <span className="chip">{formatPrice(startingPrice(category.listings))}</span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-8 sm:pt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-brand-deep">Curated across India</p>
            <h2 className="mt-1 text-3xl sm:text-4xl">Explore {category.name}</h2>
          </div>
          <Link to="/india" className="btn btn-outline">
            All destinations
          </Link>
        </div>

        {categoryHasSample(category) && (
          <p className="mt-6 rounded-2xl bg-brand-soft p-4 text-sm font-semibold text-brand-deep">
            This category includes sample concepts. Availability and final pricing are confirmed on
            enquiry.
          </p>
        )}

        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing, index) => (
            <Reveal as="li" key={listing.id} delay={(index % 3) * 110}>
              <ListingCard listing={listing} onOpen={setOpen} portrait />
            </Reveal>
          ))}
        </ul>

        <p className="mt-12 text-xs text-muted-foreground">
          Sample content for prototype purposes. Prices are indicative and may change with dates,
          season and group size. Nothing here is a confirmed booking.
        </p>
      </main>

      <ListingDialog listing={open} onClose={() => setOpen(null)} />
    </div>
  );
}
