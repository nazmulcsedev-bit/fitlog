"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ChevronDown, Dumbbell, X } from "lucide-react";
import { getWorkouts } from "@/lib/api";
import { Workout } from "@/lib/types";
import { usePlan } from "@/components/PlanProvider";
import { useToast } from "@/components/ToastProvider";
import StatsRow from "@/components/StatsRow";

type Tab = "plan" | "saved";
type SortKey = "duration" | "caloriesBurned" | "rating";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "duration", label: "Duration" },
  { value: "caloriesBurned", label: "Calories" },
  { value: "rating", label: "Rating" },
];

export default function MyPlanPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("plan");
  const [sortKey, setSortKey] = useState<SortKey>("duration");
  const { plan, saved, removeFromPlan, removeFromSaved, toggleDone, hydrated } =
    usePlan();
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    getWorkouts()
      .then((data) => {
        if (active) setWorkouts(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const byId = useMemo(() => {
    const map = new Map<number, Workout>();
    workouts.forEach((w) => map.set(w.id, w));
    return map;
  }, [workouts]);

  const planWorkouts = useMemo(() => {
    type PlanRow = { entry: (typeof plan)[number]; workout: Workout };
    return plan
      .map((p) => ({ entry: p, workout: byId.get(p.id) }))
      .filter((x): x is PlanRow => Boolean(x.workout));
  }, [plan, byId]);

  const savedWorkouts = useMemo(
    () =>
      saved
        .map((id) => byId.get(id))
        .filter((w): w is Workout => Boolean(w)),
    [saved, byId],
  );

  const metrics = useMemo(() => {
    const items = planWorkouts.map((p) => p.workout);
    return {
      exercises: items.length,
      minutes: items.reduce((sum, w) => sum + w.duration, 0),
      calories: items.reduce((sum, w) => sum + w.caloriesBurned, 0),
    };
  }, [planWorkouts]);

  const isLoading = loading || !hydrated;
  const activeList = useMemo(() => {
    const base = tab === "plan" ? planWorkouts.map((p) => p.workout) : savedWorkouts;
    return [...base].sort((a, b) => b[sortKey] - a[sortKey]);
  }, [tab, planWorkouts, savedWorkouts, sortKey]);

  return (
    <div className="mx-auto max-w-wrap px-5 py-10 sm:px-8">
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
        My Plan
      </h1>
      <p className="mt-1 font-body text-sm text-muted">
        Cap of five lifts for today. Finish them, then load more.
      </p>

      {/* Metrics */}
      <div className="mt-7 grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Exercises", value: metrics.exercises },
          { label: "Minutes", value: metrics.minutes },
          { label: "Calories", value: metrics.calories },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-line bg-panel px-4 py-4 text-center sm:text-left"
          >
            <p className="font-display text-2xl font-bold text-accent sm:text-3xl">
              {m.value}
            </p>
            <p className="font-body text-xs uppercase tracking-wide text-muted">
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs + Sort */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line">
        <div className="flex gap-2">
          {(
            [
              { key: "plan", label: `Today's Plan (${plan.length})` },
              { key: "saved", label: `Saved (${saved.length})` },
            ] as { key: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`-mb-px border-b-2 px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide transition-colors ${
                tab === t.key
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative mb-2 sm:mb-0">
          <label htmlFor="my-plan-sort" className="sr-only">
            Sort by
          </label>
          <select
            id="my-plan-sort"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="w-full appearance-none rounded-md border border-line bg-panel py-2 pl-3 pr-9 font-body text-sm text-white focus:border-accent sm:w-44"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort By: {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        </div>
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted">
            <div className="h-8 w-8 animate-spin-slow rounded-full border-2 border-line border-t-accent" />
            <p className="font-body text-sm">Loading workouts…</p>
          </div>
        )}

        {!isLoading && activeList.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-muted">
              <Dumbbell className="h-5 w-5" />
            </div>
            <h2 className="font-display text-lg font-bold uppercase text-white">
              Nothing here yet
            </h2>
            <p className="max-w-xs font-body text-sm text-muted">
              Browse the library and add a lift to get today moving.
            </p>
            <Link
              href="/"
              className="mt-2 inline-flex items-center rounded-md bg-accent px-5 py-2.5 font-display text-sm font-bold uppercase text-ink"
            >
              Go to workouts
            </Link>
          </div>
        )}

        {!isLoading && activeList.length > 0 && (
          <ul className="flex flex-col gap-3">
            {activeList.map((w) => {
              const done =
                tab === "plan" &&
                planWorkouts.find((p) => p.workout.id === w.id)?.entry.done;
              return (
                <li
                  key={w.id}
                  className={`flex flex-col gap-4 rounded-lg border bg-panel p-4 sm:flex-row sm:items-center ${
                    done ? "border-accent/50" : "border-line"
                  }`}
                >
                  <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-md bg-panel2 sm:h-16 sm:w-16">
                    <Image
                      src={w.image}
                      alt={w.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-display text-sm font-bold uppercase tracking-wide ${
                        done ? "text-muted line-through" : "text-white"
                      }`}
                    >
                      {w.name}
                    </h3>
                    <p className="font-body text-xs text-muted">
                      {w.equipment}
                    </p>
                    <StatsRow
                      duration={w.duration}
                      calories={w.caloriesBurned}
                      rating={w.rating}
                      className="mt-1.5"
                    />
                  </div>

                  <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
                    <Link
                      href={`/workout/${w.id}`}
                      className="rounded-md border border-line px-3 py-2 font-body text-xs font-semibold text-white hover:border-accent hover:text-accent"
                    >
                      View Details
                    </Link>
                    {tab === "plan" && (
                      <button
                        onClick={() => {
                          toggleDone(w.id);
                          showToast(
                            done ? "Marked as not done" : "Marked as done",
                          );
                        }}
                        aria-label="Mark as done"
                        className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                          done
                            ? "border-accent bg-accent text-ink"
                            : "border-line text-muted hover:border-accent hover:text-accent"
                        }`}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (tab === "plan") {
                          removeFromPlan(w.id);
                          showToast("Removed from today's plan");
                        } else {
                          removeFromSaved(w.id);
                          showToast("Removed from saved");
                        }
                      }}
                      aria-label="Remove"
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-muted hover:border-red-400 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
