# Building projects & GitHub portfolio

For freshers without formal work experience, a strong portfolio of projects is often the single most persuasive thing on your entire application — it's proof, not a claim. A resume says "I know Python and enjoy security"; a well-documented GitHub repo *shows* it. This lesson covers what to build and how to present it so it actually gets noticed.

## Why projects beat certificates alone

A hiring manager reading "OSCP certified" knows you passed an exam. A hiring manager looking at a well-documented recon automation tool you built, with a clear README, sees exactly how you think, how you structure code, and how you communicate — all in one artifact, all verifiable, with zero claims to just take on faith.

```mermaid
flowchart LR
    A[Resume claim: "Skilled in Python"] -.->|"Hiring manager\nmust just trust it"| B[Uncertain signal]
    C[GitHub repo: working tool\n+ clean README + commits] -->|"Directly observable"| D[Strong, verifiable signal]
```

## Good project ideas for a security portfolio

- **A custom recon or automation tool** — even something modest, like a script that automates subdomain enumeration or checks a list of URLs for common misconfigurations, demonstrates real applied skill.
- **A deliberately vulnerable app you built** — build a small app with an intentional flaw (e.g., SQL injection), document the vulnerability, and show the fix. This proves you understand *both* the offense and the defense.
- **Bug bounty write-ups** — even unpaid, duplicate, or informational-severity findings show real methodology and communication skill when written up well.
- **CTF write-ups** — walking through how you solved a challenge (recon → exploitation → flag) is one of the most common and well-regarded portfolio pieces in this industry.
- **A home lab setup guide** — documenting how you built a practice lab (e.g., Kali Linux + vulnerable VMs on VirtualBox) is genuinely useful to other learners and shows initiative.
- **A tool or script solving a small, real annoyance** — a password-strength checker, a simple port scanner, a log-parsing script — polish matters more than ambition here.

## What makes a GitHub repo actually good

Most beginner repos fail not because the code is bad, but because there's no context — a stranger lands on the page and has no idea what it does, why it exists, or how to run it. Fix that with a strong README:

:::tip A README that actually sells the project
1. **What it does** — one or two sentences, no jargon.
2. **Why you built it** — the problem or curiosity that motivated it.
3. **How to run it** — exact commands, not vague instructions.
4. **A screenshot or short GIF** of it in action — this alone dramatically increases how seriously people take the repo.
5. **What you'd improve next** — shows self-awareness and growth mindset, both genuinely valued traits.
:::

```markdown
# Subdomain Recon Tool

A lightweight Python script that automates subdomain enumeration
using crt.sh and DNS resolution, exporting live results to CSV.

## Why I built this
Manually checking each subdomain from crt.sh during bug bounty
recon was slow and repetitive — this automates the first pass.

## Usage
    python3 recon.py -d example.com -o results.csv

## Example output
[screenshot here]

## Roadmap
- [ ] Add Shodan integration
- [ ] Multi-threaded resolution
```

## GitHub habits that build credibility over time

- **Commit regularly, in small logical chunks** — a history of `fix typo`, `add error handling`, `implement CSV export` reads as real engineering process; one giant `initial commit` with everything at once does not.
- **Use meaningful commit messages** — describe *why*, not just *what*, when it isn't obvious.
- **Pin your 3–4 best repositories** to your GitHub profile — recruiters skim, and your profile's top row is what they'll actually see.
- **Write a solid profile README** — GitHub supports a special repo (named exactly after your username) that renders as your profile's landing page; a short intro plus links to your best work goes a long way.
- **Open-source what you reasonably can** — it costs you little and gives others (and future employers) something concrete to explore.

