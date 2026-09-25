"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { PlanEntry } from "@/lib/types";

const PLAN_KEY = "fitlog.plan";
const SAVED_KEY = "fitlog.saved";
export const PLAN_CAP = 5;

interface PlanContextValue {
  plan: PlanEntry[];
  saved: number[];
  hydrated: boolean;
  isInPlan: (id: number) => boolean;
  isSaved: (id: number) => boolean;
  addToPlan: (id: number) => "added" | "full" | "exists";
  removeFromPlan: (id: number) => void;
  toggleDone: (id: number) => void;
  addToSaved: (id: number) => "added" | "exists";
  removeFromSaved: (id: number) => void;
}

const PlanContext = createContext<PlanContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<PlanEntry[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPlan(readStorage<PlanEntry[]>(PLAN_KEY, []));
    setSaved(readStorage<number[]>(SAVED_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  }, [plan, hydrated]);

  useEffect(() => {
    if (hydrated)
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }, [saved, hydrated]);

  const isInPlan = useCallback(
    (id: number) => plan.some((p) => p.id === id),
    [plan],
  );
  const isSaved = useCallback((id: number) => saved.includes(id), [saved]);

  const addToPlan = useCallback(
    (id: number): "added" | "full" | "exists" => {
      let result: "added" | "full" | "exists" = "added";
      setPlan((prev) => {
        if (prev.some((p) => p.id === id)) {
          result = "exists";
          return prev;
        }
        if (prev.length >= PLAN_CAP) {
          result = "full";
          return prev;
        }
        return [...prev, { id, done: false }];
      });
      return result;
    },
    [],
  );

  const removeFromPlan = useCallback((id: number) => {
    setPlan((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleDone = useCallback((id: number) => {
    setPlan((prev) =>
      prev.map((p) => (p.id === id ? { ...p, done: !p.done } : p)),
    );
  }, []);

  const addToSaved = useCallback((id: number): "added" | "exists" => {
    let result: "added" | "exists" = "added";
    setSaved((prev) => {
      if (prev.includes(id)) {
        result = "exists";
        return prev;
      }
      return [...prev, id];
    });
    return result;
  }, []);

  const removeFromSaved = useCallback((id: number) => {
    setSaved((prev) => prev.filter((s) => s !== id));
  }, []);

  return (
    <PlanContext.Provider
      value={{
        plan,
        saved,
        hydrated,
        isInPlan,
        isSaved,
        addToPlan,
        removeFromPlan,
        toggleDone,
        addToSaved,
        removeFromSaved,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used within PlanProvider");
  return ctx;
}
