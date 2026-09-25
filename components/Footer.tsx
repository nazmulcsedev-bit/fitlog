import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto flex max-w-wrap flex-col items-center gap-3 px-5 py-8 sm:flex-row sm:justify-between sm:px-8">
        <Logo />
        <p className="font-body text-xs text-muted">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}
