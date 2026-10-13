import { Check, Copy, MessageCircle, Phone } from "lucide-react";
import { useMemo, useState } from "react";
import { Modal } from "./Modal";
import { ModeSwitch } from "./ModeSwitch";
import { PartyControls } from "./PartyControls";
import { useTrip } from "@/lib/trip";
import { buildEnquiryMessage, buildWhatsAppUrl, WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/whatsapp";

export interface EnquirySubject {
  subject: string;
  reference?: string;
  destination?: string;
  changes?: string[];
}

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  context: EnquirySubject;
}

export function EnquiryDialog({ open, onOpenChange, context }: Props) {
  const { mode, people, groupType } = useTrip();
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  const payload = useMemo(
    () => ({
      ...context,
      mode,
      partySize: people,
      groupType: mode === "group" ? groupType : undefined,
      preferredDate: date,
      notes,
    }),
    [context, mode, people, groupType, date, notes],
  );
  const message = buildEnquiryMessage(payload);
  const url = buildWhatsAppUrl(payload);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Start a conversation"
      description="We'll open WhatsApp with this message ready. Nothing is booked or charged here."
    >
      <div className="space-y-5">
        <div className="rounded-2xl bg-brand-soft p-4">
          <p className="eyebrow text-brand-deep">Enquiring about</p>
          <p className="mt-1 font-display text-xl leading-snug">{context.subject}</p>
          {context.destination && <p className="text-sm text-muted-foreground">{context.destination}</p>}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <ModeSwitch />
          <PartyControls compact />
        </div>

        <div>
          <label htmlFor="enq-date" className="mb-1.5 block text-xs font-bold text-muted-foreground">
            Preferred date <span className="font-medium">(optional)</span>
          </label>
          <input id="enq-date" type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <label htmlFor="enq-notes" className="mb-1.5 block text-xs font-bold text-muted-foreground">
            Anything you'd like to change? <span className="font-medium">(optional)</span>
          </label>
          <textarea
            id="enq-notes"
            rows={3}
            maxLength={400}
            className="field !min-h-24 py-3"
            placeholder="Dietary needs, accessibility, a different pace…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div>
          <p className="mb-1.5 text-xs font-bold text-muted-foreground">Message preview</p>
          <p className="rounded-2xl border bg-secondary p-4 text-sm leading-relaxed" data-testid="enquiry-preview">
            {message}
          </p>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-lg w-full"
        >
          <MessageCircle className="size-5" aria-hidden /> Enquire on WhatsApp
        </a>

        <div className="rounded-2xl border p-4 text-sm">
          <p className="font-bold">Can't open WhatsApp?</p>
          <p className="mt-1 text-muted-foreground">
            Message us on <span className="font-bold text-foreground">{WHATSAPP_DISPLAY}</span> and paste your enquiry.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="btn btn-outline btn-sm" onClick={copy}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy message"}
            </button>
            <a className="btn btn-outline btn-sm" href={`tel:+${WHATSAPP_NUMBER}`}>
              <Phone className="size-4" /> Call
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
