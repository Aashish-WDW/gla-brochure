import { SplitText } from "@/components/Reveal";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Globe } from "@/components/Globe";
import { INDIVIDUAL_URL } from "@/components/IndividualLink";
import { SiteHeader } from "@/components/SiteHeader";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GoLookAround — Curated journeys across India" },
      {
        name: "description",
        content:
          "Explore India on an interactive globe and map. Discover curated experiences, events and retreats, tailor a curation, then enquire on WhatsApp.",
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


function Landing() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [diving, setDiving] = useState(false);
  
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setMounted(true);
  }, []);

  const goIndia = () => {
    if (diving) return;
    if (fallback) {
      navigate({ to: "/india" });
      return;
    }
    setDiving(true);
  };

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
      <SiteHeader tone="ink" className="relative" showShare={false} />

      <main
        className={cn(
          "relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-6 px-5 pb-44 pt-2 transition-opacity duration-700 sm:px-8 sm:pb-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10",
          diving && "opacity-0",
        )}
      >
        <section className="stagger order-2 lg:order-1">
          <p className="eyebrow text-ink-muted">Interactive brochure &amp; playbook</p>
          <h1 className="mt-4 text-balance text-4xl leading-[1.02] min-[380px]:text-5xl sm:text-6xl lg:text-7xl">
            <SplitText text="India, curated for the way you travel." emphasis="curated" delay={150} />
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-muted sm:text-lg">
            Skip the endless tabs. Explore complete, thoughtfully planned journeys — experiences, events and
            retreats — then shape one to fit you or your group.
          </p>
        </section>

        <section className="order-1 mx-auto w-full max-w-[min(100%,72dvh,46rem)] lg:order-2">
          {fallback ? (
            <div className="grid aspect-square place-items-center rounded-full bg-brand/20 p-8 text-center">
              <div>
                <p className="font-display text-4xl">India</p>
                <p className="mt-2 text-sm text-ink-muted">Interactive globe unavailable — use the button below to continue.</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {mounted ? (
                <Globe
                  reducedMotion={reduced}
                  skipSignal={0}
                  diving={diving}
                  onSettled={() => {}}
                  onDived={() => navigate({ to: "/india" })}
                  onSelectIndia={goIndia}
                  onFocusCountry={() => {}}
                  onFallback={() => setFallback(true)}
                />
              ) : (
                <div className="skeleton-ink aspect-square w-full rounded-full" aria-hidden />
              )}
            </div>
          )}
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6" style={{ background: "linear-gradient(to top, var(--ink), transparent)" }}>
        <div className="mx-auto flex w-full max-w-md flex-col gap-2">
          <a
            href={INDIVIDUAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost-ink btn-lg w-full justify-center px-4 text-sm shadow-lg sm:hidden"
          >
            <User className="size-5" aria-hidden /> Looking for an individual?
            <ArrowUpRight className="size-5" aria-hidden />
          </a>
          <button type="button" className="btn btn-primary btn-lg flex w-full justify-center" onClick={goIndia}>
            GoLookAround India <ArrowRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
