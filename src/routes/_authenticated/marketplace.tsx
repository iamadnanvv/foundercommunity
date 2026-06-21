import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";

export const Route = createFileRoute("/_authenticated/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace · FounderHuntCommunity" }] }),
  component: MarketplacePage,
});

const CATEGORIES = [
  "Co-Founder Search", "Developer Hiring", "Designer Hiring",
  "Marketing Partners", "Growth Experts", "Agencies", "Freelancers",
];

function MarketplacePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 lg:p-10">
      <header>
        <h1 className="font-display text-3xl font-bold text-foreground">Collaboration Marketplace</h1>
        <p className="mt-1 text-sm text-muted-foreground">Find your co-founder, hire talent, or offer your services.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <div key={c} className="rounded-2xl border border-border bg-surface p-6">
            <Briefcase className="mb-3 size-5 text-gold" />
            <h3 className="font-display font-bold text-foreground">{c}</h3>
            <p className="mt-1 text-xs text-muted-foreground">Coming soon — first listings drop next week.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
