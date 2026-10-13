import { ArrowUpRight, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const INDIVIDUAL_URL = "https://golookaround.com";

/** GoLookAround India is for groups. Individual travellers are sent to the main site. */
export function IndividualLink({
  className,
  short = false,
}: {
  className?: string;
  short?: boolean;
}) {
  return (
    <a
      href={INDIVIDUAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-bold text-brand-deep underline-offset-4 hover:underline",
        className,
      )}
    >
      <User className="size-4 shrink-0" aria-hidden />
      <span>{short ? "Looking for an individual?" : "Looking for an individual? Visit golookaround.com"}</span>
      <ArrowUpRight className="size-4 shrink-0" aria-hidden />
    </a>
  );
}
