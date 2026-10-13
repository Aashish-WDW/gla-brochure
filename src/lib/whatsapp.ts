import type { Mode } from "@/data/types";

/** International format, no "+" — required by wa.me. */
export const WHATSAPP_NUMBER = "919390631008";
export const WHATSAPP_DISPLAY = "+91 93906 31008";

export interface EnquiryContext {
  /** Itinerary or experience name. */
  subject: string;
  /** Optional reference such as an itinerary ID. */
  reference?: string | undefined;
  destination?: string | undefined;
  mode: Mode;
  partySize?: number | undefined;
  groupType?: string | undefined;
  preferredDate?: string | undefined;
  changes?: string[] | undefined;
  notes?: string | undefined;
}

const clean = (s?: string) => (s ?? "").trim();

/** Builds the human-readable message. Optional fields that are empty are omitted. */
export function buildEnquiryMessage(ctx: EnquiryContext): string {
  const subject = clean(ctx.subject);
  const ref = clean(ctx.reference);
  const dest = clean(ctx.destination);
  const modeLabel = ctx.mode === "group" ? "Group" : "Individual";

  let first = `Hi GoLookAround! I'm enquiring about ${subject}`;
  if (ref) first += ` (ref ${ref})`;
  if (dest) first += ` in ${dest}`;
  first += `. I'm interested in ${modeLabel} options.`;

  const parts = [first];
  if (ctx.partySize && ctx.partySize > 0) {
    parts.push(`${ctx.mode === "group" ? "Group size" : "Party size"}: ${ctx.partySize}.`);
  }
  if (ctx.mode === "group" && clean(ctx.groupType)) parts.push(`Group type: ${clean(ctx.groupType)}.`);
  if (clean(ctx.preferredDate)) parts.push(`Preferred date: ${clean(ctx.preferredDate)}.`);

  const changes = [...(ctx.changes ?? []), clean(ctx.notes)].filter(Boolean);
  if (changes.length) parts.push(`Requested changes: ${changes.join("; ")}.`);

  parts.push("Please share availability and a confirmed quote.");
  return parts.join(" ");
}

export function buildWhatsAppUrl(ctx: EnquiryContext): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildEnquiryMessage(ctx))}`;
}
