import raw from "@/data/path-guides.json";
import type { PathInfo } from "@/lib/catalog";

type Guide = {
  id: string;
  goal: string;
  artifact: string;
  stages: { title: string; through: string; outcome: string }[];
  certs: { id: string; reason: string }[];
  practice: { href: string; label: string; note: string }[];
  certNote: string;
};
type Credential = {
  id: string;
  name: string;
  org: string;
  level: string;
  format: string;
  url?: string;
  readiness?: string;
  reviewed?: string;
};
const data = raw as { guides: Guide[]; certifications: Credential[]; prerequisites: Record<string, string[]> };
export const getPathGuide = (id: string) => data.guides.find((guide) => guide.id === id);
export const getCredential = (id: string) => data.certifications.find((cert) => cert.id === id);
export const getPreparation = (id: string) => data.prerequisites[id] ?? [];

export function getGuideStages(path: PathInfo) {
  let start = 0;
  return (getPathGuide(path.id)?.stages ?? []).map((stage) => {
    const end = path.lessons.findIndex((lesson) => lesson.id === stage.through);
    const lessons = path.lessons.slice(start, end + 1);
    start = end + 1;
    return { ...stage, lessons };
  });
}
