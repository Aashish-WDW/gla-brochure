import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ACTIVITY_CATEGORIES, type ActivityCategory } from "@/data/activity-categories";
import type { Listing } from "@/data/types";
import { formatPrice } from "@/lib/format";
import { startingPrice } from "@/lib/catalog";
import { Button } from "./ui/button";
import { Reveal, SplitText } from "./Reveal";
import { Modal } from "./Modal";
import { ListingCard } from "./ListingCard";
import { ListingDialog } from "./ListingDialog";

export function BrowseCategories() {
  const [category, setCategory] = useState<ActivityCategory | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);

  return (
    <section className="mt-14" aria-labelledby="category-heading">
      <h2 id="category-heading" className="text-4xl"><SplitText text="Browse by Category" /></h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIVITY_CATEGORIES.map((item, index) => (
          <Reveal as="li" key={item.id} delay={(index % 3) * 110}>
            <Button variant="ghost" onClick={() => setCategory(item)} aria-label={`Browse ${item.name}`} className="card-surface group block h-full w-full overflow-hidden whitespace-normal p-0 text-left font-normal hover:bg-card">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={item.image} alt={item.name} loading="lazy" width={1280} height={800} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="text-2xl">{item.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>
                <p className="mt-2 text-xs font-semibold text-muted-foreground">{item.listings.length} {item.listings.length === 1 ? "listing" : "listings"}</p>
                <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm">
                  <span className="font-bold">{formatPrice(startingPrice(item.listings))}</span>
                  <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1" aria-hidden />
                </div>
              </div>
            </Button>
          </Reveal>
        ))}
      </ul>
      <Modal open={!!category && !listing} onOpenChange={(open) => { if (!open) setCategory(null); }} title={category?.name ?? "Browse by Category"} description={category?.subtitle}>
        {category?.id === "scuba-diving" && <p className="mb-4 text-sm text-muted-foreground">Sample curation · Availability and pricing on enquiry.</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          {category?.listings.map((item) => <ListingCard key={item.id} listing={item} onOpen={setListing} />)}
        </div>
      </Modal>
      <ListingDialog listing={listing} onClose={() => setListing(null)} />
    </section>
  );
}