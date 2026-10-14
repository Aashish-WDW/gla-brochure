import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHead, Panel } from "@/components/portal/ui";
import { getRegion } from "@/lib/catalog";
import { resetCms, useCms } from "@/lib/cms";

export const Route = createFileRoute("/portal/")({
  head: () => ({ meta: [{ title: "Overview — GoLookAround Partner Portal" }] }),
  component: Overview,
});

function Overview() {
  const cms = useCms();
  const enabled = Object.values(cms.enabledStates).filter(Boolean).length;
  const published = cms.curations.filter((c) => c.status === "published").length;
  const stats = [
    { label: "Curations", value: cms.curations.length, sub: `${published} published`, to: "/portal/curations" as const },
    { label: "Active states", value: enabled, sub: `of ${Object.keys(cms.enabledStates).length}`, to: "/portal/states" as const },
    { label: "Destinations", value: cms.destinations.length, sub: "across India", to: "/portal/destinations" as const },
  ];
  return (
    <div className="space-y-6">
      <PageHead
        title="Overview"
        sub="Demo data — saved only in this browser."
        action={<button className="btn btn-outline btn-sm" onClick={resetCms}>Reset demo data</button>}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="group">
            <Panel>
              <p className="eyebrow text-muted-foreground">{s.label}</p>
              <p className="mt-2 text-4xl font-semibold">{s.value}</p>
              <p className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                {s.sub} <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1" />
              </p>
            </Panel>
          </Link>
        ))}
      </div>
      <Panel>
        <h2 className="text-xl">Recent curations</h2>
        <ul className="mt-4 divide-y">
          {[...cms.curations].reverse().slice(0, 5).map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <span className="font-semibold">{c.title}</span>
              <span className="text-muted-foreground">{getRegion(c.stateId)?.name} · {c.status}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
