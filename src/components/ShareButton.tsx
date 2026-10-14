import { Check, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Shares the current page: native share sheet where available, otherwise copies the link. */
export function ShareButton({
  tone = "light",
  className,
}: {
  tone?: "light" | "ink";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(t);
  }, [copied]);

  function copyWithSelection(url: string) {
    const field = document.createElement("textarea");
    field.value = url;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const didCopy = document.execCommand("copy");
    field.remove();
    return didCopy;
  }

  async function copyLink(url: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        return true;
      }
    } catch {
      // Some embedded browsers expose Clipboard API but deny permission.
    }

    try {
      return copyWithSelection(url);
    } catch {
      return false;
    }
  }

  async function share() {
    const url = window.location.href;
    const data = { title: document.title, text: "Take a look at GoLookAround India", url };
    try {
      const prefersNativeShare = window.matchMedia("(pointer: coarse)").matches;
      const canNativeShare =
        prefersNativeShare &&
        typeof navigator.share === "function" &&
        (typeof navigator.canShare !== "function" || navigator.canShare(data));
      if (canNativeShare) {
        await navigator.share(data);
        setCopied(true);
        return;
      }
    } catch (e) {
      if ((e as DOMException)?.name === "AbortError") return;
    }

    if (await copyLink(url)) {
      setCopied(true);
    } else {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className={cn(
        "btn btn-sm shrink-0 rounded-full px-3",
        tone === "ink" ? "btn-ghost-ink" : "btn-outline",
        className,
      )}
      aria-label={copied ? "Link copied" : "Share this page"}
      aria-live="polite"
      title={copied ? "Link copied" : "Share"}
    >
      {copied ? (
        <Check className="size-4" aria-hidden />
      ) : (
        <Share2 className="size-4" aria-hidden />
      )}
      <span className="text-xs font-bold">{copied ? "Copied" : "Share"}</span>
    </button>
  );
}
