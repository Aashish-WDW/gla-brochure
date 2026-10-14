import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { useEffect, useMemo, useState } from "react";
import { stateSummary } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type StateFeature = Feature<Geometry, { id: string; name: string }>;

const W = 640;
const H = 720;

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
  /** Portal mode: colour by enabled set and hide listing counts. */
  activeIds?: Set<string>;
}

export function IndiaMap({ selectedId, onSelect, className, activeIds }: Props) {
  const [features, setFeatures] = useState<StateFeature[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let live = true;
    import("@/data/india-states.json")
      .then((m) => live && setFeatures(((m.default ?? m) as unknown as FeatureCollection).features as StateFeature[]))
      .catch(() => live && setError(true));
    return () => {
      live = false;
    };
  }, []);

  const shapes = useMemo(() => {
    if (!features) return null;
    const fc = { type: "FeatureCollection", features } as FeatureCollection;
    const proj = geoMercator().fitExtent(
      [
        [16, 16],
        [W - 16, H - 16],
      ],
      fc,
    );
    const path = geoPath(proj);
    return features.map((f) => {
      const summary = stateSummary(f.properties.id);
      const c = path.centroid(f);
      return { f, d: path(f) ?? "", centroid: c, count: summary.total };
    });
  }, [features]);

  if (error) {
    return (
      <div className={cn("grid place-items-center rounded-3xl border p-8 text-center", className)}>
        <p className="text-sm text-muted-foreground">
          The map couldn't load. Use the destination list to keep exploring.
        </p>
      </div>
    );
  }

  if (!shapes) {
    return <div className={cn("skeleton aspect-[8/9] w-full", className)} aria-busy="true" aria-label="Loading map" />;
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("h-auto w-full select-none", className)}
      role="group"
      aria-label="Map of India. Select a state or union territory."
    >
      {shapes.map(({ f, d, count }) => {
        const { id, name } = f.properties;
        const selected = selectedId === id;
        const has = activeIds ? activeIds.has(id) : count > 0;
        return (
          <path
            key={id}
            d={d}
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            aria-label={activeIds ? `${name}, ${has ? "enabled" : "disabled"}` : `${name}${has ? `, ${count} listings` : ", no verified listings yet"}`}
            className={cn(
              "map-state",
              selected
                ? "fill-brand-deep"
                : has
                  ? "fill-brand/80 hover:fill-brand-deep"
                  : "fill-muted hover:fill-border",
            )}
            strokeWidth={1.25}
            strokeLinejoin="round"
            onClick={() => onSelect(id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(id);
              }
            }}
          >
            <title>{name}</title>
          </path>
        );
      })}
      {/* Count markers — only where real (mock) content exists. */}
      {shapes
        .filter((s) => !activeIds && s.count > 0)
        .map(({ f, centroid, count }) => (
          <g key={f.properties.id} transform={`translate(${centroid[0]} ${centroid[1]})`} className="pointer-events-none">
            <circle r={13} className="fill-ink-foreground stroke-brand-deep" strokeWidth={2} />
            <text textAnchor="middle" dy="0.35em" className="fill-ink text-[12px] font-extrabold">
              {count}
            </text>
          </g>
        ))}
    </svg>
  );
}
