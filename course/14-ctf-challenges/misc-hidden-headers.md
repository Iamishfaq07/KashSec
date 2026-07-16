# Misc — Hidden in Plain Sight

**Category:** Misc · **Difficulty:** Medium

## Scenario

While inspecting network traffic in your browser's DevTools (Path 05's **Browser DevTools Lab** should feel very relevant right about now), you notice `api.kashsec-labs.test` returns a few nonstandard response headers on every request — the kind most people scroll straight past without a second look.

## Provided data

Full response headers captured from a single request:

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store
X-Request-Id: 8f2c1a90-44b1
X-Debug-Trace-A: S0FTSFNFQ3toMzRkZXJzX2M0bl9oMW
X-Debug-Trace-B: RlX3NlY3JldHN9
Server: nginx
```

Something about those two `X-Debug-Trace` headers seems out of place compared to the routine ones around them.

## Your task

Find the flag hidden across these headers.

:::challenge Piece it together
<details><summary>Hint 1</summary>Standard headers like <code>Content-Type</code>, <code>Cache-Control</code>, and <code>Server</code> follow well-known, documented formats. <code>X-Debug-Trace-A</code> and <code>X-Debug-Trace-B</code> aren't real standard headers at all — the <code>X-</code> prefix is a longstanding (if deprecated) convention for custom, non-standard headers, often left behind by developers during debugging and forgotten before shipping to production.</details>
<details><summary>Hint 2</summary>Look closely at the character set inside both values — letters, numbers, no spaces or unusual symbols. That's the same encoding signature from the earlier Crypto challenge in this section. Try concatenating the two values together, in header order (A then B), before decoding anything.</details>
<details><summary>Show full answer</summary>The two nonstandard <code>X-Debug-Trace</code> headers each hold one half of a Base64-encoded string, split across two headers specifically to make it slightly less obvious at a glance than a single long value would be. Concatenating <code>X-Debug-Trace-A</code> directly followed by <code>X-Debug-Trace-B</code> gives the full Base64 string <code>S0FTSFNFQ3toMzRkZXJzX2M0bl9oMWRlX3NlY3JldHN9</code>, which decodes directly to the flag.</details>
:::

## The flag

```
KASHSEC{h34ders_c4n_h1de_secrets}
```

## Why this matters beyond the CTF

Debug headers, verbose error responses, and forgotten `X-` prefixed headers are a genuinely common real-world information disclosure vector — internal hostnames, framework versions, stack traces, and even authentication debug tokens have all shown up in production response headers left over from a development or QA build. Path 07's **web recon** lesson specifically calls out checking every response header during reconnaissance, not just the body — this challenge is a compressed illustration of exactly why that habit pays off. Tools like Burp Suite's Proxy history (Path 07) make scanning every header across an entire session dramatically faster than manually inspecting each response in DevTools one at a time.

:::tip A real recon habit worth building
When testing any web application (with proper authorization), get in the habit of reviewing full raw HTTP responses — not just what renders on the page — for every request type: normal pages, API calls, error responses, and redirects. Debug artifacts like this challenge's headers tend to survive precisely because they're invisible unless someone deliberately looks.
:::

**Next up →** [Crypto — Break the XOR Cipher](#/lesson/14-ctf-challenges/crypto-xor-cipher)
