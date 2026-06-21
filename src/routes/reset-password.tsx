import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password · FounderHuntCommunity" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Min 8 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated.");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-6">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Set a new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Pick something strong. Minimum 8 characters.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            required
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gold py-3 text-sm font-bold text-background disabled:opacity-50"
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
