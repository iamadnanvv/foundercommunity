import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Rocket, ExternalLink, ArrowUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/showcase")({
  head: () => ({ meta: [{ title: "Startup Showcase · FounderHuntCommunity" }] }),
  component: ShowcasePage,
});

function ShowcasePage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ startup_name: "", website: "", description: "", industry: "" });

  const { data: startups } = useQuery({
    queryKey: ["startups"],
    queryFn: async () => {
      const { data } = await supabase.from("startups").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("startups").insert({ ...form, founder_id: u.user.id });
    if (error) { toast.error(error.message); return; }
    toast.success("Startup submitted");
    setShowForm(false);
    setForm({ startup_name: "", website: "", description: "", industry: "" });
    qc.invalidateQueries({ queryKey: ["startups"] });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Startup Showcase</h1>
          <p className="mt-1 text-sm text-muted-foreground">Discover what fellow founders are building. Upvote your favorites.</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="rounded-full bg-gold px-5 py-2 text-sm font-bold text-background">
          {showForm ? "Cancel" : "Submit your startup"}
        </button>
      </header>

      {showForm && (
        <form onSubmit={submit} className="grid gap-3 rounded-3xl border border-border bg-surface p-5 sm:grid-cols-2">
          <input required placeholder="Startup name" value={form.startup_name} onChange={(e) => setForm({ ...form, startup_name: e.target.value })} className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          <input placeholder="https://yourstartup.com" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none" />
          <input placeholder="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none sm:col-span-2" />
          <textarea required placeholder="One-line description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} maxLength={300} className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none sm:col-span-2" />
          <button type="submit" className="rounded-full bg-gold px-5 py-2 text-sm font-bold text-background sm:col-span-2">Submit</button>
        </form>
      )}

      {(startups ?? []).length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface/50 p-12 text-center">
          <Rocket className="mx-auto mb-4 size-10 text-gold" />
          <p className="text-sm text-muted-foreground">Be the first to submit a startup.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {startups!.map((s) => <StartupCard key={s.id} startup={s} />)}
        </div>
      )}
    </div>
  );
}

function StartupCard({ startup }: { startup: any }) {
  const qc = useQueryClient();
  const { data: voteCount } = useQuery({
    queryKey: ["startup-votes", startup.id],
    queryFn: async () => {
      const { count } = await supabase.from("startup_upvotes").select("*", { count: "exact", head: true }).eq("startup_id", startup.id);
      return count ?? 0;
    },
  });
  const { data: voted } = useQuery({
    queryKey: ["startup-voted", startup.id],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return false;
      const { data } = await supabase.from("startup_upvotes").select("startup_id").eq("startup_id", startup.id).eq("user_id", u.user.id).maybeSingle();
      return !!data;
    },
  });
  const toggle = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    if (voted) await supabase.from("startup_upvotes").delete().eq("startup_id", startup.id).eq("user_id", u.user.id);
    else await supabase.from("startup_upvotes").insert({ startup_id: startup.id, user_id: u.user.id });
    qc.invalidateQueries({ queryKey: ["startup-votes", startup.id] });
    qc.invalidateQueries({ queryKey: ["startup-voted", startup.id] });
  };

  return (
    <article className="flex gap-4 rounded-2xl border border-border bg-surface p-5">
      <button onClick={toggle} className={`flex h-fit shrink-0 flex-col items-center gap-1 rounded-xl border px-3 py-2 transition ${voted ? "border-gold bg-gold-soft text-gold" : "border-border text-muted-foreground hover:text-foreground"}`}>
        <ArrowUp className="size-4" />
        <span className="text-xs font-bold">{voteCount ?? 0}</span>
      </button>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold text-foreground">{startup.startup_name}</h3>
          {startup.website && (
            <a href={startup.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold">
              <ExternalLink className="size-4" />
            </a>
          )}
        </div>
        {startup.industry && <div className="text-xs uppercase tracking-widest text-gold">{startup.industry}</div>}
        <p className="mt-2 text-sm text-muted-foreground">{startup.description}</p>
      </div>
    </article>
  );
}
