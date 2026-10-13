import type { Price } from "@/data/types";
import { formatINR } from "@/lib/format";

export function PriceTag({ price, className }: { price: Price | null; className?: string }) {
  if (!price) {
    return (
      <div className={className}>
        <p className="text-sm font-bold">Request a quote</p>
        <p className="text-xs text-muted-foreground">Pricing not yet confirmed</p>
      </div>
    );
  }
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground">Starting from</p>
      <p className="text-lg font-extrabold leading-tight">
        {formatINR(price.amount)}
      </p>
    </div>
  );
}
