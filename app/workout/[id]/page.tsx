"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Bookmark, ClipboardCheck, ArrowLeft } from "lucide-react";
import { getWorkout } from "@/lib/api";
import { Workout } from "@/lib/types";
import { usePlan, PLAN_CAP } from "@/components/PlanProvider";
import { useToast } from "@/components/ToastProvider";

const SPEC_ROWS: { label: string; get: (w: Workout) => string | number }[] = [
  { label: "Equipment", get: (w) => w.equipment },
  { label: "Difficulty", get: (w) => w.difficulty },
  { label: "Sets", get: (w) => w.sets },
  { label: "Reps", get: (w) => w.reps },
  { label: "Duration", get: (w) => `${w.duration} min` },
  { label: "Calories", get: (w) => `${w.caloriesBurned} kcal` },
  { label: "Rating", get: (w) => w.rating },
];

export default function WorkoutDetailPage() {
  const params = useParams<{ id: string }>();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { isInPlan, isSaved, addToPlan, addToSaved } = usePlan();
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    getWorkout(params.id)
      .then((data) => {
        if (!active) return;
        if (!data || (data as unknown as { error?: string }).error) {
          setNotFound(true);
        } else {
          setWorkout(data);
        }
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32 text-muted">
        <div className="h-8 w-8 animate-spin-slow rounded-full border-2 border-line border-t-accent" />
        <p className="font-body text-sm">Loading workout…</p>
      </div>
    );
  }

  if (notFound || !workout) {
    return (
      <div className="mx-auto flex max-w-wrap flex-col items-center gap-4 px-5 py-32 text-center">
        <h1 className="font-display text-2xl font-bold uppercase text-white">
          Workout not found
        </h1>
        <p className="font-body text-sm text-muted">
          This lift isn&apos;t in the library.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 font-display text-sm font-bold uppercase text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Back to workouts
        </Link>
      </div>
    );
  }

  const inPlan = isInPlan(workout.id);
  const saved = isSaved(workout.id);

  const handleAddPlan = () => {
    if (inPlan) {
      showToast("Already in your plan");
      return;
    }
    const result = addToPlan(workout.id);
    if (result === "added") showToast("Added to today's plan");
    else if (result === "full")
      showToast(`Plan is full — max ${PLAN_CAP} lifts for today`);
    else showToast("Already in your plan");
  };

  const handleSave = () => {
    if (saved) {
      showToast("Already saved");
      return;
    }
    const result = addToSaved(workout.id);
    if (result === "added") showToast("Saved for later");
    else showToast("Already saved");
  };

  return (
    <div className="mx-auto max-w-wrap px-5 py-10 sm:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 font-body text-xs text-muted hover:text-accent"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to library
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative h-72 overflow-hidden rounded-lg border border-line bg-panel sm:h-96 lg:h-full lg:min-h-[420px]">
          <Image
            src={workout.image}
            alt={workout.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {workout.muscleGroups.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line px-2.5 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wide text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-display text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">
            {workout.name}
          </h1>
          <p className="mt-3 font-body text-sm leading-relaxed text-muted">
            {workout.description}
          </p>

          <dl className="mt-6 divide-y divide-line rounded-lg border border-line bg-panel">
            {SPEC_ROWS.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <dt className="font-display text-xs font-semibold uppercase tracking-wide text-muted">
                  {row.label}
                </dt>
                <dd className="font-body text-sm font-medium text-white">
                  {row.get(workout)}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
              Instructions
            </h2>
            <ol className="mt-3 space-y-3">
              {workout.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 font-body text-sm text-muted">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-panel2 font-display text-xs font-bold text-accent">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddPlan}
              aria-disabled={inPlan}
              className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 font-display text-sm font-bold uppercase tracking-wide transition-transform ${
                inPlan
                  ? "cursor-not-allowed border border-accent/50 bg-transparent text-accent"
                  : "bg-accent text-ink hover:scale-[1.02]"
              }`}
            >
              <ClipboardCheck className="h-4 w-4" />
              {inPlan ? "Already in your plan" : "Add to today's plan"}
            </button>
            <button
              onClick={handleSave}
              aria-disabled={saved}
              className={`inline-flex items-center justify-center gap-2 rounded-md border px-5 py-3 font-display text-sm font-bold uppercase tracking-wide transition-colors ${
                saved
                  ? "cursor-not-allowed border-accent/50 text-accent"
                  : "border-line text-white hover:border-accent hover:text-accent"
              }`}
            >
              <Bookmark className="h-4 w-4" />
              {saved ? "Saved" : "Save for later"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
