import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Layers, Map as MapIcon, MapPin, RotateCcw, Send } from "lucide-react";
import { PageHead, Panel, primaryBtn } from "@/components/portal/ui";
import { REGIONS } from "@/data/regions";
import { getRegion } from "@/lib/catalog";
import { resetCms, useCms } from "@/lib/cms";

export const Route = createFileRoute("/portal/")({
  head: () => ({ meta: [{ title: "Overview — GoLookAround B2B Portal" }] }),
  component: Overview,
});

function Overview() {
  const cms = useCms();
  const enabled = REGIONS.filter((r) => cms.enabledStates[r.id]);
  const published = cms.curations.filter((c) => c.status === "published").length;
  const drafts = cms.curations.filter((c) => c.status === "draft");
  const emptyStates = enabled.filter((r) => !cms.curations.some((c) => c.stateId === r.id));
  const alerts = [
    ...drafts.map((c) => ({ id: c.id, text: `Curation · ${c.title} — still a draft, not visible to groups`, to: "/portal/curations" as const })),
    ...emptyStates.map((r) => ({ id: r.id, text: `State · ${r.name} — enabled but has no curations yet`, to: "/portal/curations" as const })),
  ];
  const stats = [
    { icon: Layers, tone: "bg-emerald-50 text-emerald-600", value: cms.curations.length, label: "Curations", sub: `${published} published` },
    { icon: Send, tone: "bg-brand-soft text-brand", value: drafts.length, label: "Drafts", sub: "awaiting publish" },
    { icon: MapIcon, tone: "bg-cyan-50 text-cyan-600", value: enabled.length, label: "Active states", sub: `${REGIONS.length - enabled.length} disabled` },
    { icon: MapPin, tone: "bg-brand-soft text-brand", value: cms.destinations.length, label: "Destinations", sub: "across India" },
  ];
  const byState = enabled
    .map((r) => ({ r, n: cms.curations.filter((c) => c.stateId === r.id).length }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 6);
  const max = Math.max(1, ...byState.map((b) => b.n));

  return (
    <div className="space-y-8">
      <PageHead
        title="Hello, Partner"
        sub="Demo data — everything below is saved only in this browser."
        action={
          <button className={primaryBtn} onClick={resetCms}>
            <RotateCcw className="size-5" /> Reset demo data
          </button>
        }
      />

      <Panel className="ring-brand/25">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-3 text-xl font-bold">
            <AlertTriangle className="size-5 text-brand" /> Attention needed
            <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-sm text-brand-deep">{alerts.length}</span>
          </h3>
          <Link to="/portal/curations" className="text-[15px] font-bold text-brand">View all curations</Link>
        </div>
        <ul className="mt-5 space-y-3">
          {alerts.length === 0 && <li className="text-muted-foreground">All caught up.</li>}
          {alerts.slice(0, 3).map((a) => (
            <li key={a.id} className="rounded-xl px-4 py-3 text-[17px] ring-1 ring-border/70">
              {a.text} · <Link to={a.to} className="font-semibold text-brand">Open</Link>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ icon: Icon, tone, value, label, sub }) => (
          <Panel key={label}>
            <span className={`grid size-12 place-items-center rounded-xl ${tone}`}>
              <Icon className="size-5" />
            </span>
            <p className="mt-8 text-4xl font-bold">{value}</p>
            <p className="mt-2 text-[17px] text-foreground/80">{label}</p>
            <p className="mt-2 text-sm text-muted-foreground">{sub}</p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Panel>
          <h3 className="text-xl font-bold">Recent curations</h3>
          <p className="mt-1 text-muted-foreground">Latest edits first</p>
          <ul className="mt-6 divide-y">
            {[...cms.curations].reverse().slice(0, 6).map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <span className="font-semibold">{c.title}</span>
                <span className="text-sm text-muted-foreground">{getRegion(c.stateId)?.name} · {c.status}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <h3 className="text-xl font-bold">Curations by state</h3>
          <p className="mt-1 text-muted-foreground">{cms.curations.length} across {enabled.length} active states</p>
          <ul className="mt-6 space-y-5">
            {byState.map(({ r, n }) => (
              <li key={r.id}>
                <div className="flex justify-between font-semibold">
                  <span>{r.name}</span>
                  <span className="text-muted-foreground">{n}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-gradient-to-r from-brand-deep to-brand-light" style={{ width: `${(n / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
