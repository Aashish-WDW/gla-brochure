import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/golookaround-logo.png.asset.json";
import { ModeSwitch } from "./ModeSwitch";
import { cn } from "@/lib/utils";

export function Logo({ tone = "light" }: { tone?: "light" | "ink" }) {
  return (
    <Link to="/" className="inline-flex shrink-0 items-center gap-1.5 sm:gap-2" aria-label="GoLookAround home">
      <img src={logoAsset.url} alt="" className="size-7 object-contain sm:size-8" />
      <span
        className={cn(
          "font-brand text-[15px] font-semibold sm:text-xl leading-none tracking-tight",
          tone === "ink" ? "text-ink-foreground" : "text-foreground",
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
  showMode = true,
}: {
  tone?: "light" | "ink";
  className?: string;
  showMode?: boolean;
}) {
  return (
    <header
      className={cn(
        "z-30 flex items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-4",
        tone === "ink" ? "on-ink" : "shadow-below bg-background/85 backdrop-blur-md",
        className,
      )}
    >
      <Logo tone={tone} />
      {showMode && <ModeSwitch tone={tone} />}
    </header>
  );
}
