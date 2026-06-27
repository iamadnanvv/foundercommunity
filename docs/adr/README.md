# Architecture Decision Records

ADRs capture significant technical decisions: the context, the choice, the
alternatives, and the consequences. Once accepted, an ADR is immutable —
supersede it with a new ADR rather than editing.

## Format

Each file follows [`template.md`](./template.md):

```
# ADR-NNNN: Title
Status: Proposed | Accepted | Superseded by ADR-XXXX
Date: YYYY-MM-DD

## Context
## Decision
## Alternatives considered
## Consequences
```

## Index

- [ADR-0001 — TanStack Start over Next.js](./0001-tanstack-start.md)
- [ADR-0002 — Razorpay without webhooks (signature verification at handler)](./0002-razorpay-no-webhook.md)
- [ADR-0003 — Roles in a separate table + `has_role()` for RLS](./0003-rls-and-roles.md)
- [ADR-0004 — Email + Google OAuth via Supabase, email confirmation on](./0004-auth-strategy.md)

## Adding a new ADR

1. Copy `template.md` to `NNNN-short-slug.md` with the next number.
2. Fill in the sections; keep it tight (1–2 pages).
3. Add it to the index above.
4. Open a PR; the team discusses status before merge.
