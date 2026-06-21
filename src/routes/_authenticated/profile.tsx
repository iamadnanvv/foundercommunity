import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "My Profile · FounderHuntCommunity" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const qc = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["my-profile-edit"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      return data;
    },
  });

  const [form, setForm] = useState({
    full_name: "", bio: "", startup_name: "", startup_website: "",
    startup_stage: "", industry: "", linkedin_url: "", looking_for: "", funding_status: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        bio: profile.bio ?? "",
        startup_name: profile.startup_name ?? "",
        startup_website: profile.startup_website ?? "",
        startup_stage: profile.startup_stage ?? "",
        industry: profile.industry ?? "",
        linkedin_url: profile.linkedin_url ?? "",
        looking_for: profile.looking_for ?? "",
        funding_status: profile.funding_status ?? "",
      });
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("profiles").update(form).eq("id", u.user.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile saved");
    qc.invalidateQueries({ queryKey: ["my-profile-edit"] });
    qc.invalidateQueries({ queryKey: ["my-profile"] });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6 lg:p-10">
      <header>
        <h1 className="font-display text-3xl font-bold text-foreground">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Help other founders find and connect with you.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-5 rounded-3xl border border-border bg-surface p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
          <Input label="LinkedIn URL" value={form.linkedin_url} onChange={(v) => setForm({ ...form, linkedin_url: v })} placeholder="https://linkedin.com/in/..." />
        </div>
        <Textarea label="Bio" value={form.bio} onChange={(v) => setForm({ ...form, bio: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Startup name" value={form.startup_name} onChange={(v) => setForm({ ...form, startup_name: v })} />
          <Input label="Startup website" value={form.startup_website} onChange={(v) => setForm({ ...form, startup_website: v })} placeholder="https://" />
          <Input label="Stage" value={form.startup_stage} onChange={(v) => setForm({ ...form, startup_stage: v })} placeholder="idea / mvp / launched / scaling" />
          <Input label="Industry" value={form.industry} onChange={(v) => setForm({ ...form, industry: v })} />
          <Input label="Funding status" value={form.funding_status} onChange={(v) => setForm({ ...form, funding_status: v })} placeholder="bootstrapped / pre-seed / seed…" />
          <Input label="Looking for" value={form.looking_for} onChange={(v) => setForm({ ...form, looking_for: v })} placeholder="co-founder / advisors / customers…" />
        </div>
        <button type="submit" className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-background">Save profile</button>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} maxLength={500} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
    </label>
  );
}
