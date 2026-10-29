import { createPortal } from "react-dom";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Compass, FlaskConical, Flame, House, Library, Search, Wrench } from "lucide-react";
import { paths, lessonCount } from "@/lib/catalog";
import { labs } from "@/data/labs";
import { streakFrom, useProgress } from "@/lib/progress";
import { cn } from "@/lib/cn";

const nav = [
  { to: "/paths", label: "Paths", icon: Compass },
  { to: "/labs", label: "Labs", icon: FlaskConical },
  { to: "/tools", label: "Tools", icon: Wrench },
  { to: "/glossary", label: "Glossary", icon: Library },
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [searchReady, setSearchReady] = useState(false);
  const closeSearch = useCallback(() => setOpen(false), []);
  const hydrated = useProgress((state) => state.hydrated);
  const days = useProgress((state) => state.days);
  const done = useProgress((state) => state.done);
  const streak = hydrated ? streakFrom(days) : 0;
  const doneCount = hydrated ? Object.keys(done).length : 0;

  useEffect(() => {
    setSearchReady(true);
    void useProgress.persist.rehydrate();
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/art/mark.jpg" alt="" className="size-9 rounded-lg object-cover" />
            <span className="font-display text-xl leading-none text-fg">KashSec</span>
          </Link>
          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-3 py-2 text-sm",
                  (pathname.startsWith(item.to) || (item.to === "/labs" && pathname.startsWith("/expert-labs"))) ? "bg-surface text-fg" : "text-muted",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              disabled={!searchReady}
              aria-label="Search the academy"
              onClick={() => setOpen(true)}
              className="press inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-3 text-sm text-muted"
            >
              <Search className="size-4" aria-hidden />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded bg-bg px-1.5 py-0.5 text-xs text-faint sm:inline">⌘K</kbd>
            </button>
            <Link
              to="/progress"
              className="press inline-flex h-11 items-center gap-1.5 rounded-full border border-line px-3 text-sm text-fg"
            >
              <Flame className="size-4 text-amber" aria-hidden />
              <span>{streak}</span>
              <span className="hidden text-muted sm:inline">· {doneCount}/{lessonCount}</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:pb-16">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface md:hidden">
        <ul className="grid grid-cols-5">
          {[
            { to: "/", label: "Home", icon: House, exact: true },
            { to: "/paths", label: "Paths", icon: Compass, exact: false },
            { to: "/labs", label: "Labs", icon: FlaskConical, exact: false },
            { to: "/tools", label: "Tools", icon: Wrench, exact: false },
            { to: "/progress", label: "You", icon: BookOpen, exact: false },
          ].map((item) => {
            const active = item.exact ? pathname === "/" : pathname.startsWith(item.to) || (item.to === "/labs" && pathname.startsWith("/expert-labs"));
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex h-16 flex-col items-center justify-center gap-1 text-xs",
                    active ? "text-amber" : "text-muted",
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {open ? <SearchDialog onClose={closeSearch} /> : null}
    </div>
  );
}

const toolLinks = [
  { href: "/tools?tab=Encode", title: "Encode and decode", meta: "Tool" },
  { href: "/tools?tab=Hash", title: "Hash", meta: "Tool" },
  { href: "/tools?tab=JWT", title: "JWT decoder", meta: "Tool" },
  { href: "/tools?tab=Subnet", title: "Subnet calculator", meta: "Tool" },
  { href: "/tools?tab=Password", title: "Password size", meta: "Tool" },
  { href: "/tools?tab=Regex", title: "Regex tester", meta: "Tool" },
  { href: "/tools?tab=Time", title: "Unix time", meta: "Tool" },
  { href: "/tools?tab=Headers", title: "Response headers", meta: "Tool" },
];

type GlossaryHit = { term: string; def: string; pathId: string; subId: string };

let glossaryCache: Promise<GlossaryHit[]> | null = null;

function loadGlossary() {
  glossaryCache ??= fetch("/data/glossary.json")
    .then((response) => (response.ok ? response.json() : []))
    .catch(() => []) as Promise<GlossaryHit[]>;
  return glossaryCache;
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [glossary, setGlossary] = useState<GlossaryHit[]>([]);

  useLayoutEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const overlay = dialog.current!.parentElement!;
    const siblings = [...document.body.children].filter((el): el is HTMLElement => el instanceof HTMLElement && el !== overlay);
    const previous = siblings.map((el) => el.inert);
    siblings.forEach((el) => { el.inert = true; });
    input.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key === "Tab") {
        const targets = [...dialog.current!.querySelectorAll<HTMLElement>('input, button, a[href]')];
        const index = targets.indexOf(document.activeElement as HTMLElement);
        if (event.shiftKey && index <= 0) { event.preventDefault(); targets.at(-1)?.focus(); }
        else if (!event.shiftKey && (index < 0 || index === targets.length - 1)) { event.preventDefault(); targets[0]?.focus(); }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      siblings.forEach((el, index) => { el.inert = previous[index]; });
      if (trigger?.isConnected) trigger.focus();
    };
  }, [onClose]);

  const wantsTerms = query.trim().length >= 2;
  useEffect(() => {
    if (!wantsTerms) return;
    let cancelled = false;
    void loadGlossary().then((terms) => { if (!cancelled) setGlossary(terms); });
    return () => { cancelled = true; };
  }, [wantsTerms]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const items: { href: string; title: string; meta: string; rank: number }[] = [];
    const push = (item: { href: string; title: string; meta: string }, rank: number) => {
      items.push({ ...item, rank });
    };
    if (needle.length < 2) {
      push({ href: "/expert-labs", title: "Expert Labs", meta: "AppSec and cloud" }, 0);
      push({ href: "/quiz/final", title: "Final exam", meta: "Quiz" }, 0);
      for (const tool of toolLinks.slice(0, 3)) push(tool, 1);
      for (const path of paths.slice(0, 6)) {
        push({ href: `/paths/${path.id}`, title: path.title, meta: `Path ${path.n}` }, 2);
      }
      return items;
    }
    for (const path of paths) {
      const hay = `${path.title} ${path.desc}`.toLowerCase();
      if (hay.includes(needle)) {
        push(
          { href: `/paths/${path.id}`, title: path.title, meta: `Path ${path.n}` },
          path.title.toLowerCase().startsWith(needle) ? 0 : 2,
        );
        push({ href: `/quiz/${path.id}`, title: `${path.title} quiz`, meta: "Quiz" }, 3);
      }
      for (const lesson of path.lessons) {
        const lessonHay = `${lesson.title} ${lesson.desc}`.toLowerCase();
        if (!lessonHay.includes(needle) && !path.title.toLowerCase().includes(needle)) continue;
        if (!lessonHay.includes(needle)) continue;
        push(
          { href: `/lesson/${path.id}/${lesson.id}`, title: lesson.title, meta: path.title },
          lesson.title.toLowerCase().includes(needle) ? 1 : 4,
        );
      }
    }
    if ("expert labs appsec cloud tenant webhook release".includes(needle)) {
      push({ href: "/expert-labs", title: "Expert Labs", meta: "AppSec and cloud" }, 0);
    }
    for (const lab of labs) {
      if (`${lab.title} ${lab.summary}`.toLowerCase().includes(needle)) {
        push({ href: `/labs/${lab.id}`, title: lab.title, meta: "Lab" }, lab.title.toLowerCase().includes(needle) ? 1 : 4);
      }
    }
    for (const tool of toolLinks) {
      if (`${tool.title} ${tool.meta}`.toLowerCase().includes(needle)) push(tool, 2);
    }
    if (needle.includes("final") || needle.includes("exam")) {
      push({ href: "/quiz/final", title: "Final exam", meta: "Quiz" }, 0);
    }
    const glossHits = glossary
      .filter((term) => `${term.term} ${term.def}`.toLowerCase().includes(needle))
      .sort((a, b) => Number(b.term.toLowerCase().includes(needle)) - Number(a.term.toLowerCase().includes(needle)))
      .slice(0, 4);
    for (const term of glossHits) {
      push(
        { href: `/lesson/${term.pathId}/${term.subId}`, title: term.term, meta: "Glossary" },
        term.term.toLowerCase().includes(needle) ? 1 : 5,
      );
    }
    items.sort((a, b) => a.rank - b.rank);
    return items.slice(0, 12);
  }, [glossary, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    dialog.current?.querySelector(`[data-result="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-bg/70 px-4 pt-24" onClick={onClose}>
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Search the academy"
        className="w-full max-w-xl overflow-hidden rounded-card border border-line bg-bg-raised shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center">
        <input
          ref={input}
          aria-label="Search lessons, labs, terms and tools"
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              if (results.length) setActive((index) => (index + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
            }
            if (event.key === "Enter" && results[active]) { event.preventDefault(); window.location.assign(results[active].href); }
          }}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Lessons, labs, terms, tools"
          className="h-14 min-w-0 flex-1 bg-transparent px-4 text-fg outline-none placeholder:text-faint"
        />
        <button type="button" onClick={onClose} className="mr-2 min-h-11 rounded border border-line px-3 text-sm">Close</button>
        </div>
        <p className="sr-only" role="status">{results[active] ? `${active + 1} of ${results.length}: ${results[active].title}. Use up and down arrows, then Enter to open.` : "No results."}</p>
        <ul className="max-h-80 overflow-auto border-t border-line">
          {results.length === 0 ? (
            <li className="px-4 py-6 text-sm text-muted">Nothing matches that.</li>
          ) : (
            results.map((item, index) => (
              <li key={item.href + item.title}>
                <a
                  href={item.href}
                  data-result={index}
                  onFocus={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  className={cn(
                    "flex items-baseline justify-between gap-3 px-4 py-3",
                    index === active ? "bg-surface" : "",
                  )}
                >
                  <span className="min-w-0 flex-1 break-words">{item.title}</span>
                  <span className="shrink-0 text-xs text-faint">{item.meta}</span>
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>, document.body
  );
}
