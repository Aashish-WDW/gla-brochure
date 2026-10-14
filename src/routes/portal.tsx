import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Layers, MapPin, Map as MapIcon } from "lucide-react";
import { Logo } from "@/components/SiteHeader";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Partner Portal — GoLookAround" },
      { name: "description", content: "B2B dashboard to manage curations, states and destinations." },
      { property: "og:title", content: "Partner Portal — GoLookAround" },
      { property: "og:description", content: "Manage GoLookAround curations, states and destinations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PortalLayout,
});

const NAV = [
  { to: "/portal", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/portal/curations", label: "Curations", icon: Layers, exact: false },
  { to: "/portal/states", label: "States", icon: MapIcon, exact: false },
  { to: "/portal/destinations", label: "Destinations", icon: MapPin, exact: false },
] as const;

function PortalLayout() {
  return (
    <div className="min-h-dvh bg-secondary lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="bg-background p-4 shadow-sm lg:sticky lg:top-0 lg:h-dvh lg:p-6">
        <Logo />
        <p className="eyebrow mt-4 text-brand-deep">Partner portal · B2B</p>
        <nav className="mt-6 flex gap-1 overflow-x-auto lg:flex-col">
          {NAV.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "!bg-brand !text-primary-foreground" }}
            >
              <Icon className="size-4" aria-hidden /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="mx-auto w-full max-w-6xl p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
