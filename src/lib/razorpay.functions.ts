import { createServerFn } from "@tanstack/react-start";
import { createHmac } from "crypto";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const AMOUNT_PAISE = 59900; // ₹599
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
