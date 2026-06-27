# ADR-0004: Email + Google OAuth via Supabase, email confirmation on

- **Status:** Accepted
- **Date:** 2026-06-27

## Context

The product targets founders — a low-spam audience that still benefits
from verified emails (founder directory trust, password recovery,
transactional comms). We want a one-click option (Google) and a classic
password fallback.

## Decision

- Enable **Email/Password** AND **Google OAuth** in Supabase Auth.
- Keep **email confirmation ON**. Signup issues a verification link;
  sign-in is blocked until confirmed.
- After signup, the UI:
  1. Detects a null session (confirmation flow) and shows a clear
     "check your inbox" toast.
  2. Switches the form to Sign-In mode automatically.
- "Email not confirmed" errors are rewritten to a user-friendly message.
- Anonymous sign-ups are disabled.
- Google OAuth `redirect_uri` is a full same-origin URL (`${origin}/dashboard`),
  not a server route.

## Alternatives considered

- **Magic links only** — fewer steps but worse on shared devices and
  harder for password managers.
- **Email confirmation OFF** — faster onboarding, but allows fake
  accounts in a paid, vetted community.
- **OAuth only** — excludes founders without Google accounts and
  complicates support.

## Consequences

- A small drop-off at the "confirm your email" step — accepted in
  exchange for higher list quality.
- We must monitor Supabase email deliverability (custom SMTP recommended
  before scale).
- The `_authenticated` layout is the single source of truth for the
  signed-in check; never gate on client-side role state.
