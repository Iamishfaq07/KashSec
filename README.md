# 🛡️ KashSec Academy

**A completely free cybersecurity course, from absolute zero to job-ready.**

26 learning paths · 323 sub-lessons · diagrams, labs, a hands-on CTF zone & challenges · always free

[![Live Site](https://img.shields.io/badge/live-kashsec.academy-EFA43A?style=for-the-badge)](https://kashsec.vercel.app/)

## What's new
- **New advanced path: OT/ICS & Critical Infrastructure Security** — SCADA/ICS fundamentals, industrial protocols (Modbus, DNP3) and why they lack built-in security, the Purdue Model, real-world attacks (Stuxnet, the Ukraine grid attacks, Oldsmar, Triton), practical OT controls, and a full capstone security assessment
- **New advanced path: Zero Trust Architecture** — never trust/always verify, identity as the perimeter, device posture, micro-segmentation, ZTNA vs. VPN, continuous verification, Zero Trust in the cloud, and a practical rollout roadmap capped with a BeyondCorp case study and maturity-assessment capstone
- **New interactive labs**: 4 API Security labs (BOLA/BFLA, GraphQL introspection abuse, mass assignment, rate-limit bypass), 4 AI Red Teaming labs (prompt injection, jailbreak, indirect injection, an agentic-risk defensive exercise), and a guided 3-stage Active Directory Attack Lab (BloodHound recon, Kerberoasting, Golden Ticket)
- **Two new advanced paths**: **API Security** (OWASP API Top 10, BOLA/BFLA, JWT attacks, GraphQL security, capstone lab) and **DevSecOps & AppSec Program** (SAST/DAST/SCA, CI/CD security, secrets & supply chain, threat modeling, building an AppSec program)
- **Tools** — a suite of in-browser security utilities (`#/tools`): encoder/decoder, hash generator, JWT decoder, CVSS 3.1 calculator, subnet calculator, password-strength meter, and a cipher playground. All client-side; nothing leaves the browser.
- **Full-text search** — search now matches the body of every lesson, not just titles. Plus an activity heatmap on your progress page, reading preferences (text size, width, legibility boost), Markdown export of your notes, an interview question bank (`#/interview`), a changelog (`#/changelog`) with RSS feed, and a "suggest an edit" link on every lesson.
- **Glossary & flashcards** — all 600+ Key Terms from every lesson in one searchable A–Z glossary (`#/glossary`), plus an active-recall flashcard mode (`#/review`) that remembers which terms you already know
- **Better lesson reading** — reading-time estimates, an "On this page" table of contents on longer lessons, one-click copy buttons and syntax highlighting on code blocks
- **Streaks, backups & shortcuts** — a visible day-streak counter, JSON export/import of all your progress (no account needed), quiz "review your last attempt", and keyboard shortcuts (`[` / `]` between lessons, `?` for the cheatsheet)
- **Installable & works offline** — KashSec is a full PWA now. Install it from the browser (or "Add to Home Screen" on mobile) and the entire course — app shell plus all 323 lessons — is available with zero network connection. See [Offline / PWA support](#offline--pwa-support) below.
- **Four new beginner-friendly paths**: **Cryptography Fundamentals** (encoding vs. encryption vs. hashing, from zero), **Windows Security Basics** (Path 03's Linux depth, now for Windows), **Cloud Computing Basics** (the foundation Path 16's cloud security assumes), and **Digital Privacy & Personal Security** (your footprint, VPNs, secure messaging, identity theft)
- **Path 17 — Malware & Reverse Engineering**: PE internals, hands-on Ghidra disassembly, dynamic analysis and sandboxing, unpacking/obfuscation, and writing YARA detection rules, capped with a full analysis pipeline lab
- **Path 13 — Mobile App Security**: Android & iOS from the ground up — APK analysis, insecure storage, traffic interception, certificate pinning bypass, and exported component vulnerabilities, capped with a full assessment lab
- **Path 19 — CTF Challenges**: a standalone Capture The Flag zone with 24 self-contained puzzles across Web, API, JWT, Crypto, Forensics, AI, Misc, and Linux privilege escalation, with difficulty tiers and a solution write-up template
- **Progress tracking, bookmarks & notes** on every lesson, plus an interactive roadmap and a personal progress dashboard
- **21 path quizzes + a Final Exam** (API Security and DevSecOps & AppSec Program don't have quizzes yet), with a canvas-drawn **certificate of completion** (PNG download, print-to-PDF, LinkedIn share)
- **14 achievements**, a light/dark **theme toggle**, global **search** (Ctrl/Cmd+K), and "continue where you left off"
- Optional **cloud sync** — sign in to back up progress across devices; the site works fully without it (see [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md))
- **Path 00**: Computer Basics & Security Mindset, now fully expanded for absolute freshers with zero prior exposure
- **Path 20**: Career Prep — resume, portfolio, interviews, and the job search, now fully expanded
- ~30 hands-on lab lessons folded into the existing paths (Linux forensics, JWT attacks, cloud misconfig, threat hunting, LLM red-teaming, and more)

## Quick start
```bash
git clone https://github.com/iamishfaq07/KashSec.git
cd KashSec
python3 -m http.server 8000
```

Open http://localhost:8000

**Start here →** Path 00 for complete beginners.

## 📁 Project structure

```
KashSec/
├── index.html              # SPA shell
├── styles.css               # design system (dark · amber · teal)
├── app.js                   # router, markdown renderer, course data
├── .nojekyll                 # tells GitHub Pages: don't run Jekyll
├── DEPLOY.md                 # full deployment walkthrough
└── course/
    ├── 00-fresher-basics/    # one folder per path
    │   ├── what-is-a-computer.md
    │   └── ...
    ├── 01-introduction/
    └── ...22-devsecops-appsec/
```

## 🗺️ The 26 paths

`00` Computer Basics & Security Mindset · `01` Introduction · `02` Networking · `03` Linux & Operating Systems · `04` Programming & Python · `05` How the Web Works · `06` Cryptography Fundamentals · `07` Windows Security Basics · `08` Cloud Computing Basics · `09` Digital Privacy & Personal Security · `10` Cybersecurity Fundamentals · `11` Web Security & Hacking · `12` Network Security · `13` Mobile App Security · `14` Ethical Hacking · `15` Bug Bounty · `16` Advanced Topics · `17` Malware & Reverse Engineering · `18` AI & AI Security · `19` CTF Challenges · `20` Career Prep · `21` API Security · `22` DevSecOps & AppSec Program · `23` GRC & Compliance · `24` Zero Trust Architecture · `25` OT/ICS & Critical Infrastructure Security

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
- **[Supabase](https://supabase.com)** *(optional)* — auth + Postgres for cross-device sync; the site never depends on it being configured
- Zero build tooling — what you edit is what ships

## 🌐 Deployment

The site auto-deploys to **Vercel** from the `main` branch — zero build step, it's served as-is. Live at [kashsec.vercel.app](https://kashsec.vercel.app/).

## ☁️ Optional cloud sync

Progress, bookmarks, notes, and quiz scores live in `localStorage` by
default — no account needed, ever. If you want people to be able to
sign in and sync across devices, see [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)
for a step-by-step guide (free Supabase tier, ~10 minutes). Until it's
configured, the sign-in UI stays hidden and nothing changes.

## 📴 Offline / PWA support

KashSec is an installable Progressive Web App. A service worker (`sw.js`) precaches the entire app shell plus all 323 lesson files the first time you visit, so once that finishes, the whole course works with **no network connection at all** — refresh, close the tab, come back a week later on a plane, it's all still there.

- **Install it**: most browsers show an install icon in the address bar, or use the install button in the site header (desktop Chrome/Edge, Android). On iOS Safari, use Share → **Add to Home Screen**.
- **Regenerating the precache list**: `sw.js` is generated, not hand-written. After adding, removing, or renaming any path or lesson, run:
  ```bash
  npm run build:sw
  ```
  This reads the `PATHS` array in `app.js` and rewrites `sw.js`'s lesson list to match — commit the regenerated file.
- **Update flow**: when a new version deploys, the site shows a "Refresh" toast instead of silently swapping content under you mid-session.
- Supabase auth/sync calls are never cached and always go straight to the network — sync only ever reflects live, current data.

## 💰 Ads (optional, off by default)

The site can carry Google AdSense ads to help cover costs. Ads are **fully disabled** until configured — no script loads, no ad slot renders, nothing shifts layout. To turn them on:

1. Apply at [adsense.google.com](https://adsense.google.com) with this site and get approved (Google reviews the site first — usually a few days).
2. Open `ads.js` and set `ADS_CONFIG.clientId` to your publisher ID (`ca-pub-...`).
3. Update `/ads.txt` at the repo root with the same publisher ID — Google requires this file to actually pay out on impressions.
4. In the AdSense dashboard, create two manual ad units (one for the lesson sidebar, one for below lesson content) and copy each unit's slot ID into `ADS_CONFIG.slots` in `ads.js`.
5. In the AdSense dashboard under **Privacy & messaging**, enable Google's built-in consent tool. That's the actual GDPR/UK consent requirement for serving ads to EU/UK visitors — it's a dashboard toggle, not code, and works automatically with the loader already in place. Don't build a custom consent banner instead; ad consent has to come from a certified CMP, and Google's own tool already is one.

Placement is deliberately minimal — one slot in the lesson sidebar, one below lesson content — so ads don't get in the way of actually finishing a lesson. Tool pages, labs, quizzes, and the homepage stay ad-free.

## 🤝 Contributing

Found a typo, a broken link, or want to write a missing sub-lesson? PRs are welcome — the whole point of this project is that free security education should keep getting better.

---

<div align="center">

**Learn · Practise · Get hired.**

Free forever, for everyone starting from zero.

</div>
