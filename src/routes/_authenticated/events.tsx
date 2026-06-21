import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/_authenticated/events")({
  head: () => ({ meta: [{ title: "Events · FounderHuntCommunity" }] }),
  component: EventsPage,
});

function EventsPage() {
  const { data: events } = useQuery({
    queryKey: ["events-all"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").order("event_date", { ascending: true });
      return data ?? [];
    },
  });
  const upcoming = (events ?? []).filter((e) => new Date(e.event_date) >= new Date());
  const past = (events ?? []).filter((e) => new Date(e.event_date) < new Date());

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 lg:p-10">
      <header>
        <h1 className="font-display text-3xl font-bold text-foreground">Events</h1>
        <p className="mt-1 text-sm text-muted-foreground">Weekly sessions, webinars, AMAs, and investor meetups.</p>
      </header>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-widest text-gold">Upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-surface/50 p-10 text-center">
            <Calendar className="mx-auto mb-3 size-8 text-gold" />
            <p className="text-sm text-muted-foreground">No events scheduled yet — new ones drop weekly.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">{upcoming.map((e) => <EventCard key={e.id} event={e} />)}</div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Past</h2>
          <div className="grid gap-4 md:grid-cols-2">{past.map((e) => <EventCard key={e.id} event={e} />)}</div>
        </section>
      )}
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <div className="text-xs uppercase tracking-widest text-gold">
        {new Date(event.event_date).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
      </div>
      <h3 className="mt-2 font-display text-lg font-bold text-foreground">{event.title}</h3>
      {event.speaker && <p className="text-xs text-muted-foreground">with {event.speaker}</p>}
      {event.description && <p className="mt-3 text-sm text-muted-foreground">{event.description}</p>}
    </article>
  );
}
