import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Shell } from "@/components/shell";
import { lessonCount, lessonKey, paths, pathsIn, tracks, type TrackId } from "@/lib/catalog";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/cn";
import { getCredential, getPathGuide } from "@/lib/path-guides";

type PathSearch = { q?: string; track?: TrackId };
const normalize = (text: string) => text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const searchable = new Map(paths.map((path) => [path.id, normalize([
  path.n, path.title, path.desc, getPathGuide(path.id)?.goal,
  ...path.lessons.map((lesson) => lesson.title + " " + lesson.desc),
  ...(getPathGuide(path.id)?.certs ?? []).map((rec) => { const cert = getCredential(rec.id); return cert ? cert.name + " " + cert.org : ""; }),
].join(" "))]));

export const Route = createFileRoute("/paths/")({
  validateSearch: (search: Record<string, unknown>): PathSearch => ({
    q: typeof search.q === "string" ? search.q.slice(0, 160) || undefined : undefined,
    track: tracks.some((track) => track.id === search.track) ? search.track as TrackId : undefined,
  }),
  head: () => ({ meta: [{ title: "Paths · KashSec" }] }),
  component: PathsPage,
});

function PathsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const track = search.track ?? "all";
  const [interactive, setInteractive] = useState(false);
  useEffect(() => { setInteractive(true); }, []);
  const [query, setQuery] = useState(search.q ?? "");
  const pendingSearches = useRef(new Set<string>());
  const latestSearch = useRef("");
  // Router transitions can lag behind typing. Keep the input local and ignore
  // our own intermediate URL updates, while still accepting back/forward URLs.
  useEffect(() => {
    const key = JSON.stringify([search.q ?? "", search.track ?? "all"]);
    if (pendingSearches.current.has(key)) {
      pendingSearches.current.delete(key);
      if (latestSearch.current === key) pendingSearches.current.clear();
    } else {
      pendingSearches.current.clear();
      setQuery(search.q ?? "");
    }
  }, [search.q, search.track]);
  const update = (q: string, nextTrack: TrackId | "all") => {
    setQuery(q);
    const key = JSON.stringify([q, nextTrack]);
    pendingSearches.current.add(key);
    latestSearch.current = key;
    void navigate({ to: "/paths", search: { q: q || undefined, track: nextTrack === "all" ? undefined : nextTrack }, replace: true, resetScroll: false });
  };
  const hydrated = useProgress((state) => state.hydrated);
  const done = useProgress((state) => state.done);
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const list = (track === "all" ? paths : pathsIn(track)).filter((path) => terms.every((term) => searchable.get(path.id)?.includes(term)));

  return (
    <Shell>
      <p className="text-sm uppercase tracking-[0.18em] text-amber">Curriculum</p>
      <h1 className="mt-2 font-display text-5xl">The map</h1>
      <p className="mt-3 max-w-xl text-muted">
        {paths.length} paths and {lessonCount} lessons, from first steps to specialist practice. Find a topic, then open its roadmap.
      </p>
      <div className="mt-6" aria-busy={!interactive}>
        <label htmlFor="path-search" className="font-medium">Find a path</label>
        <p id="path-search-hint" className="mt-2 text-sm text-muted">Search topics, lesson titles, or recommended certifications. Try AppSec, ASVS, Linux, or CSSLP.</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input id="path-search" type="search" maxLength={160} autoComplete="off" disabled={!interactive} value={query} onChange={(event) => update(event.target.value, track)} aria-describedby="path-search-hint" placeholder={interactive ? "What would you like to learn?" : "Preparing path finder…"} className="min-h-12 min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 text-fg" />
          <button type="button" disabled={!interactive || (!query && track === "all")} onClick={() => { update("", "all"); document.getElementById("path-search")?.focus(); }} className="min-h-11 rounded-full border border-line px-4 text-sm disabled:opacity-50">Reset filters</button>
        </div>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter paths by track">
        <Filter label="All" active={track === "all"} disabled={!interactive} onClick={() => update(query, "all")} />
        {tracks.map((item) => (
          <Filter key={item.id} label={item.label} active={track === item.id} disabled={!interactive} onClick={() => update(query, item.id)} />
        ))}
      </div>
      <p className="mt-3 text-sm text-muted" role="status" aria-live="polite">{list.length} of {paths.length} paths shown.</p>
      {list.length === 0 && <p className="mt-5 text-muted">No paths match these filters. Try a broader topic or reset the filters.</p>}
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

function Filter({ label, active, disabled, onClick }: { label: string; active: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
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
