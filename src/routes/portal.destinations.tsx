import { createFileRoute } from "@tanstack/react-router";
import { ImagePlus, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Field, inputCls, PageHead, Panel, primaryBtn, Select } from "@/components/portal/ui";
import { REGIONS } from "@/data/regions";
import { getRegion } from "@/lib/catalog";
import { setCms, uid, useCms } from "@/lib/cms";
import { readImage } from "@/lib/image";

const MAX_DESC = 500;

export const Route = createFileRoute("/portal/destinations")({
  head: () => ({ meta: [{ title: "Destinations — GoLookAround B2B Portal" }] }),
  component: DestinationsPage,
});

function DestinationsPage() {
  const cms = useCms();
  const [name, setName] = useState("");
  const [stateId, setStateId] = useState(REGIONS[0]!.id);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [imgError, setImgError] = useState("");

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) return setImgError("Please choose an image file.");
    try {
      setImage(await readImage(f));
      setImgError("");
    } catch {
      setImgError("Couldn't read that image.");
    }
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCms((s) => ({ ...s, destinations: [...s.destinations, { id: uid("d"), name: name.trim(), stateId, description: description.slice(0, MAX_DESC), ...(image ? { image } : {}) }] }));
    setName("");
    setDescription("");
    setImage(undefined);
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
              <Select label="State" value={stateId} onChange={setStateId} options={REGIONS.map((r) => ({ value: r.id, label: r.name, hint: cms.enabledStates[r.id] ? "" : "Disabled" }))} />
            </Field>
            <Field label="Photo">
              {image ? (
                <div className="relative overflow-hidden rounded-2xl ring-1 ring-border/70">
                  <img src={image} alt="Destination preview" className="aspect-[16/10] w-full object-cover" />
                  <button type="button" aria-label="Remove photo" onClick={() => setImage(undefined)} className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/90 shadow">
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground hover:bg-muted/40">
                  <ImagePlus className="size-6" />
                  <span>Add a photo</span>
                  <input type="file" accept="image/*" className="sr-only" onChange={pick} />
                </label>
              )}
              {imgError && <p className="mt-1 text-sm text-destructive">{imgError}</p>}
            </Field>
            <Field label="Description">
              <textarea rows={4} maxLength={MAX_DESC} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} />
              <p className="mt-1 text-right text-xs text-muted-foreground">{description.length}/{MAX_DESC}</p>
            </Field>
            <button className={primaryBtn}><Plus className="size-5" /> Add destination</button>
          </form>
        </Panel>
        <Panel>
          <h3 className="text-xl font-bold">All destinations</h3>
          <ul className="mt-4 divide-y">
            {cms.destinations.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                {d.image && <img src={d.image} alt="" className="size-14 shrink-0 rounded-xl object-cover" />}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{d.name}</p>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{getRegion(d.stateId)?.name}{d.description && ` · ${d.description}`}</p>
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
