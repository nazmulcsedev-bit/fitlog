import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-wrap flex-col items-center gap-4 px-5 py-32 text-center">
      <p className="font-display text-6xl font-bold text-accent">404</p>
      <h1 className="font-display text-2xl font-bold uppercase text-white">
        Page not found
      </h1>
      <p className="max-w-sm font-body text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
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
