import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

/** Plays a torn-paper reveal whenever the route path changes. */
export function PaperTear() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const first = useRef(true);
  const [key, setKey] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setKey((k) => k + 1);
    setShow(true);
    const t = setTimeout(() => setShow(false), 950);
    return () => clearTimeout(t);
  }, [path]);

  if (!show) return null;
  return (
    <div key={key} className="paper-tear" aria-hidden>
      <div className="paper-tear__half paper-tear__half--left" />
      <div className="paper-tear__half paper-tear__half--right" />
    </div>
  );
}
