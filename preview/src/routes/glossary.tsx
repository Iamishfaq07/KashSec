import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Button, inputClass } from "@/components/ui";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/glossary")({
  head: () => ({ meta: [{ title: "Glossary · KashSec" }] }),
  component: GlossaryPage,
});

type Term = {
  term: string;
  def: string;
  pathId: string;
  pathTitle: string;
  subId: string;
  subTitle: string;
};

function GlossaryPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("All");
  const [mode, setMode] = useState<"list" | "cards">("list");
  const [card, setCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const known = useProgress((state) => state.knownTerms);
  const toggleTerm = useProgress((state) => state.toggleTerm);

  useEffect(() => {
    void fetch("/data/glossary.json")
      .then((response) => response.json())
      .then((data: Term[]) => setTerms(data))
      .catch(() => setTerms([]));
  }, []);

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return terms.filter((item) => {
      if (letter !== "All" && !item.term.toUpperCase().startsWith(letter)) return false;
      if (!needle) return true;
      return `${item.term} ${item.def}`.toLowerCase().includes(needle);
    });
  }, [terms, query, letter]);

  const deck = filtered.length ? filtered : terms;
  const current = deck[card % Math.max(deck.length, 1)];

  useEffect(() => {
    if (mode !== "cards" || !current) return;
    function onKey(event: KeyboardEvent) {
      const el = event.target as HTMLElement | null;
      if (el?.closest?.("input, textarea")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === " ") {
        event.preventDefault();
        setFlipped((value) => !value);
      } else if (event.key.toLowerCase() === "n") {
        setCard((value) => value + 1);
        setFlipped(false);
      } else if (event.key.toLowerCase() === "k") {
        toggleTerm(current.term);
        setCard((value) => value + 1);
        setFlipped(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, current, toggleTerm]);

  return (
    <Shell>
      <p className="text-sm uppercase tracking-[0.18em] text-amber">Key terms</p>
      <h1 className="mt-2 font-display text-5xl">Glossary</h1>
      <p className="mt-3 max-w-xl text-muted">
        {terms.length ? `${terms.length} terms pulled from the lessons.` : "Loading terms."}{" "}
        {Object.keys(known).length} marked known on this device.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button tone={mode === "list" ? "amber" : "ghost"} onClick={() => setMode("list")}>
          List
        </Button>
        <Button tone={mode === "cards" ? "amber" : "ghost"} onClick={() => setMode("cards")}>
          Flashcards
        </Button>
      </div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search terms"
        className={`${inputClass} mt-4 max-w-md`}
      />
      <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
        {["All", ...letters].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLetter(item)}
            className={item === letter ? "h-9 shrink-0 rounded-full bg-surface px-2 text-sm text-amber" : "h-9 shrink-0 rounded-full px-2 text-sm text-faint"}
          >
            {item}
          </button>
        ))}
      </div>
      {mode === "cards" && current ? (
        <div className="mt-6 max-w-lg">
          <button
            type="button"
            onClick={() => setFlipped((value) => !value)}
            className="press min-h-48 w-full rounded-card border border-line bg-surface p-6 text-left"
          >
            <span className="text-xs uppercase tracking-wider text-faint">{flipped ? "Definition" : "Term"}</span>
            <span className="mt-3 block font-display text-3xl leading-snug">{flipped ? current.def : current.term}</span>
          </button>
          <p className="mt-2 text-xs text-faint">Space flips · n next · k I know it</p>
          {flipped ? (
            <Link
              to="/lesson/$pathId/$lessonId"
              params={{ pathId: current.pathId, lessonId: current.subId }}
              className="mt-2 inline-block text-sm text-amber"
            >
              From {current.subTitle}
            </Link>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              tone="ghost"
              onClick={() => {
                setCard((value) => value + 1);
                setFlipped(false);
              }}
            >
              Again
            </Button>
            <Button
              onClick={() => {
                toggleTerm(current.term);
                setCard((value) => value + 1);
                setFlipped(false);
              }}
            >
              {known[current.term] ? "Forget" : "I know it"}
            </Button>
          </div>
        </div>
      ) : (
        <ul className="mt-6 grid gap-3">
          {filtered.slice(0, 40).map((item) => (
            <li key={item.term + item.subId} className="rounded-card border border-line p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-2xl">{item.term}</h2>
                <button type="button" className="text-sm text-amber" onClick={() => toggleTerm(item.term)}>
                  {known[item.term] ? "Known" : "Mark known"}
                </button>
              </div>
              <p className="mt-2 text-muted">{item.def}</p>
              <Link
                to="/lesson/$pathId/$lessonId"
                params={{ pathId: item.pathId, lessonId: item.subId }}
                className="mt-2 inline-block text-sm text-faint"
              >
                {item.pathTitle} · {item.subTitle}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {mode === "list" && filtered.length > 40 ? (
        <p className="mt-4 text-sm text-faint">Showing 40 of {filtered.length}. Search to narrow it.</p>
      ) : null}
    </Shell>
  );
}
