# Routing

TanStack Router uses **file-based routing**. Every file in `src/routes/` is a
route; `src/routeTree.gen.ts` is auto-generated — never edit it.

## Conventions

| File | URL |
| --- | --- |
| `index.tsx` | `/` |
| `auth.tsx` | `/auth` |
| `pricing.tsx` | `/pricing` |
| `_authenticated/route.tsx` | pathless layout — gates all children |
| `_authenticated/dashboard.tsx` | `/dashboard` |
| `_authenticated/feed.tsx` | `/feed` |
| `api/public/foo.ts` | `/api/public/foo` (external/webhook endpoints) |

## Layouts

`src/routes/__root.tsx` provides the html/head/body shell — must render
`<Outlet />`. `src/routes/_authenticated/route.tsx` is a pathless layout
that performs the auth check and renders the sidebar shell.

## Adding a page

1. Create the file under the right folder (`_authenticated/` if it requires login).
2. Export a `Route` via `createFileRoute("/path")({ component, head, loader? })`.
3. Set a unique `head()` with title + description (SEO).
4. Add navigation via `<Link to="/path">` — TanStack typechecks the target.

## Data loading

Default to **TanStack Query in the loader**:

```ts
loader: ({ context }) => context.queryClient.ensureQueryData(postsQueryOptions)
// then in the component:
const { data } = useSuspenseQuery(postsQueryOptions);
```

Do not use `useEffect + fetch` for initial render.

## Error & not-found boundaries

Every route with a loader sets `errorComponent` and `notFoundComponent`.
The root sets `notFoundComponent` for unmatched URLs. See
`src/routes/__root.tsx`.
