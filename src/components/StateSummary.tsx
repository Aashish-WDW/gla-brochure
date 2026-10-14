import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";
import { getRegion, getStateContent, stateSummary } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { EnquiryDialog } from "./EnquiryDialog";
import { cn } from "@/lib/utils";

export function StateSummary({
  stateId,
  immersive = false,
}: {
  stateId: string;
  immersive?: boolean;
}) {
  const region = getRegion(stateId);
  const content = getStateContent(stateId);
  const sum = stateSummary(stateId);
  const [enquire, setEnquire] = useState(false);
  if (!region) return null;

  if (!content || sum.total === 0) {
    return (
      <div className={cn("space-y-4", immersive && "p-5 sm:p-7")}>
        <p className="eyebrow text-brand-deep">Content in progress</p>
        <h2 className="break-words text-3xl leading-tight sm:text-4xl">{region.name}</h2>
        <p className="text-muted-foreground">
          We only show verified listings, and {region.name} doesn't have any live yet. Tell us what
          you're imagining and the team can plan it with you.
        </p>
        <button
          type="button"
          className="btn btn-primary w-full sm:w-auto"
          onClick={() => setEnquire(true)}
        >
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
    <div
      className={cn(
        "space-y-5",
        immersive &&
          "space-y-0 lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch",
      )}
    >
      <div
        className={cn(
          "relative aspect-[3/4] overflow-hidden bg-ink shadow-xl",
          immersive ? "rounded-none" : "rounded-2xl",
        )}
      >
        <img
          src={content.image}
          alt={`${region.name} landscape`}
          width={900}
          height={1200}
          loading="lazy"
          className="size-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6 lg:hidden">
          <p className="eyebrow text-brand-light">{content.bestSeason}</p>
          <h2 className="mt-1 break-words text-3xl leading-tight min-[380px]:text-4xl sm:text-5xl">
            {region.name}
          </h2>
          <p className="mt-2 font-semibold text-white/90">{content.tagline}</p>
        </div>
      </div>
      <div
        className={cn(
          "space-y-5",
          immersive && "p-5 pb-28 sm:p-7 sm:pb-28 lg:flex lg:flex-col lg:justify-center lg:p-8",
        )}
      >
        {immersive && (
          <div className="hidden lg:block">
            <p className="eyebrow text-brand-deep">{content.bestSeason}</p>
            <h2 className="mt-2 break-words text-4xl leading-tight xl:text-5xl">{region.name}</h2>
            <p className="mt-2 text-lg font-semibold text-foreground">{content.tagline}</p>
          </div>
        )}
        <p className="text-base leading-relaxed text-muted-foreground">{content.blurb}</p>
        <dl className="grid grid-cols-2 gap-2 text-center">
          {[
            {
              label: sum.itineraries === 1 ? "Curation" : "Curations",
              n: sum.itineraries,
              featured: true,
            },
            { label: "Experiences", n: sum.experiences },
            { label: "Events", n: sum.events },
            { label: "Retreats", n: sum.retreats },
          ].map(({ label, n, featured }) => (
            <div
              key={label}
              className={cn(
                "rounded-xl p-3 shadow-sm",
                featured ? "bg-brand-soft text-brand-deep" : "bg-secondary",
              )}
            >
              <dd className="text-2xl font-extrabold">{n}</dd>
              <dt className={cn("text-xs font-bold", !featured && "text-muted-foreground")}>
                {label}
              </dt>
            </div>
          ))}
        </dl>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4 text-brand" aria-hidden />
            {formatPrice(sum.from)}
          </span>
        </div>
        <Link
          to="/india/$stateId"
          params={{ stateId }}
          className={cn(
            "btn btn-primary btn-lg shadow-2xl",
            immersive
              ? "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[60] w-[calc(100%-2rem)] max-w-[38rem] -translate-x-1/2 lg:static lg:w-full lg:max-w-none lg:translate-x-0"
              : "w-full",
          )}
        >
          Explore {region.name} <ArrowRight className="size-5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
