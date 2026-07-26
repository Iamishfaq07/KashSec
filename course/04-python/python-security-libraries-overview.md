# Python Security Libraries: An Overview

You've now built real scripts using files, requests, and sockets. This lesson is a map of the specialized third-party libraries that power most real-world Python security tooling — recognition now, so the names are familiar the first time you encounter them in later paths.

## hashlib: hashing, built directly into Python

```python
import hashlib

password = "hunter2"
hashed = hashlib.sha256(password.encode()).hexdigest()
print(hashed)
```

Directly applying Path 06's hashing lesson in actual code — though remember that lesson's own warning: `hashlib.sha256` alone is the wrong tool for password storage specifically (use `bcrypt` or similar, covered next), even though it's genuinely useful for file integrity checks and other non-password hashing needs.

## cryptography: proper encryption, done safely

The applied-crypto lesson in Path 06 specifically recommended using established libraries rather than rolling your own — Python's **`cryptography`** package is exactly that recommendation put into practice, providing safe, well-reviewed implementations of symmetric encryption, asymmetric encryption, and more.

## bcrypt / argon2-cffi: password hashing, done correctly

```python
import bcrypt

hashed = bcrypt.hashpw(b"hunter2", bcrypt.gensalt())
bcrypt.checkpw(b"hunter2", hashed)   # True
```

Directly the password-hashing algorithms Path 06's hashing lesson recommended by name, now as actual, ready-to-use Python libraries.

## scapy: packet crafting and analysis

**scapy** lets you construct, send, and analyze raw network packets directly from Python — genuinely powerful for the kind of packet-level work Path 02's practical-packet-lab introduced, and widely used throughout network security tooling and research.

## Beautiful Soup: parsing HTML

```python
from bs4 import BeautifulSoup
soup = BeautifulSoup(response.text, "html.parser")
links = soup.find_all("a")
```

Genuinely useful for OSINT reconnaissance (Path 14) and web-focused security tooling — extracting structured information (links, forms, specific page elements) from raw HTML pulled down using the `requests` library from the earlier lesson.

## paramiko: SSH from Python

Directly applying Path 03's SSH lesson: **paramiko** lets a Python script establish and control SSH connections programmatically, genuinely useful for automating administration or security checks across many remote machines at once.

## Why recognizing these names matters now, before you've used most of them

Exactly like Path 01's cyberattacks-overview lesson mapped attack categories before later paths went deep on each one, this lesson's goal is the same pattern applied to tooling: when Path 14's reconnaissance material mentions scapy, or Path 16's advanced labs reference paramiko for automating a multi-machine exercise, you'll already have a rough sense of what each library does and why it exists, rather than encountering the name for the first time mid-lesson.

:::challenge Test yourself
Why is `hashlib.sha256()` the wrong tool for hashing a password for storage, even though it's a perfectly legitimate hashing function?
<details><summary>Show answer</summary>This traces directly back to Path 06's hashing lesson: general-purpose hash functions like SHA-256 are deliberately designed to be <em>fast</em>, which is exactly the wrong property for password storage — a fast hash function lets an attacker who steals a database of hashed passwords test billions of guesses per second using modern hardware. Password-specific hashing algorithms like bcrypt and argon2 are deliberately designed to be <em>slow</em> and computationally expensive, specifically to make large-scale guessing attacks impractical even with powerful hardware, while remaining fast enough for the single legitimate login check a real user actually needs. SHA-256 remains an excellent choice for file integrity checks (where speed is a genuine benefit and there's no secret being protected against guessing), just not for anything protecting a secret an attacker might try to brute-force.</details>
:::

## Key terms

- **hashlib** — Python's built-in module for general-purpose hashing (not suitable for password storage).
- **bcrypt** — a third-party library implementing password-specific, deliberately slow hashing.
- **scapy** — a library for crafting and analyzing raw network packets.

## Recap

- Python's security ecosystem includes both built-in tools (hashlib) and specialized third-party libraries (cryptography, bcrypt, scapy, Beautiful Soup, paramiko), each solving a specific, recurring security task.
- Recognizing these names now means later paths' references to them land as familiar territory rather than unexplained jargon.
- The hashlib-vs-bcrypt distinction is a genuinely important, recurring theme from Path 06 worth remembering: fast hashing for integrity checks, deliberately slow hashing for passwords.

**Next up →** [Automation for Security](#/lesson/04-python/automation-for-security)
