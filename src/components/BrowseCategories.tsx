import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ACTIVITY_CATEGORIES } from "@/data/activity-categories";
import { startingPrice } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { INDIVIDUAL_URL } from "./IndividualLink";
import { Reveal, SplitText } from "./Reveal";

export function BrowseCategories() {
  return (
    <section className="mt-14" aria-labelledby="category-heading">
      <h2 id="category-heading" className="text-3xl sm:text-4xl">
        <SplitText text="Browse by Category" />
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        The same categories as the GoLookAround website — on the land, in the air, under the water,
        and the stories in between.
      </p>
      <a
        href={INDIVIDUAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-brand-deep underline-offset-4 hover:underline"
      >
        See these categories on golookaround.com
        <ArrowUpRight className="size-4" aria-hidden />
      </a>
      <ul className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
        {ACTIVITY_CATEGORIES.map((item, index) => (
          <Reveal
            as="li"
            key={item.id}
            delay={(index % 3) * 110}
            className="w-[78vw] max-w-[20rem] shrink-0 snap-start sm:w-auto sm:max-w-none"
          >
            <Link
              to="/category/$categoryId"
              params={{ categoryId: item.id }}
              aria-label={`Browse ${item.name}`}
              className="card-surface group relative block aspect-[3/4] h-auto w-full overflow-hidden whitespace-normal bg-ink p-0 text-left font-normal hover:bg-ink"
            >
              <div className="absolute inset-0 aspect-[3/4] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
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
                <h3 className="text-2xl">{item.name}</h3>
                <p className="mt-1 text-sm text-white/80">{item.subtitle}</p>
                <p className="mt-2 text-xs font-semibold text-white/70">
                  {item.listings.length} {item.listings.length === 1 ? "listing" : "listings"}
                </p>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-black/20 px-3 py-2 text-sm shadow-lg backdrop-blur-sm">
                  <span className="font-bold">{formatPrice(startingPrice(item.listings))}</span>
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
  );
}
