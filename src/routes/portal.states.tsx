import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { inputCls, PageHead, Panel, Toggle } from "@/components/portal/ui";
import { REGIONS } from "@/data/regions";
import { setCms, useCms } from "@/lib/cms";

export const Route = createFileRoute("/portal/states")({
  head: () => ({ meta: [{ title: "States — GoLookAround Partner Portal" }] }),
  component: StatesPage,
});

function StatesPage() {
  const cms = useCms();
  const [q, setQ] = useState("");
  const list = REGIONS.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
  const set = (id: string, v: boolean) =>
    setCms((s) => ({ ...s, enabledStates: { ...s.enabledStates, [id]: v } }));
  return (
    <div className="space-y-6">
      <PageHead title="States" sub="Disabled states are hidden from the India destination list." />
      <Panel>
        <input className={inputCls} placeholder="Search states" value={q} onChange={(e) => setQ(e.target.value)} />
        <ul className="mt-4 divide-y">
          {list.map((r) => {
            const on = !!cms.enabledStates[r.id];
            const count = cms.curations.filter((c) => c.stateId === r.id).length;
            return (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{count} curations · {on ? "Enabled" : "Disabled"}</p>
                </div>
                <Toggle on={on} onChange={(v) => set(r.id, v)} label={`Enable ${r.name}`} />
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}
