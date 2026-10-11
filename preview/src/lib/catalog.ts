import raw from "../../public/data/catalog.json";

export type Lesson = {
  n: string;
  id: string;
  title: string;
  desc: string;
};

export type PathInfo = {
  n: string;
  id: string;
  title: string;
  level: string;
  desc: string;
  lessons: Lesson[];
};

export const paths = (raw as { paths: PathInfo[] }).paths;

export const lessonCount = paths.reduce((sum, path) => sum + path.lessons.length, 0);

export type TrackId = "start" | "core" | "offense" | "programs" | "career";

export const tracks: { id: TrackId; label: string; blurb: string }[] = [
  {
    id: "start",
    label: "Start here",
    blurb: "No background assumed. Computers, networks, and the habits that keep you safe.",
  },
  {
    id: "core",
    label: "Core craft",
    blurb: "How attacks actually land on the web, the network, and the systems behind them.",
  },
  {
    id: "offense",
    label: "Offense & practice",
    blurb: "Ethical hacking, bug bounty, malware, CTFs, and API security — with the rules attached.",
  },
  {
    id: "programs",
    label: "Programs",
    blurb: "The work of a security program: AI, DevSecOps, GRC, Zero Trust, and OT.",
  },
  {
    id: "career",
    label: "Get hired",
    blurb: "Resume, portfolio, interviews, and the first ninety days.",
  },
];

export function trackOf(path: PathInfo): TrackId {
  const n = Number(path.n);
  if (n <= 9) return "start";
  if (n <= 12) return "core";
  if (n === 20) return "career";
  if (n === 18 || n >= 22) return "programs";
  return "offense";
}

export function pathsIn(track: TrackId) {
  return paths.filter((path) => trackOf(path) === track);
}

export function getPath(id: string) {
  return paths.find((path) => path.id === id);
}

export function getLesson(pathId: string, lessonId: string) {
  const path = getPath(pathId);
  const lesson = path?.lessons.find((item) => item.id === lessonId);
  if (!path || !lesson) return null;
  const index = path.lessons.findIndex((item) => item.id === lessonId);
  return {
    path,
    lesson,
    index,
    prev: index > 0 ? path.lessons[index - 1] : undefined,
    next: index < path.lessons.length - 1 ? path.lessons[index + 1] : undefined,
  };
}

export function lessonKey(pathId: string, lessonId: string) {
  return `${pathId}/${lessonId}`;
}

export function readingMinutes(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function headings(markdown: string) {
  return markdown
    .split("\n")
    .map((line) => {
      const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
      if (!match) return null;
      const text = match[2].replace(/[*_`]/g, "").trim();
      return { level: match[1].length, text, id: slug(text) };
    })
    .filter((item): item is { level: number; text: string; id: string } => item !== null);
}

export function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
