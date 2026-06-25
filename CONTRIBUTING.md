# Contributing

Read [`README.md`](./README.md) first — it covers the stack, folder layout, auth flow, database conventions, and Razorpay integration.

## Ground rules

1. **Don't edit auto-generated files.** That includes `src/routeTree.gen.ts`, anything under `src/integrations/supabase/` (client, types, middleware), `.env`, and `supabase/config.toml`.
2. **Routes are file-based.** Add a file under `src/routes/`; the plugin regenerates `routeTree.gen.ts`. The `createFileRoute("...")` string must match the filename mapping (`a.b.c.tsx` → `/a/b/c`).
3. **Protected pages live under `src/routes/_authenticated/`.** The layout there redirects unauthenticated users.
4. **Server logic uses `createServerFn`.** Put it in a `*.functions.ts` file under `src/lib/`. Webhooks / public APIs use `createFileRoute` server routes under `src/routes/api/public/*` and must verify the caller.
5. **Every new public-schema table needs `GRANT` + RLS + policies** in the same migration. See README → Database.
6. **Use design tokens.** No hardcoded colors. Use `bg-background`, `text-foreground`, `bg-gold`, etc.
7. **Never check user roles from client state.** Use the `has_role()` SQL function inside RLS policies.

## Adding a feature checklist

- [ ] Route file created under the right folder (`_authenticated/` if it requires login)
- [ ] `head()` set with unique title + description (and og:image at leaf if relevant)
- [ ] Data fetched via TanStack Query loader + `useSuspenseQuery` (not `useEffect + fetch`)
- [ ] Any new server function: `*.functions.ts`, `requireSupabaseAuth` if user-scoped
- [ ] Any new table: migration with CREATE → GRANT → ENABLE RLS → POLICY
- [ ] No `console.log` left in committed code; errors surfaced via `sonner` toast
- [ ] `bun run lint` clean

## Useful commands

```bash
bun run dev          # dev server on :8080
bun run build        # production build
bun run lint         # eslint
bunx tsgo --noEmit   # fast typecheck
```
