import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/golookaround-logo.png.asset.json";
import { ModeSwitch } from "./ModeSwitch";
import { cn } from "@/lib/utils";

export function Logo({ tone = "light" }: { tone?: "light" | "ink" }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2" aria-label="GoLookAround home">
      <img src={logoAsset.url} alt="" className="size-8 object-contain" />
      <span
        className={cn(
          "font-brand text-xl font-semibold leading-none tracking-tight",
          tone === "ink" ? "text-ink-foreground" : "text-foreground",
        )}
      >
        GoLookAround
      </span>
    </Link>
  );
}

export function SiteHeader({ tone = "light", className }: { tone?: "light" | "ink"; className?: string }) {
  return (
    <header
      className={cn(
        "z-30 flex items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-4",
        tone === "ink" ? "on-ink" : "border-b bg-background/85 backdrop-blur-md",
        className,
      )}
    >
      <Logo tone={tone} />
      <ModeSwitch tone={tone} />
    </header>
  );
}
