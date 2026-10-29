import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui";
import { lessonCount, lessonKey, paths, pathsIn, tracks, type PathInfo } from "@/lib/catalog";
import { labs, type Lab } from "@/data/labs";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({
  component: Home,
});

type DrillQ = { q: string; options: string[]; correct: number; explain: string };

function Home() {
  const hydrated = useProgress((state) => state.hydrated);
  const last = useProgress((state) => state.last);
  const done = useProgress((state) => state.done);

  return (
    <Shell>
      <section className="grid items-end gap-8 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="rise text-sm uppercase tracking-[0.18em] text-amber">Free academy</p>
          <h1 className="rise rise-2 mt-3 font-display text-5xl leading-[1.05] text-fg sm:text-6xl">
            Security, from the first keystroke.
          </h1>
          <p className="rise rise-3 mt-4 max-w-md text-lg leading-relaxed text-muted">
            {paths.length} paths. {lessonCount} lessons. Labs you can touch, quizzes with explanations, and tools that stay in the browser.
          </p>
          <div className="rise rise-4 mt-6 flex flex-wrap gap-3">
            <Link to="/lesson/$pathId/$lessonId" params={{ pathId: "00-fresher-basics", lessonId: "what-is-a-computer" }}>
              <Button>
                Begin at zero <ArrowRight className="size-4" aria-hidden />
              </Button>
            </Link>
            <Link to="/paths">
              <Button tone="ghost">See the map</Button>
            </Link>
          </div>
        </div>
        <figure className="rise rise-3 md:col-span-6">
          <img
            src="/art/desk.jpg"
            alt="A night desk: notebook with a pencil network sketch, and a laptop edge glowing amber"
            className="aspect-video w-full rounded-card object-cover"
          />
          <figcaption className="mt-2 text-sm text-faint">Night desk. Path 00 starts here, not in a terminal.</figcaption>
        </figure>
      </section>

      {hydrated && last ? (
        <Link
          to="/lesson/$pathId/$lessonId"
          params={{ pathId: last.pathId, lessonId: last.lessonId }}
          className="card mt-8 flex items-center justify-between gap-4 rounded-card border border-line bg-surface px-4 py-4"
        >
          <span>
            <span className="block text-xs uppercase tracking-wider text-faint">Continue</span>
            <span className="font-display text-2xl">{last.title}</span>
          </span>
          <ArrowRight className="size-5 text-amber" aria-hidden />
        </Link>
      ) : null}
      <UpNext />

      <section className="mt-12 grid gap-10">
        {tracks.map((track) => (
          <div key={track.id}>
            <div className="mb-3">
              <h2 className="font-display text-3xl">{track.label}</h2>
              <p className="mt-1 max-w-xl text-sm text-muted">{track.blurb}</p>
            </div>
            <ul className="grid gap-2">
              {pathsIn(track.id).map((path) => (
                <PathRow key={path.id} path={path} done={hydrated ? done : {}} />
              ))}
            </ul>
          </div>
        ))}
      </section>

      <figure className="mt-12">
        <img
          src="/art/aisle.jpg"
          alt="A dim aisle of equipment with one amber light and one teal light"
          className="aspect-[16/7] w-full rounded-card object-cover"
        />
        <figcaption className="mt-2 text-sm text-faint">The work is quiet. The habits are not.</figcaption>
      </figure>

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <Drill />
        <article className="rounded-card border border-line bg-surface p-5">
          <p className="text-xs uppercase tracking-wider text-teal">Labs you can run</p>
          <h2 className="mt-2 font-display text-3xl">Sandboxes you can run</h2>
          <ul className="mt-4 grid gap-2">
            {labs
              .filter((lab) => lab.playable)
              .slice(0, 5)
              .map((lab) => (
                <li key={lab.id}>
                  <Link to="/labs/$labId" params={{ labId: lab.id }} className="text-fg underline-offset-4 hover:underline">
                    {lab.title}
                  </Link>
                </li>
              ))}
          </ul>
          <Link to="/labs" className="mt-4 inline-block text-sm text-amber">
            {labs.filter((lab) => lab.playable).length} live labs
          </Link>
        </article>
      </section>
    </Shell>
  );
}

