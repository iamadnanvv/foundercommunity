import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/_authenticated/feed")({
  head: () => ({ meta: [{ title: "Community Feed · FounderHuntCommunity" }] }),
  component: FeedPage,
});

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "product_launch", label: "Product Launch" },
  { value: "validation", label: "Validation" },
  { value: "saas_growth", label: "SaaS Growth" },
  { value: "ai_tools", label: "AI Tools" },
  { value: "fundraising", label: "Fundraising" },
  { value: "hiring", label: "Hiring" },
  { value: "partnerships", label: "Partnerships" },
] as const;

type Category = (typeof CATEGORIES)[number]["value"];

function FeedPage() {
  const qc = useQueryClient();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("general");
  const [filter, setFilter] = useState<Category | "all">("all");

  const { data: posts } = useQuery({
    queryKey: ["feed", filter],
    queryFn: async () => {
      let q = supabase
        .from("posts")
        .select("id, content, category, created_at, user_id, profiles:profiles!posts_user_id_fkey(full_name, profile_image)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (filter !== "all") q = q.eq("category", filter);
      const { data, error } = await q;
      if (error) {
        // fallback without join if FK alias fails
        const { data: d2 } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(50);
        return d2 ?? [];
      }
      return data ?? [];
    },
  });

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 5) { toast.error("Say a bit more"); return; }
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("posts").insert({ user_id: u.user.id, content: content.trim(), category });
    if (error) { toast.error(error.message); return; }
    setContent("");
    qc.invalidateQueries({ queryKey: ["feed"] });
    toast.success("Posted to the community");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6 lg:p-10">
      <header>
        <h1 className="font-display text-3xl font-bold text-foreground">Community Feed</h1>
        <p className="mt-1 text-sm text-muted-foreground">Share an update, ask for feedback, celebrate a win.</p>
      </header>

      <form onSubmit={handlePost} className="rounded-3xl border border-border bg-surface p-5">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What are you building today?"
          rows={3}
          maxLength={2000}
          className="w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground"
          >
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <button type="submit" className="rounded-full bg-gold px-5 py-2 text-sm font-bold text-background">
            Post
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>All</FilterChip>
        {CATEGORIES.map((c) => (
          <FilterChip key={c.value} active={filter === c.value} onClick={() => setFilter(c.value)}>
            {c.label}
          </FilterChip>
        ))}
      </div>

      <div className="space-y-3">
        {(posts ?? []).length === 0 && <p className="text-center text-sm text-muted-foreground">No posts yet — be the first.</p>}
        {(posts ?? []).map((p: any) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${active ? "bg-gold text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}

function PostCard({ post }: { post: any }) {
  const qc = useQueryClient();
  const { data: liked } = useQuery({
    queryKey: ["post-liked", post.id],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return false;
      const { data } = await supabase.from("post_likes").select("post_id").eq("post_id", post.id).eq("user_id", u.user.id).maybeSingle();
      return !!data;
    },
  });
  const { data: count } = useQuery({
    queryKey: ["post-likes", post.id],
    queryFn: async () => {
      const { count } = await supabase.from("post_likes").select("*", { count: "exact", head: true }).eq("post_id", post.id);
      return count ?? 0;
    },
  });

  const toggleLike = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    if (liked) {
      await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", u.user.id);
    } else {
      await supabase.from("post_likes").insert({ post_id: post.id, user_id: u.user.id });
    }
    qc.invalidateQueries({ queryKey: ["post-liked", post.id] });
    qc.invalidateQueries({ queryKey: ["post-likes", post.id] });
  };

  const author = post.profiles?.full_name ?? "Founder";
  const initials = author.split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <header className="mb-3 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-full bg-gold-soft font-display text-sm font-bold text-gold">
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{author}</div>
          <div className="text-xs text-muted-foreground">
            <span className="text-gold uppercase tracking-widest">{post.category.replace("_", " ")}</span>
            {" · "}
            {new Date(post.created_at).toLocaleDateString()}
          </div>
        </div>
      </header>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{post.content}</p>
      <footer className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <button onClick={toggleLike} className={`flex items-center gap-1.5 transition ${liked ? "text-gold" : "hover:text-foreground"}`}>
          <Heart className={`size-4 ${liked ? "fill-current" : ""}`} /> {count ?? 0}
        </button>
      </footer>
    </article>
  );
}
