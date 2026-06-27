# Payments — Razorpay (₹599 Lifetime)

A one-time payment unlocks lifetime access. We intentionally **do not use a
webhook**; verification happens server-side via HMAC signature at the moment
the checkout returns. See [ADR-0002](./adr/0002-razorpay-no-webhook.md).

## Flow

```
Client (/pricing)                 Server (createServerFn)        Razorpay
─────────────────                 ────────────────────────       ────────
  click "Pay" ───────────────────▶ createRazorpayOrder
                                      ├─ POST /v1/orders ─────────▶
                                      ◀───────────────── order.id
                                      └─ INSERT payments(pending)
  ◀──────────────── { orderId, keyId, amount, currency }
  Razorpay.open(...)
       │  user pays in modal
       ▼
  handler({razorpay_order_id,
           razorpay_payment_id,
           razorpay_signature})  ─▶ verifyRazorpayPayment
                                      ├─ HMAC-SHA256(order|payment, KEY_SECRET)
                                      │   == razorpay_signature ?
                                      ├─ UPDATE payments status=success
                                      └─ UPDATE profiles is_paid=true
  ◀──────────────── { ok: true }
  navigate(/dashboard)
```

## Files

- `src/routes/pricing.tsx` — UI + Razorpay modal wiring
- `src/lib/razorpay.functions.ts` — `createRazorpayOrder`, `verifyRazorpayPayment`

## Secrets

- `RAZORPAY_KEY_ID` — server-side; passed to the client per-order (this is
  expected — Razorpay's checkout SDK reads it client-side).
- `RAZORPAY_KEY_SECRET` — server-side only; used to authenticate the order
  creation call and to compute the HMAC.

Rotate keys in the Razorpay dashboard, then update both secrets in the
Lovable secret manager.

## Failure modes

| Symptom | Likely cause |
| --- | --- |
| 401 on `createRazorpayOrder` | user is signed out — redirect to `/auth` |
| 500 on `createRazorpayOrder` | secrets unset, or Razorpay rejected the order (check logs) |
| "Invalid payment signature" | tampered response, or `RAZORPAY_KEY_SECRET` mismatch |
| Modal closes silently | `ondismiss` fires — already handled |

## Testing

The Playwright spec `tests/e2e/payments.spec.ts` verifies:
- `/pricing` renders the CTA and price
- The Razorpay checkout script lazy-loads
- Clicking "Pay" while signed out redirects to `/auth`

It does **not** execute a real payment. Use Razorpay test keys
(`rzp_test_*`) and the dashboard's test cards for manual end-to-end runs.
