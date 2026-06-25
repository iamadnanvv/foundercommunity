/**
 * Razorpay payment server functions.
 *
 * Flow (no webhook — verification is signature-based at return time):
 *   1. Client calls `createRazorpayOrder` → server creates an order via
 *      Razorpay REST and inserts a `payments` row with status `pending`.
 *   2. Client opens the Razorpay checkout modal with the returned `orderId`.
 *   3. On success, client calls `verifyRazorpayPayment` with the three
 *      `razorpay_*` fields. Server verifies the HMAC-SHA256 signature
 *      (orderId|paymentId, KEY_SECRET), then flips `payments.status` to
 *      `success` and `profiles.is_paid` to `true` via the admin client.
 *
 * Secrets (server-only env vars, read inside `.handler()`):
 *   - RAZORPAY_KEY_ID
 *   - RAZORPAY_KEY_SECRET
 *
 * Both functions are gated by `requireSupabaseAuth` — never call from a
 * public route loader (SSR/prerender has no bearer token and will 401).
 */
import { createServerFn } from "@tanstack/react-start";
import { createHmac } from "crypto";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** ₹599 lifetime access, expressed in paise (Razorpay's unit). */
const AMOUNT_PAISE = 59900;
const CURRENCY = "INR";


export const createRazorpayOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error("Razorpay keys are not configured");
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: AMOUNT_PAISE,
        currency: CURRENCY,
        receipt: `fh_${context.userId.slice(0, 8)}_${Date.now()}`,
        notes: { user_id: context.userId },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Razorpay order creation failed", res.status, text);
      throw new Error("Could not create payment order");
    }

    const order = (await res.json()) as { id: string; amount: number; currency: string };

    await context.supabase.from("payments").insert({
      user_id: context.userId,
      amount: order.amount,
      currency: order.currency,
      razorpay_order_id: order.id,
      status: "pending",
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    };
  });

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => input,
  )
  .handler(async ({ data, context }) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error("Razorpay keys are not configured");

    const expected = createHmac("sha256", keySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");

    if (expected !== data.razorpay_signature) {
      await context.supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("razorpay_order_id", data.razorpay_order_id)
        .eq("user_id", context.userId);
      throw new Error("Invalid payment signature");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await supabaseAdmin
      .from("payments")
      .update({
        status: "success",
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      })
      .eq("razorpay_order_id", data.razorpay_order_id)
      .eq("user_id", context.userId);

    await supabaseAdmin
      .from("profiles")
      .update({ is_paid: true })
      .eq("id", context.userId);

    return { ok: true };
  });
