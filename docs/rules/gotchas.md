# Common Gotchas

- **Dual stores** — `useStore` (practice) and `useCourseStore` (course). Update both when needed.
- **Friendships** — table has `CHECK user_id < friend_id`. Always use `sortFriendPair()`.
- **Course data** — loads lazily (~5MB with SVGs). Use `course-meta.ts` for lightweight metadata only.
- **SSR** — guard any code touching `sessionStorage`/`localStorage`.
- **League** — competitors are real users + simulated bots (bots backfill when real users are scarce).
