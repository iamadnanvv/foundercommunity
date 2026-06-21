import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Rocket,
  Calendar,
  Users,
  Briefcase,
  User as UserIcon,
  LogOut,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/feed", label: "Community Feed", icon: MessageSquare },
  { to: "/resources", label: "Resource Library", icon: BookOpen },
  { to: "/showcase", label: "Startup Showcase", icon: Rocket },
  { to: "/events", label: "Events", icon: Calendar },
  { to: "/members", label: "Members", icon: Users },
  { to: "/marketplace", label: "Marketplace", icon: Briefcase },
  { to: "/profile", label: "My Profile", icon: UserIcon },
] as const;

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-surface p-5 lg:flex">
        <Link to="/dashboard" className="mb-8 flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-gold">
            <div className="size-3 rounded-full bg-background" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">FounderHunt</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-gold-soft text-gold"
                    : "text-muted-foreground hover:bg-background hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleSignOut}
          className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="flex w-full flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md lg:hidden">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="grid size-7 place-items-center rounded-lg bg-gold">
              <div className="size-2.5 rounded-full bg-background" />
            </div>
            <span className="font-display text-base font-bold text-foreground">FounderHunt</span>
          </Link>
          <button onClick={handleSignOut} className="text-xs text-muted-foreground">Sign out</button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-surface/50 px-3 py-2 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              activeProps={{ className: "bg-gold-soft text-gold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