:::warn Never commit secrets
API keys, credentials, and `.env` files should never be committed — use a `.gitignore` from day one, and if you accidentally commit a secret, rotate it immediately (removing it from history alone is not sufficient once it's been pushed publicly). This habit matters doubly in security roles, where this exact mistake is something you'll be expected to catch in *other people's* code.
:::

## Beyond GitHub — a personal blog as a durable second portfolio channel

A GitHub profile shows *what* you built; a short technical blog post shows *how you think* — a distinct, complementary signal worth building alongside your repos, not instead of them. A single well-written post walking through a CTF challenge's solution, explaining a security concept you recently understood deeply for the first time, or documenting a home-lab project's setup process demonstrates the exact communication skill covered in Path 09.7's reporting lesson — a genuinely underrated differentiator, since most junior candidates can point to code but far fewer can clearly explain their own reasoning in writing. Free platforms (a GitHub Pages site, Dev.to, a simple Markdown-based static site) remove any excuse around cost or setup complexity; the actual bar is just finishing and publishing one piece, however short, rather than waiting for a topic that feels impressive enough.

## Contributing to existing open-source projects

Building your own projects from scratch isn't the only path to a credible portfolio — **contributing to existing open-source security tools** (a Nuclei template, a small bug fix in a tool you use regularly, improved documentation for a project that helped you learn) is often faster to start than a solo project and comes with a built-in credibility signal: a merged pull request into a project real practitioners actually use is objectively verifiable, timestamped, and often more impressive to an experienced interviewer than another isolated portfolio piece, precisely because it required your contribution to meet an existing maintainer's real quality bar rather than just your own. Starting small — fixing a typo in documentation, adding a missing test case — is a completely legitimate first contribution; the goal early on is building the habit and understanding the contribution workflow (forking, branching, PR review) rather than making an immediately dramatic impact.

## 🧪 Hands-on lab — ship one real project this week

1. Pick one idea from the list above that genuinely interests you — motivation matters more than ambition for a first portfolio piece.
2. Build a small, working version — resist scope creep; a tiny tool that works beats an ambitious one that's half-finished.
3. Write a README following the five-part structure above, including at least one screenshot.
4. Add a `.gitignore` appropriate to your language (Python/Node templates are one search away) before your first commit, and double-check no secrets are included.
5. Push it to GitHub with a clean, incremental commit history, then pin it to your profile.

:::challenge Test yourself
Why does a stranger landing on a GitHub repo with no README typically dismiss it within seconds, even if the underlying code is genuinely good?
<details><summary>Show answer</summary>Without a README, a visitor has no context for what problem the project solves, why it exists, or how to even run it — they'd have to read and mentally execute the raw code just to understand its purpose, which almost nobody will do for an unfamiliar repo in the few seconds they're willing to spend. A clear README front-loads exactly that context, letting a recruiter or hiring manager understand the project's value and your thinking in seconds rather than requiring them to reverse-engineer it from source code alone — which is precisely why README quality often has more influence on a repo's perceived value than the code's actual sophistication.</details>
:::

## Key terms

- **README** — the landing document explaining what a repo does, why, and how to use it.
- **Profile README** — a special GitHub repo (named after your username) that renders on your profile page.
- **`.gitignore`** — a file listing paths Git should never track (secrets, build artifacts, local config).
- **Write-up** — a structured walkthrough of how a CTF challenge or bug bounty finding was solved/discovered.

## Recap

- A well-documented project is verifiable proof of skill in a way a resume claim alone can't be.
- A strong README (what, why, how to run, screenshot, roadmap) is often more important to a project's perceived value than raw code sophistication.
- Regular, meaningful commits and pinned top repositories build credibility over time.
- Never commit secrets — a `.gitignore` from the very first commit is a non-negotiable habit, especially in security roles.

???refs
- [Make a README](https://www.makeareadme.com/) — a solid, practical README template and guide.
- [GitHub: Managing your profile README](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme) — official guide to profile READMEs.
- [gitignore.io](https://www.toptal.com/developers/gitignore) — generate a proper `.gitignore` for any language/tool in seconds.
???

**Next up →** [Job search strategy](#/lesson/13-career-prep/job-search)
