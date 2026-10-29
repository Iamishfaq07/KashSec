import { useEffect, useRef, useState } from "react";
import checks from "@/data/lesson-checks.json";

type Question = {
  q: string;
  options: string[];
  correct: number;
  explain: string;
  review: string;
};

export function LessonCheck({ lessonKey }: { lessonKey: string }) {
  const question = (checks as Record<string, Question>)[lessonKey];
  const [answer, setAnswer] = useState<number | null>(null);
  const feedback = useRef<HTMLParagraphElement>(null);
  const firstOption = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (answer !== null) feedback.current?.focus({ preventScroll: true });
  }, [answer]);
  if (!question) return null;
  return (
    <section
      className="mt-8 rounded-card border border-line bg-surface p-5"
      aria-labelledby="lesson-check-question"
      data-lesson-check
    >
      <p className="text-xs uppercase tracking-wider text-amber">
        Quick check · this lesson
      </p>
      <h2 id="lesson-check-question" className="mt-2 text-lg font-semibold">
        {question.q}
      </h2>
      <div
        className="mt-4 grid gap-2"
        role="group"
        aria-labelledby="lesson-check-question"
      >
        {question.options.map((option, index) => (
          <button
            type="button"
            key={option}
            ref={index === 0 ? firstOption : undefined}
            disabled={answer !== null}
            data-check-option={index}
            className={`rounded-xl border p-3 text-left text-sm focus-visible:outline-2 focus-visible:outline-amber ${
              answer !== null && index === question.correct
                ? "border-teal text-teal"
                : answer === index
                  ? "border-amber text-amber"
                  : "border-line"
            }`}
            onClick={() => setAnswer(index)}
          >
            <span aria-hidden>{String.fromCharCode(65 + index)}. </span>
            {option}
          </button>
        ))}
      </div>
      <p
        ref={feedback}
        role="status"
        tabIndex={-1}
        className="mt-4 text-sm focus-visible:outline-2 focus-visible:outline-amber"
        data-check-feedback
      >
        {answer !== null ? (
          <>
            <strong>{answer === question.correct ? "Correct. " : "Not quite. "}</strong>
            {question.explain}
          </>
        ) : null}
      </p>
      {answer !== null ? (
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-amber">
          <button
            type="button"
            className="rounded-lg border border-line px-3 py-2"
            onClick={() => {
              setAnswer(null);
              // The same button becomes enabled in this render.
              requestAnimationFrame(() => firstOption.current?.focus({ preventScroll: true }));
            }}
          >
            Try again
          </button>
          <button
            type="button"
            className="rounded-lg border border-line px-3 py-2"
            onClick={() => {
              const heading = Array.from(document.querySelectorAll<HTMLElement>(".prose-lesson h2, .prose-lesson h3"))
                .find((item) => item.textContent?.trim() === question.review);
              if (!heading) return;
              heading.tabIndex = -1;
              heading.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
              heading.focus({ preventScroll: true });
            }}
          >
            Review this idea ↑
          </button>
        </div>
      ) : null}
      <p className="mt-4 text-xs text-muted">
        Optional practice. Your answer does not change your quiz score or mark this lesson finished.
      </p>
    </section>
  );
}