function UpNext() {
  const hydrated = useProgress((state) => state.hydrated);
  const done = useProgress((state) => state.done);
  const practiced = useProgress((state) => state.labs);
  if (!hydrated) return null;
  const started = Object.keys(done).length > 0 || Object.keys(practiced).length > 0;
  if (!started) return null;
  let gap: { path: PathInfo; lesson: PathInfo["lessons"][number] } | null = null;
  for (const path of paths) {
    const lesson = path.lessons.find((item) => !done[lessonKey(path.id, item.id)]);
    if (lesson) {
      gap = { path, lesson };
      break;
    }
  }
  const lab = labs.find((item) => !practiced[item.id]);
  if (!gap && !lab) return null;
  return (
    <section className="mt-4 grid gap-3 md:grid-cols-2">
      {gap ? (
        <Link
          to="/lesson/$pathId/$lessonId"
          params={{ pathId: gap.path.id, lessonId: gap.lesson.id }}
          className="rounded-card border border-line px-4 py-4"
        >
          <span className="text-xs uppercase tracking-wider text-faint">First unfinished</span>
          <span className="mt-1 block text-lg">{gap.lesson.title}</span>
          <span className="text-sm text-muted">{gap.path.title}</span>
        </Link>
      ) : (
        <p className="rounded-card border border-line px-4 py-4 text-muted">Every lesson is marked finished.</p>
      )}
      {lab ? <LabCue lab={lab} /> : <p className="rounded-card border border-line px-4 py-4 text-muted">Every lab is marked practiced.</p>}
    </section>
  );
}

function LabCue({ lab }: { lab: Lab }) {
  return (
    <Link to="/labs/$labId" params={{ labId: lab.id }} className="rounded-card border border-line px-4 py-4">
      <span className="text-xs uppercase tracking-wider text-teal">Lab still open</span>
      <span className="mt-1 block text-lg">{lab.title}</span>
      <span className="text-sm text-muted">{lab.summary}</span>
    </Link>
  );
}

function PathRow({ path, done }: { path: PathInfo; done: Record<string, true> }) {
  const finished = path.lessons.filter((lesson) => done[lessonKey(path.id, lesson.id)]).length;
  const pct = Math.round((finished / path.lessons.length) * 100);
  return (
    <li>
      <Link
        to="/paths/$pathId"
        params={{ pathId: path.id }}
        className="card grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-line bg-bg-raised px-3 py-3"
      >
        <span className="font-display text-2xl text-amber">{path.n}</span>
        <span className="min-w-0 break-words">
          <span className="block text-fg">{path.title}</span>
          <span className="text-sm text-faint">{path.level}</span>
        </span>
        <span className="text-right text-sm text-muted">
          {finished}/{path.lessons.length}
          <span className="mt-1 block h-1 w-16 overflow-hidden rounded-full bg-line">
            <span className="block h-full bg-teal" style={{ width: `${pct}%` }} />
          </span>
        </span>
      </Link>
    </li>
  );
}

function Drill() {
  const [question, setQuestion] = useState<DrillQ | null>(null);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    void import("@/data/quizzes.json")
      .then((module) => module.default)
      .then((payload: { quizzes: Record<string, { questions: DrillQ[] }> }) => {
        const all = Object.values(payload.quizzes).flatMap((quiz) => quiz.questions);
        const day = Math.floor(Date.now() / 86_400_000);
        setQuestion(all[day % all.length] ?? null);
      })
      .catch(() => setQuestion(null));
  }, []);

  return (
    <article className="rounded-card border border-line bg-surface p-5">
      <p className="text-xs uppercase tracking-wider text-amber">Today's question</p>
      {question ? (
        <>
          <h2 className="mt-2 font-display text-2xl leading-snug">{question.q}</h2>
          <ul className="mt-4 grid gap-2">
            {question.options.map((option, index) => {
              const revealed = picked !== null;
              const right = index === question.correct;
              return (
                <li key={option}>
                  <button
                    type="button"
                    disabled={revealed}
                    onClick={() => setPicked(index)}
                    className="press w-full rounded-xl border border-line bg-bg px-3 py-3 text-left text-sm disabled:opacity-100"
                  >
                    <span className={revealed && right ? "text-teal" : revealed && index === picked ? "text-danger" : ""}>
                      {option}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {picked !== null ? <p className="mt-3 text-sm leading-relaxed text-muted">{question.explain}</p> : null}
        </>
      ) : (
        <p className="mt-3 text-muted">Loading a question from the bank.</p>
      )}
    </article>
  );
}
