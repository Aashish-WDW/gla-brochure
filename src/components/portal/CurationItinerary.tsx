import { Clock, ImagePlus, MapPin, Moon, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Field, inputCls, Select } from "@/components/portal/ui";
import { type CurationDay, type CurationStop, uid } from "@/lib/cms";
import { formatINR } from "@/lib/format";
import { readImage } from "@/lib/image";

const MAX_DESC = 500;

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return t && h !== undefined && m !== undefined && !Number.isNaN(h + m) ? h * 60 + m : null;
};
/** Hours between start and end (handles crossing midnight). null when either is missing. */
export function stopHours(s: CurationStop): number | null {
  if (s.kind !== "experience") return null;
  const a = toMin(s.start);
  const b = toMin(s.end);
  if (a === null || b === null) return null;
  const d = b - a;
  return (d <= 0 ? d + 1440 : d) / 60;
}
const hrs = (h: number) => `${Number.isInteger(h) ? h : h.toFixed(1)} ${h === 1 ? "hr" : "hrs"}`;

const blankStop = (kind: CurationStop["kind"]): CurationStop => ({
  id: uid("s"),
  kind,
  title: "",
  description: "",
  location: "",
  start: "",
  end: "",
  pricePerPerson: null,
});

function StopEditor({ stop, onChange, onRemove, groupSize }: { stop: CurationStop; onChange: (s: CurationStop) => void; onRemove: () => void; groupSize: number | null }) {
  const [imgError, setImgError] = useState("");
  const h = stopHours(stop);
  const isStay = stop.kind === "stay";
  const set = (patch: Partial<CurationStop>) => onChange({ ...stop, ...patch });
  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) return setImgError("Please choose an image file.");
    try {
      set({ image: await readImage(f) });
      setImgError("");
    } catch {
      setImgError("Couldn't read that image.");
    }
  };

  return (
    <div className="space-y-4 rounded-3xl bg-background p-4 ring-1 ring-border/70">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
          {isStay ? (
            <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">Overnight</span>
          ) : (
            <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">{stop.start && stop.end ? `${stop.start} – ${stop.end}` : "Set time"}</span>
          )}
          <span className="rounded-full px-3 py-1 ring-1 ring-border">{isStay ? "Stay" : "Experience"}</span>
          {h !== null && (
            <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="size-4" /> {hrs(h)}</span>
          )}
        </div>
        <button type="button" aria-label="Remove stop" onClick={onRemove} className="grid size-9 shrink-0 place-items-center rounded-xl ring-1 ring-border/70 hover:text-destructive">
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-[9rem_1fr]">
        <div>
          {stop.image ? (
            <div className="relative overflow-hidden rounded-2xl ring-1 ring-border/70">
              <img src={stop.image} alt="Stop preview" className="aspect-square w-full object-cover" />
              <button type="button" aria-label="Remove photo" onClick={() => set({ image: undefined })} className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-white/90 shadow"><X className="size-4" /></button>
            </div>
          ) : (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border text-xs text-muted-foreground hover:bg-muted/40">
              <ImagePlus className="size-5" />
              <span>Add photo</span>
              <input type="file" accept="image/*" className="sr-only" onChange={pick} />
            </label>
          )}
          {imgError && <p className="mt-1 text-xs text-destructive">{imgError}</p>}
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type">
              <Select
                label="Type"
                value={stop.kind}
                onChange={(v) => set({ kind: v as CurationStop["kind"] })}
                options={[{ value: "experience", label: "Experience" }, { value: "stay", label: "Stay" }]}
              />
            </Field>
            <Field label="Location"><input className={inputCls} placeholder="e.g. Kochi" value={stop.location} onChange={(e) => set({ location: e.target.value })} /></Field>
          </div>
          <Field label="Title"><input className={inputCls} value={stop.title} onChange={(e) => set({ title: e.target.value })} /></Field>
          <Field label="Description">
            <textarea rows={2} maxLength={MAX_DESC} className={inputCls} value={stop.description} onChange={(e) => set({ description: e.target.value })} />
            <p className="mt-1 text-right text-xs text-muted-foreground">{stop.description.length}/{MAX_DESC}</p>
          </Field>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {isStay ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground sm:col-span-2"><Moon className="size-4" /> Overnight stay — no start or end time</div>
        ) : (
          <>
            <Field label="Start time"><input type="time" className={inputCls} value={stop.start} onChange={(e) => set({ start: e.target.value })} /></Field>
            <Field label="End time"><input type="time" className={inputCls} value={stop.end} onChange={(e) => set({ end: e.target.value })} /></Field>
          </>
        )}
        <Field label={isStay ? "Price per person / night (₹)" : "Price per person (₹)"}>
          <input type="number" min={0} placeholder="Blank = Request a quote" className={inputCls} value={stop.pricePerPerson ?? ""} onChange={(e) => set({ pricePerPerson: e.target.value === "" ? null : Math.max(0, Number(e.target.value)) })} />
        </Field>
      </div>

      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {stop.location && <span className="inline-flex items-center gap-1"><MapPin className="size-4" /> {stop.location}</span>}
        {stop.pricePerPerson === null ? (
          <span className="font-semibold">Request a quote</span>
        ) : (
          <span>
            <span className="font-bold text-foreground">{formatINR(stop.pricePerPerson)}</span> per person{isStay ? " / night" : ""}
            {groupSize ? <> · total for {groupSize}: <span className="font-bold text-foreground">{formatINR(stop.pricePerPerson * groupSize)}</span></> : null}
          </span>
        )}
      </p>
    </div>
  );
}

