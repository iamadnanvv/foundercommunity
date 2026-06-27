# ADR-0003: Roles in a separate table + `has_role()` for RLS

- **Status:** Accepted
- **Date:** 2026-06-27

## Context

We need role-based access (admin, founder, investor) enforced at the
database. Two common anti-patterns are: storing the role on the
`profiles`/`users` table (privilege escalation risk if a profile UPDATE
policy is too loose), and checking roles client-side (trivially bypassed).

Supabase RLS policies that reference other tables risk **recursion** if
those tables are also RLS-gated.

## Decision

- Roles live in `public.user_roles (user_id, role)` — a **separate** table.
- A `public.app_role` enum constrains valid values.
- A `public.has_role(_user_id uuid, _role app_role)` function is declared
  `STABLE SECURITY DEFINER` with `search_path = public`. It bypasses RLS
  when evaluating the lookup, preventing recursion.
- RLS policies call `public.has_role(auth.uid(), 'admin')` for privileged
  paths. The client never reads `user_roles` to make decisions.

## Alternatives considered

- **Role column on `profiles`** — rejected: a single overly-permissive
  UPDATE policy becomes a privilege-escalation vector.
- **JWT claims** — possible, but requires custom claim injection and
  re-issuing tokens on role change; SQL function is simpler.
- **Service-role checks only** — too coarse; we want per-row policy
  expressivity.

## Consequences

- Every privileged action's policy must consistently call `has_role()`.
- Adding a new role = enum value + (optionally) new policies; no schema
  changes to existing tables.
- The service-role client (used by admin server fns) bypasses RLS entirely
  — privileged server fns MUST authorize callers explicitly
  (`requireSupabaseAuth` + `has_role`).
