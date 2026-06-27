# Authentication

Supabase Auth handles credentials, sessions, and OAuth. The frontend uses the
**publishable** key; sensitive operations run server-side via
`createServerFn` + `requireSupabaseAuth` middleware.

## Supported methods

- **Email + password** — with email confirmation enabled. New signups receive
  a verification link; until they click it, sign-in returns "Email not
  confirmed" (we surface a friendly version).
- **Google OAuth** — via `lovable.auth.signInWithOAuth("google", …)`. The
  `redirect_uri` must be a full same-origin URL (we use `${origin}/dashboard`).

## Session lifecycle

1. User signs in → Supabase issues an access + refresh token, stored in
   `localStorage` under `sb-<project>-auth-token`.
2. `supabase.auth.onAuthStateChange` notifies subscribers.
3. The protected layout (`src/routes/_authenticated/route.tsx`) reads
   `getSession()` on mount; if null, it redirects to `/auth`.
4. The TanStack client middleware (`src/integrations/supabase/auth-attacher.ts`,
   wired in `src/start.ts`) attaches the bearer token to every server-function
   call so `requireSupabaseAuth` can authorize it.

## Why no auth in loaders of public routes?

A `createServerFn` gated by `requireSupabaseAuth` throws 401 without a
bearer token. SSR/prerender runs without a session, so calling such a
function from a **public** route loader breaks `build:dev`. Always call
those server fns from a component (via `useServerFn` + `useQuery`) or
from a loader **under** `_authenticated/`.

## Role-based access

Roles live in a **separate** `user_roles` table — never on `profiles`.
The `has_role(user_id, role)` security-definer function is used inside RLS
policies. See [ADR-0003](./adr/0003-rls-and-roles.md) for the rationale.

```sql
create policy "admins can update any post"
  on public.posts for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));
```

## Files

- `src/routes/auth.tsx` — UI
- `src/routes/_authenticated/route.tsx` — guard
- `src/integrations/supabase/auth-middleware.ts` — server-side gate
- `src/integrations/supabase/auth-attacher.ts` — bearer attacher
