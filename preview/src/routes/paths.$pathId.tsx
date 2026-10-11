import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { getPath, lessonKey } from "@/lib/catalog";
import { useProgress } from "@/lib/progress";
import { Check } from "lucide-react";

export const Route = createFileRoute("/paths/$pathId")({
  head: ({ params }) => ({
    meta: [{ title: `${getPath(params.pathId)?.title ?? "Path"} · KashSec` }],
  }),
  component: PathPage,
});

function PathPage() {
  const { pathId } = Route.useParams();
  const path = getPath(pathId);
  const done = useProgress((state) => state.done);
  const hydrated = useProgress((state) => state.hydrated);
  const best = useProgress((state) => state.quizBest[pathId]);

  if (!path) {
    return (
      <Shell>
        <h1 className="font-display text-4xl">That path is not in the catalog.</h1>
      </Shell>
    );
  }

  const finished = hydrated ? path.lessons.filter((lesson) => done[lessonKey(path.id, lesson.id)]).length : 0;
  const pct = Math.round((finished / path.lessons.length) * 100);
  const resume = !hydrated
    ? path.lessons[0]
    : (path.lessons.find((lesson) => !done[lessonKey(path.id, lesson.id)]) ?? path.lessons[0]);
  const allDone = hydrated && finished === path.lessons.length;

  return (
    <Shell>
      <p className="text-sm text-amber">Path {path.n} · {path.level}</p>
      <h1 className="mt-2 max-w-3xl font-display text-5xl leading-tight">{path.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">{path.desc}</p>
      <p className="mt-4 text-sm text-faint">
        {finished} of {path.lessons.length} lessons finished
        {hydrated && best !== undefined ? ` · quiz best ${best}%` : ""}
      </p>
      <div className="mt-3 h-1.5 max-w-md overflow-hidden rounded-full bg-line" aria-hidden>
        <div className="h-full bg-teal" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          to="/lesson/$pathId/$lessonId"
          params={{ pathId: path.id, lessonId: resume.id }}
          className="press inline-flex h-11 items-center rounded-full bg-amber px-4 text-sm font-medium text-amber-ink"
        >
          {allDone ? "Review from the start" : finished ? "Resume the path" : "Start the path"}
        </Link>
        <Link
          to="/quiz/$pathId"
          params={{ pathId: path.id }}
          className="press inline-flex h-11 items-center rounded-full border border-line px-4 text-sm"
        >
          Take the quiz
        </Link>
      </div>
      <ol className="mt-8 grid gap-2">
        {path.lessons.map((lesson) => {
          const complete = hydrated && done[lessonKey(path.id, lesson.id)];
          return (
            <li key={lesson.id}>
              <Link
                to="/lesson/$pathId/$lessonId"
                params={{ pathId: path.id, lessonId: lesson.id }}
                className="card grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-line px-3 py-3"
              >
                <span className="mt-0.5 flex size-7 items-center justify-center rounded-full border border-line text-xs">
                  {complete ? <Check className="size-4 text-teal" aria-label="Done" /> : lesson.n}
                </span>
                <span>
                  <span className="block text-fg">{lesson.title}</span>
                  {lesson.desc ? <span className="text-sm text-muted">{lesson.desc}</span> : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </Shell>
  );
}
