# CSRF — Cross-Site Request Forgery

The IDOR lesson showed a broken *authorization* check. This lesson covers a genuinely different failure — one where authentication and authorization both work exactly as designed, and the attack succeeds anyway, by tricking the victim's own browser into making a request on their behalf.

## What CSRF actually exploits

Recall Path 05's Same-Origin Policy lesson: cookies are still *sent* automatically with cross-origin requests, even though the Same-Origin Policy prevents a script on a different origin from *reading* the response. **CSRF (Cross-Site Request Forgery)** exploits exactly this gap — an attacker's page, hosted anywhere, can trigger a request to a target site, and the victim's browser automatically attaches their existing session cookie, making the request look completely legitimate to the server.

```html
<!-- Hosted on evil.com, visited by a victim already logged into bank.com -->
<img src="https://bank.com/transfer?to=attacker&amount=1000">
```

If `bank.com` performs this transfer based purely on a valid session cookie, with no additional verification that the request genuinely originated from `bank.com`'s own page, the transfer succeeds — the victim's browser sent a fully authenticated request without the victim ever intending to.

## Why GET requests make this even easier

Directly connecting to Path 05's HTTP-methods lesson: an action that should never happen via GET (like a state-changing transfer) makes CSRF trivial — a single `<img>` tag, a hyperlink, or even a genuine accidental page load can trigger the attack, with the victim never needing to click anything at all.

## The defense: CSRF tokens

The standard defense is a **CSRF token** — a unique, unpredictable value embedded in the legitimate page's form, which must be submitted along with the request and verified server-side:

```html
<form action="/transfer" method="POST">
    <input type="hidden" name="csrf_token" value="a8f5f167f44f4964e6c998dee827110c">
    <!-- ... -->
</form>
```

An attacker's page hosted on a different origin has no way to read this token (protected by the Same-Origin Policy from Path 05), so a forged request can't include a valid one — the server rejects any request missing a correct, matching token, regardless of whether a valid session cookie was also attached.

## SameSite cookies: a modern, complementary defense

```
Set-Cookie: session=abc123; SameSite=Strict
```

The **SameSite** cookie attribute tells the browser not to send a cookie at all on cross-origin requests, directly closing the exact gap CSRF exploits, without requiring a separate token mechanism. `Strict` provides the strongest protection; `Lax` (a common default on modern browsers) allows cookies on some cross-origin navigation while still blocking the classic CSRF pattern.

:::tip Modern browsers have quietly reduced CSRF's real-world prevalence
Because `SameSite=Lax` has become a common browser default even without explicit configuration, classic CSRF is somewhat less prevalent than it once was — but it remains a genuine, real finding, especially against older applications, misconfigured cookies, or GET-based state changes that bypass some SameSite protections. CSRF tokens remain the more complete, explicit defense.
:::

:::challenge Test yourself
Why does CSRF succeed even when authentication (verifying who the user is) and the session mechanism itself both work exactly as designed?
<details><summary>Show answer</summary>CSRF doesn't attack authentication at all — the victim genuinely is who their session cookie claims they are, and the server's authentication check passes completely legitimately. The actual failure is that the server has no way to verify the request's <em>origin and intent</em> — it can't distinguish a request the user genuinely meant to submit from their own logged-in session versus a request their browser was tricked into sending automatically by a completely different, malicious site. This is exactly why CSRF is categorized separately from authentication or authorization bugs: the identity check is correct, but there's no verification that the specific request actually reflects the user's genuine, deliberate intent — which is precisely the gap CSRF tokens and SameSite cookies are designed to close.</details>
:::

## Key terms

- **CSRF (Cross-Site Request Forgery)** — tricking a victim's authenticated browser into making an unintended request to a target site.
- **CSRF token** — a unique, unpredictable value verifying a request genuinely originated from the legitimate page.
- **SameSite cookie attribute** — a browser-enforced setting restricting when a cookie is sent on cross-origin requests.

## Recap

- CSRF exploits the fact that cookies are sent automatically with cross-origin requests, even though the Same-Origin Policy prevents reading the response — authentication works fine, but request origin and intent are never verified.
- CSRF tokens and the SameSite cookie attribute are the two standard, complementary defenses, closing the gap from different angles.
- State-changing actions performed via GET make CSRF especially easy to exploit, directly connecting to Path 05's warning about GET's intended side-effect-free semantics.

**Next up →** [Clickjacking](#/lesson/11-web-security/clickjacking)
