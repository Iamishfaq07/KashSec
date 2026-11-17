import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { loadLessonSource } from "./lesson-source.ts";
const original = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = original;
});

test("failed loads can be retried and successful return visits use the cache", async () => {
  let calls = 0;
  globalThis.fetch = async () =>
    ++calls === 1
      ? new Response("unavailable", { status: 503 })
      : new Response("# A lesson\n\nReadable text.");
  await assert.rejects(
    loadLessonSource("test-path", "retry", new AbortController().signal),
    /503/,
  );
  assert.match(
    await loadLessonSource("test-path", "retry", new AbortController().signal),
    /Readable text/,
  );
  await loadLessonSource("test-path", "retry", new AbortController().signal);
  assert.equal(calls, 2);
});

test("HTML fallback pages never count as lessons", async () => {
  globalThis.fetch = async () =>
    new Response("<!doctype html><html>App shell</html>");
  await assert.rejects(
    loadLessonSource("test-path", "bad-response", new AbortController().signal),
    /did not return a lesson/,
  );
});

test("generated lesson markers are accepted without masking HTML fallback pages", async () => {
  globalThis.fetch = async () => new Response("<!-- coderabbit-ai-generated:v1 -->\n\n# Lesson\n\nText.");
  assert.match(await loadLessonSource("test-path", "marked-lesson", new AbortController().signal), /# Lesson/);
  globalThis.fetch = async () => new Response("<!-- coderabbit-ai-generated:v1 -->\n<html>\n# Fake lesson\n</html>");
  await assert.rejects(loadLessonSource("test-path", "marked-html", new AbortController().signal), /did not return a lesson/);
});

test("aborting navigation cancels a pending lesson request", async () => {
  globalThis.fetch = async (_url, init) =>
    new Promise((_resolve, reject) => {
      init!.signal!.addEventListener(
        "abort",
        () => reject(init!.signal!.reason),
        { once: true },
      );
    });
  const controller = new AbortController();
  const pending = loadLessonSource("test-path", "cancelled", controller.signal);
  controller.abort();
  await assert.rejects(pending, { name: "AbortError" });
});

test("slow requests time out instead of loading forever", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  globalThis.fetch = async (_url, init) =>
    new Promise((_resolve, reject) => {
      init!.signal!.addEventListener(
        "abort",
        () => reject(init!.signal!.reason),
        { once: true },
      );
    });
  const pending = loadLessonSource(
    "test-path",
    "timeout",
    new AbortController().signal,
  );
  const rejected = assert.rejects(pending, /timed out/);
  t.mock.timers.tick(15001);
  await rejected;
});
