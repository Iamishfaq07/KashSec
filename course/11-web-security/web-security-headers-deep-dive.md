# Web Security Headers: A Deep Dive

The XSS lesson showed the vulnerability CSP defends against, and clickjacking introduced `frame-ancestors`. This lesson pulls every HTTP security header covered scattered throughout this course into one place, plus a few genuinely important ones not yet named — directly the checklist the HTTP-security-header-analyzer tool elsewhere in this course actually implements.

## The headers worth knowing, in one place

| Header | What it does | Covered in |
|---|---|---|
| `Content-Security-Policy` | Restricts which content sources can load and execute | Path 05, this path's XSS/clickjacking lessons |
| `X-Frame-Options` | Legacy anti-clickjacking protection | This path's clickjacking lesson |
| `Strict-Transport-Security` | Forces HTTPS for all future visits, even if a user types `http://` | New in this lesson |
| `X-Content-Type-Options` | Prevents the browser from guessing (MIME-sniffing) a file's type | New in this lesson |
| `Referrer-Policy` | Controls how much of the referring URL gets sent to other sites | New in this lesson |
| `Permissions-Policy` | Restricts which browser features (camera, location) a page can use | New in this lesson |

## HSTS: forcing HTTPS, even against the first request

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

**HSTS (HTTP Strict Transport Security)** tells the browser to *never* connect to this site over plain HTTP again, for the specified duration — directly closing a real gap in Path 06's TLS-handshake coverage: even a site that properly redirects HTTP to HTTPS has a brief window on a user's *very first* visit where an attacker performing a man-in-the-middle attack (Path 02) could intercept that initial unencrypted request before the redirect happens. HSTS, once set, eliminates this gap for all future visits.

## X-Content-Type-Options: stopping MIME-sniffing abuse

```
X-Content-Type-Options: nosniff
```

Browsers sometimes try to guess a file's actual type by inspecting its content, rather than trusting the server's declared `Content-Type` — a genuinely exploitable behavior if an attacker can upload a file that gets misinterpreted as executable HTML/JavaScript instead of the harmless type it was declared as. `nosniff` disables this guessing behavior entirely, directly connecting to the file-upload risks the cmd-and-upload lesson covers.

## Referrer-Policy: controlling what leaks between sites

```
Referrer-Policy: strict-origin-when-cross-origin
```

By default, navigating from one site to another sends the *full URL* of the page you came from as the `Referer` header — potentially leaking sensitive information embedded in a URL (a session token in a query parameter, a password-reset link) to a completely different site. `Referrer-Policy` controls exactly how much of that URL gets shared.

## Why checking these headers is genuinely high-value reconnaissance

A quick header check (using `curl -I`, from Path 03, or DevTools' Network tab, from Path 05) against any target reveals a lot about an application's security maturity in seconds — missing CSP, missing HSTS, and a permissive `X-Frame-Options` together paint a picture of an application that likely hasn't received much dedicated security attention, genuinely useful triage information before diving deeper into any specific vulnerability class.

:::challenge Test yourself
Why does HSTS provide meaningfully better protection than simply configuring a server to redirect all HTTP requests to HTTPS?
<details><summary>Show answer</summary>A server-side HTTP-to-HTTPS redirect still requires the browser's <em>very first</em> request to that domain to go out over plain, unencrypted HTTP before the redirect can even happen — creating a brief but genuine window where a man-in-the-middle attacker positioned on the network (Path 02) could intercept that initial request, potentially stripping the redirect entirely and keeping the victim on an attacker-controlled, unencrypted connection for the rest of the session (a well-documented technique called SSL stripping). HSTS closes this gap by having the browser <em>remember</em>, after the first successful HTTPS visit, to never even attempt a plain HTTP connection to that domain again for the specified duration — meaning every subsequent visit skips the vulnerable unencrypted-first-request window entirely, rather than relying on a redirect that could theoretically be intercepted before it takes effect.</details>
:::

## Key terms

- **HSTS (Strict-Transport-Security)** — forces the browser to only ever connect over HTTPS to a domain, closing the unencrypted-first-request gap a redirect alone leaves open.
- **MIME-sniffing** — a browser's attempt to guess a file's actual type by inspecting its content rather than trusting the declared Content-Type.

## Recap

- This lesson consolidates every HTTP security header touched on throughout this course, plus HSTS, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy.
- HSTS closes a real gap that a simple HTTP-to-HTTPS redirect alone leaves open on a user's first visit.
- Checking an application's security headers is a fast, genuinely high-value reconnaissance step, revealing a lot about its overall security maturity in seconds.

**Next up →** [SQL Injection](#/lesson/11-web-security/sqli)
