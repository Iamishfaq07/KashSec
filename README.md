<div align="center">

# 🛡️ KashSec Academy

**A completely free cybersecurity course, from absolute zero to job-ready.**

14 learning paths · 150+ sub-lessons · diagrams, labs & challenges · always free

[![Live Site](https://img.shields.io/badge/live-kashsec.academy-EFA43A?style=for-the-badge)](https://iamishfaq07.github.io/KashSec/)
[![Made with](https://img.shields.io/badge/stack-HTML%20%C2%B7%20CSS%20%C2%B7%20JS-3FB6A8?style=for-the-badge)](#tech-stack)
[![Price](https://img.shields.io/badge/price-%E2%82%B90%20forever-111927?style=for-the-badge)](#)

</div>

---

## What is this?

KashSec Academy is a static, single-page course site that teaches cybersecurity from the very first principles — *"what is a network?"* — all the way through web hacking, bug bounty hunting, and AI red-teaming. No login, no paywall, no tracking. Just open it and start reading.

The whole site is plain HTML/CSS/JS with no build step, no framework, and no `npm install`. Lessons are written in Markdown and rendered client-side, so adding or editing content is as simple as editing a `.md` file.

## ✨ Features

| | |
|---|---|
| 🗺️ **12 structured paths** | From Intro & Networking through Advanced Topics & AI Security |
| 📖 **Two-level navigation** | Every path is split into short, focused sub-lessons |
| 🧜 **Mermaid diagrams** | Flowcharts and sequence diagrams rendered live in the browser |
| 🎨 **Inline SVG figures** | Custom hand-built diagrams where a picture beats a paragraph |
| 💡 **Rich callouts** | `tip` / `warn` / `danger` / `lab` / `challenge` / `note` boxes |
| 🔗 **Further reading** | Curated external references at the end of every lesson |
| 📊 **Reading progress bar** | Know how far through a lesson you are |
| 📱 **Fully responsive** | Same experience on phone, tablet, and desktop |

## 🚀 Quick start

```bash
git clone https://github.com/iamishfaq07/KashSec.git
cd KashSec
python3 -m http.server 8000
```

Then open **http://localhost:8000** — that's it. No dependencies to install.

> Lessons are fetched with `fetch()`, so opening `index.html` directly by double-clicking won't work (browsers block `fetch` on `file://`). Always serve it, even locally.

## 📁 Project structure

```
KashSec/
├── index.html              # SPA shell
├── styles.css               # design system (dark · amber · teal)
├── app.js                   # router, markdown renderer, course data
├── .nojekyll                 # tells GitHub Pages: don't run Jekyll
├── DEPLOY.md                 # full deployment walkthrough
└── course/
    ├── 01-introduction/      # one folder per path
    │   ├── what-is-cybersecurity.md
    │   └── ...
    ├── 02-networking/
    └── ...12-ai-security/
```

## 🗺️ The 14 paths

`00` Computer Basics & Security Mindset · `01` Introduction · `02` Networking · `03` Linux & Operating Systems · `04` Programming & Python · `05` How the Web Works · `06` Cybersecurity Fundamentals · `07` Web Security & Hacking · `08` Network Security · `09` Ethical Hacking · `10` Bug Bounty · `11` Advanced Topics · `12` AI & AI Security · `13` Career Prep

## ✍️ Writing a lesson

Lessons are plain Markdown with a few custom blocks the renderer understands:

```md
:::tip
A short, friendly tip.
:::

:::danger Custom title here
Something the reader must not skip.
:::

​```mermaid
flowchart LR
  A --> B
​```

~~~svg Diagram caption
<svg>...</svg>
~~~

???refs
- [OWASP Top 10](https://owasp.org/Top10/) — the industry-standard checklist
???
```

To add a brand-new sub-lesson: drop a `.md` file in the right `course/<path>/` folder and add an entry to the `PATHS` array near the top of `app.js`.

## 🛠️ Tech stack

- **[marked](https://marked.js.org/)** — Markdown → HTML
- **[Mermaid](https://mermaid.js.org/)** — diagrams as code
- Zero build tooling — what you edit is what ships

## 🌐 Deployment

The site auto-deploys to **GitHub Pages** from the `main` branch. See [`DEPLOY.md`](./DEPLOY.md) for the full walkthrough, including custom domains.

## 🤝 Contributing

Found a typo, a broken link, or want to write a missing sub-lesson? PRs are welcome — the whole point of this project is that free security education should keep getting better.

---

<div align="center">

**Learn · Practise · Get hired.**

Free forever, for everyone starting from zero.

</div>
