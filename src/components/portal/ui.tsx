import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHead({ title, sub, action }: { title: string; sub: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl sm:text-4xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      </div>
      {action}
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-3xl bg-card p-5 shadow-sm sm:p-6", className)}>{children}</div>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border bg-background px-3 py-2.5 text-sm font-normal outline-none focus:ring-2 focus:ring-brand";

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", on ? "bg-brand" : "bg-muted ring-1 ring-border")}
    >
      <span className={cn("absolute top-0.5 size-5 rounded-full bg-background shadow transition-all", on ? "left-[1.375rem]" : "left-0.5")} />
    </button>
  );
}
