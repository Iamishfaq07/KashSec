# XSS Practical Lab

This is the capstone lab for Path 07 — hands-on practice finding and exploiting all three major XSS variants, then writing up a finding the way real bug bounty programs expect.

## Recommended platforms

- **[PortSwigger Web Security Academy](https://portswigger.net/web-security)** — free, extensive, purpose-built XSS labs covering every variant, referenced throughout this path.
- **DVWA (Damn Vulnerable Web Application)** — a free, locally-runnable vulnerable app (via Docker), useful for practicing without needing an internet connection.

## Tasks

1. **Find and exploit a reflected XSS.** Reflected XSS occurs when user input is echoed straight back into the page's HTML without sanitization — commonly in search results or error messages. Look for a parameter reflected into the page (`?q=test` showing "You searched for: test" somewhere in the response) and try:
   ```html
   <script>alert(document.domain)</script>
   ```
   A popup confirms the browser executed your injected script rather than treating it as plain text.
2. **Find and exploit a stored XSS.** Stored (persistent) XSS is more dangerous than reflected — the payload is saved server-side (in a comment, a profile field, a review) and executes for *every* visitor who views that stored content, not just the person who submitted it. Find a field that persists and displays user input (a comment box is the classic example) and submit the same script payload — then reload the page as a different "user" (or just reload fresh) to confirm it fires again without you resubmitting anything.
3. **Bypass a simple filter.** Many vulnerable labs include a basic filter (stripping `<script>` tags, for instance) as an intentional next challenge. Try alternate payloads that avoid the exact string being filtered:
   ```html
   <img src=x onerror=alert(document.domain)>
   <svg onload=alert(document.domain)>
   ```
   These work because the vulnerability isn't really about the word "script" — it's about any HTML attribute capable of executing JavaScript, and there are many.
4. **Create a proof-of-concept demonstrating real impact.** A plain `alert()` popup proves the bug exists but doesn't demonstrate *impact*. In a safe lab, escalate to something that shows a security researcher's actual reasoning — for example, a payload that reads `document.cookie` and displays it, demonstrating (without actually exfiltrating anything to a real external server) exactly what a real attacker could steal:
   ```html
   <script>alert(document.cookie)</script>
   ```

:::warn Impact demonstration, not real exploitation
Everything here should stay confined to proving impact within your own lab session — never actually exfiltrate real session data to an external server, even "just to prove it works," without explicit written authorization covering exactly that kind of test. A `document.cookie` popup within your own lab session proves the same point without crossing that line.
:::

:::challenge Write a full XSS report
Pick your strongest finding from this lab and write a short report: **Title**, **Type** (reflected/stored/DOM), **Steps to reproduce** (exact payload and location), **Impact** (what a real attacker could do — session hijacking, credential theft via a fake login overlay, defacement), and **Fix** (proper output encoding, and — as defense in depth — a Content Security Policy). This is the exact deliverable format expected on real bug bounty platforms.
:::

## Key takeaway

All three XSS variants share the same root cause — untrusted input rendered as executable HTML/JavaScript instead of inert text — and the same fundamental fix: **context-aware output encoding**, applied consistently everywhere user input reaches the page, never as an afterthought bolted onto one specific field.

**Explore more →** [Path 08 — Network Security](#/lesson/08-network-security)
