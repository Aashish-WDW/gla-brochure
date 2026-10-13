import { Check, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Shares the current page: native share sheet where available, otherwise copies the link. */
export function ShareButton({ tone = "light", className }: { tone?: "light" | "ink"; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function share() {
    const url = window.location.href;
    const data = { title: document.title, text: "Take a look at GoLookAround India", url };
    try {
      if (typeof navigator.share === "function") {
        await navigator.share(data);
        return;
      }
    } catch (e) {
      if ((e as DOMException)?.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className={cn(
        "btn btn-sm shrink-0 rounded-full px-2.5",
        tone === "ink" ? "btn-ghost-ink" : "btn-outline",
        className,
      )}
      aria-label={copied ? "Link copied" : "Share this page"}
      title={copied ? "Link copied" : "Share"}
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Share2 className="size-4" aria-hidden />}
      <span className="sr-only">{copied ? "Link copied" : "Share this page"}</span>
    </button>
  );
}
