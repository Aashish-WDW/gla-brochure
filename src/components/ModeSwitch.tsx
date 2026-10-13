import { User, Users } from "lucide-react";
import type { Mode } from "@/data/types";
import { useTrip } from "@/lib/trip";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Mode; label: string; Icon: typeof User }[] = [
  { value: "individual", label: "Individual", Icon: User },
  { value: "group", label: "Group", Icon: Users },
];

/** Segmented control. Shows icon + label so state never relies on colour alone. */
export function ModeSwitch({ tone = "light", className }: { tone?: "light" | "ink"; className?: string }) {
  const { mode, setMode } = useTrip();
  return (
    <div
      role="radiogroup"
      aria-label="Travelling as"
      className={cn(
        "inline-flex rounded-full p-1",
        tone === "ink" ? "bg-ink-foreground/10 ring-1 ring-ink-foreground/20" : "bg-muted ring-1 ring-border",
        className,
      )}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setMode(value)}
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 text-[0.8rem] font-bold transition-colors sm:px-4",
              active
                ? "bg-brand text-primary-foreground shadow-sm"
                : tone === "ink"
                  ? "text-ink-muted hover:text-ink-foreground"
                  : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}
