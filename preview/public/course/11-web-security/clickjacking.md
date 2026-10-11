# Clickjacking

The CSRF lesson covered tricking a browser into sending an unintended request. This lesson covers a related but visually different trick: tricking the *user themselves* into clicking something they never actually meant to click.

## What clickjacking actually is

**Clickjacking** loads a legitimate target page inside an invisible `<iframe>`, overlaid beneath attacker-controlled content the victim actually sees and interacts with — the victim believes they're clicking a harmless button on the attacker's page, but they're actually clicking a precisely-positioned, invisible element on the legitimate page underneath.

```html
<style>
    iframe { opacity: 0.01; position: absolute; top: 0; left: 0; z-index: 2; }
    .decoy-button { position: absolute; top: 300px; left: 400px; z-index: 1; }
</style>
<iframe src="https://victim-site.com/delete-account"></iframe>
<button class="decoy-button">Click here to win a prize!</button>
```

The invisible iframe is positioned precisely so the legitimate "Delete Account" button sits exactly where the visible decoy button appears — the victim clicks what looks like a harmless prize button, but the click actually lands on the real, invisible button underneath.

## Why this attack requires the victim to already be logged in

Clickjacking doesn't forge a session the way CSRF does — it relies on the victim being genuinely, legitimately authenticated on the target site already, then tricking their *own real click* into performing an action within that legitimate session. This is a meaningfully different mechanism than CSRF, even though both ultimately trick a user into an unintended action.

## The defense: frame-busting and CSP

Path 05's Content Security Policy lesson mentioned `frame-ancestors` in passing — here's the direct application: an application can tell the browser exactly which sites (if any) are allowed to embed it in an iframe at all:

```
Content-Security-Policy: frame-ancestors 'none'
```

`'none'` blocks framing entirely; `'self'` allows framing only by the same origin. This is the modern, standard defense, replacing the older, less reliable JavaScript-based "frame-busting" scripts that could sometimes be bypassed.

## X-Frame-Options: the older, still-relevant header

```
X-Frame-Options: DENY
X-Frame-Options: SAMEORIGIN
```

`X-Frame-Options` predates CSP's `frame-ancestors` and provides similar protection, still worth setting for compatibility with older browsers that don't fully support CSP — a genuine example of defense in depth (Path 10) applied to header configuration itself: two independent headers, each providing overlapping protection.

:::challenge Test yourself
Why is clickjacking considered a meaningfully different attack from CSRF, even though both trick a victim's browser into an unintended action?
<details><summary>Show answer</summary>CSRF exploits the browser <em>automatically</em> attaching session cookies to a forged request the victim never actually interacted with at all — the victim's actual click or intent is irrelevant, since the browser sends the request on its own (via an image tag, for instance). Clickjacking, by contrast, requires the victim to genuinely, physically click something — the trick isn't in forging a request without any interaction, it's in disguising <em>what the victim's real click actually lands on</em>, using a precisely positioned invisible iframe to hijack a click the victim believes is going somewhere else entirely. Both ultimately cause an unintended action within a legitimate session, but the underlying mechanism (and correspondingly, the defense — frame-ancestors versus CSRF tokens/SameSite) is genuinely different for each.</details>
:::

## Key terms

- **Clickjacking** — overlaying an invisible target page beneath deceptive content, tricking a victim's genuine click into an unintended action.
- **frame-ancestors** — a CSP directive controlling which sites are allowed to embed a page in an iframe.
- **X-Frame-Options** — an older header providing similar anti-framing protection.

## Recap

- Clickjacking hides a legitimate, authenticated page beneath deceptive content, tricking a victim's real click into an unintended action within their own genuine session.
- `frame-ancestors` (CSP) and `X-Frame-Options` are the two standard defenses, worth setting together for broader browser compatibility.
- The mechanism differs meaningfully from CSRF — clickjacking requires a genuine click, CSRF requires none at all — even though both result in an unintended authenticated action.

**Next up →** [Cross-Site Scripting](#/lesson/11-web-security/xss)
