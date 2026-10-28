import { createFileRoute } from "@tanstack/react-router";
import { getAuth } from "@/lib/auth/server";
import { normalizeAuthRequest } from "@/lib/auth/paths";

async function handle({ request }: { request: Request }) {
  try {
    return await (await getAuth()).handler(await normalizeAuthRequest(request));
  } catch (error) {
    if (error instanceof SyntaxError)
      return new Response("Invalid JSON", { status: 400 });
    console.error(
      "[auth] backend unavailable",
      error instanceof Error ? error.name : "Unknown error",
    );
    return new Response(
      "Sign-in is temporarily unavailable. You can keep learning.",
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}

export const Route = createFileRoute("/api/auth/$")({
  server: { handlers: { GET: handle, POST: handle } },
});
