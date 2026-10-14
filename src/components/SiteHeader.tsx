import { Link } from "@tanstack/react-router";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { INDIVIDUAL_URL } from "./IndividualLink";
import { ShareButton } from "./ShareButton";

export function Logo() {
  return (
    <Link
      to="/"
      className="inline-flex shrink-0 items-center gap-2.5 sm:gap-3"
      aria-label="GoLookAround home"
    >
      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-black sm:size-11 lg:size-12">
        <img src="/golookaround-site-logo.png" alt="" className="size-full object-contain" />
      </span>
      <span className="text-brand-gradient font-brand text-lg font-semibold leading-none tracking-tight min-[360px]:text-xl sm:text-2xl lg:text-3xl">
        GoLookAround
      </span>
    </Link>
  );
}

export function SiteHeader({
  tone = "light",
  className,
  showShare = true,
  showIndividual = true,
}: {
  tone?: "light" | "ink";
  className?: string;
  showShare?: boolean;
  showIndividual?: boolean;
}) {
  const pill = cn("btn btn-sm", tone === "ink" ? "btn-ghost-ink" : "btn-outline");
  return (
    <header
      className={cn(
        "z-30 flex items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-4",
        tone === "ink" && "on-ink",
        className,
      )}
    >
      <Logo />
      <div className="flex items-center gap-2 sm:gap-3">
        {showIndividual && (
          <a
            href={INDIVIDUAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(pill, "hidden sm:inline-flex")}
          >
            <User className="size-4 shrink-0" aria-hidden />
            Looking for an individual?
          </a>
        )}
        {showShare && <ShareButton tone={tone} />}
      </div>
    </header>
  );
}
