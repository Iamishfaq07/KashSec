import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { lessonCount, lessonKey, paths, pathsIn, tracks, type TrackId } from "@/lib/catalog";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/paths/")({
  head: () => ({ meta: [{ title: "Paths · KashSec" }] }),
  component: PathsPage,
});

function PathsPage() {
  const [track, setTrack] = useState<TrackId | "all">("all");
  const hydrated = useProgress((state) => state.hydrated);
  const done = useProgress((state) => state.done);
  const list = track === "all" ? paths : pathsIn(track);

  return (
    <Shell>
      <p className="text-sm uppercase tracking-[0.18em] text-amber">Curriculum</p>
      <h1 className="mt-2 font-display text-5xl">The map</h1>
      <p className="mt-3 max-w-xl text-muted">
        {paths.length} paths, {lessonCount} lessons, in the order a beginner can actually survive.
      </p>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <Filter label="All" active={track === "all"} onClick={() => setTrack("all")} />
        {tracks.map((item) => (
          <Filter key={item.id} label={item.label} active={track === item.id} onClick={() => setTrack(item.id)} />
        ))}
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {list.map((path) => (
          <li key={path.id}>
            <Link
              to="/paths/$pathId"
              params={{ pathId: path.id }}
              className="card flex h-full flex-col rounded-card border border-line bg-surface p-4"
            >
              <span className="font-display text-3xl text-amber">{path.n}</span>
              <span className="mt-2 text-lg text-fg">{path.title}</span>
              <span className="mt-1 text-sm text-faint">{path.level}</span>
              <span className="mt-3 text-sm leading-relaxed text-muted">{path.desc}</span>
              <span className="mt-4 text-sm text-teal">
                {hydrated
                  ? `${path.lessons.filter((lesson) => done[lessonKey(path.id, lesson.id)]).length}/${path.lessons.length} finished`
                  : `${path.lessons.length} lessons`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function Filter({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "press h-11 shrink-0 rounded-full px-4 text-sm",
        active ? "bg-amber text-amber-ink" : "border border-line text-muted",
      )}
    >
      {label}
    </button>
  );
}
