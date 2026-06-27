# Testing

| Layer | Tool | Command |
| --- | --- | --- |
| Types | tsgo | `bunx tsgo --noEmit` |
| Lint | ESLint | `bun run lint` |
| Unit  | (not yet) — Vitest planned | `bunx vitest run` |
| E2E   | Playwright | `bunx playwright test` |

## E2E layout

```
tests/e2e/
  auth.spec.ts      # landing, /auth UI, protected redirect
  payments.spec.ts  # /pricing renders, Razorpay loads, signed-out flow
```

`playwright.config.ts` boots `bun run preview --port 8080` automatically.
Locally, an already-running dev server is reused (`reuseExistingServer`).

## Writing a new spec

1. Drop a `*.spec.ts` under `tests/e2e/`.
2. Use stable selectors: `getByRole`, `getByLabel`. Avoid CSS classes.
3. Don't depend on real third-party state (Razorpay test cards, Google
   OAuth, Supabase email confirm). Stub or guard those flows.
4. Run locally: `bun run dev` in one terminal, `bunx playwright test` in
   another.

## CI

Both jobs in `.github/workflows/ci.yml` must be green to merge.
