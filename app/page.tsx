"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, Dumbbell, Search } from "lucide-react";
import { getWorkouts } from "@/lib/api";
import { Workout } from "@/lib/types";
import WorkoutCard from "@/components/WorkoutCard";

type SortKey = "duration" | "caloriesBurned" | "rating";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "duration", label: "Duration" },
  { value: "caloriesBurned", label: "Calories" },
  { value: "rating", label: "Rating" },
];

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("duration");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    getWorkouts()
      .then((data) => {
        if (active) setWorkouts(data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visibleWorkouts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? workouts.filter(
          (w) =>
            w.name.toLowerCase().includes(q) ||
            w.muscleGroups.some((g) => g.toLowerCase().includes(q)),
        )
      : workouts;
    return [...filtered].sort((a, b) => b[sortKey] - a[sortKey]);
  }, [workouts, sortKey, query]);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-ink">
        <div className="mx-auto grid max-w-wrap items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Workout Library
            </p>
            <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              Train with intent.
              <br />
              Log every set.
            </h1>
            <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-muted sm:text-base">
              FitLog is a dark, no-nonsense gym companion: pick a lift, lock
              it into today&apos;s plan, and watch the week&apos;s work add
              up.
            </p>
            <a
              href="#library"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-105"
            >
              <Dumbbell className="h-4 w-4" />
              Browse Workouts
            </a>
          </div>
          <div className="relative order-first h-64 overflow-hidden rounded-lg border border-line bg-panel sm:h-80 md:order-last md:h-96">
            <Image
              src="https://img.magnific.com/free-photo/3d-cartoon-fitness-man_23-2151691400.jpg?w=740"
              alt="Athlete mid-lift"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Library */}
      <section id="library" className="mx-auto max-w-wrap px-5 py-14 sm:px-8">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
              The Library
            </h2>
            <p className="mt-1 font-body text-sm text-muted">
              Twelve lifts covering every major muscle group.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or tag"
                className="w-full rounded-md border border-line bg-panel py-2 pl-9 pr-3 font-body text-sm text-white placeholder:text-muted focus:border-accent sm:w-56"
              />
            </div>
            <div className="relative">
              <label htmlFor="sort" className="sr-only">
                Sort by
              </label>
              <select
                id="sort"
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
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted">
            <div className="h-8 w-8 animate-spin-slow rounded-full border-2 border-line border-t-accent" />
            <p className="font-body text-sm">Loading workouts…</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-2 py-24 text-center text-muted">
            <p className="font-body text-sm">
              Couldn&apos;t load the workout library. Please try again.
            </p>
          </div>
        )}

        {!loading && !error && visibleWorkouts.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-24 text-center text-muted">
            <p className="font-body text-sm">No lifts match your search.</p>
          </div>
        )}

        {!loading && !error && visibleWorkouts.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleWorkouts.map((w) => (
              <WorkoutCard key={w.id} workout={w} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
