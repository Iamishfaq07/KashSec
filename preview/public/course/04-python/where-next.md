# Where to go next with Python

You've written real code. Here's a compact tour of the Python you'll want *next* — the libraries and idioms that turn "beginner" into "self-sufficient security scripter."

## The big three libraries for security

If you learn only three third-party libraries, make them these:

### 1. `requests` — HTTP that just works

The de facto standard for talking to web services in Python.

```python
import requests

r = requests.get("https://api.github.com")
print(r.status_code)         # 200
print(r.json()["current_user_url"])

# Send data:
r = requests.post("https://httpbin.org/post",
                  json={"user": "admin"},
                  headers={"X-Auth": "token"})
print(r.json())

# Sessions keep cookies across requests:
s = requests.Session()
s.post("https://target/login", data={"u": "admin", "p": "secret"})
r = s.get("https://target/admin")  # session cookie sent automatically
```

You'll live in `requests` for anything web-related (Paths 11, 10, 12).

### 2. `socket` — raw TCP/UDP

Built-in — for connecting directly to services.

```python
import socket

with socket.create_connection(("scanme.nmap.org", 22), timeout=2) as s:
    banner = s.recv(1024)
    print(banner.decode(errors="replace"))
```

Grabbing a service banner in three lines. This is how port-scanners and banner-grabbers start.

### 3. `argparse` — proper CLI tools

Built-in — turn scripts into professional CLI tools.

```python
import argparse

def main():
    p = argparse.ArgumentParser(description="Do the thing")
    p.add_argument("target", help="hostname or IP")
    p.add_argument("-p", "--ports", default="80,443")
    p.add_argument("-t", "--timeout", type=float, default=1.0)
    args = p.parse_args()
    print(args.target, args.ports, args.timeout)

if __name__ == "__main__":
    main()
```

Free `--help`, error handling, and type coercion. Never write ad-hoc `sys.argv` parsing again.

## Handy libraries by task

| Task | Library |
|---|---|
| HTTP requests | **requests** or **httpx** (async) |
| HTML parsing | **beautifulsoup4**, **lxml** |
| Network packets | **scapy** — sniff & craft raw packets |
| Web automation | **playwright**, **selenium** |
| SSH sessions | **paramiko** |
| DNS | **dnspython** |
| JWT | **PyJWT** |
| Cryptography | **cryptography** (modern), **pycryptodome** |
| Password hashing | **passlib** (bcrypt/argon2) |
| Windows / AD | **impacket** |
| Regex on steroids | **regex** |
| Data analysis | **pandas** |
| CLI eye candy | **rich**, **click**, **typer** |
| Threading & speed | **concurrent.futures** (stdlib), **asyncio** |

You won't need most of these on day one, but knowing they exist saves you months of reinventing.

## Error handling — a professional habit

Use `try`/`except` around anything that can fail:

```python
try:
    r = requests.get(url, timeout=5)
    r.raise_for_status()
except requests.Timeout:
    print("Timeout")
except requests.HTTPError as e:
    print(f"HTTP {e.response.status_code}")
except requests.RequestException as e:
    print(f"Network error: {e}")
```

Rules:

- Catch **specific** exceptions, not bare `except:`.
- Prefer letting exceptions bubble up during dev — surprises are how you find bugs.
- Only swallow errors when you *know* how to recover.

## Speed: threading and concurrency

Scanning 10,000 hosts one at a time takes forever. Threads run many at once. The simplest good pattern uses `concurrent.futures`:

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

def check(host):
    # your slow network call
    return host, True

hosts = ["h1", "h2", "h3"]  # imagine 1,000 of these

with ThreadPoolExecutor(max_workers=50) as pool:
    futures = [pool.submit(check, h) for h in hosts]
    for future in as_completed(futures):
        host, result = future.result()
        print(host, result)
```

For heavier work or huge concurrency, look into **asyncio + httpx**. Both are worth learning once you're comfortable.

## Type hints — a modern habit worth adopting early

Modern Python supports optional **type hints**, documenting what type a function expects and returns directly in its signature:

```python
def scan_port(host: str, port: int, timeout: float = 1.0) -> bool:
    """Return True if the port is open."""
    ...
