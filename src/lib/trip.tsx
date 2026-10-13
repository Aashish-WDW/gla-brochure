import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Mode } from "@/data/types";
import { peopleCount } from "./itinerary";

export const GROUP_TYPES = ["Friends", "Family", "Community", "Corporate team"] as const;

interface TripState {
  /** GoLookAround India is group-only. */
  mode: Mode;
  travellers: number;
  setTravellers: (n: number) => void;
  groupSize: number;
  setGroupSize: (n: number) => void;
  groupType: string;
  setGroupType: (t: string) => void;
  /** Number of people used for pricing, based on mode. */
  people: number;
}

const TripContext = createContext<TripState | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const mode: Mode = "group";
  const [travellers, setTravellers] = useState(2);
  const [groupSize, setGroupSize] = useState(12);
  const [groupType, setGroupType] = useState<string>(GROUP_TYPES[0]);

  const value = useMemo<TripState>(
    () => ({
      mode,
      travellers,
      setTravellers,
      groupSize,
      setGroupSize,
      groupType,
      setGroupType,
      people: peopleCount(mode, travellers, groupSize),
    }),
    [travellers, groupSize, groupType],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip(): TripState {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used inside TripProvider");
  return ctx;
}
