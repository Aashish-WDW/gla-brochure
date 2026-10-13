import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Lock, SkipForward } from "lucide-react";
import { useEffect, useState } from "react";
import { Globe } from "@/components/Globe";
import { SiteHeader } from "@/components/SiteHeader";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GoLookAround — Curated journeys across India" },
      {
        name: "description",
        content:
          "Explore India on an interactive globe and map. Discover curated experiences, events and retreats, tailor an itinerary, then enquire on WhatsApp.",
      },
      { property: "og:title", content: "GoLookAround — Curated journeys across India" },
      {
        property: "og:description",
        content: "A map-led playbook of curated experiences, events and retreats for individuals and groups.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const COMING_SOON = ["Sri Lanka", "Nepal", "Thailand", "Japan", "UAE", "Indonesia"];

function Landing() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [settled, setSettled] = useState(false);
  const [skip, setSkip] = useState(0);
  const [diving, setDiving] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setMounted(true);
  }, []);

  const goIndia = () => {
    if (diving) return;
    setDiving(true);
  };

  const notice = focus
    ? focus === "India"
      ? "India — active. Select to explore."
      : `${focus} — Coming Soon`
    : settled
      ? "Hover, tap or focus a country. Only India is open for now."
      : "Finding India…";

  return (
    <div className="on-ink relative flex min-h-dvh flex-col overflow-hidden bg-ink text-ink-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 45%, var(--brand-glow), transparent 70%), radial-gradient(40% 40% at 10% 100%, var(--brand-glow), transparent 70%)",
          opacity: 0.55,
        }}
      />
      <SiteHeader tone="ink" className="relative" />

      <main
        className={cn(
          "relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-6 px-5 pb-10 pt-2 transition-opacity duration-700 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10",
          diving && "opacity-0",
        )}
      >
        <section className="order-2 animate-fade-up lg:order-1">
          <p className="eyebrow text-ink-muted">Interactive brochure &amp; playbook</p>
          <h1 className="mt-4 text-balance text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            India, <em className="text-brand-glow-ink not-italic text-[oklch(0.78_0.14_262)]">curated</em> for the way you travel.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-muted">
            Skip the endless tabs. Explore complete, thoughtfully planned journeys — experiences, events and
            retreats — then shape one to fit you or your group.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-primary btn-lg" onClick={goIndia}>
              Explore India <ArrowRight className="size-5" aria-hidden />
            </button>
            {!settled && mounted && !reduced && (
              <button type="button" className="btn btn-ghost-ink btn-lg" onClick={() => setSkip((n) => n + 1)}>
                <SkipForward className="size-4" aria-hidden /> Skip intro
              </button>
            )}
          </div>

          <p className="mt-6 min-h-6 text-sm font-semibold" role="status" aria-live="polite">
            {notice}
          </p>

          <div className="mt-6">
            <p className="eyebrow mb-3 text-ink-muted">Opening next</p>
            <ul className="flex flex-wrap gap-2">
              {COMING_SOON.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    aria-disabled="true"
                    onClick={() => setFocus(c)}
                    onFocus={() => setFocus(c)}
                    onBlur={() => setFocus(null)}
                    className="inline-flex min-h-9 cursor-not-allowed items-center gap-1.5 rounded-full border border-ink-foreground/15 px-3.5 text-xs font-bold text-ink-muted"
                  >
                    <Lock className="size-3" aria-hidden /> {c}
                    <span className="sr-only"> — Coming Soon</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="order-1 mx-auto w-full max-w-[min(100%,72dvh,46rem)] lg:order-2">
          {fallback ? (
            <div className="grid aspect-square place-items-center rounded-full bg-brand/20 p-8 text-center">
              <div>
                <p className="font-display text-4xl">India</p>
                <p className="mt-2 text-sm text-ink-muted">Interactive globe unavailable — use the button to continue.</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {mounted ? (
                <Globe
                  reducedMotion={reduced}
                  skipSignal={skip}
                  diving={diving}
                  onSettled={() => setSettled(true)}
                  onDived={() => navigate({ to: "/india" })}
                  onSelectIndia={goIndia}
                  onFocusCountry={setFocus}
                  onFallback={() => setFallback(true)}
                />
              ) : (
                <div className="skeleton-ink aspect-square w-full rounded-full" aria-hidden />
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