```

Python doesn't actually *enforce* these at runtime — you can still pass the wrong type and Python won't stop you — but tools like `mypy` can check your code against them, and most modern code editors use them to catch mistakes and offer better autocomplete as you type. Reading real-world Python code (including the tools listed below), you'll see type hints constantly; adopting them in your own scripts, even loosely, is a genuinely good habit that pays off as scripts grow past a few dozen lines.

## Reading someone else's code

The single fastest way to level up is reading real tools. Pick something small and dig in:

- **[dnsx](https://github.com/projectdiscovery/dnsx)** — DNS toolkit (Go, but great structure).
- **[waybackpy](https://github.com/akamhy/waybackpy)** — Wayback Machine Python client, small and neat.
- **[sublist3r](https://github.com/aboul3la/Sublist3r)** — subdomain enumerator. Read the source; understand each function.
- **[dirsearch](https://github.com/maurosoria/dirsearch)** — directory brute-forcer.

Try to add a small feature to one of them. That's how open source works — and how your name lands in commit histories.

## Testing your code

For anything you'll rely on, write tests. Python's built-in `pytest` (via pip) is delightful:

```python
# strength.py has: def score_length(pw: str) -> int:

# test_strength.py
from strength import score_length

def test_short():
    assert score_length("abc") == 0

def test_medium():
    assert score_length("abcdef") == 1

def test_long():
    assert score_length("abcdefghijklmnop") == 4
```

Run: `pytest`. Tests take 30 seconds to write and save hours of debugging over the life of a project.

## A "portfolio-worthy" tool checklist

Turn any script into a portfolio piece with these:

- [ ] Shebang and docstring on top
- [ ] `argparse` for CLI
- [ ] Small, single-purpose functions with type hints
- [ ] Specific exception handling
- [ ] `requirements.txt` with pinned versions
- [ ] A README with install, usage, examples, and a screenshot
- [ ] Basic tests (`pytest`)
- [ ] Pushed to GitHub

Even a small tool with all these boxes ticked screams "real developer."

## The Python + security career loop

```mermaid
flowchart LR
    Learn[Learn a concept] --> Build[Build a tiny tool with it]
    Build --> Publish[Publish on GitHub]
    Publish --> Share[Share on Twitter/LinkedIn]
    Share --> Meet[Meet others doing similar]
    Meet --> Learn

    style Learn fill:#111927,color:#3FB6A8,stroke:#3FB6A8
    style Build fill:#2b1f0a,color:#EFA43A,stroke:#EFA43A
    style Publish fill:#0f2b26,color:#3FB6A8,stroke:#3FB6A8
    style Share fill:#0f2b26,color:#3FB6A8,stroke:#3FB6A8
    style Meet fill:#111927,color:#3FB6A8,stroke:#3FB6A8
```

This loop is how careers compound in security. Every small tool becomes a portfolio piece, a conversation starter, and — often — a job lead.

:::challenge Reflection
Name one **specific tiny tool** you'll build in the next two weeks using what you've learned. Write it in your notes now.

<details><summary>Show some ideas</summary>
- A CLI that resolves a list of subdomains and prints the ones with a specific HTTP status code.<br>
- A password-strength API server (Flask, tiny).<br>
- A log-file grep tool with coloured output using <code>rich</code>.<br>
- A tiny recon aggregator that runs whois, dig, and curl -I on a target.<br>
- A HIBP-check email tool that reads a list and prints breach counts.
</details>
:::

## Key terms

- **requests** — Python's standard HTTP client.
- **argparse** — build proper command-line interfaces.
- **`concurrent.futures`** — simple threading for speed.
- **asyncio / httpx** — async concurrency, powerful next step.
- **pytest** — friendly test runner.

## Recap

- `requests`, `socket`, `argparse` cover most day-one security scripting needs.
- Handle exceptions specifically; use threading to scale.
- Read real tools to learn how professionals structure code.
- Turn small scripts into portfolio-worthy repos.
- Build tiny things, publish them, share them — this loop grows careers.

???refs
- [Requests docs](https://requests.readthedocs.io/) — the classic.
- [argparse docs](https://docs.python.org/3/library/argparse.html)
- [ProjectDiscovery](https://github.com/projectdiscovery) — many great tools worth reading (Go + Python).
- [Awesome Python — curated](https://github.com/vinta/awesome-python) — categorised libraries.
- [pytest](https://docs.pytest.org/) — the friendly testing framework.
???

## 🎉 You've finished Path 04

You now know Python well enough to write real tools. Variables, control flow, functions, files, standard library, `requests`, exception handling, threading, project structure — everything you need for the rest of the course and beyond.

**Next up →** [Python, requests & APIs](#/lesson/04-python/python-requests-apis)
