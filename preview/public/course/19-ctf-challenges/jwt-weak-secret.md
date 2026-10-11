# Web — Crack the Secret

**Category:** Web · **Difficulty:** Medium

## Scenario

`api.kashsec-labs.test` issues HS256-signed JWTs — properly signed this time, unlike this section's earlier `alg=none` challenge. You have a valid `guest` token and want `admin`. There's no algorithm trick available here; HS256 with a signature check is genuinely enforced. But you also noticed the company's engineering blog post, from two years ago, casually mentioning their auth service was "a quick weekend project."

## Provided data

Your captured token:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoidXNlciJ9.dHcJv0Y5rN2fXhL8mQ4wZ1kP3jT6sB9c
```

A short wordlist of common weekend-project HMAC secrets to try:

```
secret, password123, kashsec, changeme, dev-secret-key
```

## Your task

HS256 verification means: `HMAC-SHA256(header + "." + payload, secret)` must equal the token's signature. If you can guess the secret, you can compute a valid signature for *any* payload you write — including one with `"role":"admin"`.

:::challenge Find the secret, then forge the token
<details><summary>Hint 1</summary>Unlike RS256 (asymmetric — a public/private key pair), HS256 is symmetric: the exact same secret both signs and verifies. If that secret is short or guessable, you don't need to break any cryptography — you just need to try candidate secrets and see which one reproduces the token's actual signature.</details>
<details><summary>Hint 2</summary>You can test each candidate offline, entirely locally: take the token's own header+payload, compute HMAC-SHA256 with each wordlist entry, and compare the result against the token's real signature segment. Whichever candidate produces a match is the real secret.</details>
<details><summary>Show full answer</summary>Testing each candidate against the token's actual header.payload segment, <code>dev-secret-key</code> produces a matching HMAC-SHA256 signature. With the real secret in hand, you can now sign <em>any</em> payload yourself: build <code>{"user":"guest","role":"admin"}</code>, Base64URL-encode it alongside the same header, and compute a fresh HMAC-SHA256 signature using <code>dev-secret-key</code>. The server verifies it as fully legitimate — because, cryptographically, it is: you signed it with the correct secret, you just weren't supposed to know it. Submitting the forged token to the API's <code>/whoami</code> endpoint returns <code>{"user":"guest","role":"admin","flag":"KASHSEC{n3v3r_r0ll_y0ur_0wn_s3cr3t_w34kly}"}</code>.</details>
:::

## The flag

```
KASHSEC{n3v3r_r0ll_y0ur_0wn_s3cr3t_w34kly}
```

## Why this matters beyond the CTF

Weak or guessable HMAC secrets are a genuinely common real-world JWT finding, and unlike `alg=none` (which requires a specific server misconfiguration to even be exploitable), a weak secret is exploitable purely offline — once you have even one legitimately-issued token to test candidates against, you never need to touch the server again until you submit your forged result. Tools like `jwt_tool` and `hashcat` automate exactly this wordlist-testing process against real targets. Path 21's JWT-attacks lesson covers this alongside `alg=none` and algorithm confusion as the third pillar of the classic JWT attack trio.

## Bonus round — how would you have found this without the blog post hint?

:::challenge Where do weak-secret candidates actually come from in real testing?
<details><summary>Hint</summary>The scenario gave you a curated wordlist and a convenient blog-post hint pointing at it. In an authorized real-world engagement, what would actually generate that candidate list in the first place?</details>
<details><summary>Show answer</summary>In practice, testers use large, purpose-built wordlists (like the ones bundled with <code>jwt_tool</code> or general-purpose password lists like <code>rockyou.txt</code>) combined with brute-force tools such as <code>hashcat</code>'s dedicated JWT-cracking mode, which can test millions of candidate secrets per second on modest hardware. The "weekend project" blog post in this challenge is a stand-in for real-world reconnaissance signals that suggest a target is worth trying this against at all — a company's public GitHub repo with hardcoded secrets in commit history, a job posting mentioning "built our own lightweight auth," or a leaked internal wiki page are all realistic equivalents. The technique itself (brute-force against the actual token, entirely offline) doesn't change; only how confident you are it's worth the compute time does.</details>
:::

:::tip Offline cracking has no rate limit
Because verifying a guessed secret requires no interaction with the target server at all, there's no login-attempt lockout, no rate limiting, and no logging of your attempts — you can try secrets as fast as your own hardware allows. This is exactly why "our login has rate limiting" provides zero protection against this specific attack; the guessing never touches the server until the very last, successful step.
:::

**Next up →** [Web — The Wrong Kind of Trust](#/lesson/19-ctf-challenges/jwt-algorithm-confusion)
