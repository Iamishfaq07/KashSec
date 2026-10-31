import { useEffect, useState, type MouseEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bookmark, Check } from "lucide-react";
import { Shell } from "@/components/shell";
import { LessonCheck } from "@/components/lesson-check";
import { Button } from "@/components/ui";
import { getLesson, lessonKey, readingMinutes } from "@/lib/catalog";
import { labForPath } from "@/data/labs";
import { loadLessonSource } from "@/lib/lesson-source";
import { renderLesson } from "@/lib/markdown";
import { useProgress } from "@/lib/progress";
import { useProgressStorage } from "@/lib/progress-storage";

export const Route = createFileRoute("/lesson/$pathId/$lessonId")({
  head: ({ params }) => {
    const found = getLesson(params.pathId, params.lessonId);
    return {
      meta: [
        {
          title: found ? `${found.lesson.title} · KashSec` : "Lesson · KashSec",
        },
      ],
    };
  },
  component: LessonPage,
});

function LessonPage() {
  const { pathId, lessonId } = Route.useParams();
  const found = getLesson(pathId, lessonId);
  const key = lessonKey(pathId, lessonId);
  const done = useProgress((state) => Boolean(state.done[key]));
  const note = useProgress((state) => state.notes[key] ?? "");
  const bookmarked = useProgress((state) => Boolean(state.bookmarks[key]));
  const complete = useProgress((state) => state.complete);
  const uncomplete = useProgress((state) => state.uncomplete);
  const setNote = useProgress((state) => state.setNote);
  const storageStatus = useProgressStorage((state) => state.status);
  const toggleBookmark = useProgress((state) => state.toggleBookmark);
  const [html, setHtml] = useState("");
  const [minutes, setMinutes] = useState(1);
  const [toc, setToc] = useState<{ level: number; text: string; id: string }[]>(
    [],
  );
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);
  const [readPct, setReadPct] = useState(0);
  const [activeId, setActiveId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    setStatus("loading");
    setHtml("");
    setToc([]);
    setActiveId("");
    if (!found) return;
    void loadLessonSource(pathId, lessonId, controller.signal)
      .then((markdown) => {
        if (cancelled) return;
        const rendered = renderLesson(markdown);
        setHtml(rendered);
        setMinutes(readingMinutes(markdown));
        const doc = new DOMParser().parseFromString(rendered, "text/html");
        setToc(
          Array.from(doc.querySelectorAll("h2, h3"))
            .slice(0, 12)
            .map((heading) => ({
              level: Number(heading.tagName.slice(1)),
              text: heading.textContent ?? "",
              id: heading.id,
            })),
        );
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("missing");
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [pathId, lessonId, attempt]);

  useEffect(() => {
    if (status !== "ready" || !html.includes("mermaid-src")) return;
    let cancelled = false;
    void import("mermaid")
      .then(async (mod) => {
        const mermaid = mod.default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "dark",
          fontFamily: "Outfit, sans-serif",
          flowchart: {
            htmlLabels: false,
            nodeSpacing: 70,
            rankSpacing: 70,
            padding: 16,
          },
        });
        const nodes = Array.from(document.querySelectorAll("pre.mermaid-src"));
        for (const node of nodes) {
          if (cancelled) return;
          const source = (node.textContent ?? "").replace(/\\n/g, " ");
          const id = `diagram-${Math.random().toString(36).slice(2, 9)}`;
          try {
            const drawn = await mermaid.render(id, source);
            if (cancelled) return;
            const host = document.createElement("div");
            host.className = "mermaid-svg";
            host.innerHTML = drawn.svg;
            node.replaceWith(host);
          } catch {
            /* keep the source if the diagram is not valid */
          }
        }
      })
      .catch(() => {
        /* Diagrams are optional; keep the readable source. */
      });
    return () => {
      cancelled = true;
    };
  }, [html, status]);

  useEffect(() => {
    function onScroll() {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      setReadPct(max > 0 ? Math.min(100, (root.scrollTop / max) * 100) : 0);
    }
    let frame = 0;
    const schedule = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          onScroll();
        });
    };
    onScroll();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
    };
  }, [status, pathId, lessonId]);

  useEffect(() => {
    if (status !== "ready") return;
    const heads = Array.from(
      document.querySelectorAll(".prose-lesson h2, .prose-lesson h3"),
    );
    if (!heads.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: [0, 1] },
    );
    for (const head of heads) observer.observe(head);
    return () => observer.disconnect();
  }, [status, html]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const el = event.target as HTMLElement | null;
      if (
        el?.closest?.("input, textarea, select, button, a, [contenteditable]")
      )
        return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const current = getLesson(pathId, lessonId);
      if (!current) return;
      const pressed = event.key.toLowerCase();
      if (pressed === "j" && current.next) {
        void navigate({
          to: "/lesson/$pathId/$lessonId",
          params: { pathId, lessonId: current.next.id },
        });
      } else if (pressed === "k" && current.prev) {
        void navigate({
          to: "/lesson/$pathId/$lessonId",
          params: { pathId, lessonId: current.prev.id },
        });
      } else if (pressed === "b") {
        toggleBookmark(lessonKey(pathId, lessonId));
      } else if (pressed === "f") {
        const id = lessonKey(pathId, lessonId);
        if (useProgress.getState().done[id]) uncomplete(id);
        else complete(id, { pathId, lessonId, title: current.lesson.title });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathId, lessonId, navigate, toggleBookmark, complete, uncomplete]);

  function onArticleClick(event: MouseEvent<HTMLElement>) {
    const button = (event.target as HTMLElement).closest("button.copy-code");
    if (!button) return;
    const code =
      button.parentElement?.parentElement?.querySelector("code")?.textContent ??
      "";
    if (!navigator.clipboard) {
      button.textContent = "Select code to copy";
      return;
    }
    void navigator.clipboard
      .writeText(code)
      .then(() => {
        button.textContent = "Copied";
      })
      .catch(() => {
        button.textContent = "Select code to copy";
      });
  }

  if (!found) {
    return (
      <Shell>
        <h1 className="font-display text-4xl">Lesson not found.</h1>
        <Link to="/paths" className="mt-4 inline-block text-amber">
          Back to the map
        </Link>
      </Shell>
    );
  }

  const { path, lesson, index, prev, next } = found;

  return (
    <Shell>
      <div
        className="pointer-events-none fixed inset-x-0 top-16 z-40 h-0.5 bg-line"
        aria-hidden
      >
        <div className="h-full bg-amber" style={{ width: `${readPct}%` }} />
      </div>
      <div className="mb-4 text-sm text-faint">
        <Link
          to="/paths/$pathId"
          params={{ pathId: path.id }}
          className="text-amber"
        >
          {path.title}
        </Link>
        <span>{` · ${index + 1} of ${path.lessons.length} · ${minutes} min`}</span>
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
        <article className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h1 className="min-w-0 break-words font-display text-4xl leading-tight sm:text-5xl">
              {lesson.title}
            </h1>
            <button
              type="button"
              aria-pressed={bookmarked}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark lesson"}
              onClick={() => toggleBookmark(key)}
              className="press mt-2 flex size-11 shrink-0 items-center justify-center rounded-full border border-line"
            >
              <Bookmark
                className={
                  bookmarked
                    ? "size-4 fill-amber text-amber"
                    : "size-4 text-muted"
                }
              />
            </button>
          </div>
          {lesson.desc ? (
            <p className="mt-3 text-lg text-muted">{lesson.desc}</p>
          ) : null}
          {labForPath(path.id) ? (
            <Link
              to="/labs/$labId"
              params={{ labId: labForPath(path.id)!.id }}
              className="mt-4 inline-block text-sm text-teal"
            >
              Practice · {labForPath(path.id)!.title}
            </Link>
          ) : null}
          {status === "loading" ? (
            <p className="mt-8 text-muted" role="status">
              Loading lesson…
            </p>
          ) : null}
          {status === "missing" ? (
            <div
              className="mt-8 rounded-card border border-line p-4"
              role="status"
            >
              <p>
                We couldn’t load this lesson. Check your connection, then try
                again.
              </p>
              <Button
                className="mt-3"
                onClick={() => setAttempt((value) => value + 1)}
              >
                Retry lesson
              </Button>
            </div>
          ) : null}
          {status === "ready" ? (
            <div
              className="prose-lesson mt-8"
              onClick={onArticleClick}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : null}
          {status === "ready" ? <LessonCheck key={key} lessonKey={key} /> : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {status === "ready" && next ? (
              <Button
                onClick={() => {
                  if (!done)
                    complete(key, { pathId, lessonId, title: lesson.title });
                  void navigate({
                    to: "/lesson/$pathId/$lessonId",
                    params: { pathId, lessonId: next.id },
                  });
                }}
              >
                Finish & continue →
              </Button>
            ) : null}
            <Button
              tone={done ? "teal" : "amber"}
              onClick={() =>
                done
                  ? uncomplete(key)
                  : complete(key, { pathId, lessonId, title: lesson.title })
              }
            >
              <Check className="size-4" aria-hidden />
              {done ? "Finished" : "Mark finished"}
            </Button>
          </div>
          <label className="mt-8 block">
            <span className="text-sm text-muted">
              Notes, kept on this device
            </span>
            <textarea
              value={note}
              maxLength={4000}
              aria-describedby="lessonNoteHelp"
              onChange={(event) => setNote(key, event.target.value)}
              className="mt-2 h-32 w-full rounded-card border border-line bg-surface p-3 text-fg outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
              placeholder="Rewrite the idea in your own words."
            />
          </label>
          <p id="lessonNoteHelp" className="mt-2 text-sm text-muted">{note.length.toLocaleString()} / 4,000 characters. Downloads are plain text; keep personal notes private.</p>
          <p role="status" className="mt-2 text-sm text-muted">{storageStatus === "error" ? "Could not save in this browser. Download your notes before leaving." : storageStatus === "saved" ? "Saved in this browser." : "Notes save automatically in this browser."}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button tone="ghost" disabled={!note.length} onClick={() => {
              const text = `Lesson: ${lesson.title}\nSource: https://kashsec.vercel.app/lesson/${pathId}/${lessonId}.html\n\n${note}`;
              const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
              const link = document.createElement("a");
              link.href = url; link.download = `kashsec-${pathId}--${lessonId}-notes.txt`;
              link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}>Download lesson notes</Button>
            {storageStatus === "error" ? <Button tone="ghost" onClick={() => setNote(key, note)}>Retry saving notes</Button> : null}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                to="/lesson/$pathId/$lessonId"
                params={{ pathId, lessonId: prev.id }}
                className="rounded-card border border-line p-4"
              >
                <span className="text-xs uppercase tracking-wider text-faint">
                  Previous
                </span>
                <span className="mt-1 block">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to="/lesson/$pathId/$lessonId"
                params={{ pathId, lessonId: next.id }}
                className="rounded-card border border-line p-4 sm:text-right"
              >
                <span className="text-xs uppercase tracking-wider text-faint">
                  Next
                </span>
                <span className="mt-1 block">{next.title}</span>
              </Link>
            ) : (
              <Link
                to="/quiz/$pathId"
                params={{ pathId }}
                className="rounded-card border border-line p-4 sm:text-right"
              >
                <span className="text-xs uppercase tracking-wider text-faint">
                  Path complete
                </span>
                <span className="mt-1 block">Take the quiz</span>
              </Link>
            )}
          </div>
          <p className="mt-3 hidden text-xs text-faint sm:block">
            j next · k previous · b bookmark · f finished
          </p>
        </article>
        {toc.length > 0 ? (
          <aside className="hidden lg:block">
            <p className="text-xs uppercase tracking-wider text-faint">
              On this page
            </p>
            <ul className="mt-3 grid gap-2">
              {toc.map((item) => (
                <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
                  <a
                    href={`#${item.id}`}
                    className={
                      item.id === activeId
                        ? "text-sm text-amber"
                        : "text-sm text-muted"
                    }
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </Shell>
  );
}
