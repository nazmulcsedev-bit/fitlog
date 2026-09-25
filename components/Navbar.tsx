"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { usePlan } from "./PlanProvider";

const links = [
  { href: "/", label: "Workout" },
  { href: "/my-plan", label: "My Plan" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { plan, saved } = usePlan();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-wrap items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="FitLog home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-display text-sm font-medium uppercase tracking-wide transition-colors ${
                  active
                    ? "text-accent"
                    : "text-muted hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/my-plan"
            className="rounded-full bg-accent px-3.5 py-1.5 font-body text-xs font-semibold text-ink transition-transform hover:scale-105"
            aria-label={`Plan, ${plan.length} items`}
          >
            Plan · {plan.length}
          </Link>
          <Link
            href="/my-plan"
            className="rounded-full border border-line px-3.5 py-1.5 font-body text-xs font-semibold text-white transition-colors hover:border-accent hover:text-accent"
            aria-label={`Saved, ${saved.length} items`}
          >
            Saved · {saved.length}
          </Link>
        </div>
      </div>
    </header>
  );
}
