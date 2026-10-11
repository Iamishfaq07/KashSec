# Build a password-strength checker

Combine everything from Path 04 into a real, useful tool. By the end of this lesson you'll have a Python program that takes a password and rates its strength — the same kind of check real signup pages use.

## What "strong" means, roughly

A password's practical strength depends on a few things:

- **Length** — the single biggest factor. Every extra character makes brute-force exponentially harder.
- **Character variety** — mixing lower, upper, digits, symbols slows attackers using restricted charsets.
- **Uniqueness / entropy** — no dictionary words, no obvious patterns like `qwerty` or `123456`.
- **Not been leaked before** — passwords already in breach dumps are the *first* things attackers try.

We'll build a checker that evaluates each of these.

## Step 1 — Length check

```python
def score_length(pw: str) -> int:
    """Return points for length (0–4)."""
    if len(pw) >= 16:
        return 4
    if len(pw) >= 12:
        return 3
    if len(pw) >= 8:
        return 2
    if len(pw) >= 6:
        return 1
    return 0
```

## Step 2 — Character variety

```python
def score_variety(pw: str) -> int:
    """Return points for character variety (0–4)."""
    kinds = 0
    if any(c.islower() for c in pw):  kinds += 1
    if any(c.isupper() for c in pw):  kinds += 1
    if any(c.isdigit() for c in pw):  kinds += 1
    if any(not c.isalnum() for c in pw): kinds += 1
    return kinds
```

`any()` returns True if any character in the password matches the test. Nice and compact.

## Step 3 — Weak/common check

Many bad passwords appear on well-known blocklists. Let's include a tiny one for demonstration:

```python
COMMON_PASSWORDS = {
    "password", "123456", "123456789", "qwerty", "abc123",
    "letmein", "monkey", "111111", "iloveyou", "admin",
    "welcome", "1234", "12345", "1234567", "password1",
    "qwerty123", "1q2w3e4r", "sunshine", "master", "dragon",
}

def is_common(pw: str) -> bool:
    """Return True if password is on the common list."""
    return pw.lower() in COMMON_PASSWORDS
```

In production, you'd use the ~14 million–entry **SecLists rockyou.txt** or similar. Ours is enough to demonstrate.

## Step 4 — Have-I-Been-Pwned (bonus, optional)

