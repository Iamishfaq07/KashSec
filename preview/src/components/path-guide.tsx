import { Link } from "@tanstack/react-router";
import { getPath, lessonKey, type PathInfo } from "@/lib/catalog";
import { getCredential, getGuideStages, getPathGuide, getPreparation } from "@/lib/path-guides";

export function PathGuide({ path, done, hydrated }: { path: PathInfo; done: Record<string, unknown>; hydrated: boolean }) {
  const guide = getPathGuide(path.id);
  if (!guide) return null;
  const stages = getGuideStages(path);
  const isDone = (id: string) => hydrated && !!done[lessonKey(path.id, id)];
  const current = stages.findIndex((stage) => stage.lessons.some((lesson) => !isDone(lesson.id)));
  const preparation = getPreparation(path.id).map(getPath).filter((p): p is PathInfo => !!p);
  return (
    <div className="mt-10 space-y-9">
      <section aria-labelledby="path-map-heading">
        <p className="text-xs uppercase tracking-widest text-amber">Your learning route</p>
        <h2 id="path-map-heading" className="mt-2 max-w-3xl font-display text-2xl">{guide.goal}</h2>
        <p className="mt-2 text-sm text-muted">Follow the connected stages, or open any lesson below. Nothing is locked.</p>
        {preparation.length > 0 && <div className="mt-4"><p className="text-xs text-faint">Helpful preparation</p><div className="mt-2 flex flex-wrap gap-2">{preparation.map((p) => <Link key={p.id} to="/paths/$pathId" params={{ pathId: p.id }} className="inline-flex min-h-11 items-center rounded-full border border-line px-3 text-sm">{p.title}</Link>)}</div></div>}
        <ol aria-label="Learning stages" className="mt-6 grid gap-4 lg:grid-cols-4">
          {stages.map((stage, index) => {
            const finished = stage.lessons.filter((lesson) => isDone(lesson.id)).length;
            const complete = finished === stage.lessons.length;
            const next = stage.lessons.find((lesson) => !isDone(lesson.id)) ?? stage.lessons[0];
            return <li key={stage.through} className="relative flex min-w-0 gap-3 lg:flex-col">
              {index < stages.length - 1 && <span aria-hidden className="absolute left-5 top-10 -bottom-4 w-px bg-line lg:bottom-auto lg:left-10 lg:top-5 lg:h-px lg:w-full" />}
              <span aria-hidden className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 bg-bg text-sm ${complete ? "border-teal text-teal" : current === index ? "border-amber text-amber" : "border-line text-muted"}`}>{complete ? "✓" : index + 1}</span>
              <div className={`relative flex min-w-0 flex-1 flex-col rounded-2xl border bg-surface p-4 ${current === index ? "border-amber" : "border-line"}`}>
                <p className="text-xs text-muted">Stage {index + 1} · {complete ? "Complete" : finished ? "In progress" : "Not started"}</p>
                <h3 className="mt-2 font-display text-lg">{stage.title}</h3>
                <p className="mt-2 text-sm text-muted">{stage.outcome}</p>
                <p className="mt-3 text-xs text-faint">Lessons {stage.lessons[0].n}–{stage.lessons.at(-1)?.n} · {finished}/{stage.lessons.length} complete</p>
                <Link to="/lesson/$pathId/$lessonId" params={{ pathId: path.id, lessonId: next.id }} aria-current={current === index ? "step" : undefined} className="mt-auto inline-flex min-h-11 items-center pt-2 text-sm text-amber">{complete ? "Review" : finished ? "Continue" : "Start"} stage {index + 1} →<span className="sr-only">: {next.title}</span></Link>
              </div>
            </li>;
          })}
        </ol>
      </section>
      <section className="rounded-2xl border border-line bg-surface p-5" aria-labelledby="path-evidence-heading">
        <h2 id="path-evidence-heading" className="font-display text-xl">Build evidence</h2>
        <p className="mt-2 text-muted">{guide.artifact}</p>
        <p className="mt-2 text-sm text-faint">Keep the scope, your decisions, the result, and what you would check next.</p>
        {guide.practice.length > 0 && <><h3 className="mt-5 font-medium">Practice alongside the lessons</h3><ul className="mt-2 space-y-2">{guide.practice.map((item) => {
          const lesson = item.href.match(/^\/lesson\/([^/]+)\/([^/]+)\.html$/);
          const expert = item.href.match(/^\/expert-labs\/(?:([a-z0-9-]+)\.html)?$/);
          return <li key={item.href}>{lesson ? <Link to="/lesson/$pathId/$lessonId" params={{ pathId: lesson[1], lessonId: lesson[2] }} className="inline-flex min-h-11 items-center text-sm text-amber">{item.label} →</Link> : expert ? (expert[1] ? <Link to="/expert-labs/$caseId" params={{ caseId: expert[1] }} className="inline-flex min-h-11 items-center text-sm text-amber">{item.label} →</Link> : <Link to="/expert-labs" className="inline-flex min-h-11 items-center text-sm text-amber">{item.label} →</Link>) : <a href={`https://kashsec.vercel.app${item.href}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-amber">{item.label} ↗<span className="sr-only"> (opens the KashSec simulator in a new tab)</span></a>}<p className="text-sm text-muted">{item.note}</p></li>;
        })}</ul></>}
      </section>
      <section aria-labelledby="path-credentials-heading">
        <h2 id="path-credentials-heading" className="font-display text-2xl">Certification options for this path</h2>
        <p className="mt-2 text-sm text-muted">Optional goals for different roles. These lessons cover selected foundations, not a complete exam syllabus.</p>
        {guide.certNote && <p className="mt-3 border-l-2 border-amber pl-3 text-sm text-muted">{guide.certNote}</p>}
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{guide.certs.map((rec) => {
          const cert = getCredential(rec.id);
          if (!cert) return null;
          return <article key={cert.id} className="flex min-w-0 flex-col rounded-2xl border border-line bg-surface p-5"><p className="text-xs text-faint">{cert.org} · {cert.level}</p><h3 className="mt-2 font-display text-lg">{cert.name}</h3><p className="mt-2 text-sm text-muted">{rec.reason}</p><p className="mt-3 border-t border-line pt-3 text-sm text-muted"><strong>Before you book:</strong> {cert.readiness}</p><p className="mt-2 text-xs text-faint">{cert.format}</p><a href={cert.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center text-sm text-amber">Official requirements and preparation ↗<span className="sr-only"> for {cert.name} (opens in a new tab)</span></a><p className="mt-2 text-xs text-faint">Provider information checked {cert.reviewed}. Check the current rules before booking.</p></article>;
        })}</div>
      </section>
    </div>
  );
}
