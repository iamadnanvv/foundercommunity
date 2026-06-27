# ADR-0001: TanStack Start over Next.js

- **Status:** Accepted
- **Date:** 2026-06-27

## Context

FounderHuntCommunity needs SSR for SEO on the landing/pricing pages, a SPA-
feel for the authenticated app, type-safe routing, and a server-function
RPC layer for Razorpay + Supabase admin calls. The Lovable platform deploys
to Cloudflare Workers with `nodejs_compat`.

## Decision

Use **TanStack Start v1** (React 19 + Vite 7) with file-based routing under
`src/routes/`. Use `createServerFn` for app-internal RPC and
`createFileRoute` server handlers under `src/routes/api/public/*` for
webhooks.

## Alternatives considered

- **Next.js (App Router)** — heavier runtime, weaker first-class typed
  routing, and the Lovable template targets TanStack Start.
- **Remix** — viable, but lacks the TanStack Query integration we use for
  loaders and the typed link/router story we prefer.
- **Pure SPA (Vite + React Router)** — no SSR, harms SEO on landing.

## Consequences

- Typed routes — `<Link to="/dashboard">` is checked at build time.
- Server fns and route handlers share one bundler config; care needed
  around `*.server.ts` boundaries (see `src/lib/`).
- Server runtime is Cloudflare Workers — Node-only npm packages are off-
  limits (no `child_process`, `sharp`, `puppeteer`, etc.).
