import Link from "next/link";
import Image from "next/image";
import { Workout } from "@/lib/types";
import StatsRow from "./StatsRow";

export default function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-panel transition-colors hover:border-accent/60"
    >
      <div className="relative h-44 w-full overflow-hidden bg-panel2">
        <Image
          src={workout.image}
          alt={workout.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex flex-wrap gap-1.5">
          {workout.muscleGroups.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wide text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-display text-base font-bold uppercase leading-tight text-white">
          {workout.name}
        </h3>
        <p className="font-body text-xs text-muted">{workout.equipment}</p>
        <StatsRow
          duration={workout.duration}
          calories={workout.caloriesBurned}
          rating={workout.rating}
          className="mt-auto pt-1"
        />
      </div>
    </Link>
  );
}
