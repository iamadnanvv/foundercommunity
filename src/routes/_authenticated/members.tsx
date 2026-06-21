import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated/members")({
  head: () => ({ meta: [{ title: "Members · FounderHuntCommunity" }] }),
  component: MembersPage,
});

function MembersPage() {
  const [search, setSearch] = useState("");
  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(100);
      return data ?? [];
    },
  });

  const filtered = (members ?? []).filter((m) => {
    const q = search.toLowerCase();
    return (
      (m.full_name ?? "").toLowerCase().includes(q) ||
      (m.startup_name ?? "").toLowerCase().includes(q) ||
      (m.industry ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Members</h1>
          <p className="mt-1 text-sm text-muted-foreground">Connect with founders building in your space.</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, startup, industry…"
          className="w-full rounded-full border border-border bg-surface px-4 py-2.5 text-sm focus:border-gold focus:outline-none sm:w-80"
        />
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => {
          const initials = (m.full_name ?? "F").split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();
          return (
            <article key={m.id} className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-full bg-gold-soft font-display text-base font-bold text-gold">
                  {initials}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{m.full_name ?? "Founder"}</h3>
                  {m.startup_name && <p className="text-xs text-muted-foreground">{m.startup_name}</p>}
                </div>
              </div>
              {m.bio && <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">{m.bio}</p>}
              <div className="flex flex-wrap gap-2 text-xs">
                {m.industry && <span className="rounded-full bg-gold-soft px-2 py-0.5 text-gold">{m.industry}</span>}
                {m.startup_stage && <span className="rounded-full border border-border px-2 py-0.5 text-muted-foreground">{m.startup_stage}</span>}
              </div>
              {m.linkedin_url && (
                <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs text-gold hover:underline">
                  LinkedIn <ExternalLink className="size-3" />
                </a>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
