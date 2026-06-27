# Deployment

## Environments

| Environment | URL pattern | Source |
| --- | --- | --- |
| Preview | `id-preview--<project>.lovable.app` | every Lovable edit |
| Stable preview | `project--<id>-dev.lovable.app` | latest preview build |
| Production | `project--<id>.lovable.app` (or custom domain) | published deployment |

## Publishing

In the Lovable editor: **Publish** → choose visibility → confirm. The
custom domain (if any) is configured in project settings.

## Secrets

Stored in the Lovable secret manager, exposed as env vars to the server
runtime (Cloudflare Worker). Required:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

`VITE_SUPABASE_*` vars are auto-provisioned by Lovable Cloud.

## CI

`.github/workflows/ci.yml` runs on every push and PR:

1. **quality** — typecheck (`tsgo`), lint (`eslint`), unit tests, build
2. **e2e** — Playwright smoke for auth + payments against the production build

Add the following GitHub repository secrets for the build step (placeholders
work for CI since real Supabase isn't reached during typecheck/build):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## Rollback

Use the Lovable version history (chat → version icon) to revert to a prior
state. Database changes are not auto-reverted — write a corrective
migration.

## Health checks

- `GET /` should return 200 with the landing page HTML.
- `GET /pricing` should return 200 and include the Razorpay script URL.
- `GET /dashboard` (unauthenticated) should client-redirect to `/auth`.
