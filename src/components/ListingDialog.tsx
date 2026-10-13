import { CalendarDays, Check, Clock, MapPin, MessageCircle, Users } from "lucide-react";
import { useState } from "react";
import type { Listing } from "@/data/types";
import { getRegion } from "@/lib/catalog";
import { EnquiryDialog } from "./EnquiryDialog";
import { Modal } from "./Modal";
import { PriceTag } from "./PriceTag";

export function ListingDialog({ listing, onClose }: { listing: Listing | null; onClose: () => void }) {
  const [enquire, setEnquire] = useState(false);
  const region = listing ? getRegion(listing.stateId) : undefined;
  const destination = listing ? `${listing.location}, ${region?.name ?? ""}`.replace(/, $/, "") : "";

  return (
    <>
      <Modal
        open={!!listing && !enquire}
        onOpenChange={(o) => !o && onClose()}
        title={listing?.title ?? ""}
        description={listing ? destination : undefined}
        variant="side"
      >
        {listing && (
          <div className="space-y-5">
            <img
              src={listing.image}
              alt={`${listing.title} in ${listing.location}`}
              width={1280}
              height={853}
              className="aspect-[16/10] w-full rounded-2xl object-cover"
            />
            <div className="flex flex-wrap gap-2">
              <span className="chip capitalize">{listing.category}</span>
              <span className="chip chip-outline">
                <Clock className="size-3" aria-hidden /> {listing.durationLabel}
              </span>
              <span className="chip chip-outline">
                <MapPin className="size-3" aria-hidden /> {listing.location}
              </span>
              {listing.groupRange && (
                <span className="chip chip-outline">
                  <Users className="size-3" aria-hidden /> {listing.groupRange[0]}–{listing.groupRange[1]} people
                </span>
              )}
            </div>
            {listing.category === "event" && (
              <p className="flex items-center gap-2 rounded-xl bg-brand-soft p-3 text-sm font-semibold">
                <CalendarDays className="size-4 text-brand" aria-hidden />
                {listing.dateLabel}
                {!listing.dateConfirmed && <span className="text-muted-foreground">(not confirmed)</span>}
              </p>
            )}
            <p className="leading-relaxed text-muted-foreground">{listing.description}</p>
            <div>
              <p className="eyebrow mb-2">What's included</p>
              <ul className="space-y-1.5">
                {listing.inclusions.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-end justify-between rounded-2xl border p-4">
              <PriceTag price={listing.price} />
              <p className="max-w-[12rem] text-right text-xs text-muted-foreground">
                Indicative. Final pricing depends on dates, group size and customisation.
              </p>
            </div>
            <button type="button" className="btn btn-primary btn-lg w-full" onClick={() => setEnquire(true)}>
              <MessageCircle className="size-5" aria-hidden /> Enquire on WhatsApp
            </button>
          </div>
        )}
      </Modal>
      {listing && (
        <EnquiryDialog
          open={enquire}
          onOpenChange={setEnquire}
          context={{ subject: listing.title, destination }}
        />
      )}
    </>
  );
}
