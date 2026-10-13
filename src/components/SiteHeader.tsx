import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/golookaround-logo.png.asset.json";
import { cn } from "@/lib/utils";
import { ShareButton } from "./ShareButton";

export function Logo({ tone = "light" }: { tone?: "light" | "ink" }) {
  return (
    <Link to="/" className="inline-flex shrink-0 items-center gap-1.5 sm:gap-2" aria-label="GoLookAround home">
      <img src={logoAsset.url} alt="" className="size-7 object-contain sm:size-8" />
      <span
        className={cn(
          "font-brand text-[15px] font-semibold sm:text-xl leading-none tracking-tight",
          tone === "ink" ? "text-brand-gradient" : "text-foreground",
        )}
      >
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
      <Logo tone={tone} />
      <div className="flex items-center gap-2 sm:gap-3">
        {showIndividual && (
          <>
            <a
              href={INDIVIDUAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(pill, "hidden sm:inline-flex")}
            >
              <User className="size-4 shrink-0" aria-hidden />
              Looking for an individual?
            </a>
            <a
              href={INDIVIDUAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Looking for an individual? Visit golookaround.com"
              className={cn(pill, "sm:hidden")}
            >
              <User className="size-4 shrink-0" aria-hidden />
            </a>
          </>
        )}
        {showShare && <ShareButton tone={tone} />}
      </div>
    </header>
  );
}
