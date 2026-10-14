import { GROUP_TYPES, useTrip } from "@/lib/trip";
import { Stepper } from "./Stepper";

/** Group size and group type controls. */
export function PartyControls({ compact = false }: { compact?: boolean }) {
  const { groupSize, setGroupSize, groupType, setGroupType } = useTrip();
  return (
    <div className={compact ? "grid grid-cols-1 gap-3 min-[360px]:grid-cols-2" : "flex flex-wrap items-end gap-5"}>
      <div className={compact ? "min-w-0" : undefined}>
        <p className="mb-1.5 text-xs font-bold text-muted-foreground">Group size</p>
        <Stepper
          label="Group size"
          value={groupSize}
          min={6}
          max={200}
          onChange={setGroupSize}
          className={compact ? "w-full justify-between" : undefined}
        />
      </div>
      <div className={compact ? "min-w-0" : undefined}>
        <label
          htmlFor="group-type"
          className="mb-1.5 block text-xs font-bold text-muted-foreground"
        >
          Group type
        </label>
        <select
          id="group-type"
          className={compact ? "field !w-full" : "field !w-auto"}
          value={groupType}
          onChange={(e) => setGroupType(e.target.value)}
        >
          {GROUP_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
