import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

const DISPLAY_MS = 720;

/** A brief branded loading screen shown between route changes. */
export function LoadingScreen() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const first = useRef(true);
  const [key, setKey] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    setKey((current) => current + 1);
    setShow(true);
    const timer = window.setTimeout(() => setShow(false), DISPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [path]);

  if (!show) return null;

  return (
    <div key={key} className="route-loading-screen" role="status" aria-label="Loading page">
      <div className="flex flex-col items-center gap-5 text-center">
        <span className="grid size-20 place-items-center overflow-hidden rounded-full bg-black shadow-2xl">
          <img src="/golookaround-site-logo.png" alt="" className="size-full object-contain" />
        </span>
        <span className="text-brand-gradient font-brand text-3xl font-semibold leading-none">
          GoLookAround
        </span>
        <span
          className="size-8 animate-spin rounded-full border-4 border-white/20 border-t-brand-light"
          aria-hidden
        />
        <span className="sr-only">Loading your next view</span>
      </div>
    </div>
  );
}
