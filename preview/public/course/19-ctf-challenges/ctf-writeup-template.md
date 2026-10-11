# Solution Write-ups: The Template Every Good CTF Player Uses

You've now worked through every challenge in this section. This closing lesson teaches a skill that matters far more than any individual solve: **writing a clean, reusable solution write-up** — the exact document format that turns "I solved a puzzle" into a portfolio piece, a bug bounty report, or a professional pentest finding.

:::tip
A write-up is not a diary of everything you tried. It's a clean, reconstructed path from problem to solution — written *after* you've solved it, for a reader who wasn't there for your dead ends. This distinction is the single most important thing in this lesson.
:::

## Why write-ups matter more than solve counts

Anyone can claim "I solved 40 CTF challenges." A recruiter, a bug bounty program, or a hiring manager can't verify that claim from the number alone — but they absolutely can evaluate a well-written solution write-up, because it demonstrates exactly the skills this entire course has been building: clear technical communication, structured problem-solving, and the ability to explain *why* something works, not just *that* it works. Path 15's bug bounty material and Path 20's portfolio-building lesson both point at the same underlying truth: a portfolio of well-documented write-ups is one of the highest-leverage things a newcomer to this field can build, because it's concrete, verifiable evidence of real skill — something a resume line item can never be.

## The template

Every strong write-up, regardless of category, follows roughly this structure:

### 1. Challenge summary
One or two sentences: what was the challenge, what category, what difficulty. Enough that a reader unfamiliar with the specific puzzle understands the setup immediately.

### 2. Recon / initial observations
What did you notice first? What data were you given, and what stood out about it? This section should read like your actual first few minutes of looking at the problem — organized, but honest about where your attention actually went.

### 3. Hypothesis and approach
What did you suspect the vulnerability or technique was, and why? This is the section that demonstrates *reasoning*, not just knowledge — a reader should be able to follow your logic even if they've never seen this specific challenge before.

### 4. Exploitation / solution steps
The actual technical steps, in order, with enough specific detail (commands, payloads, requests) that someone else could reproduce your solve exactly. This is the section most people over-abbreviate — "then I found the flag" is not a solution step, it's a conclusion with no shown work.

### 5. Root cause
What was the *underlying* flaw, in one or two sentences, independent of this specific challenge's flavor text? This is what separates a write-up that demonstrates real understanding from one that just demonstrates you followed steps to an answer.

### 6. Remediation (optional but valuable)
How would you actually fix this, if it were a real system? This section is what turns a CTF write-up into something that reads like a professional security finding — genuinely useful practice for real bug bounty and pentest report writing, covered in more depth by Path 21's Vulnerability Report Writer tool and Path 15's bug bounty report-writing material.

## A worked example, using a challenge from earlier in this section

Here's what a strong write-up for the IDOR Hunt challenge (from earlier in this section) looks like, applying the template:

> **Challenge summary**: Web category, Easy difficulty. A note-taking app returns another user's private note when the note ID in the URL is decremented by one from the player's own note.
>
> **Recon**: The app makes a `GET /api/notes/{id}` request when viewing a note. My own note loaded at ID 8831. The request only carries a session cookie — the ID itself comes straight from the URL.
>
> **Hypothesis**: If the server is using the raw URL parameter to fetch a note without cross-checking it against the authenticated session's owner, adjacent IDs might belong to other users and be readable regardless.
>
> **Solution steps**: Replayed the same authenticated request with `id=8830` instead of `8831`. The server returned a full note object belonging to a different `owner_id` (1041, versus my own account's 1042), including its full contents — with no authorization error.
>
> **Root cause**: Insecure Direct Object Reference (IDOR) / Broken Object Level Authorization — the server checks that a note with the given ID exists, but never checks that the *requesting user* is actually authorized to view that specific note.
>
> **Remediation**: Add a server-side ownership check on every read: `if note.owner_id != current_user.id: return 403`, enforced on the actual object being fetched, not inferred from the fact that the requester is authenticated at all.

Notice what this example does *not* include: a play-by-play of every wrong guess, unrelated observations that went nowhere, or vague language like "I tried some stuff and it worked." A strong write-up is a clean reconstruction, not a transcript.

## Common write-up mistakes to avoid

- **Skipping the "why," jumping straight to the payload.** A write-up that's just "run this exact command" teaches nothing transferable and reads as if you copied someone else's solve without understanding it — even when you didn't.
- **Including irrelevant exploration.** Nobody needs to know about the seventeen things you tried that didn't work, unless one of them meaningfully shaped your eventual approach.
- **Vague root-cause statements.** "The app was insecure" explains nothing. "The endpoint trusted a client-supplied ID with no server-side ownership check" is specific enough to actually demonstrate understanding.
- **No remediation section, when one would clearly add value.** Especially for anything web/API/logic-related, a one-line fix demonstrates you understand the *defense* side, not just the *offense* side — exactly the dual perspective real AppSec and pentest roles require.

## 🧪 Hands-on lab — write two real write-ups

1. Pick any two challenges from this section that you've genuinely solved (not just read the answer to).
2. Using the six-section template above, write a full solution write-up for each — aim for concise, specific, and reproducible, not exhaustive.
3. For at least one, include a genuine remediation section, written as if you were reporting this to the fictional company's engineering team.
4. Compare your two write-ups: is your reasoning section in each one specific enough that a stranger could follow your logic without already knowing the answer?

:::challenge Test yourself
1. Why does "I tried some stuff and it worked" fail as a write-up, even if the described exploit was real and correct?
2. What's the difference between a write-up's "root cause" section and its "solution steps" section?
3. Why does a well-written write-up matter more to a hiring manager or bug bounty program than a raw solve count?
:::

## Key terms

- **Write-up** — a structured, reconstructed explanation of how a challenge was solved, written for a reader who wasn't present for the actual solving process
- **Root cause** — the underlying, general flaw responsible for a vulnerability, independent of the specific scenario it appeared in
- **Remediation** — the concrete fix that would close the vulnerability in a real system

## Recap

A clean, well-structured write-up is one of the highest-leverage artifacts you can produce from CTF practice — it's concrete, verifiable evidence of real technical reasoning, not just a solve count. The six-part template (summary, recon, hypothesis, solution steps, root cause, remediation) applies across every category in this section, and the exact same skill transfers directly into real bug bounty reports and professional pentest findings, which is precisely why this course treats it as the closing lesson of the entire CTF Zone.

???refs
- [CTFtime write-up archive](https://ctftime.org/writeups) — thousands of real, publicly published CTF write-ups worth studying for style and structure
- [HackerOne — How to write a good vulnerability report](https://www.hackerone.com/vulnerability-management/how-write-good-vulnerability-report) — the professional, real-world equivalent of this lesson's template
???

**Explore more →** [Back to all paths](#/course) · [Your progress & certificate](#/progress)
