import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { progressStorage, useProgressStorage } from "./progress-storage";

type ProgressState = {
  hydrated: boolean;
  done: Record<string, true>;
  notes: Record<string, string>;
  bookmarks: Record<string, true>;
  labs: Record<string, true>;
  knownTerms: Record<string, true>;
  quizBest: Record<string, number>;
  days: string[];
  last?: { pathId: string; lessonId: string; title: string };
  setHydrated: () => void;
  complete: (key: string, last: { pathId: string; lessonId: string; title: string }) => void;
  uncomplete: (key: string) => void;
  setNote: (key: string, note: string) => void;
  toggleBookmark: (key: string) => void;
  markLab: (id: string) => void;
  toggleTerm: (term: string) => void;
  recordQuiz: (id: string, pct: number) => void;
  touch: () => void;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function withToday(days: string[]) {
  const stamp = today();
  return days.includes(stamp) ? days : [...days, stamp].slice(-400);
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      hydrated: false,
      done: {},
      notes: {},
      bookmarks: {},
      labs: {},
      knownTerms: {},
      quizBest: {},
      days: [],
      setHydrated: () => set({ hydrated: true }),
      complete: (key, last) =>
        set((state) => ({
          done: { ...state.done, [key]: true },
          days: withToday(state.days),
          last,
        })),
      uncomplete: (key) =>
        set((state) => {
          const done = { ...state.done };
          delete done[key];
          return { done };
        }),
      setNote: (key, note) =>
        set((state) => ({ notes: { ...state.notes, [key]: note.slice(0, 4000) } })),
      toggleBookmark: (key) =>
        set((state) => {
          const bookmarks = { ...state.bookmarks };
          if (bookmarks[key]) delete bookmarks[key];
          else bookmarks[key] = true;
          return { bookmarks };
        }),
      markLab: (id) =>
        set((state) => ({
          labs: { ...state.labs, [id]: true },
          days: withToday(state.days),
        })),
      toggleTerm: (term) =>
        set((state) => {
          const knownTerms = { ...state.knownTerms };
          if (knownTerms[term]) delete knownTerms[term];
          else knownTerms[term] = true;
          return { knownTerms };
        }),
      recordQuiz: (id, pct) =>
        set((state) => ({
          quizBest: { ...state.quizBest, [id]: Math.max(state.quizBest[id] ?? 0, pct) },
          days: withToday(state.days),
        })),
      touch: () => set((state) => ({ days: withToday(state.days) })),
    }),
    {
      name: "kashsec-desk-v1",
      storage: createJSONStorage(() => progressStorage),
      skipHydration: true,
      partialize: (state) => ({
        done: state.done,
        notes: state.notes,
        bookmarks: state.bookmarks,
        labs: state.labs,
        knownTerms: state.knownTerms,
        quizBest: state.quizBest,
        days: state.days,
        last: state.last,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) useProgressStorage.setState({ status: "error" });
        state?.setHydrated();
      },
    },
  ),
);

export function streakFrom(days: string[]) {
  const set = new Set(days);
  const cursor = new Date();
  const stamp = (date: Date) => date.toISOString().slice(0, 10);
  if (!set.has(stamp(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!set.has(stamp(cursor))) return 0;
  }
  let count = 0;
  while (set.has(stamp(cursor))) {
    count += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return count;
}
