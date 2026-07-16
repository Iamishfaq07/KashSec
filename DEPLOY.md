# KashSec Academy v2 — Deployment Guide

Version 2 with **two-level navigation**, **Mermaid diagrams**, **inline SVG figures**, **rich callout boxes**, and **external reference links** — each path split into short focused sub-lessons.

## What changed vs v1

- Each path is now split into short sub-lessons (5–11 per path).
- URLs are structured: `#/lesson/PATH_ID/SUB_ID` (e.g., `#/lesson/01-introduction/what-is-cybersecurity`).
- Sidebar shows all paths; click one to expand its sub-lessons.
- Lessons support Mermaid flowcharts, inline SVG diagrams, colourful callout boxes (tip/warn/danger/lab/challenge/note), and a "Further reading" block linking to external references.
- Reading-progress bar at the top.

## Folder structure

```
kashsec-site-v2/
├── index.html
├── styles.css
├── app.js
├── .nojekyll
└── course/
    ├── 01-introduction/            <- one folder per path
    │   ├── what-is-cybersecurity.md
    │   ├── why-it-matters.md
    │   ├── types-of-hackers.md
    │   ├── the-golden-rule.md
    │   └── how-to-learn.md
    ├── 02-networking/              <- filled in path by path
    ├── 03-linux/
    └── ...
```

## How to deploy

The site is deployed on **Vercel**, connected to the `main` branch of this
repo — every push to `main` triggers an automatic redeploy. There's no
build step; Vercel just serves the static files as-is (root directory,
no framework preset needed).

To point Vercel at a fresh copy of this repo: [vercel.com/new](https://vercel.com/new) →
import the repo → leave the build settings on defaults (no build command,
output directory `.`) → Deploy.

## Content status

**Path 01 (Introduction) is fully rebuilt** as the working example. All 5 sub-lessons are written in the new format with diagrams, callouts, and references.

**Paths 02–12** — the old single-file markdowns are being rebuilt in the same style, path by path. Missing sub-lessons will show a friendly "Coming soon" message until they're filled in.

## Special markdown syntax used in lessons

If you edit lessons, here are the custom blocks the site understands:

### Callout boxes
```
:::tip
Content here
:::

:::warn CUSTOM TITLE
Content here
:::

:::danger
Content here
:::

:::lab Lab title
Steps here
:::

:::challenge Question here
Content here with a details/summary block for the answer.
:::

:::note
General note
:::
```

### Mermaid diagrams
Standard fenced code block with `mermaid` language:
    ```mermaid
    flowchart LR
      A --> B
    ```

### Inline SVG figures
```
~~~svg Caption text
<svg ...>...</svg>
~~~
```

### External references block
```
???refs
- [Link 1](https://...) — description
- [Link 2](https://...) — description
???
```

## Testing locally

Same as before:
```bash
cd kashsec-site-v2
python3 -m http.server 8000
```
Then open http://localhost:8000
