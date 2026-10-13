import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** "side" docks to the right on desktop, bottom sheet on mobile. */
  variant?: "center" | "side";
}

/** Accessible dialog: centred card on desktop, bottom sheet on phones. */
export function Modal({ open, onOpenChange, title, description, children, variant = "center" }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed z-50 flex max-h-[92dvh] flex-col overflow-hidden bg-background shadow-2xl outline-none",
            "inset-x-0 bottom-0 rounded-t-3xl data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-10",
            variant === "center" &&
              "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(92vw,40rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl",
            variant === "side" &&
              "sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[min(94vw,30rem)] sm:rounded-none sm:rounded-l-3xl",
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b px-5 py-4 sm:px-7">
            <div>
              <Dialog.Title className="font-display text-2xl leading-tight">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  {description}
                </Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{title}</Dialog.Description>
              )}
            </div>
            <Dialog.Close
              className="grid size-10 shrink-0 place-items-center rounded-full border transition-colors hover:bg-muted"
              aria-label="Close"
            >
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <div className="overflow-y-auto px-5 py-5 sm:px-7">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
