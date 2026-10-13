import { createElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealState = "hidden" | "shown";

/** Flags an element once it scrolls into view. Honors reduced motion. */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [state, setState] = useState<RevealState>("hidden");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setState("shown");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          requestAnimationFrame(() => setState("shown"));
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, state] as const;
}

type Tag = "div" | "li" | "section" | "p" | "h2" | "ul" | "span";

/** Fades and lifts its content in when it scrolls into view. */
export function Reveal({
  as = "div",
  delay = 0,
  className,
  children,
}: {
  as?: Tag;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const [ref, state] = useReveal<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      "data-reveal": state,
      className: cn("reveal", className),
      style: { "--reveal-delay": `${delay}ms` } as CSSProperties,
    },
    children,
  );
}

/** Word-by-word rising headline. Put it inside an h1/h2. */
export function SplitText({
  text,
  emphasis,
  delay = 0,
}: {
  text: string;
  /** A word that gets the brand gradient. */
  emphasis?: string;
  delay?: number;
}) {
  const [ref, state] = useReveal<HTMLSpanElement>(0.3);
  const words = text.split(" ");
  return (
    <span ref={ref} data-reveal={state} className="split" style={{ "--split-delay": `${delay}ms` } as CSSProperties}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={`${w}-${i}`}>
            <span className="word-mask">
              <span
                className={cn("word", emphasis && w.replace(/[^\p{L}]/gu, "") === emphasis && "text-brand-gradient")}
                style={{ "--i": i } as CSSProperties}
              >
                {w}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </span>
  );
}
