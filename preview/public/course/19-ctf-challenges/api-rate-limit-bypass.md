# API — Locked Out, Sort Of

**Category:** API · **Difficulty:** Hard

## Scenario

`portal.kashsec-labs.test` has an admin login endpoint that's supposed to lock out an IP after 3 failed password attempts. You've confirmed the lockout is real — but you also have access to the target's nginx access logs (leaked in an earlier, unrelated recon step) showing exactly how the app determines "which IP" made a request.

## Provided data

Three of your own failed login attempts, followed by the lockout response:

```
POST /api/login {"username":"admin","password":"wrong1"} → 401
POST /api/login {"username":"admin","password":"wrong2"} → 401
POST /api/login {"username":"admin","password":"wrong3"} → 401
POST /api/login {"username":"admin","password":"wrong4"} → 429 Too Many Requests
```

An excerpt from the leaked nginx config, explaining exactly how the app identifies "the client":

```nginx
# app trusts the LAST value of X-Forwarded-For for rate limiting,
# to correctly identify real client IPs behind our load balancer
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```

And a short list of password candidates found in an earlier OSINT step against this same fictional target:

```
Summer2024!, CorpAdmin1, P@ssw0rd2024, KashSecAdmin!, Winter2025$
```

## Your task

Use the rate-limit's actual identification logic — not the real client IP — to get more than 3 password attempts through, and find which candidate is correct.

:::challenge Work out the bypass
<details><summary>Hint 1</summary>The nginx comment says the app trusts the "last value" of <code>X-Forwarded-For</code> for rate limiting. That header is normally set by trusted infrastructure (like a load balancer) — but it's still just a header. What happens if <em>you</em>, the client, also send one?</details>
<details><summary>Hint 2</summary>If the app blindly trusts whatever ends up as the "last" X-Forwarded-For value, and your own request can add its own X-Forwarded-For header before the load balancer appends the real one, you may be able to control which value the app treats as authoritative — depending on exactly how the infrastructure combines multiple values.</details>
<details><summary>Show full answer</summary>Because the app keys its rate limit off a client-influenceable value, sending your own <code>X-Forwarded-For</code> header with a fresh, made-up IP on every single request resets the "which IP is this" bucket the rate limiter uses — even though your real, underlying network connection never changes. Sending each of the five candidate passwords with a distinct fake <code>X-Forwarded-For</code> value (e.g. <code>10.0.0.1</code>, <code>10.0.0.2</code>, <code>10.0.0.3</code>...) lets all five attempts through without ever hitting the 3-attempt cap. The correct password is <code>KashSecAdmin!</code>, and a successful login returns: <code>{"token": "...", "flag": "KASHSEC{sp00f_th3_h34der_sk1p_th3_l1m1t}"}</code>.</details>
:::

## The flag

```
KASHSEC{sp00f_th3_h34der_sk1p_th3_l1m1t}
```

## Why this matters beyond the CTF

Rate limiting an authentication endpoint by a client-supplied header instead of the actual, verified connection source is a real, recurring misconfiguration — Path 21's **Rate-Limit Bypass Simulator** lab is built around this exact mechanic. The deeper lesson: any signal an attacker can set themselves (a header, a cookie, a body field) is not a trustworthy basis for a security control, no matter how reasonable the infrastructure comment sounds. The correct fix is rate-limiting by the actual, verified TCP connection source, and only trusting `X-Forwarded-For` when it's set by infrastructure you fully control and the client cannot reach past.

## Bonus round — why did the comment's reasoning sound so plausible?

:::challenge Was the nginx comment actually wrong?
<details><summary>Hint</summary>Re-read the comment: "trusts the last value... to correctly identify real client IPs behind our load balancer." In isolation, for a load balancer that always appends the true client IP as the last entry, this can be a reasonable pattern. What's missing from this specific setup that would make it safe?</details>
<details><summary>Show answer</summary>The reasoning is sound <em>only if</em> the infrastructure strips or overwrites any client-supplied <code>X-Forwarded-For</code> value before appending the real one — so the "last value" is always guaranteed to be infrastructure-controlled, never attacker-controlled. This target's misconfiguration isn't "using X-Forwarded-For is inherently wrong" — plenty of correctly configured systems use it safely. The actual bug is a missing infrastructure-level step: nothing strips the client's own forged header before the load balancer's real value gets appended, so an attacker's fake value can end up occupying a position the app trusts. This is a subtle, very real class of misconfiguration — the fix isn't "never use X-Forwarded-For," it's "control the full chain of who's allowed to set it."</details>
:::

:::tip This is the same bug in a different disguise every time
Whether it's rate limiting, IP allow-listing, or geofencing, "trust a client-controllable header to make a security decision" is the same root mistake wearing different clothes. Whenever you see security logic keyed off a header name starting with <code>X-</code>, it's worth asking specifically who can set that header, and whether anything actually stops a client from setting it themselves.
:::

**Next up →** [Web — Crack the Secret](#/lesson/19-ctf-challenges/jwt-weak-secret)
