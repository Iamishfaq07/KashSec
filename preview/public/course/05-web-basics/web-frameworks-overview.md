# Web frameworks: an overview

Every concept in this path so far has been explained at the level of raw HTML, HTTP, and JavaScript. This lesson is a map of the tools real-world developers actually build with — so that when a later path (or a real job) mentions React or Django by name, you already have a rough sense of what it is and where it fits.

:::tip
Exactly like Path 01's cyberattacks-overview lesson, this is recognition, not mastery. You don't need to learn any of these frameworks right now — the goal is knowing what category each one belongs to and roughly what problem it solves.
:::

## Frontend frameworks: building what the client renders

- **React** — the most widely used frontend framework, building interactive interfaces out of reusable **components**, each managing its own piece of the DOM (from the browser-rendering lesson) rather than manipulating raw HTML directly
- **Vue** and **Angular** — genuine alternatives solving broadly the same problem (structured, component-based UI building) with different design philosophies and tradeoffs

These frameworks don't change any of the underlying concepts this path has covered — HTTP requests, the DOM, cookies, CORS — they just provide structure and tooling for building the client-side code that ultimately does the same things a hand-written HTML/CSS/JS page would.

## Backend frameworks: handling requests and business logic

- **Django / Flask** (Python) — Django is a full-featured framework with a lot of built-in structure; Flask is a lighter-weight alternative giving developers more control over exactly what's included
- **Express** (Node.js/JavaScript) — lets developers write both frontend *and* backend code in the same language, a genuinely significant reason for JavaScript's dominance across the modern web stack
- **Ruby on Rails / Spring (Java) / ASP.NET (C#)** — other major backend frameworks, each dominant in different industries and company histories

Every backend framework, regardless of language, is ultimately doing the same fundamental job the client-vs-server lesson described: receiving HTTP requests, running server-side logic, and returning responses — the framework just provides structure, common patterns, and pre-built solutions for problems (routing, database access, authentication) nearly every web application needs to solve.

## Why frameworks matter for security specifically

- **Frameworks often provide built-in protections** — many modern frameworks automatically escape output to prevent XSS, provide CSRF token handling by default, or use parameterized database queries preventing SQL injection out of the box — genuinely reducing an entire category of vulnerability compared to hand-rolled code, *when developers don't disable or bypass these protections*
- **But frameworks aren't magic** — a developer who bypasses a framework's built-in protection (using a "raw" or "unsafe" output method to skip automatic escaping, for instance) reintroduces exactly the vulnerability the framework was otherwise preventing — Path 11's web security material covers several real examples of exactly this pattern
- **Framework-specific vulnerabilities exist too** — a vulnerability discovered in a widely-used framework itself can affect every application built on top of it simultaneously, which is exactly why keeping frameworks updated (directly connecting to Path 00's updates lesson) matters at the application-dependency level, not just the operating-system level

## Recognizing a framework in the wild

A page's source often reveals its framework — React apps frequently have a `<div id="root">` or `<div id="app">` that gets populated entirely by JavaScript rather than containing visible content in the original HTML (directly connecting to the how-browsers-render-pages lesson's DOM-vs-source-code distinction), and framework-specific naming conventions in class names or attributes are often visible in DevTools' Elements panel.

:::challenge Test yourself
Why might a security review specifically check whether a web application's framework has any built-in output-escaping or parameterized-query protection disabled, rather than assuming the framework's defaults are always in effect?
<details><summary>Show answer</summary>Modern frameworks frequently provide meaningful protection against entire vulnerability categories (XSS via automatic output escaping, SQL injection via parameterized queries) as sensible defaults — but developers can and sometimes do explicitly bypass these protections, often for a specific, seemingly reasonable-at-the-time reason (needing to render raw HTML content, building a dynamic query the framework's standard tools don't easily support). A security review that simply assumes "this app uses Framework X, so it's protected against XSS" without checking for these specific bypasses can miss a genuine, exploitable vulnerability hiding behind an otherwise well-protected framework — which is exactly why Path 11's web security material treats framework defaults as a helpful baseline to verify, not a guarantee to blindly trust.</details>
:::

## Key terms

- **Frontend framework** — a tool (React, Vue, Angular) providing structure for building client-side, component-based user interfaces.
- **Backend framework** — a tool (Django, Express, Rails) providing structure for handling server-side request processing and business logic.
- **Component** — a reusable, self-contained piece of UI in a frontend framework, managing its own portion of the DOM.

## Recap

- Frameworks don't change the underlying concepts this path has covered — they provide structure and pre-built solutions on top of the same HTTP, DOM, and client-server fundamentals.
- Many modern frameworks provide meaningful built-in protection against entire vulnerability categories by default, genuinely reducing risk — but only when developers don't explicitly bypass those protections.
- Recognizing a framework's presence (through DOM structure, naming conventions) is a genuinely useful skill for both development and security assessment work.

**Next up →** [Cookies & Sessions Lab](#/lesson/05-web-basics/cookies-sessions-lab)
