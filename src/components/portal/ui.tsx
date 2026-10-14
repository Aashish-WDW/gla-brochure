import * as S from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NONE = "__none";

/** Styled dropdown. Use "" as a value for an empty/none option. */
export function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; hint?: string }[];
  label: string;
}) {
  return (
    <S.Root value={value || NONE} onValueChange={(v) => onChange(v === NONE ? "" : v)}>
      <S.Trigger
        aria-label={label}
        className="flex w-full items-center justify-between gap-2 rounded-xl bg-background px-3 py-2.5 text-left text-sm font-normal outline-none ring-1 ring-border hover:ring-brand/50 focus:ring-2 focus:ring-brand data-[state=open]:ring-2 data-[state=open]:ring-brand"
      >
        <S.Value />
        <S.Icon><ChevronDown className="size-4 text-muted-foreground" /></S.Icon>
      </S.Trigger>
      <S.Portal>
        <S.Content
          position="popper"
          sideOffset={6}
          className="z-[70] max-h-72 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl bg-card p-1.5 font-[Poppins,sans-serif] shadow-xl ring-1 ring-border/70 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <S.Viewport>
            {options.map((o) => (
              <S.Item
                key={o.value || NONE}
                value={o.value || NONE}
                className="relative flex cursor-pointer select-none items-center justify-between gap-2 rounded-xl py-2 pl-3 pr-8 text-sm outline-none data-[highlighted]:bg-brand-soft data-[highlighted]:text-brand-deep data-[state=checked]:font-semibold"
              >
                <S.ItemText>{o.label}</S.ItemText>
                {o.hint && <span className="text-xs text-muted-foreground">{o.hint}</span>}
                <S.ItemIndicator className="absolute right-2.5"><Check className="size-4 text-brand" /></S.ItemIndicator>
              </S.Item>
            ))}
          </S.Viewport>
        </S.Content>
      </S.Portal>
    </S.Root>
  );
}

export function PageHead({ title, sub, action }: { title: string; sub: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="mt-1.5 text-[17px] text-muted-foreground">{sub}</p>
      </div>
      {action}
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-3xl bg-card p-6 shadow-sm ring-1 ring-border/60 sm:p-8", className)}>{children}</div>;
}

export const primaryBtn =
  "inline-flex items-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-[17px] font-semibold text-primary-foreground shadow-lg shadow-brand/30 hover:bg-brand-deep";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl bg-background px-3 py-2.5 text-sm font-normal outline-none ring-1 ring-border focus:ring-2 focus:ring-brand";

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
