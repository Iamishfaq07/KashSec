# KashSec Academy — Deployment Guide

This folder is the **complete website**. It's a static site — pure HTML/CSS/JS, no build step, no npm install, no framework. It renders your 12 markdown course files with the KashSec dark/amber/teal design.

## Folder contents

```
kashsec-site/
├── index.html            # main page (SPA shell)
├── styles.css            # KashSec design system
├── app.js                # router + markdown loader
├── .nojekyll             # tells GitHub Pages: don't run Jekyll
├── DEPLOY.md             # this file
└── course/               # your 12 lesson files + README
    ├── 01-introduction.md
    ├── 02-networking.md
    ├── ... (through 12)
    └── README.md
```

---

## Deploy to GitHub Pages — step by step

### Step 1 — Create a GitHub repository
1. Go to [github.com/new](https://github.com/new)
2. **Repository name:** `kashsec-academy` (or anything you like)
3. **Public** (required for free GitHub Pages)
4. Don't add a README or .gitignore — leave it empty
5. Click **Create repository**

### Step 2 — Upload the site
**Easiest way (web UI):**
1. On your new repo page, click **"uploading an existing file"**
2. Drag the **entire contents of this `kashsec-site/` folder** (not the folder itself — the files inside it) into the browser
3. Make sure `index.html`, `styles.css`, `app.js`, `.nojekyll`, and the `course/` folder are all uploaded
4. Scroll down, type a commit message like `Initial site`, and click **Commit changes**

**Using git (if you know it):**
```bash
cd kashsec-site
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kashsec-academy.git
git push -u origin main
```

### Step 3 — Turn on GitHub Pages
1. In your repo, go to **Settings** (top right)
2. Left sidebar → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Under **Branch**, select **main** and **/ (root)**, then **Save**
5. Wait 1–2 minutes for the site to build

### Step 4 — Visit your site 🎉
Your site is now live at:

```
https://YOUR_USERNAME.github.io/kashsec-academy/
```

(Replace `YOUR_USERNAME` with your GitHub username.)

If you named the repo exactly `YOUR_USERNAME.github.io`, it lives at `https://YOUR_USERNAME.github.io/` (no subpath).

---

## Testing locally before deploying (optional but recommended)

Because the site uses `fetch()` to load markdown, opening `index.html` directly by double-clicking **won't work** — browsers block `fetch` on `file://` for security. Run a tiny local server instead:

```bash
cd kashsec-site
python3 -m http.server 8000
```

Then open **http://localhost:8000** in your browser. Everything will work exactly like it will on GitHub Pages.

Alternative if you don't have Python:
```bash
npx serve
```

---

## How to update the course

1. Edit any `.md` file inside `course/` (in the GitHub web editor, or locally and push).
2. Commit / save.
3. GitHub Pages rebuilds in ~30 seconds. Refresh your site — new content appears.

To add a completely new path/lesson:
1. Add the new `.md` file to `course/`
2. Edit `app.js` and add an entry to the `PATHS` array near the top
3. Commit — done.

---

## Adding a custom domain later

If you buy `kashsec.com` (or any domain) and want to use it:

1. In your repo, create a file called `CNAME` (no extension) containing just your domain, e.g. `kashsec.com`
2. In your domain registrar's DNS settings, add:
   - An **A record** for `@` pointing to `185.199.108.153` (and `.109`, `.110`, `.111`)
   - Or a **CNAME** for `www` pointing to `YOUR_USERNAME.github.io`
3. In repo **Settings → Pages**, enter your custom domain and enable **Enforce HTTPS**

---

## Troubleshooting

- **Blank page or "Loading…" forever:** open browser DevTools (F12) → Console. Check for errors. Most likely cause on a fresh deploy is Pages hasn't finished building — wait 2 minutes and refresh.
- **Lessons say "Could not load lesson":** your `course/` folder didn't upload. Confirm the .md files are in `YOUR_USERNAME/kashsec-academy/tree/main/course/` on GitHub.
- **404 on assets:** make sure you uploaded the files' **contents** (not the folder wrapper) so that `index.html` sits at the repo root.
- **CSS not loading:** hard-refresh with Ctrl+F5 (Cmd+Shift+R on Mac) to bust the cache.

That's it. Enjoy your public course site! 🛡️
