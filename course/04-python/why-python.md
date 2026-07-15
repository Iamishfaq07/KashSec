# Why Python for security

You've written a bit of Python now. Let's zoom out: why is Python *the* language of security tooling, and what shape do real security scripts take?

## Python's superpowers for our field

- **Readable.** You can nearly read Python aloud. That matters when you're revisiting a script months later, or reading someone's exploit.
- **Batteries included.** The standard library ships with everything from HTTP clients to hashing to sockets. You'll rarely need to install anything for basic work.
- **Enormous ecosystem.** For anything else, `pip install <thing>` gets you battle-tested libraries. Requests, Scapy, BeautifulSoup, Pwntools, Impacket — the security world's toolbox.
- **Cross-platform.** Runs on Windows, macOS, Linux; the same script usually works everywhere.
- **Interoperability.** Talks to APIs, shells, C libraries, and databases with ease.
- **AI/ML native.** Every modern AI/ML tool lives in Python — matters for Path 12.

## The tools built in Python you'll use

Almost every serious open-source security tool is either in Python or has a Python binding:

| Tool | What it does |
|---|---|
| **sqlmap** | Automatic SQL injection |
| **Scapy** | Craft & sniff raw network packets |
| **Impacket** | Windows / AD attack primitives |
| **Pwntools** | Exploit development framework |
| **Volatility** | Memory forensics |
| **theHarvester** | OSINT email/name harvesting |
| **CrackMapExec / NetExec** | AD swiss-army knife |
| **Requests** | HTTP client (backbone of web tooling) |
| **BeautifulSoup** | HTML parsing for scrapers |
| **Frida** | Dynamic instrumentation for reverse engineering |

Being able to read (and eventually modify) their source is a real advantage.

## Python 2 vs Python 3

You'll occasionally see Python 2 code online. **Ignore it.** Python 2 reached end-of-life in 2020. Only ever use Python 3.

```bash
python3 --version    # should print something like 3.11.x on Kali
```

If a command online uses just `python`, replace it with `python3` to be sure.

## Virtual environments — keep projects clean

As you install libraries, they can conflict between projects. The professional habit is a **virtual environment** — an isolated Python installation for one project.

```bash
# Create a venv in a folder called .venv
python3 -m venv .venv

# Activate it (Linux/Mac):
source .venv/bin/activate

# On Windows (PowerShell):
.venv\Scripts\Activate

# Now pip installs go INTO this venv only:
pip install requests

# Leave the venv:
deactivate
```

Do this per project. Your future you will thank you.

## pip — installing libraries

```bash
pip install requests            # install
pip install "requests>=2.31"    # version constraint
pip install -r requirements.txt # from a file
pip list                        # what's installed
pip freeze > requirements.txt   # snapshot current versions
```

Most real Python projects have a `requirements.txt` listing everything they need. Include one when you ship your own scripts.

## The shape of a real security script

Every professional-looking script tends to have this shape. Learn it now:

```python
#!/usr/bin/env python3
"""
port-check.py — Check if a list of ports is open on a target.
Usage: python3 port-check.py <target> <port1,port2,...>
"""

import sys
import socket

TIMEOUT = 1.0

def check_port(host: str, port: int) -> bool:
    """Return True if TCP port is open on host, False otherwise."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(TIMEOUT)
        try:
            s.connect((host, port))
            return True
        except (socket.timeout, ConnectionRefusedError, OSError):
            return False

def main():
    if len(sys.argv) != 3:
        print("Usage: port-check.py <target> <port1,port2,...>")
        sys.exit(1)

    target = sys.argv[1]
    ports = [int(p) for p in sys.argv[2].split(",")]

    print(f"[*] Checking {target}...")
    for port in ports:
        status = "OPEN" if check_port(target, port) else "closed"
        print(f"    {port}: {status}")

if __name__ == "__main__":
    main()
```

Notice these professional touches — copy them in your own scripts:

1. **Shebang** on line 1.
2. **Docstring** at the top explaining what the script is for.
3. **Constants at the top** (`TIMEOUT`), variable stuff in functions.
4. **Type hints** (`host: str, port: int -> bool`) — self-documenting.
5. **`with` statement** ensures the socket is closed even on error.
6. **Specific exceptions caught**, not bare `except:`.
7. **`main()` function**, called only if the script is run directly.
8. Reads args from **`sys.argv`** (or `argparse` for anything real).

## argparse — proper command-line arguments

For anything beyond the tiniest script, use `argparse`:

```python
import argparse

parser = argparse.ArgumentParser(description="Port check tool")
parser.add_argument("target", help="hostname or IP")
parser.add_argument("-p", "--ports", default="80,443", help="ports to check")
parser.add_argument("-t", "--timeout", type=float, default=1.0)
parser.add_argument("-v", "--verbose", action="store_true")
args = parser.parse_args()

print(args.target, args.ports, args.timeout, args.verbose)
```

You get free `--help` output and proper handling of missing/invalid arguments.

## The Python security learning path

- **Weeks 1–4:** finish this path — comfortable with variables, control flow, functions, files, `requests`, `socket`.
- **Weeks 5–8:** write small tools: a subdomain resolver, a directory brute-forcer, a hash cracker (against hashes you generated yourself).
- **Weeks 9–12:** read the source of a small existing tool (e.g., `dnsx`, `waybackpy`). Add a feature. This is how skill compounds.
- **Later:** Scapy for packet crafting (Path 08), Impacket for AD (Path 11), custom exploits (Path 09/11).

:::challenge Test yourself
Why should you use a virtual environment for each Python project?

<details><summary>Show answer</summary>To keep each project's dependencies isolated. Two projects may need different versions of the same library; without venvs they conflict globally. Venvs also make projects reproducible via a <code>requirements.txt</code> lock.</details>
:::

## Key terms

- **pip** — Python's package installer.
- **venv** — isolated per-project Python environment.
- **`requirements.txt`** — file listing a project's dependencies.
- **Docstring / type hints** — self-documenting code.
- **argparse** — the standard library for CLI arguments.

## Recap

- Python is the security world's default scripting language.
- Use Python 3 only; Python 2 is dead.
- Isolate projects with virtual environments.
- Professional scripts have shebang, docstring, main(), specific exceptions, and argparse.
- Practise by writing small tools and reading source code of real ones.

???refs
- [Python.org — Downloads & docs](https://www.python.org/downloads/) — official.
- [pip docs](https://pip.pypa.io/) — the installer's reference.
- [Real Python — venv guide](https://realpython.com/python-virtual-environments-a-primer/)
- [Awesome Python Security](https://github.com/guardrailsio/awesome-python-security) — curated list of Python security tools & libraries.
???

**Next up →** [Your first Python program](#/lesson/04-python/first-program)
