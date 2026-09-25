import { Dumbbell } from "lucide-react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-accent text-ink">
        <Dumbbell className="h-[18px] w-[18px]" strokeWidth={2.5} />
      </span>
      <span className="font-display text-lg font-bold uppercase tracking-wide text-white">
        FitLog
      </span>
    </span>
  );
}
