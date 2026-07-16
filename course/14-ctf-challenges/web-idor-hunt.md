# Web — The IDOR Hunt

**Category:** Web · **Difficulty:** Easy

## Scenario

You're testing `internal-notes.kashsec-labs.test`, a note-taking app used by a fictional small company. You've registered a free account (user ID `1042`) and created one note. While using the app normally, you notice the note viewer makes a request that looks like this:

```
GET /api/notes/8831 HTTP/1.1
Host: internal-notes.kashsec-labs.test
Cookie: session=a91f...redacted
```

Your own note loaded at ID `8831`. Curious, you decide to test what happens with a nearby ID.

## Provided data

Here are three responses you captured while manually testing nearby note IDs:

```json
// GET /api/notes/8830
{
  "id": 8830,
  "owner_id": 1041,
  "title": "Q3 budget draft — DO NOT SHARE",
  "body": "Final board approval numbers: revenue target $4.2M, layoff contingency plan attached separately. Meeting password for board call: KASHSEC{1d0r-1s-2-e4sy}"
}
```

```json
// GET /api/notes/8829
{
  "error": "Note not found"
}
```

```json
// GET /api/notes/8832
{
  "id": 8832,
  "owner_id": 1043,
  "title": "Grocery list",
  "body": "milk, eggs, bread"
}
```

## Your task

Notice anything about how you accessed note `8830`? You didn't create it, and its `owner_id` (`1041`) doesn't match your account (`1042`) — yet the server returned its full contents without complaint.

**The flag is already visible in the data above.** Your real task is to explain *why* this happened — that's the actual skill being tested here, not just spotting the string.

:::challenge What's the underlying vulnerability, precisely?
<details><summary>Hint 1</summary>Compare what identifies "your" note (something tied to your session/cookie) versus what identifies "which note to return" (the number in the URL). Are these the same thing, as far as the server is concerned?</details>
<details><summary>Hint 2</summary>The server checked "does a note with this ID exist?" — but never checked "does this note belong to the user making the request?" That missing second check has a name.</details>
<details><summary>Show full answer</summary>This is a textbook <strong>Insecure Direct Object Reference (IDOR)</strong> — part of the broader "Broken Access Control" category, consistently the #1 issue in the OWASP Top 10. The API uses the raw, guessable/enumerable <code>note_id</code> directly from the URL to fetch and return data, without ever verifying that the requesting user's session actually owns (or has permission to view) that specific note. Because IDs are small sequential integers, an attacker doesn't even need to guess — simply incrementing or decrementing the ID from their own note systematically walks through every other user's private data. The fix is an authorization check on every single request: <code>if note.owner_id != current_user.id: return 403</code>, enforced server-side, every time — never inferred from the URL alone.</details>
:::

## The flag

```
KASHSEC{1d0r-1s-2-e4sy}
```

## Why this matters beyond the CTF

IDOR is one of the most commonly *and easily* found vulnerability classes in real bug bounty programs — precisely because testing for it requires nothing more than two test accounts and the willingness to change a number in a URL or request body. Path 07's lesson on **Broken Access & IDOR**, and Path 10's **Hunting IDOR** lesson, cover the full "two-account method" for finding these systematically in real, authorized testing — this challenge is the compressed, self-contained version of that exact workflow.

## Bonus round — a disguised variant

Before moving on, try this harder variant using the same underlying vulnerability. The app's export feature makes a different-looking request:

```
GET /api/notes/export?token=bm90ZS04ODMw HTTP/1.1
Host: internal-notes.kashsec-labs.test
Cookie: session=a91f...redacted
```

That `token` value doesn't look like a plain integer ID — but is it actually any safer? Try decoding `bm90ZS04ODMw` (it's a very common, easily-reversible text encoding, not encryption) before checking the hint.

:::challenge Is the export endpoint actually protected?
<details><summary>Hint</summary>The encoding is Base64 — decode it and see what you get. Does obscuring an ID's *appearance* change whether the server performs an ownership check on it?</details>
<details><summary>Show answer</summary><code>bm90ZS04ODMw</code> decodes to <code>note-8830</code> — the exact same note ID from the main challenge, just wrapped in Base64. This is a classic beginner mistake: encoding an identifier is <strong>not</strong> the same as protecting it. Base64 (like the URL-encoding, hex, and other encodings covered in Path 05's DevTools lesson) is trivially reversible by anyone, and provides zero actual security — the server still needs the exact same ownership check on this endpoint as on the plain <code>/api/notes/{id}</code> one. A disguised IDOR is still an IDOR; only genuine server-side authorization logic fixes it, never obscuring the parameter's format.</details>
:::

:::tip Real-world severity varies enormously
Not every IDOR is equally severe — an IDOR exposing another user's grocery list (like note `8832` above) is a low-impact finding; one exposing board meeting passwords or financial data (like note `8830`) can be critical. Always assess and report the actual *impact* of what the exposed data allows, not just the mechanical existence of the bug — this is exactly what separates a strong bug bounty report from a weak one.
:::

**Next up →** [Crypto — The Layered Cipher](#/lesson/14-ctf-challenges/crypto-layered-cipher)
