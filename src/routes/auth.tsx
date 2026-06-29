import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In · FounderHuntCommunity" },
      { name: "description", content: "Sign in or create your FounderHuntCommunity account." },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(8, "Min 8 characters").max(72);
const nameSchema = z.string().trim().min(2, "Enter your name").max(80);
// E.164 format: +<country code><number>, total 8–16 digits.
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,15}$/, "Use E.164 format, e.g. +14155552671");
const otpSchema = z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code");

type Mode = "signin" | "signup" | "forgot" | "phone";


function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const handlePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const phoneOk = phoneSchema.safeParse(phone);
      if (!phoneOk.success) throw new Error(phoneOk.error.errors[0].message);

      if (!otpSent) {
        // Sends an SMS OTP. `shouldCreateUser: true` creates a user on first sign-in.
        const { error } = await supabase.auth.signInWithOtp({
          phone: phoneOk.data,
          options: { shouldCreateUser: true },
        });
        if (error) throw error;
        setOtpSent(true);
        toast.success("Code sent. Check your messages.");
      } else {
        const otpOk = otpSchema.safeParse(otp);
        if (!otpOk.success) throw new Error(otpOk.error.errors[0].message);
        const { error } = await supabase.auth.verifyOtp({
          phone: phoneOk.data,
          token: otpOk.data,
          type: "sms",
        });
        if (error) throw error;
        toast.success("Welcome to FounderHunt.");
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Phone sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const emailOk = emailSchema.safeParse(email);
      if (!emailOk.success) throw new Error(emailOk.error.errors[0].message);

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(emailOk.data, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Reset link sent. Check your inbox.");
        setMode("signin");
        return;
      }

      const pwOk = passwordSchema.safeParse(password);
      if (!pwOk.success) throw new Error(pwOk.error.errors[0].message);

      if (mode === "signup") {
        const nameOk = nameSchema.safeParse(name);
        if (!nameOk.success) throw new Error(nameOk.error.errors[0].message);
        const { data, error } = await supabase.auth.signUp({
          email: emailOk.data,
          password: pwOk.data,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: nameOk.data },
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Account created. Check your email to confirm and then sign in.");
          setMode("signin");
          setPassword("");
          return;
        }
        toast.success("Account created. Welcome to FounderHunt.");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: emailOk.data, password: pwOk.data });
        if (error) {
          if (error.message.toLowerCase().includes("email not confirmed")) {
            throw new Error("Please confirm your email first — check your inbox for the verification link.");
          }
          throw error;
        }
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) {
      toast.error("Google sign-in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setOtp("");
    setOtpSent(false);
  };


  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-surface p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-gold">
            <div className="size-3 rounded-full bg-background" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">FounderHunt</span>
        </Link>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight text-foreground">
            Build Faster.<br />Validate <span className="text-gold italic">Smarter.</span><br />Scale Together.
          </h2>
          <p className="mt-6 max-w-md text-muted-foreground">
            Join 420+ founders shipping the next generation of SaaS and AI products.
          </p>
        </div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          ₹599 · Lifetime access · No subscriptions
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground lg:hidden">
            ← Back home
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {mode === "signin" && "Welcome back"}
            {mode === "signup" && "Create your account"}
            {mode === "forgot" && "Reset your password"}
            {mode === "phone" && (otpSent ? "Enter your code" : "Sign in with phone")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin" && "Sign in to your founder account."}
            {mode === "signup" && "Start your lifetime founder journey."}
            {mode === "forgot" && "Enter your email — we'll send a reset link."}
            {mode === "phone" && (otpSent
              ? `We sent a 6-digit code to ${phone}.`
              : "We'll text you a one-time code.")}
          </p>




          {mode !== "forgot" && mode !== "phone" && (
            <button
              type="button"
              onClick={() => switchMode("phone")}
              disabled={loading}
              className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground transition hover:border-gold/50 disabled:opacity-50"
            >
              📱 Continue with phone
            </button>
          )}

          {mode !== "forgot" && mode !== "phone" && (
            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
            </div>
          )}

          {mode === "phone" ? (
            <form onSubmit={handlePhone} className="mt-8 space-y-4">
              <Field
                label="Phone number"
                value={phone}
                onChange={setPhone}
                type="tel"
                placeholder="+14155552671"
              />
              {otpSent && (
                <Field
                  label="Verification code"
                  value={otp}
                  onChange={setOtp}
                  type="text"
                  placeholder="123456"
                />
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gold py-3 text-sm font-bold text-background transition hover:brightness-110 disabled:opacity-50"
              >
                {loading ? "Please wait…" : otpSent ? "Verify & sign in" : "Send code"}
              </button>
              {otpSent && (
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtp(""); }}
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
                >
                  Use a different number
                </button>
              )}
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <Field label="Full name" value={name} onChange={setName} type="text" placeholder="Jane Founder" />
              )}
              <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@startup.com" />
              {mode !== "forgot" && (
                <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="At least 8 characters" />
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gold py-3 text-sm font-bold text-background transition hover:brightness-110 disabled:opacity-50"
              >
                {loading ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
              </button>
            </form>
          )}

          <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                <button onClick={() => switchMode("forgot")} className="hover:text-foreground">Forgot password?</button>
                <button onClick={() => switchMode("signup")} className="hover:text-foreground">
                  New here? <span className="text-gold">Create account</span>
                </button>
              </>
            ) : mode === "signup" ? (
              <button onClick={() => switchMode("signin")} className="ml-auto hover:text-foreground">
                Already a member? <span className="text-gold">Sign in</span>
              </button>
            ) : (
              <button onClick={() => switchMode("signin")} className="ml-auto hover:text-foreground">
                ← Back to sign in
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type, placeholder }: { label: string; value: string; onChange: (v: string) => void; type: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none"
      />
    </label>
  );
}
