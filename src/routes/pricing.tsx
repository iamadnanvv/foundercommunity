import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "@/lib/razorpay.functions";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const s = document.createElement("script");
    s.src = RAZORPAY_SCRIPT;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const PERKS = [
  "Lifetime access to the founder community",
  "Private feed: validation, fundraising, growth",
  "Curated resource library and templates",
  "Startup showcase with upvotes & feedback",
  "Member directory + DMs with vetted founders",
  "Early access to events and AI tools",
];

function PricingPage() {
  const navigate = useNavigate();
  const createOrder = useServerFn(createRazorpayOrder);
  const verifyPayment = useServerFn(verifyRazorpayPayment);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    loadRazorpay();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setName(
        (data.user?.user_metadata?.full_name as string | undefined) ?? null,
      );
    });
  }, []);

  async function handlePay() {
    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Please sign in to continue");
        navigate({ to: "/auth" });
        return;
      }

      const ok = await loadRazorpay();
      if (!ok) {
        toast.error("Failed to load checkout. Check your connection.");
        return;
      }

      const order = await createOrder();

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "FounderHuntCommunity",
        description: "Lifetime access",
        prefill: {
          email: email ?? undefined,
          name: name ?? undefined,
        },
        theme: { color: "#D4AF37" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifyPayment({ data: response });
            toast.success("Welcome aboard! Lifetime access unlocked.");
            navigate({ to: "/dashboard" });
          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed. Contact support.");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.on("payment.failed", (resp: any) => {
        console.error("payment.failed", resp);
        toast.error(resp?.error?.description ?? "Payment failed");
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="mb-10 text-center">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
          >
            ← Back home
          </Link>
          <h1 className="mt-6 font-display text-5xl md:text-6xl">
            One payment. <span className="text-gold">Lifetime access.</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            No subscriptions. No upsells. Join the founder community for life.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-10 shadow-2xl">
          <div className="flex items-baseline justify-center gap-2">
            <span className="font-display text-6xl text-gold">₹599</span>
            <span className="text-sm text-muted-foreground">one-time</span>
          </div>

          <ul className="mt-8 grid gap-3">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <Button
            onClick={handlePay}
            disabled={loading}
            className="mt-10 h-12 w-full bg-gold text-background hover:bg-gold/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Opening checkout…
              </>
            ) : (
              "Get lifetime access — ₹599"
            )}
          </Button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Secure payments by Razorpay. UPI, cards, net banking & wallets.
          </p>
        </div>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — FounderHuntCommunity" },
      {
        name: "description",
        content:
          "Lifetime access to FounderHuntCommunity for a single ₹599 payment.",
      },
    ],
  }),
});
