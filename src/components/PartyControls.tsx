import { GROUP_TYPES, useTrip } from "@/lib/trip";
import { Stepper } from "./Stepper";

/** Group size and group type controls. */
export function PartyControls({ compact = false }: { compact?: boolean }) {
  const { groupSize, setGroupSize, groupType, setGroupType } = useTrip();
  return (
    <div className={compact ? "flex flex-wrap items-center gap-3" : "flex flex-wrap items-end gap-5"}>
      <>
          <div>
            <p className="mb-1.5 text-xs font-bold text-muted-foreground">Group size</p>
            <Stepper label="Group size" value={groupSize} min={6} max={200} onChange={setGroupSize} />
          </div>
          <div>
            <label htmlFor="group-type" className="mb-1.5 block text-xs font-bold text-muted-foreground">
              Group type
            </label>
            <select
              id="group-type"
              className="field !w-auto"
              value={groupType}
              onChange={(e) => setGroupType(e.target.value)}
            >
              {GROUP_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </>
    </div>
  );
}