The [Pwned Passwords](https://haveibeenpwned.com/Passwords) service exposes an API that lets you check whether a password appears in breach data — safely, without ever sending the full password. It works via **k-anonymity**: you send only the first 5 characters of the SHA-1 hash, and they return all matching suffixes for you to check locally.

```python
import hashlib
import requests   # pip install requests

def hibp_count(pw: str) -> int:
    """Return how many times pw appears in the HIBP breach corpus, or -1 on error."""
    sha1 = hashlib.sha1(pw.encode()).hexdigest().upper()
    prefix, suffix = sha1[:5], sha1[5:]
    try:
        r = requests.get(f"https://api.pwnedpasswords.com/range/{prefix}", timeout=5)
        r.raise_for_status()
    except requests.RequestException:
        return -1
    for line in r.text.splitlines():
        h, count = line.split(":")
        if h == suffix:
            return int(count)
    return 0
```

Notice we **never send the password itself** anywhere. That's a beautiful privacy design worth studying.

**k-anonymity** as a general technique (not just this one API) means providing enough information to get a useful answer while remaining indistinguishable within a group of at least *k* other possibilities — here, sending only a 5-character hash prefix means HIBP's servers see a bucket of hundreds of possible full hashes, never which *specific* one is actually yours. This same privacy-preserving pattern shows up elsewhere in security and privacy engineering, and is directly relevant to Path 09's digital privacy material — genuinely useful to recognize as a reusable design pattern, not just a one-off API quirk.

## Step 5 — Put it all together

```python
#!/usr/bin/env python3
"""
strength.py — Password strength checker.
Usage: python3 strength.py
"""

import getpass
import hashlib
import sys

try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False


COMMON_PASSWORDS = {
    "password", "123456", "123456789", "qwerty", "abc123",
    "letmein", "monkey", "111111", "iloveyou", "admin",
    "welcome", "1234", "12345", "1234567", "password1",
    "qwerty123", "1q2w3e4r", "sunshine", "master", "dragon",
}


def score_length(pw: str) -> int:
    if len(pw) >= 16: return 4
    if len(pw) >= 12: return 3
    if len(pw) >= 8:  return 2
    if len(pw) >= 6:  return 1
    return 0


def score_variety(pw: str) -> int:
    kinds = 0
    if any(c.islower() for c in pw): kinds += 1
    if any(c.isupper() for c in pw): kinds += 1
    if any(c.isdigit() for c in pw): kinds += 1
    if any(not c.isalnum() for c in pw): kinds += 1
    return kinds


def is_common(pw: str) -> bool:
    return pw.lower() in COMMON_PASSWORDS


def hibp_count(pw: str) -> int:
    """Query Have I Been Pwned via k-anonymity. Returns -1 on network error."""
    if not HAS_REQUESTS:
        return -1
    sha1 = hashlib.sha1(pw.encode()).hexdigest().upper()
    prefix, suffix = sha1[:5], sha1[5:]
    try:
        r = requests.get(f"https://api.pwnedpasswords.com/range/{prefix}", timeout=5)
        r.raise_for_status()
    except requests.RequestException:
        return -1
    for line in r.text.splitlines():
        h, count = line.split(":")
        if h == suffix:
            return int(count)
    return 0


def rate(pw: str) -> None:
    length_pts  = score_length(pw)
    variety_pts = score_variety(pw)
    total       = length_pts + variety_pts        # out of 8
    common      = is_common(pw)
    breached    = hibp_count(pw)

    print("\n--- Password Analysis ---")
    print(f"Length:       {len(pw)} chars → {length_pts}/4 points")
    print(f"Variety:      {variety_pts}/4 character classes")
    print(f"Common list:  {'YES' if common else 'no'}")
    if breached == -1:
        print("HIBP check:   skipped (no network or requests library)")
    elif breached == 0:
        print("HIBP check:   ✓ not in known breaches")
    else:
        print(f"HIBP check:   ✗ seen {breached:,} times in breaches")

    print(f"\nRaw score: {total}/8")
    if common or breached > 0:
        print("Verdict: 💀 UNSAFE — this password is publicly known")
    elif total <= 3:
        print("Verdict: ❌ Weak")
    elif total <= 5:
        print("Verdict: ⚠ Medium")
    elif total <= 7:
        print("Verdict: ✅ Strong")
    else:
        print("Verdict: 🏆 Excellent")


def main():
    print("Password Strength Checker (KashSec)")
    print("Input is hidden — nothing is stored or sent (except a partial hash to HIBP).")
    try:
        pw = getpass.getpass("Password: ")
    except (KeyboardInterrupt, EOFError):
        sys.exit(0)
    if not pw:
        print("No password entered.")
        sys.exit(1)
    rate(pw)


if __name__ == "__main__":
    main()
```

Save as `strength.py`. Install requests if you want the HIBP check:

```bash
pip install requests
```

Then run:

```bash
python3 strength.py
```

Try a range: `abc`, `password`, `Kashmir2024!`, and a truly long random one. Watch the scoring shift.

## What you just built

This is a **real tool**. It exercises:

- Functions (each testing one thing) ✅
- Type hints and docstrings ✅
- Data structures (a set of common passwords) ✅
- `any()`, string methods, comprehensions ✅
- HTTP requests to a public API ✅
- Hashing and a privacy-preserving protocol ✅
- Command-line UX (hidden input, clean output) ✅
- The `if __name__ == "__main__":` idiom ✅

A hiring manager scanning your GitHub would recognise this as "someone who writes real Python."

:::tip WHERE THIS FITS IN THE COURSE
Password *storage* — how servers should hash and salt passwords — is Path 10. Password *attacks* — how attackers crack them — are in Paths 10 and 09. This checker is your first bridge from Python into applied security.
:::

## 🧪 Lab challenges — extend the tool

- Add a **`--file <path>` option** that reads passwords from a file and rates each.
- Add a **JSON output mode** (`--json`) so it can be piped into other tools.
- Add a check for **repeated characters** (e.g., `aaaa` or `1111`) and dock points.
- Add a check for common **keyboard walks** (`qwerty`, `asdfgh`, `zxcvbn`).
- Refactor: move `COMMON_PASSWORDS` to a text file the tool loads at startup.
- Package it as a proper CLI with `argparse`.

Any one of these makes the tool noticeably better and is honest, professional practice.

:::challenge Test yourself
Why does the HIBP check only send the first 5 characters of the SHA-1 hash, and how does that keep your password private?

<details><summary>Show answer</summary>It's <strong>k-anonymity</strong>: sending only the 5-char prefix returns thousands of matching hash suffixes. You then check locally whether the rest of *your* hash is in that batch. HIBP never sees the whole hash or the password, so they can't learn what you asked about — but you still get an authoritative answer.</details>
:::

## Key terms

- **Blocklist / commonlist** — pre-known bad passwords.
- **k-anonymity** — a privacy technique using prefix lookups.
- **HIBP** — Have I Been Pwned; the breach-corpus service.
- **`getpass`** — read passwords without echoing them.
- **`any()`** — True if any element matches a condition.

## Recap

- Real security tools combine small functions each doing one job.
- Standard-library modules (hashlib, getpass) cover surprising ground for free.
- k-anonymity is a beautiful pattern — check a partial hash to preserve privacy.
- The tool you just wrote is a real starting portfolio piece.

???refs
- [Have I Been Pwned Pwned Passwords](https://haveibeenpwned.com/Passwords) — the free API used above.
- [NIST 800-63B — Digital Identity Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html) — modern authoritative password guidance.
- [SecLists](https://github.com/danielmiessler/SecLists) — massive collection of common passwords, subdomains, and more.
- [passlib docs](https://passlib.readthedocs.io/) — proper password hashing in Python (bcrypt/argon2).
???

**Next up →** [Object-oriented Python basics](#/lesson/04-python/object-oriented-python-basics)
