import { geoContains, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import type { Feature, FeatureCollection } from "geojson";
import { useCallback, useEffect, useRef, useState } from "react";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";

const INDIA_ID = "356";
/** Where India sits: longitude / latitude we centre the globe on. */
const TARGET = { lon: 79, lat: 19 };
const INTRO_MS = 6500;
const DIVE_MS = 900;

type Country = Feature & { id?: string; properties: { name: string } };

interface GlobeProps {
  reducedMotion: boolean;
  /** Increment to jump straight to the settled view. */
  skipSignal: number;
  diving: boolean;
  onSettled: () => void;
  onDived: () => void;
  onSelectIndia: () => void;
  onFocusCountry: (name: string | null) => void;
  onFallback: () => void;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function Globe({
  reducedMotion,
  skipSignal,
  diving,
  onSettled,
  onDived,
  onSelectIndia,
  onFocusCountry,
  onFallback,
}: GlobeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markerRef = useRef<HTMLButtonElement>(null);
  const [countries, setCountries] = useState<Country[] | null>(null);
  const [settled, setSettled] = useState(false);

  const progress = useRef(reducedMotion ? 1 : 0);
  const diveProgress = useRef(0);
  const hover = useRef<string | null>(null);
  const sizeRef = useRef(0);
  const colors = useRef({ sea: "", land: "", landHover: "", line: "", india: "", indiaHover: "", glow: "" });
  const raf = useRef(0);
  const settledNotified = useRef(false);

  const cb = useRef({ onSettled, onDived, onSelectIndia, onFocusCountry });
  cb.current = { onSettled, onDived, onSelectIndia, onFocusCountry };

  // Load geometry lazily so the landing shell paints first.
  useEffect(() => {
    let live = true;
    import("world-atlas/countries-110m.json")
      .then((mod) => {
        if (!live) return;
        const topo = (mod.default ?? mod) as unknown as Topology;
        const fc = feature(topo, topo.objects["countries"]!) as unknown as FeatureCollection;
        setCountries(fc.features as Country[]);
      })
      .catch(() => live && onFallback());
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const projection = useRef(geoOrthographic().clipAngle(90).precision(0.6));

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const list = countries;
    if (!canvas || !list || !sizeRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = sizeRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(size * dpr)) {
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const p = easeOutCubic(progress.current);
    const lon = reducedMotion ? TARGET.lon : TARGET.lon - 300 * (1 - p);
    const lat = TARGET.lat * p + 8 * (1 - p);
    const dive = easeInOut(diveProgress.current);
    const zoom = (0.5 + 0.5 * p) * (1 + 2.4 * dive);
    const R = (size / 2) * 0.88 * zoom;

    const proj = projection.current;
    proj.translate([size / 2, size / 2]).scale(R).rotate([-lon, -lat]);
    const path = geoPath(proj, ctx);
    const c = colors.current;

    // Atmosphere glow
    const glow = ctx.createRadialGradient(size / 2, size / 2, R * 0.96, size / 2, size / 2, R * 1.22);
    glow.addColorStop(0, c.glow);
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, R * 1.22, 0, Math.PI * 2);
    ctx.fill();

    // Sea
    ctx.beginPath();
    path({ type: "Sphere" } as GeoPermissibleObjects);
    ctx.fillStyle = c.sea;
    ctx.fill();

    // Graticule
    ctx.beginPath();
    path(geoGraticule10());
    ctx.strokeStyle = c.line;
    ctx.lineWidth = 0.6;
    ctx.stroke();

    // Countries
    ctx.lineWidth = 0.6;
    for (const f of list) {
      const isIndia = f.id === INDIA_ID;
      if (isIndia) continue;
      ctx.beginPath();
      path(f as GeoPermissibleObjects);
      ctx.fillStyle = hover.current === f.id ? c.landHover : c.land;
      ctx.fill();
      ctx.strokeStyle = c.sea;
      ctx.stroke();
    }
    // India last, with glow
    const india = list.find((f) => f.id === INDIA_ID);
    if (india) {
      ctx.save();
      ctx.shadowColor = c.india;
      ctx.shadowBlur = 22 * Math.max(p, 0.2);
      ctx.beginPath();
      path(india as GeoPermissibleObjects);
      ctx.fillStyle = hover.current === INDIA_ID ? c.indiaHover : c.india;
      ctx.fill();
      ctx.restore();
    }

    // Sphere rim
    ctx.beginPath();
    path({ type: "Sphere" } as GeoPermissibleObjects);
    ctx.strokeStyle = c.line;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Keyboard/touch marker follows India on screen.
    const marker = markerRef.current;
    if (marker) {
      const pt = proj([TARGET.lon - 1, TARGET.lat + 2]);
      if (pt) marker.style.transform = `translate(${pt[0]}px, ${pt[1]}px) translate(-50%, -50%)`;
    }
  }, [countries, reducedMotion]);

  // Resolve design-token colours for the canvas once.
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const v = (n: string) => cs.getPropertyValue(n).trim();
    colors.current = {
      sea: v("--globe-sea"),
      land: v("--globe-land"),
      landHover: v("--globe-land-hover"),
      line: v("--globe-line"),
      india: v("--globe-india"),
      indiaHover: v("--globe-india-hover"),
      glow: v("--brand-glow"),
    };
    if (!document.createElement("canvas").getContext("2d")) onFallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Size observer
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      sizeRef.current = Math.round(el.clientWidth);
      draw();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [draw]);

  // Intro animation loop
  useEffect(() => {
    if (!countries) return;
    let start: number | null = null;
    const startProgress = progress.current;
    const tick = (now: number) => {
      if (start === null) start = now;
      if (progress.current < 1) {
        progress.current = Math.min(1, startProgress + (now - start) / INTRO_MS);
      }
      draw();
      if (progress.current < 1) {
        raf.current = requestAnimationFrame(tick);
      } else if (!settledNotified.current) {
        settledNotified.current = true;
        setSettled(true);
        cb.current.onSettled();
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [countries, draw]);

  // Skip
  useEffect(() => {
    if (skipSignal > 0) {
      progress.current = 1;
      draw();
      if (!settledNotified.current) {
        settledNotified.current = true;
        setSettled(true);
        cb.current.onSettled();
      }
    }
  }, [skipSignal, draw]);

  // Zoom into India
  useEffect(() => {
    if (!diving) return;
    progress.current = 1;
    if (reducedMotion) {
      cb.current.onDived();
      return;
    }
    let start: number | null = null;
    let id = 0;
    const tick = (now: number) => {
      if (start === null) start = now;
      diveProgress.current = Math.min(1, (now - start) / DIVE_MS);
      draw();
      if (diveProgress.current < 1) id = requestAnimationFrame(tick);
      else cb.current.onDived();
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [diving, draw, reducedMotion]);

  const hit = useCallback(
    (clientX: number, clientY: number): Country | null => {
      const canvas = canvasRef.current;
      if (!canvas || !countries) return null;
      const r = canvas.getBoundingClientRect();
      const ll = projection.current.invert?.([clientX - r.left, clientY - r.top]);
      if (!ll) return null;
      // invert returns NaN outside the sphere
      if (!Number.isFinite(ll[0]) || !Number.isFinite(ll[1])) return null;
      const india = countries.find((f) => f.id === INDIA_ID);
      if (india && geoContains(india as GeoPermissibleObjects, ll)) return india;
      return countries.find((f) => geoContains(f as GeoPermissibleObjects, ll)) ?? null;
    },
    [countries],
  );

  const onMove = (e: React.PointerEvent) => {
    if (!settled) return;
    const f = hit(e.clientX, e.clientY);
    const next = f?.id ?? null;
    if (next !== hover.current) {
      hover.current = next;
      draw();
      cb.current.onFocusCountry(f ? f.properties.name : null);
    }
    if (canvasRef.current) canvasRef.current.style.cursor = f?.id === INDIA_ID ? "pointer" : f ? "not-allowed" : "default";
  };

  const onClick = (e: React.MouseEvent) => {
    if (!settled) return;
    const f = hit(e.clientX, e.clientY);
    if (!f) return;
    if (f.id === INDIA_ID) cb.current.onSelectIndia();
    else cb.current.onFocusCountry(f.properties.name);
  };

  return (
    <div ref={wrapRef} className="relative aspect-square w-full" style={{ opacity: countries ? 1 : 0.0001 }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full touch-manipulation"
        role="img"
        aria-label="Interactive globe. India is the only active destination; all other countries are coming soon."
        onPointerMove={onMove}
        onPointerLeave={() => {
          if (hover.current) {
            hover.current = null;
            draw();
            cb.current.onFocusCountry(null);
          }
        }}
        onClick={onClick}
      />
      <button
        ref={markerRef}
        type="button"
        onClick={() => cb.current.onSelectIndia()}
        onMouseEnter={() => cb.current.onFocusCountry("India")}
        onFocus={() => cb.current.onFocusCountry("India")}
        onBlur={() => cb.current.onFocusCountry(null)}
        aria-label="India — explore destinations"
        className="absolute left-0 top-0 grid size-14 place-items-center rounded-full transition-opacity duration-700"
        style={{ opacity: settled && !diving ? 1 : 0, pointerEvents: settled ? "auto" : "none" }}
        tabIndex={settled ? 0 : -1}
      >
        <span className="absolute size-8 rounded-full bg-brand" style={{ animation: "pulse-ring 2.2s ease-out infinite" }} />
        <span className="relative size-3 rounded-full bg-ink-foreground ring-4 ring-brand" />
      </button>
    </div>
  );
}
