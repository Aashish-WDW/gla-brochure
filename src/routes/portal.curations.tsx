import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { Field, inputCls, PageHead, Panel, primaryBtn, Select } from "@/components/portal/ui";
import { REGIONS } from "@/data/regions";
import { getRegion } from "@/lib/catalog";
import { type Curation, setCms, uid, useCms } from "@/lib/cms";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/portal/curations")({
  head: () => ({ meta: [{ title: "Curations — GoLookAround B2B Portal" }] }),
  component: CurationsPage,
});

const blank = (): Curation => ({
  id: "",
  title: "",
  stateId: REGIONS[0]!.id,
  destinationId: null,
  category: "experience",
  price: null,
  minGroup: null,
  description: "",
  status: "draft",
  updatedAt: "",
});

function CurationsPage() {
  const cms = useCms();
  const [edit, setEdit] = useState<Curation | null>(null);
  const enabled = REGIONS.filter((r) => cms.enabledStates[r.id]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit || !edit.title.trim()) return;
    const c = { ...edit, id: edit.id || uid("c"), updatedAt: new Date().toISOString() };
    setCms((s) => ({
      ...s,
      curations: s.curations.some((x) => x.id === c.id) ? s.curations.map((x) => (x.id === c.id ? c : x)) : [...s.curations, c],
    }));
    setEdit(null);
  };
  const num = (v: string) => (v === "" ? null : Math.max(0, Number(v)));

  return (
    <div className="space-y-8">
      <PageHead
        title="Curations"
        sub="Create experiences, events and retreats for groups."
        action={<button className={primaryBtn} onClick={() => setEdit({ ...blank(), stateId: enabled[0]?.id ?? REGIONS[0]!.id })}><Plus className="size-5" /> New curation</button>}
      />
      <Panel className="overflow-x-auto p-0 sm:p-0">
        <table className="w-full min-w-[640px] text-left">
          <thead className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <tr>{["Title", "State", "Category", "Price", "Status", ""].map((h) => <th key={h} className="px-6 py-4 font-bold">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {cms.curations.map((c) => (
              <tr key={c.id}>
                <td className="px-6 py-4 font-semibold">{c.title}</td>
                <td className="px-6 py-4 text-muted-foreground">{getRegion(c.stateId)?.name}</td>
                <td className="px-6 py-4 capitalize">{c.category}</td>
                <td className="px-6 py-4">{formatPrice(c.price === null ? null : { amount: c.price, unit: "person" })}</td>
                <td className="px-6 py-4">
                  <span className={c.status === "published" ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700" : "rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground"}>{c.status}</span>
                </td>
                <td className="flex justify-end gap-2 px-6 py-4">
                  <button aria-label="Edit" className="grid size-9 place-items-center rounded-xl ring-1 ring-border/70" onClick={() => setEdit(c)}><Pencil className="size-4" /></button>
                  <button aria-label="Delete" className="grid size-9 place-items-center rounded-xl ring-1 ring-border/70 hover:text-destructive" onClick={() => setCms((s) => ({ ...s, curations: s.curations.filter((x) => x.id !== c.id) }))}><Trash2 className="size-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Modal open={!!edit} onOpenChange={(o) => !o && setEdit(null)} title={edit?.id ? "Edit curation" : "New curation"}>
        {edit && (
          <form onSubmit={save} className="space-y-4 p-6">
            <Field label="Title"><input required className={inputCls} value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="State">
                <Select label="State" value={edit.stateId} onChange={(v) => setEdit({ ...edit, stateId: v, destinationId: null })} options={enabled.map((r) => ({ value: r.id, label: r.name }))} />
              </Field>
              <Field label="Destination">
                <Select
                  label="Destination"
                  value={edit.destinationId ?? ""}
                  onChange={(v) => setEdit({ ...edit, destinationId: v || null })}
                  options={[{ value: "", label: "No specific destination" }, ...cms.destinations.filter((d) => d.stateId === edit.stateId).map((d) => ({ value: d.id, label: d.name }))]}
                />
              </Field>
              <Field label="Category">
                <Select label="Category" value={edit.category} onChange={(v) => setEdit({ ...edit, category: v as Curation["category"] })} options={[{ value: "experience", label: "Experience" }, { value: "event", label: "Event" }, { value: "retreat", label: "Retreat" }]} />
              </Field>
              <Field label="Status">
                <Select label="Status" value={edit.status} onChange={(v) => setEdit({ ...edit, status: v as Curation["status"] })} options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }]} />
              </Field>
              <Field label="Price per person (₹, blank = Request a quote)"><input type="number" min={0} className={inputCls} value={edit.price ?? ""} onChange={(e) => setEdit({ ...edit, price: num(e.target.value) })} /></Field>
              <Field label="Minimum group size"><input type="number" min={1} className={inputCls} value={edit.minGroup ?? ""} onChange={(e) => setEdit({ ...edit, minGroup: num(e.target.value) })} /></Field>
            </div>
            <Field label="Description"><textarea rows={3} className={inputCls} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></Field>
            <button className={primaryBtn}>Save curation</button>
          </form>
        )}
      </Modal>
    </div>
  );
}
