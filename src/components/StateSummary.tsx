import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";
import { getRegion, getStateContent, stateSummary } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { EnquiryDialog } from "./EnquiryDialog";

export function StateSummary({ stateId }: { stateId: string }) {
  const region = getRegion(stateId);
  const content = getStateContent(stateId);
  const sum = stateSummary(stateId);
  const [enquire, setEnquire] = useState(false);
  if (!region) return null;

  if (!content || sum.total === 0) {
    return (
      <div className="space-y-4">
        <p className="eyebrow text-brand-deep">Content in progress</p>
        <h2 className="text-4xl leading-tight">{region.name}</h2>
        <p className="text-muted-foreground">
          We only show verified listings, and {region.name} doesn't have any live yet. Tell us what you're
          imagining and the team can plan it with you.
        </p>
        <button type="button" className="btn btn-primary w-full" onClick={() => setEnquire(true)}>
          <MessageCircle className="size-4" aria-hidden /> Ask about {region.name}
        </button>
        <EnquiryDialog
          open={enquire}
          onOpenChange={setEnquire}
          context={{ subject: `a custom plan`, destination: region.name }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <img
        src={content.image}
        alt={`${region.name} landscape`}
        width={1280}
        height={853}
        loading="lazy"
        className="aspect-[16/10] w-full rounded-2xl object-cover"
      />
      <div>
        <p className="eyebrow text-brand-deep">{content.bestSeason}</p>
        <h2 className="mt-1 text-4xl leading-tight">{region.name}</h2>
        <p className="mt-1 font-semibold">{content.tagline}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.blurb}</p>
      </div>
      <dl className="grid grid-cols-3 gap-2 text-center">
        {[
          ["Experiences", sum.experiences],
          ["Events", sum.events],
          ["Retreats", sum.retreats],
        ].map(([label, n]) => (
          <div key={label} className="rounded-xl bg-secondary p-3">
            <dd className="text-2xl font-extrabold">{n}</dd>
            <dt className="text-xs font-bold text-muted-foreground">{label}</dt>
          </div>
        ))}
      </dl>
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Clock className="size-4 text-brand" aria-hidden />
        {formatPrice(sum.from)}
        {sum.itineraries > 0 && (
          <span className="text-muted-foreground">· {sum.itineraries} curated itinerar{sum.itineraries > 1 ? "ies" : "y"}</span>
        )}
      </p>
      <Link to="/india/$stateId" params={{ stateId }} className="btn btn-primary btn-lg w-full">
        Explore {region.name} <ArrowRight className="size-5" aria-hidden />
      </Link>
    </div>
  );
}
