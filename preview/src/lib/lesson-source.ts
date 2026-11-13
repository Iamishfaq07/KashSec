// Revisited lessons are instant; failed requests are never cached.
const cache = new Map<string, string>();

export async function loadLessonSource(
  pathId: string,
  lessonId: string,
  signal: AbortSignal,
) {
  const key = `${pathId}/${lessonId}`;
  if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(key)) throw new Error("Invalid lesson");
  if (signal.aborted) throw signal.reason;
  const cached = cache.get(key);
  if (cached) return cached;
  const controller = new AbortController();
  const abort = () => controller.abort(signal.reason);
  signal.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(
    () => controller.abort(new Error("Lesson request timed out")),
    15000,
  );
  try {
    const response = await fetch(`/course/${key}.md`, {
      signal: controller.signal,
    });
    if (!response.ok)
      throw new Error(`Lesson request failed (${response.status})`);
    const markdown = await response.text();
    const checked = markdown.replace(/^\s*<!-- coderabbit-ai-generated:v1 -->\s*/, "");
    if (
      /^\s*(?:<!doctype\s+html|<html\b)/i.test(checked) ||
      !/^#\s+\S/m.test(markdown)
    ) {
      throw new Error("The server did not return a lesson");
    }
    if (controller.signal.aborted) throw controller.signal.reason;
    cache.set(key, markdown);
    if (cache.size > 12) cache.delete(cache.keys().next().value!);
    return markdown;
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", abort);
  }
}
