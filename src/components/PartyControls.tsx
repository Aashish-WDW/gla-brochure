import { GROUP_TYPES, useTrip } from "@/lib/trip";
import { Stepper } from "./Stepper";

/** Party / group size controls that follow the Individual or Group mode. */
export function PartyControls({ compact = false }: { compact?: boolean }) {
  const { mode, travellers, setTravellers, groupSize, setGroupSize, groupType, setGroupType } = useTrip();
  return (
    <div className={compact ? "flex flex-wrap items-center gap-3" : "flex flex-wrap items-end gap-5"}>
      {mode === "individual" ? (
        <div>
          <p className="mb-1.5 text-xs font-bold text-muted-foreground">Travellers</p>
          <Stepper label="Travellers" value={travellers} min={1} max={6} onChange={setTravellers} />
        </div>
      ) : (
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
      )}
    </div>
  );
}
