import { Clock, Flame, Star } from "lucide-react";

export default function StatsRow({
  duration,
  calories,
  rating,
  className = "",
}: {
  duration: number;
  calories: number;
  rating: number;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-4 font-body text-xs text-muted ${className}`}
    >
      <span className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" /> {duration} min
      </span>
      <span className="flex items-center gap-1.5">
        <Flame className="h-3.5 w-3.5" /> {calories} kcal
      </span>
      <span className="flex items-center gap-1.5">
        <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {rating}
      </span>
    </div>
  );
}