export function CurationItinerary({ days, onChange, groupSize }: { days: CurationDay[]; onChange: (d: CurationDay[]) => void; groupSize: number | null }) {
  const setDay = (id: string, fn: (d: CurationDay) => CurationDay) => onChange(days.map((d) => (d.id === id ? fn(d) : d)));

  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-display text-lg">Itinerary</h3>
        <p className="text-sm text-muted-foreground">Add days, then the experiences and stays on each day. Totals use the minimum group size{groupSize ? ` (${groupSize})` : " — set it above to see totals"}.</p>
      </div>

      {days.map((day, i) => {
        const planned = day.stops.reduce((n, s) => n + (stopHours(s) ?? 0), 0);
        return (
          <div key={day.id} className="space-y-3 rounded-3xl bg-muted/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-display text-xl">Day {i + 1}</h4>
              <div className="flex items-center gap-3">
                {planned > 0 && <span className="text-sm font-semibold text-muted-foreground">{hrs(planned)} planned</span>}
                <button type="button" aria-label={`Remove day ${i + 1}`} onClick={() => onChange(days.filter((d) => d.id !== day.id))} className="grid size-9 place-items-center rounded-xl ring-1 ring-border/70 hover:text-destructive"><Trash2 className="size-4" /></button>
              </div>
            </div>
            {day.stops.map((s) => (
              <StopEditor
                key={s.id}
                stop={s}
                groupSize={groupSize}
                onChange={(n) => setDay(day.id, (d) => ({ ...d, stops: d.stops.map((x) => (x.id === s.id ? n : x)) }))}
                onRemove={() => setDay(day.id, (d) => ({ ...d, stops: d.stops.filter((x) => x.id !== s.id) }))}
              />
            ))}
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setDay(day.id, (d) => ({ ...d, stops: [...d.stops, blankStop("experience")] }))} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold ring-1 ring-border/70 hover:bg-background"><Plus className="size-4" /> Add experience</button>
              <button type="button" onClick={() => setDay(day.id, (d) => ({ ...d, stops: [...d.stops, blankStop("stay")] }))} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold ring-1 ring-border/70 hover:bg-background"><Plus className="size-4" /> Add stay</button>
            </div>
          </div>
        );
      })}

      <button type="button" onClick={() => onChange([...days, { id: uid("day"), stops: [] }])} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold ring-1 ring-border/70 hover:bg-muted/40"><Plus className="size-4" /> Add day</button>
    </section>
  );
}
