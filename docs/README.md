# FounderHuntCommunity — Developer Portal

Welcome. This `/docs` tree is the onboarding entry point for new engineers.
Pair it with the top-level [`README.md`](../README.md) (quickstart) and
[`CONTRIBUTING.md`](../CONTRIBUTING.md) (ground rules).

## Read in this order

1. [Architecture overview](./architecture.md) — stack, runtime, request flow
2. [Routing](./routing.md) — TanStack Start file-based routing, guards, layouts
3. [Authentication](./authentication.md) — Supabase Auth, email + Google OAuth, session handling
4. [Payments](./payments.md) — Razorpay ₹599 lifetime-access flow (no webhooks)
5. [Database & RLS](./database.md) — schema, policies, the `has_role` pattern
6. [Deployment](./deployment.md) — Lovable Cloud, CI, environments
7. [Testing](./testing.md) — typecheck, lint, Playwright e2e
8. [Architecture Decision Records](./adr/README.md) — historical "why" decisions

## Quickstart

```bash
bun install
bun run dev          # http://localhost:8080
bun run lint
bunx tsgo --noEmit
bunx playwright test # e2e smoke (needs build first in CI)
```

Required env vars live in `.env` (auto-provisioned by Lovable Cloud):
`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`.

Server-only secrets (set via the Lovable secret manager, never committed):
`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.
