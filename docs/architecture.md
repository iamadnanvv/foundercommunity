# Architecture

## Stack

| Layer        | Technology |
| ------------ | ---------- |
| Framework    | TanStack Start v1 (React 19) on Vite 7 |
| Styling      | Tailwind v4 (CSS-first via `src/styles.css`) + shadcn/ui |
| Server runtime | Cloudflare Workers (nodejs_compat) |
| Database     | Supabase Postgres with Row-Level Security |
| Auth         | Supabase Auth — Email/Password + Google OAuth |
| Payments     | Razorpay (one-time ₹599, signature-verified) |
| Hosting      | Lovable Cloud |
| Package mgr  | Bun |

## Runtime topology

```
┌─────────────────┐    HTTPS    ┌──────────────────────┐
│  Browser (SPA)  │ ──────────▶ │  Cloudflare Worker   │
│  React 19 + TQ  │             │  (TanStack SSR +     │
│                 │ ◀────────── │   createServerFn)    │
└────────┬────────┘             └──────────┬───────────┘
         │                                 │
         │ supabase-js (anon key, RLS)     │ service-role (admin)
         ▼                                 ▼
                  ┌────────────────────────────┐
                  │   Supabase (Postgres)      │
                  │   - profiles, posts...     │
                  │   - user_roles + has_role()│
                  └────────────────────────────┘
```

## Folder layout

```
src/
  routes/                 # file-based routing (TanStack Router)
    __root.tsx            # html/head/body shell
    index.tsx             # landing page
    auth.tsx              # sign-in / sign-up / forgot password
    pricing.tsx           # public ₹599 checkout
    _authenticated/       # gated subtree (route guard in route.tsx)
    api/public/           # webhooks / external endpoints (none yet)
  lib/                    # *.functions.ts (server fns) + utilities
  integrations/
    supabase/             # AUTO-GENERATED — do not edit
    lovable/              # platform helpers
  components/ui/          # shadcn primitives
  styles.css              # Tailwind v4 tokens (`--gold`, surfaces, etc.)
supabase/                 # config + migrations
tests/e2e/                # Playwright smoke tests
docs/                     # this portal
docs/adr/                 # Architecture Decision Records
```

## Request flow (typical authenticated read)

1. User visits `/_authenticated/feed`.
2. `src/routes/_authenticated/route.tsx` checks the session via `supabase.auth.getSession()`; unauthenticated users get redirected to `/auth`.
3. The feed loader calls `queryClient.ensureQueryData(...)` which invokes a `createServerFn` from `src/lib/`.
4. The server fn is gated by `requireSupabaseAuth` middleware — it reads the user's bearer token, attaches a per-request Supabase client, and exposes `context.userId` / `context.supabase`.
5. RLS policies enforce row visibility based on `auth.uid()`.

## Why TanStack Start?

See [ADR-0001](./adr/0001-tanstack-start.md).
