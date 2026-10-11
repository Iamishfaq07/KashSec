import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui";
import { getPath } from "@/lib/catalog";
import { useProgress } from "@/lib/progress";
import bank from "../../public/data/quizzes.json";

export const Route = createFileRoute("/quiz/$pathId")({
  head: ({ params }) => ({
    meta: [{ title: params.pathId === "final" ? "Final exam · KashSec" : "Quiz · KashSec" }],
  }),
  component: QuizPage,
});

type Quiz = {
  title: string;
  passPct: number;
  questions: { q: string; options: string[]; correct: number; explain: string }[];
};

const data = bank as { quizzes: Record<string, Quiz>; final: Quiz };

function QuizPage() {
  const { pathId } = Route.useParams();
  const quiz = pathId === "final" ? data.final : data.quizzes[pathId];
  const path = getPath(pathId);
  const recordQuiz = useProgress((state) => state.recordQuiz);
  const best = useProgress((state) => state.quizBest[pathId]);
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);

  const [missedOnly, setMissedOnly] = useState(false);

  const score = useMemo(() => {
    if (!quiz || picks.length !== quiz.questions.length) return null;
    const right = picks.filter((pick, i) => pick === quiz.questions[i].correct).length;
    return Math.round((right / quiz.questions.length) * 100);
  }, [picks, quiz]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const el = event.target as HTMLElement | null;
      if (el?.closest?.("input, textarea, select")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (!quiz || picks.length === quiz.questions.length) return;
      const current = quiz.questions[index];
      if (!current) return;
      if (chosen === null && /^[1-4]$/.test(event.key)) {
        const option = Number(event.key) - 1;
        if (option < current.options.length) commit(option);
      } else if ((event.key === "Enter" || event.key.toLowerCase() === "n") && chosen !== null && index < quiz.questions.length - 1) {
        setIndex((value) => value + 1);
        setChosen(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quiz, picks.length, chosen, index]);

  if (!quiz) {
    return (
      <Shell>
        <h1 className="font-display text-4xl">No quiz for that path yet.</h1>
      </Shell>
    );
  }

  const question = quiz.questions[index];
  const finished = picks.length === quiz.questions.length;

  function commit(option: number) {
    if (chosen !== null || !quiz) return;
    setChosen(option);
    const next = [...picks, option];
    setPicks(next);
    if (next.length === quiz.questions.length) {
      const right = next.filter((pick, i) => pick === quiz.questions[i].correct).length;
      recordQuiz(pathId, Math.round((right / quiz.questions.length) * 100));
    }
  }

  return (
    <Shell>
      {path ? (
        <Link to="/paths/$pathId" params={{ pathId: path.id }} className="text-sm text-amber">
          {path.title}
        </Link>
      ) : (
        <Link to="/paths" className="text-sm text-amber">
          Paths
        </Link>
      )}
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">{quiz.title}</h1>
      <p className="mt-2 text-sm text-faint">
        Pass mark {quiz.passPct}%{best !== undefined ? ` · best on this device ${best}%` : ""}
      </p>
      {finished && score !== null ? (
        <div className="mt-8 max-w-2xl">
          <p className="font-display text-6xl text-amber">{score}%</p>
          <p className="mt-2 text-muted">
            {score >= quiz.passPct ? "That clears the pass mark." : "Below the pass mark. The explanations are the useful part."}
          </p>
          <ol className="mt-6 grid gap-4">
            {quiz.questions.map((item, i) => ({ item, i })).filter(({ item, i }) => !missedOnly || picks[i] !== item.correct).map(({ item, i }) => (
              <li key={item.q} className="rounded-card border border-line p-4">
                <p>{item.q}</p>
                <p className={picks[i] === item.correct ? "mt-2 text-sm text-teal" : "mt-2 text-sm text-danger"}>
                  {picks[i] === item.correct ? "Correct." : `You picked “${item.options[picks[i]]}”.`} {item.explain}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-2">
            {score < 100 ? (
              <Button tone="ghost" onClick={() => setMissedOnly((value) => !value)}>
                {missedOnly ? "Show every question" : "Missed only"}
              </Button>
            ) : null}
            <Button
              onClick={() => {
                setPicks([]);
                setIndex(0);
                setChosen(null);
                setMissedOnly(false);
              }}
            >
              Try again
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 max-w-2xl">
          <p className="text-sm text-faint">
            {index + 1} / {quiz.questions.length} · keys 1–4, then enter
          </p>
          <h2 className="mt-2 font-display text-3xl leading-snug">{question.q}</h2>
          <ul className="mt-4 grid gap-2">
            {question.options.map((option, optionIndex) => {
              const revealed = chosen !== null;
              const right = optionIndex === question.correct;
              return (
                <li key={option}>
                  <button
                    type="button"
                    disabled={revealed}
                    onClick={() => commit(optionIndex)}
                    className="press w-full rounded-xl border border-line bg-surface px-3 py-3 text-left disabled:opacity-100"
                  >
                    <span className={revealed && right ? "text-teal" : revealed && optionIndex === chosen ? "text-danger" : ""}>
                      <span className="mr-2 text-faint">{optionIndex + 1}</span>
                      {option}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {chosen !== null ? (
            <>
              <p className="mt-4 text-sm leading-relaxed text-muted">{question.explain}</p>
              {index < quiz.questions.length - 1 ? (
                <Button
                  className="mt-4"
                  onClick={() => {
                    setIndex((value) => value + 1);
                    setChosen(null);
                  }}
                >
                  Next
                </Button>
              ) : null}
            </>
          ) : null}
        </div>
      )}
    </Shell>
  );
}
