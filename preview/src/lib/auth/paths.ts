/** Keep the broker's registered callback URL stable across auth API versions. */
export const AUTH_BASE_PATH = "/api/auth/oauth2";
const LEGACY_BASE_PATH = "/api/auth";

/** Accept older cached clients without changing the external callback URL. */
export async function normalizeAuthRequest(request: Request): Promise<Request> {
  const url = new URL(request.url);
  if (
    url.pathname === AUTH_BASE_PATH ||
    url.pathname.startsWith(`${AUTH_BASE_PATH}/`)
  )
    return request;
  if (!url.pathname.startsWith(`${LEGACY_BASE_PATH}/`)) return request;
  const path = url.pathname.slice(LEGACY_BASE_PATH.length);
  url.pathname =
    AUTH_BASE_PATH + (path === "/sign-in/oauth2" ? "/sign-in/social" : path);
  if (path === "/sign-in/oauth2" && request.method === "POST") {
    const body = (await request.json()) as Record<string, unknown>;
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new SyntaxError("Expected a JSON object");
    const { providerId, ...rest } = body;
    const headers = new Headers(request.headers);
    headers.delete("content-length");
    return new Request(url, {
      method: "POST",
      headers,
      signal: request.signal,
      body: JSON.stringify({ ...rest, provider: providerId }),
    });
  }
  return new Request(url, request);
}
