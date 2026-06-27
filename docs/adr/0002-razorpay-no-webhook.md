# ADR-0002: Razorpay without webhooks — signature verification at handler return

- **Status:** Accepted
- **Date:** 2026-06-27

## Context

Razorpay supports two ways to confirm a payment: (a) configure a webhook
that Razorpay calls server-to-server with an HMAC signature; (b) verify the
HMAC signature returned to the client `handler` callback at modal close.
Webhooks require a public URL, a separate `RAZORPAY_WEBHOOK_SECRET`, and
careful idempotency. For a single SKU (₹599 lifetime, no subscriptions, no
refunds workflow) the webhook adds operational overhead without
materially improving correctness.

## Decision

Use **client-callback signature verification**. The Razorpay JS SDK
`handler` posts `{razorpay_order_id, razorpay_payment_id, razorpay_signature}`
to our `verifyRazorpayPayment` server function, which:

1. Computes `HMAC-SHA256(order_id|payment_id, RAZORPAY_KEY_SECRET)`.
2. Compares it to `razorpay_signature` (constant-time equality).
3. On match: updates the `payments` row to `success` and flips
   `profiles.is_paid = true` (via the service-role admin client).

No webhook endpoint, no `RAZORPAY_WEBHOOK_SECRET`.

## Alternatives considered

- **Webhook-only** — extra moving parts; payment success is non-blocking
  for the UI but adds a second source of truth to reconcile.
- **Both** — best for high volume; unnecessary at our scale.

## Consequences

- Simpler ops (one less secret, one less public endpoint, no idempotency
  table).
- If the user closes the browser between Razorpay's confirmation and our
  handler firing, the `payments` row stays `pending` until a manual sweep.
  Mitigation: a future cron can call Razorpay's `/orders/{id}/payments`
  API to reconcile.
- We MUST validate `razorpay_signature` server-side — the client cannot
  be trusted.
