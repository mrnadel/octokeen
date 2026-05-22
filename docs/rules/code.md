# Code Architecture Rules

## TypeScript
- No `any` — use `unknown` and narrow, or define a type
- No `var` — `const` by default, `let` only when reassignment is needed
- No type assertions (`as X`) except at system boundaries (API responses, `JSON.parse`)
- Prefer type aliases for unions/intersections; interfaces for object shapes
- Always type async function return values explicitly

## Functions
- Single responsibility — one function does one thing
- Max ~20 lines; if longer, extract
- Name describes the action: `getUserById`, `formatCurrency`, `isEligibleForUpgrade`
- Predicates start with `is` / `has` / `can` / `should`
- No boolean trap params — use an options object or two separate functions
- Pure functions preferred; side effects isolated and named clearly

## Files
- Max 150 lines — split at natural seams (helpers, types, constants)
- One component per file
- Co-locate helpers with the component they serve; move to `lib/` only when shared by 3+ consumers

## Naming
- Components: `PascalCase`
- Hooks: `use` prefix, camelCase (`useLeagueData`)
- Utilities: camelCase verbs (`formatDate`, `sortFriendPair`)
- Module-level constants: `SCREAMING_SNAKE` (`MAX_HEARTS`)
- DB columns: `snake_case` (Drizzle); TS objects: `camelCase`

## Imports
- Absolute imports (`@/`) for anything more than 1 level deep
- Group: external libs → internal `@/` → relative — blank line between groups
- No barrel `index.ts` re-exports unless the module has 5+ exports consumers need

## Components
- Props interface named `[ComponentName]Props`
- Destructure props at the top of the function body
- No inline object/array literals in JSX props — hoist or memoize to avoid re-renders
- Keep JSX under 80 lines; extract sub-sections into named child components

## State & Side Effects
- Server state (DB data) via RSC or `fetch` — not Zustand
- Zustand only for client UI/game state that persists or crosses routes
- No direct store mutations outside the store's own actions
- `useEffect` only for syncing external systems; never for derived state (use `useMemo`)

## Error Handling
- Validate at boundaries (API routes, form inputs) — not deep in utilities
- API routes return typed error shapes: `{ error: string }`
- Never swallow errors silently; at minimum `console.error` with context

## General
- No magic numbers — extract named constants
- No commented-out code — delete it; git has history
- No `TODO` in committed code unless it has a ticket/issue reference
