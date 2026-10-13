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
}: {
  tone?: "light" | "ink";
  className?: string;
  showShare?: boolean;
}) {
  return (
    <header
      className={cn(
        "z-30 flex items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-4",
        tone === "ink" && "on-ink",
        className,
      )}
    >
      <Logo tone={tone} />
      {showShare && <ShareButton tone={tone} />}
    </header>
  );
}
