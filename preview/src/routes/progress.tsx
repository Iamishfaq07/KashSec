import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { lessonCount, lessonKey, paths } from "@/lib/catalog";
import { streakFrom, useProgress } from "@/lib/progress";

export const Route = createFileRoute("/progress")({
  head: () => ({ meta: [{ title: "Progress · KashSec" }] }),
  component: ProgressPage,
});

function ProgressPage() {
  const hydrated = useProgress((state) => state.hydrated);
  const done = useProgress((state) => state.done);
  const days = useProgress((state) => state.days);
  const bookmarks = useProgress((state) => state.bookmarks);
  const quizBest = useProgress((state) => state.quizBest);
  const last = useProgress((state) => state.last);
  const finished = Object.keys(done).length;
  const streak = hydrated ? streakFrom(days) : 0;
  const labs = useProgress((state) => state.labs);
  const notes = useProgress((state) => state.notes);

  const saved = Object.keys(bookmarks)
    .map((key) => {
      const [pathId, lessonId] = key.split("/");
      const path = paths.find((item) => item.id === pathId);
      const lesson = path?.lessons.find((item) => item.id === lessonId);
      if (!path || !lesson) return null;
      return { path, lesson };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const noteList = Object.entries(notes)
    .map(([key, text]) => {
      const trimmed = text.trim();
      if (!trimmed) return null;
      const [pathId, lessonId] = key.split("/");
      const path = paths.find((item) => item.id === pathId);
      const lesson = path?.lessons.find((item) => item.id === lessonId);
      if (!path || !lesson) return null;
      return { path, lesson, text: trimmed };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <Shell>
      <p className="text-sm uppercase tracking-[0.18em] text-amber">On this device</p>
      <h1 className="mt-2 font-display text-5xl">Your desk</h1>
      <p className="mt-3 max-w-xl text-muted">
        Progress stays in the browser. No account. A streak is just days you actually opened a lesson, lab, or quiz.
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Streak" value={hydrated ? String(streak) : "–"} />
        <Stat label="Lessons" value={hydrated ? `${finished}` : "–"} hint={`of ${lessonCount}`} />
        <Stat label="Labs" value={hydrated ? String(Object.keys(labs).length) : "–"} />
        <Stat label="Quizzes" value={hydrated ? String(Object.keys(quizBest).length) : "–"} />
      </dl>
      {hydrated ? <DayStrip days={days} /> : null}
      {last ? (
        <Link
          to="/lesson/$pathId/$lessonId"
          params={{ pathId: last.pathId, lessonId: last.lessonId }}
          className="mt-6 block rounded-card border border-line bg-surface p-4"
        >
          <span className="text-xs uppercase tracking-wider text-faint">Continue</span>
          <span className="mt-1 block font-display text-3xl">{last.title}</span>
        </Link>
      ) : null}
      <h2 className="mt-10 font-display text-3xl">Paths</h2>
      <ul className="mt-3 grid gap-3">
        {paths.map((path) => {
          const count = path.lessons.filter((lesson) => done[lessonKey(path.id, lesson.id)]).length;
          const pct = Math.round((count / path.lessons.length) * 100);
          return (
            <li key={path.id}>
              <Link to="/paths/$pathId" params={{ pathId: path.id }} className="block">
                <span className="flex justify-between text-sm">
                  <span>{path.title}</span>
                  <span className="text-faint">{count}/{path.lessons.length}</span>
                </span>
                <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-line">
                  <span className="block h-full bg-teal" style={{ width: `${hydrated ? pct : 0}%` }} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <h2 className="mt-10 font-display text-3xl">Notes</h2>
      {noteList.length === 0 ? (
        <p className="mt-2 text-muted">None yet. A note on a lesson shows up here.</p>
      ) : (
        <ul className="mt-3 grid gap-3">
          {noteList.map(({ path, lesson, text }) => (
            <li key={`${path.id}/${lesson.id}`}>
              <Link to="/lesson/$pathId/$lessonId" params={{ pathId: path.id, lessonId: lesson.id }} className="block rounded-card border border-line p-4">
                <span className="block text-fg">{lesson.title}</span>
                <span className="mt-1 block text-sm text-muted">{text}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <h2 className="mt-10 font-display text-3xl">Bookmarks</h2>
      {saved.length === 0 ? (
        <p className="mt-2 text-muted">None yet. Bookmark a lesson from its page.</p>
      ) : (
        <ul className="mt-3 grid gap-2">
          {saved.map(({ path, lesson }) => (
            <li key={lesson.id}>
              <Link to="/lesson/$pathId/$lessonId" params={{ pathId: path.id, lessonId: lesson.id }}>
                {lesson.title}
                <span className="ml-2 text-sm text-faint">{path.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link
        to="/quiz/$pathId"
        params={{ pathId: "final" }}
        className="press mt-10 inline-flex h-11 items-center rounded-full bg-amber px-4 text-sm font-medium text-amber-ink"
      >
        Final exam{hydrated && quizBest.final !== undefined ? ` · best ${quizBest.final}%` : ""}
      </Link>
    </Shell>
  );
}

function DayStrip({ days }: { days: string[] }) {
  const marks = new Set(days);
  const cells = Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (13 - index));
    const stamp = date.toISOString().slice(0, 10);
    return { stamp, on: marks.has(stamp) };
  });
  return (
    <ol className="mt-4 flex gap-1.5" aria-label="Last 14 days">
      {cells.map((cell) => (
        <li
          key={cell.stamp}
          title={cell.stamp}
          className={cell.on ? "size-3 rounded-sm bg-amber" : "size-3 rounded-sm bg-line"}
        />
      ))}
    </ol>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <dt className="text-xs uppercase tracking-wider text-faint">{label}</dt>
      <dd className="mt-1 font-display text-4xl">{value}</dd>
      {hint ? <p className="text-xs text-faint">{hint}</p> : null}
    </div>
  );
}
