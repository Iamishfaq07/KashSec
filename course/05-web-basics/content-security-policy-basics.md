# Content Security Policy basics

The HTML-CSS-JS lesson mentioned XSS as a risk that exists because browsers execute whatever JavaScript a page contains. This lesson introduces the single most effective browser-enforced defense against that exact risk: **Content Security Policy (CSP)**.

## What CSP actually does

**CSP** is an HTTP response header (or an equivalent `<meta>` tag) that tells the browser exactly which sources of content — scripts, styles, images, fonts — are allowed to load and execute on a page, and which are not:

```
Content-Security-Policy: script-src 'self' https://trusted-cdn.com
```

This example tells the browser: only run JavaScript that comes from this page's own origin, or from `trusted-cdn.com` — any script from anywhere else, including a script an attacker manages to inject through an XSS vulnerability, gets blocked by the browser itself, regardless of how the injection happened.

## Why this is such a powerful, layered defense

This directly connects to a theme this entire course keeps returning to: **defense in depth**. Even if an application has an actual XSS vulnerability — a genuine flaw allowing an attacker to inject content into the page — a properly configured CSP can prevent that injected script from actually *executing*, because the browser simply refuses to run any script that doesn't match the policy's allowed sources. The underlying bug still exists and should still be fixed, but CSP meaningfully reduces the real-world impact even before that fix ships.

## The dangerous shortcut: 'unsafe-inline'

```
Content-Security-Policy: script-src 'self' 'unsafe-inline'
```

Adding `'unsafe-inline'` allows inline `<script>` tags to run directly within the page — often added by developers as a quick fix to get an existing application working with CSP, without properly restructuring inline scripts into separate files. The problem: `'unsafe-inline'` re-opens almost exactly the XSS protection CSP was meant to provide in the first place, since injected inline script now runs just as freely as legitimate inline script does.

:::danger A CSP with 'unsafe-inline' provides dramatically weaker protection
A common real-world pattern worth recognizing: an application ships a CSP header, appears to have "done CSP," but includes `'unsafe-inline'` for convenience — meaning the actual XSS protection this lesson is describing is largely undermined. Reviewing a CSP header for `'unsafe-inline'` (and the similarly risky `'unsafe-eval'`, which allows `eval()`-style dynamic code execution) is a genuinely quick, high-value check during any real web security assessment.
:::

## Other useful CSP directives, briefly

- **`default-src`** — the fallback policy applied to any resource type not explicitly specified
- **`img-src`** — controls which sources images can load from
- **`frame-ancestors`** — controls which sites are allowed to embed this page in an `<iframe>`, directly defending against clickjacking attacks
- **`report-uri` / `report-to`** — tells the browser to send a report whenever the policy blocks something, genuinely useful for monitoring and tuning a policy over time without breaking legitimate functionality

:::challenge Test yourself
Why does a CSP containing `'unsafe-inline'` provide meaningfully weaker XSS protection than one without it, even though the application still technically "has a CSP"?
<details><summary>Show answer</summary>CSP's core XSS defense works by telling the browser to only execute scripts from explicitly trusted, allow-listed sources — an attacker's injected script, having no way to actually originate from a trusted external source, would normally be blocked outright. <code>'unsafe-inline'</code> specifically re-permits <em>any</em> inline script directly embedded in the page's HTML to run, with no distinction between the application's own legitimate inline scripts and an attacker's maliciously injected inline script — both are simply "inline script embedded in the page," and CSP with this directive treats them identically. This means an XSS vulnerability that injects an inline `<script>` tag (the most common form of XSS injection) executes successfully regardless of the CSP being present, largely defeating the specific protection this lesson describes, even though the header technically exists and might still provide some narrower benefit against externally-hosted malicious scripts.</details>
:::

## Key terms

- **Content Security Policy (CSP)** — an HTTP header restricting which sources of content a page is allowed to load and execute.
- **'unsafe-inline'** — a CSP directive that re-permits inline scripts, significantly weakening XSS protection.
- **Defense in depth** — layering multiple independent security controls so a single flaw doesn't lead directly to full compromise.

## Recap

- CSP tells the browser exactly which content sources are trusted, and blocks execution of anything else — including an attacker's injected script from a real XSS vulnerability.
- This is a genuine example of defense in depth: CSP doesn't fix the underlying bug, but it meaningfully reduces real-world impact even before that fix ships.
- `'unsafe-inline'` significantly undermines CSP's core protection, and checking for it is a quick, high-value step in any real web security review.

**Next up →** [Anatomy of a modern web app](#/lesson/05-web-basics/web-anatomy)
