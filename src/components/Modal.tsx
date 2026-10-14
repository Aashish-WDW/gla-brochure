import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string | undefined;
  children: ReactNode;
  footer?: ReactNode;
  /** "side" docks to the right on desktop, bottom sheet on mobile. */
  variant?: "center" | "side";
  /** Allows media-and-content dialogs to use a wider desktop canvas. */
  size?: "default" | "wide";
  /** Lets media-led content sit directly beneath a floating close button. */
  immersive?: boolean;
}

/** Accessible dialog: centred card on desktop, bottom sheet on phones. */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  variant = "center",
  size = "default",
  immersive = false,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed z-50 flex w-full max-w-full max-h-[92dvh] flex-col overflow-hidden bg-background shadow-2xl outline-none",
            "inset-x-0 bottom-0 rounded-t-3xl data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-10",
            variant === "center" &&
              "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(92vw,40rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl",
            variant === "center" && size === "wide" && "lg:w-[min(92vw,68rem)]",
            variant === "side" &&
              "sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[min(94vw,30rem)] sm:rounded-none sm:rounded-l-3xl",
          )}
        >
          <div
            className={cn(
              "flex items-start justify-between gap-4",
              immersive
                ? "absolute right-4 top-4 z-20"
                : "relative z-10 px-5 py-4 shadow-[0_12px_30px_-26px_oklch(0.145_0.02_265_/_55%)] sm:px-7",
            )}
          >
            <div className={cn("min-w-0", immersive && "sr-only")}>
              <Dialog.Title className="break-words font-display text-xl leading-tight min-[380px]:text-2xl">
                {title}
              </Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  {description}
                </Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{title}</Dialog.Description>
              )}
            </div>
            <Dialog.Close
              className="grid size-10 shrink-0 place-items-center rounded-full bg-background/92 shadow-lg backdrop-blur-md transition-colors hover:bg-muted"
              aria-label="Close"
            >
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <div className={cn("overflow-y-auto", immersive ? "p-0" : "px-5 py-5 sm:px-7")}>
            {children}
          </div>
          {footer && (
            <div className="relative z-20 shrink-0 border-t bg-background/95 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-above backdrop-blur sm:px-7">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
