# Tech Stack

- **Next.js 16 App Router**, Turbopack, TypeScript strict, React 19
- **Zustand 5** — 5 persisted stores (localStorage). Cross-store deps documented in `docs/project-overview.md`
- **Drizzle ORM** + PostgreSQL (33 tables) — schema: `src/lib/db/schema.ts`
- **NextAuth v5** (Google + Credentials) — config: `src/lib/auth.ts`
- **Paddle** — payments. Two-layer gating: client Zustand + server `access-control.ts`
- **Tailwind CSS 4** — custom design system, no shadcn/ui
- **Course content** — static TS files in `src/data/course/professions/`, not DB. Active courses: `src/data/professions.ts`
- **Vitest** — run `npm test` before committing
