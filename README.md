# FitLog — Workout Library

A dark, no-nonsense gym companion built with Next.js. Browse a library of
twelve lifts, drill into full instructions and specs for each one, and build
out today's training plan (capped at five lifts) with a separate list of
lifts saved for later — all persisted locally so it survives a refresh.

## Technologies used

- **Next.js 14** (App Router) — routing, layouts, client/server components
- **React 18** + **TypeScript**
- **Tailwind CSS** — styling, responsive layout, theming
- **lucide-react** — icon set
- **localStorage** — persists Today's Plan and Saved lists across reloads
- Public REST API (`api.abcz.workers.dev/api/fitlog`) for workout data

## Features

1. **Responsive workout library** — a searchable, sortable 3×4 grid (sort by
   Duration, Calories, or Rating) of every lift, fully responsive from mobile
   to desktop.
2. **Detailed workout pages** — two-column layout with hero image, tags, a
   full spec panel (equipment, difficulty, sets, reps, duration, calories,
   rating), and numbered step-by-step instructions.
3. **Today's Plan with a 5-lift cap** — add lifts from any detail page,
   track live Exercises / Minutes / Calories totals, mark lifts done, and
   remove them, all with toast confirmations.
4. **Saved for later list** — a second tab on the My Plan page for lifts to
   revisit, independent of today's plan.
5. **Persistent state, live badges & graceful empty/error states** — the
   navbar's Plan and Saved counters update instantly and survive reloads via
   localStorage; loading spinners, a "nothing here yet" empty state, and a
   custom 404 page round out the experience.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx                  Home: hero + library grid (search + sort)
  workout/[id]/page.tsx     Workout detail page
  my-plan/page.tsx          Today's Plan / Saved tabs
  not-found.tsx             Custom 404
  layout.tsx, globals.css   Root layout, fonts, Tailwind
components/
  Navbar.tsx, Footer.tsx, Logo.tsx
  WorkoutCard.tsx, StatsRow.tsx
  PlanProvider.tsx          Plan/Saved state + localStorage
  ToastProvider.tsx         Toast notifications
lib/
  api.ts                    Fetch helpers for the FitLog API
  types.ts                  Shared TypeScript types
```

## Notes

- Data comes live from `https://api.abcz.workers.dev/api/fitlog`; no API key
  required.
- Today's Plan is capped at 5 lifts per the design brief — adding a 6th shows
  a toast instead.
