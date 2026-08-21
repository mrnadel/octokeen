# Content Rules

Read `docs/content-writing-guide.md` before writing or editing course content.

Never, regardless of how small the edit:

- **Change an existing `id`.** User progress is keyed on lesson and question IDs.
- **Delete a lesson** that `meta.ts` still lists. `loadUnitData` throws.
- **Write a distractor explanation as** `"<option>" is wrong because <correct answer's explanation>`. This one pattern caused ~80% of the defects found in the last content audit. Name the specific error that option makes.
- **Drop a currency symbol.** `$1,000`, never `1,000`.
- **Use an em dash or double dash.**

After any content change:

```
npx tsc --noEmit
npx tsx scripts/qa-content.ts     # zero violations for units you touched
```

`npx tsx scripts/seed-content.ts` publishes content to the **production database**. Upsert-only and safe, but confirm with the repo owner before running it.
