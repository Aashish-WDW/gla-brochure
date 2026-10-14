import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { IndiaMap } from "@/components/IndiaMap";
import { inputCls, PageHead, Panel, Toggle } from "@/components/portal/ui";
import { REGIONS } from "@/data/regions";
import { setCms, useCms } from "@/lib/cms";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portal/states")({
  head: () => ({ meta: [{ title: "States — GoLookAround B2B Portal" }] }),
  component: StatesPage,
});

function StatesPage() {
  const cms = useCms();
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const active = useMemo(() => new Set(REGIONS.filter((r) => cms.enabledStates[r.id]).map((r) => r.id)), [cms.enabledStates]);
  const list = REGIONS.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
  const set = (id: string, v: boolean) => setCms((s) => ({ ...s, enabledStates: { ...s.enabledStates, [id]: v } }));

  return (
    <div className="space-y-8">
      <PageHead title="States" sub="Tap a state on the map or use the switches. Disabled states are hidden from the India page." />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <Panel className="lg:sticky lg:top-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold">India map</h3>
            <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-sm font-bold text-brand-deep">{active.size} enabled</span>
          </div>
          <IndiaMap
            activeIds={active}
            selectedId={picked}
            onSelect={(id) => {
              setPicked(id);
              set(id, !active.has(id));
            }}
            className="mx-auto mt-4 max-h-[62dvh] max-w-lg"
          />
          <div className="mt-3 flex gap-5 text-xs font-bold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-sm bg-brand/80" /> Enabled</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded-sm bg-muted ring-1 ring-border" /> Disabled</span>
            <span>Click a state to switch it</span>
          </div>
        </Panel>
        <Panel>
          <input className={inputCls} placeholder="Search states" value={q} onChange={(e) => setQ(e.target.value)} />
          <ul className="mt-4 max-h-[62dvh] divide-y overflow-y-auto pr-1">
            {list.map((r) => {
              const on = active.has(r.id);
              const count = cms.curations.filter((c) => c.stateId === r.id).length;
              return (
                <li key={r.id} className={cn("flex items-center justify-between gap-3 rounded-xl px-2 py-3", picked === r.id && "bg-brand-soft")}>
                  <div>
                    <p className="text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{count} curations · {on ? "Enabled" : "Disabled"}</p>
                  </div>
                  <Toggle on={on} onChange={(v) => { setPicked(r.id); set(r.id, v); }} label={`Enable ${r.name}`} />
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
