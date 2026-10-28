import assert from "node:assert/strict";
import { test } from "node:test";
import { AUTH_BASE_PATH, normalizeAuthRequest } from "./paths.ts";

test("callback addresses stay exactly where the broker expects them", async () => {
  const request = new Request(
    `https://academy.example${AUTH_BASE_PATH}/callback/grok-google?code=test&state=test`,
  );
  assert.equal(await normalizeAuthRequest(request), request);
  assert.equal(
    AUTH_BASE_PATH + "/callback/grok-google",
    "/api/auth/oauth2/callback/grok-google",
  );
});

test("older session requests preserve query parameters and authorization", async () => {
  const request = new Request(
    "https://academy.example/api/auth/get-session?disableCookieCache=true",
    { headers: { authorization: "Bearer test-token" } },
  );
  const normalized = await normalizeAuthRequest(request);
  assert.equal(
    normalized.url,
    "https://academy.example/api/auth/oauth2/get-session?disableCookieCache=true",
  );
  assert.equal(normalized.headers.get("authorization"), "Bearer test-token");
});

test("older sign-in requests use the new provider API without dropping return URLs", async () => {
  const request = new Request(
    "https://academy.example/api/auth/sign-in/oauth2",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://academy.example",
      },
      body: JSON.stringify({
        providerId: "grok-google",
        callbackURL: "/paths",
        errorCallbackURL: "/login?error=1",
      }),
    },
  );
  const normalized = await normalizeAuthRequest(request);
  assert.equal(
    new URL(normalized.url).pathname,
    AUTH_BASE_PATH + "/sign-in/social",
  );
  assert.equal(normalized.headers.get("origin"), "https://academy.example");
  assert.deepEqual(await normalized.json(), {
    provider: "grok-google",
    callbackURL: "/paths",
    errorCallbackURL: "/login?error=1",
  });
});

test("older sign-out requests preserve their method and body", async () => {
  const request = new Request("https://academy.example/api/auth/sign-out", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const normalized = await normalizeAuthRequest(request);
  assert.equal(normalized.method, "POST");
  assert.equal(await normalized.text(), "{}");
});

test("malformed legacy sign-in JSON is rejected", async () => {
  for (const body of ["null", "[]", "bad JSON"])
    await assert.rejects(
      normalizeAuthRequest(
        new Request("https://academy.example/api/auth/sign-in/oauth2", {
          method: "POST",
          body,
        }),
      ),
      SyntaxError,
    );
});
