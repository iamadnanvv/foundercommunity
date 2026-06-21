import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { BookOpen, Download } from "lucide-react";

export const Route = createFileRoute("/_authenticated/resources")({
  head: () => ({ meta: [{ title: "Resource Library · FounderHuntCommunity" }] }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const [search, setSearch] = useState("");
  const { data: resources } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const filtered = (resources ?? []).filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  const byCategory = filtered.reduce<Record<string, typeof filtered>>((acc, r) => {
    (acc[r.category] ||= []).push(r);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Resource Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">SaaS playbooks, AI guides, pitch decks, SOPs and templates.</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search resources…"
          className="w-full rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none sm:w-72"
        />
      </header>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface/50 p-12 text-center">
          <BookOpen className="mx-auto mb-4 size-10 text-gold" />
          <h2 className="font-display text-xl font-bold text-foreground">Library is being curated</h2>
          <p className="mt-2 text-sm text-muted-foreground">New SaaS playbooks, AI guides, and templates are dropping weekly.</p>
        </div>
      ) : (
        Object.entries(byCategory).map(([cat, items]) => (
          <section key={cat} className="space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-gold">{cat}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((r) => (
                <a key={r.id} href={r.file_url} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-gold/50">
                  <BookOpen className="mb-3 size-5 text-gold" />
                  <h3 className="font-display font-bold text-foreground">{r.title}</h3>
                  {r.description && <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>}
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground transition group-hover:text-gold">
                    <Download className="size-3" /> Download
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
