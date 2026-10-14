import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Field, inputCls, PageHead, Panel, primaryBtn } from "@/components/portal/ui";
import { REGIONS } from "@/data/regions";
import { getRegion } from "@/lib/catalog";
import { setCms, uid, useCms } from "@/lib/cms";

export const Route = createFileRoute("/portal/destinations")({
  head: () => ({ meta: [{ title: "Destinations — GoLookAround B2B Portal" }] }),
  component: DestinationsPage,
});

function DestinationsPage() {
  const cms = useCms();
  const [name, setName] = useState("");
  const [stateId, setStateId] = useState(REGIONS[0]!.id);
  const [description, setDescription] = useState("");

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCms((s) => ({ ...s, destinations: [...s.destinations, { id: uid("d"), name: name.trim(), stateId, description }] }));
    setName("");
    setDescription("");
  };

  return (
    <div className="space-y-8">
      <PageHead title="Destinations" sub="Cities and places inside a state that curations can belong to." />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Panel>
          <form onSubmit={add} className="space-y-4">
            <h3 className="text-xl font-bold">Add destination</h3>
            <Field label="Name"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required /></Field>
            <Field label="State">
              <select className={inputCls} value={stateId} onChange={(e) => setStateId(e.target.value)}>
                {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name}{cms.enabledStates[r.id] ? "" : " (disabled)"}</option>)}
              </select>
            </Field>
            <Field label="Description"><textarea rows={3} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
            <button className={primaryBtn}><Plus className="size-5" /> Add destination</button>
          </form>
        </Panel>
        <Panel>
          <h3 className="text-xl font-bold">All destinations</h3>
          <ul className="mt-4 divide-y">
            {cms.destinations.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-sm text-muted-foreground">{getRegion(d.stateId)?.name}{d.description && ` · ${d.description}`}</p>
                </div>
                <button
                  aria-label={`Delete ${d.name}`}
                  className="grid size-9 place-items-center rounded-xl text-muted-foreground ring-1 ring-border/70 hover:text-destructive"
                  onClick={() => setCms((s) => ({ ...s, destinations: s.destinations.filter((x) => x.id !== d.id) }))}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
