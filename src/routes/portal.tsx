import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, Layers, LogOut, MapPin, Map as MapIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useCms } from "@/lib/cms";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "B2B Portal — GoLookAround" },
      { name: "description", content: "B2B dashboard to manage curations, states and destinations." },
      { property: "og:title", content: "B2B Portal — GoLookAround" },
      { property: "og:description", content: "Manage GoLookAround curations, states and destinations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PortalLayout,
});

const TITLES: Record<string, string> = {
  "/portal": "Overview",
  "/portal/curations": "Curations",
  "/portal/states": "States",
  "/portal/destinations": "Destinations",
};

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hidden rounded-2xl bg-card px-4 py-2 shadow-sm ring-1 ring-border/60 sm:block">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
        {now ? now.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" }) : "—"}
      </p>
      <p className="text-sm font-bold tabular-nums">
        {now ? now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--"}
      </p>
    </div>
  );
}

function PortalLayout() {
  const cms = useCms();
  const path = useRouterState({ select: (s) => s.location.pathname.replace(/\/$/, "") || "/portal" });
  const NAV = [
    { to: "/portal", label: "Overview", icon: LayoutGrid, exact: true, badge: null },
    { to: "/portal/curations", label: "Curations", icon: Layers, exact: false, badge: cms.curations.length },
    { to: "/portal/states", label: "States", icon: MapIcon, exact: false, badge: Object.values(cms.enabledStates).filter(Boolean).length },
    { to: "/portal/destinations", label: "Destinations", icon: MapPin, exact: false, badge: cms.destinations.length },
  ] as const;

  return (
    <div className="min-h-dvh bg-secondary/60 font-[Poppins,sans-serif] lg:grid lg:grid-cols-[17.5rem_1fr]">
      <aside className="flex flex-col bg-background shadow-[1px_0_0_var(--border)] lg:sticky lg:top-0 lg:h-dvh">
        <Link to="/portal" className="flex items-center gap-3 px-7 pt-7">
          <span className="grid size-12 place-items-center overflow-hidden rounded-2xl bg-ink">
            <img src="/golookaround-site-logo.png" alt="" className="size-full object-contain" />
          </span>
          <span>
            <span className="block text-lg font-semibold leading-tight">GoLookAround</span>
            <span className="block text-xs font-bold tracking-[0.18em] text-brand">B2B PORTAL</span>
          </span>
        </Link>
        <nav className="mt-7 flex gap-1 overflow-x-auto px-4 pb-4 lg:flex-1 lg:flex-col">
          <p className="hidden px-4 pb-2 text-xs font-bold tracking-[0.16em] text-muted-foreground lg:block">CMS</p>
          {NAV.map(({ to, label, icon: Icon, exact, badge }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              className="flex shrink-0 items-center gap-4 rounded-xl px-4 py-3 text-[17px] text-muted-foreground hover:text-foreground"
              activeProps={{ className: "!bg-card font-semibold !text-foreground shadow-sm ring-1 ring-border/60" }}
            >
              <Icon className="size-5" strokeWidth={1.6} aria-hidden />
              <span className="flex-1">{label}</span>
              {badge !== null && (
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand-deep">{badge}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="hidden p-4 lg:block">
          <div className="flex items-center gap-3 rounded-2xl p-3 ring-1 ring-border/70">
            <span className="grid size-11 place-items-center rounded-full bg-brand font-bold text-primary-foreground">P</span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">Partner</span>
              <span className="block text-xs text-muted-foreground">B2B account</span>
            </span>
            <Link to="/" aria-label="Back to site" className="grid size-9 place-items-center rounded-xl ring-1 ring-border/70">
              <LogOut className="size-4" />
            </Link>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between gap-4 px-5 pt-6 sm:px-10">
          <div>
            <p className="text-sm font-medium text-muted-foreground">B2B Portal</p>
            <h1 className="text-2xl font-bold">{TITLES[path] ?? "Portal"}</h1>
          </div>
          <div className="flex items-center gap-4">
            <label className="hidden w-72 items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-sm ring-1 ring-border/60 md:flex">
              <Search className="size-4 text-muted-foreground" />
              <input placeholder="Search anything..." className="flex-1 bg-transparent text-sm outline-none" />
              <kbd className="rounded-md px-1.5 py-0.5 text-[10px] text-muted-foreground ring-1 ring-border">⌘K</kbd>
            </label>
            <Clock />
          </div>
        </header>
        <main className="px-5 py-8 sm:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
