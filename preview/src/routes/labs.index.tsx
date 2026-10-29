import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { labs } from "@/data/labs";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/labs/")({
  head: () => ({ meta: [{ title: "Labs · KashSec" }] }),
  component: LabsPage,
});

function LabsPage() {
  const practiced = useProgress((state) => state.labs);
  const hydrated = useProgress((state) => state.hydrated);
  const live = labs.filter((lab) => lab.playable);
  const rest = labs.filter((lab) => !lab.playable);

  return (
    <Shell>
      <nav className="mb-6 flex flex-wrap gap-3" aria-label="Lab collections">
        <Link to="/labs" aria-current="page" className="rounded-xl border border-amber px-4 py-3">All labs</Link>
        <Link to="/expert-labs" className="rounded-xl border border-line px-4 py-3 text-amber">Expert Labs · New</Link>
      </nav>
      <p className="text-sm uppercase tracking-[0.18em] text-teal">Practice</p>
      <h1 className="mt-2 font-display text-5xl">Labs</h1>
      <p className="mt-3 max-w-xl text-muted">
        All {labs.length} run in the browser. Each one stays on this page: a choice, a tell, and the fix. Nothing is sent to a real system.
      </p>
      <p className="mt-3 text-sm text-faint">Only practice on systems you own or have written permission to test.</p>
      <h2 className="mt-8 font-display text-3xl">The bench</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {live.map((lab) => (
          <li key={lab.id}>
            <Link to="/labs/$labId" params={{ labId: lab.id }} className="card block h-full rounded-card border border-line bg-surface p-4">
              <span className="text-xs uppercase tracking-wider text-teal">Live</span>
              <span className="mt-2 block text-lg">{lab.title}</span>
              <span className="mt-2 block text-sm leading-relaxed text-muted">{lab.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
      {rest.length > 0 ? (
        <>
          <h2 className="mt-10 font-display text-3xl">Scenario briefs</h2>
          <ul className="mt-3 grid gap-2">
            {rest.map((lab) => (
              <li key={lab.id}>
                <Link to="/labs/$labId" params={{ labId: lab.id }} className="flex items-baseline justify-between gap-3 rounded-2xl border border-line px-3 py-3">
                  <span>{lab.title}</span>
                  <span className="text-xs text-faint">{hydrated && practiced[lab.id] ? "Practiced" : "Brief"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </Shell>
  );
}
