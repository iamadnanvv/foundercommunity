# Database & RLS

Postgres on Supabase. Every public table follows the same migration shape:

```sql
CREATE TABLE public.foo (...);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.foo TO authenticated;
GRANT ALL ON public.foo TO service_role;
-- optional: GRANT SELECT ON public.foo TO anon;  -- only if anon reads
ALTER TABLE public.foo ENABLE ROW LEVEL SECURITY;
CREATE POLICY ...
```

PostgREST does NOT grant default privileges on `public` — without `GRANT`,
all queries fail with a permission error even with RLS allowing the row.

## Schema (Phase 1)

| Table | Purpose |
| --- | --- |
| `profiles` | 1:1 with `auth.users`; full_name, bio, avatar, is_paid |
| `user_roles` | `(user_id, role)` — roles separated from profile (see ADR-0003) |
| `posts` | community feed entries, categorized |
| `post_likes` | upvotes, unique per (user, post) |
| `resources` | curated templates / playbooks |
| `startups` | showcase entries with upvotes |
| `payments` | Razorpay order/payment audit trail |

## Role checks

Never trust client-side role state. Use the `has_role()` SECURITY DEFINER
function in policies:

```sql
create policy "admins manage resources"
  on public.resources for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
```

## Migrations

Live in `supabase/migrations/`. Apply via the Supabase migration tool. Do
not edit applied migrations — add a new one.
