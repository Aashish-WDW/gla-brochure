import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
  className?: string | undefined;
}

export function Stepper({ label, value, min, max, step = 1, onChange, className }: StepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div
      className={cn("inline-flex items-center rounded-full border bg-background", className)}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className="grid size-11 place-items-center rounded-full hover:bg-muted disabled:opacity-40"
        onClick={() => onChange(clamp(value - step))}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
      >
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        className="w-12 border-0 bg-transparent text-center text-base font-bold [appearance:textfield] focus-visible:outline-offset-4 [&::-webkit-inner-spin-button]:appearance-none"
        value={value}
        min={min}
        max={max}
        aria-label={label}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n)) onChange(clamp(Math.round(n)));
        }}
      />
      <button
        type="button"
        className="grid size-11 place-items-center rounded-full hover:bg-muted disabled:opacity-40"
        onClick={() => onChange(clamp(value + step))}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
