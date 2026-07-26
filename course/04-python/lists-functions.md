# Lists & functions

Two of Python's most useful ideas: **lists** for handling collections of things (like wordlists and scan results), and **functions** for packaging code you'll reuse.

## Lists — deeper look

You met lists briefly. Now let's actually use them.

```python
tools = ["nmap", "burp", "sqlmap", "hydra"]

# Read:
print(tools[0])            # 'nmap'
print(tools[-1])           # 'hydra' (last)
print(tools[1:3])          # ['burp', 'sqlmap'] (slice)
print(len(tools))          # 4
print("burp" in tools)     # True

# Modify:
tools.append("wireshark")  # add to end
tools.insert(0, "nikto")   # add at position
tools.remove("hydra")      # remove a value
tools.pop()                # remove & return last
tools[1] = "Burp Suite"    # replace by index
tools.sort()               # sort in place
tools.reverse()            # reverse in place
sorted_copy = sorted(tools)  # sorted copy (leaves original)
```

## The list operations you'll use most

```python
# Loop over items:
for tool in tools:
    print(f"- {tool}")

# Loop with index:
for i, tool in enumerate(tools, start=1):
    print(f"{i}. {tool}")

# Build a new list from another (comprehension):
uppercased = [t.upper() for t in tools]

# Filter:
short_names = [t for t in tools if len(t) < 6]

# Combine:
attack_tools = ["hydra", "sqlmap"]
defence_tools = ["snort", "suricata"]
all_tools = attack_tools + defence_tools

# Split a string into a list:
"a,b,c".split(",")         # ['a', 'b', 'c']

# Join a list back into a string:
",".join(["a", "b", "c"])  # 'a,b,c'
```

The **split/join** pattern shows up in nearly every script — reading a CSV, parsing IPs from output, building headers.

## Reading a wordlist into a list

Very common security pattern:

```python
with open("subdomains.txt") as f:
    subs = [line.strip() for line in f if line.strip()]

print(f"Loaded {len(subs)} candidate subdomains")
for s in subs[:5]:
    print(f"  {s}")
```

## Tuples — like lists but immutable

Occasionally you'll see round brackets instead of square. Those are **tuples** — like lists, but cannot be changed after creation. Great for fixed pairs like coordinates or (host, port).

```python
target = ("scanme.nmap.org", 80)
host, port = target                # unpacking
print(host, port)
```

## Sets — for unique things

```python
seen = set()
seen.add("hello")
seen.add("hello")   # duplicates silently dropped
print(seen)         # {'hello'}

# Convert a list to a set to deduplicate:
subs_unique = list(set(subs))

# Set operations you'll like:
found_ports = {22, 80, 443}
allowed_ports = {22, 443}
extra = found_ports - allowed_ports   # {80} — ports open but not allowed
```

## Functions — the building blocks of maintainable code

A **function** packages code so you can call it many times without repeating yourself. Every professional script is a collection of small functions.

```python
def greet(name):
    """Return a friendly greeting."""
    return f"Hello, {name}!"

message = greet("Ishfaq")
print(message)
```

- `def` — "define a function"
- `name` — the parameter (input)
- `return` — the value the function sends back

Call it as many times as you want.

## Default and keyword arguments

```python
def scan(host, port=80, timeout=1.0):
    print(f"Scanning {host}:{port} (timeout={timeout}s)")

scan("scanme.nmap.org")                 # uses defaults
scan("scanme.nmap.org", 443)            # override port
scan("scanme.nmap.org", timeout=0.5)    # override just timeout by name
```

Naming arguments (`timeout=0.5`) makes calls self-documenting.

### *args and **kwargs — accepting a flexible number of arguments

Sometimes you don't know in advance how many arguments a function needs to accept — `*args` collects any number of extra positional arguments into a tuple, and `**kwargs` collects any number of extra named arguments into a dictionary:

```python
def scan_multiple(*hosts, **options):
    for host in hosts:
        print(f"Scanning {host} with options: {options}")

scan_multiple("host1.com", "host2.com", "host3.com", timeout=2, verbose=True)
# hosts = ("host1.com", "host2.com", "host3.com")
# options = {"timeout": 2, "verbose": True}
```

You'll see `*args`/`**kwargs` constantly when reading other people's code (many real libraries use this pattern to stay flexible) — recognizing the pattern on sight matters more at this stage than writing it yourself often.

## Multiple return values

Functions can return multiple values (as a tuple):

```python
def analyse(host):
    port = 22
    is_open = True
    banner = "OpenSSH 8.4p1"
    return port, is_open, banner

p, o, b = analyse("myserver")
print(p, o, b)
```

## The magic `if __name__ == "__main__":` line

You'll see this at the bottom of professional Python scripts:

```python
def do_work():
    ...

if __name__ == "__main__":
    do_work()
```

It means "only run `do_work()` if this file is executed directly, not if someone else *imports* it as a module." That way your file can be *both* a runnable script and a reusable library.

## Scope — where names live

Variables inside a function are local to it:

```python
def double(x):
    result = x * 2   # 'result' only exists inside this function
    return result

print(double(5))     # 10
print(result)        # NameError — 'result' doesn't exist out here
```

The way to share data cleanly is via return values and function arguments — not global variables. Globals become a mess quickly.

## A real, clean security tool

Let's rewrite the port sweeper using functions:

```python
#!/usr/bin/env python3
"""
sweep.py — Simple TCP port sweep against your own machine.
Usage: python3 sweep.py <host> [port1,port2,...]
"""

import socket
import sys

TIMEOUT = 0.5
DEFAULT_PORTS = [22, 80, 139, 443, 445, 3306, 3389, 5432, 8080]


def check_port(host: str, port: int, timeout: float = TIMEOUT) -> bool:
    """Return True if TCP port is open on host."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(timeout)
        try:
            s.connect((host, port))
            return True
        except (socket.timeout, ConnectionRefusedError, OSError):
            return False


def sweep(host: str, ports: list[int]) -> list[int]:
    """Return the list of open ports on host."""
    open_ports = []
    for port in ports:
        if check_port(host, port):
            print(f"[+] {port} OPEN")
            open_ports.append(port)
        else:
            print(f"[-] {port} closed")
    return open_ports


def main():
    if len(sys.argv) < 2:
        print("Usage: sweep.py <host> [port1,port2,...]")
        sys.exit(1)
    host = sys.argv[1]
    ports = (
        [int(p) for p in sys.argv[2].split(",")]
        if len(sys.argv) > 2
        else DEFAULT_PORTS
    )
    print(f"[*] Sweeping {host}...")
    opens = sweep(host, ports)
    print(f"\nSummary: {len(opens)} open ports: {opens}")


if __name__ == "__main__":
    main()
```

Every function has one clear job. Every function has a docstring. This is now a genuinely maintainable script — the shape you'll build every future tool around.

:::tip THE ONE-JOB RULE
Each function should do *one* thing well. If you can't summarise it in a single sentence, split it into smaller functions. This one habit makes code far cleaner over time.
:::

## 🧪 Lab — Build a subdomain resolver

Save as `resolve.py`. Reads names from a wordlist, tries to resolve each, prints the ones that exist:

```python
#!/usr/bin/env python3
"""resolve.py — Resolve subdomains from a wordlist."""

import socket
import sys


def resolve(name: str) -> str | None:
    """Return IP for name, or None if it doesn't resolve."""
    try:
        return socket.gethostbyname(name)
    except socket.gaierror:
        return None


def main():
    if len(sys.argv) != 3:
        print("Usage: resolve.py <domain> <wordlist>")
        sys.exit(1)

    domain = sys.argv[1]
    wordlist = sys.argv[2]

    with open(wordlist) as f:
        names = [line.strip() for line in f if line.strip()]

    print(f"[*] Trying {len(names)} names against {domain}...")
    for name in names:
        full = f"{name}.{domain}"
        ip = resolve(full)
        if ip:
            print(f"[+] {full}  →  {ip}")


if __name__ == "__main__":
    main()
```

Try it: create a tiny wordlist like `wl.txt` with a few names (`www`, `mail`, `test`), then:

```bash
python3 resolve.py example.com wl.txt
```

You just wrote a real subdomain enumerator. In Path 15, you'll extend this with wildcards, threading, and API-based recon.

:::challenge Test yourself
In the code below, what does `[t for t in tools if len(t) < 6]` produce, given `tools = ["nmap", "burp", "sqlmap"]`?

<details><summary>Show answer</summary><code>['nmap', 'burp']</code> — <code>sqlmap</code> has 6 characters, so it fails the <code>&lt; 6</code> check.</details>
:::

## Key terms

- **List / tuple / set** — mutable ordered / immutable ordered / unordered unique.
- **Comprehension** — one-line list building.
- **`split` / `join`** — string ↔ list conversion.
- **Function** — reusable named block of code.
- **`return` / parameters / default arguments** — how functions communicate.
- **Scope** — where a variable is visible.
- **`if __name__ == "__main__":`** — run-if-executed idiom.

## Recap

- Lists are your go-to collection; sets deduplicate; tuples are immutable pairs.
- Comprehensions build lists in one readable line.
- Functions package reusable code; one job each, with a docstring.
- Real Python tools are a `main()` plus small helpers.

???refs
- [Python docs — Data structures](https://docs.python.org/3/tutorial/datastructures.html) — lists, tuples, sets, dicts.
- [Real Python — Defining functions](https://realpython.com/defining-your-own-python-function/)
- [PEP 257 — Docstring conventions](https://peps.python.org/pep-0257/)
???

**Next up →** [Working with files in Python](#/lesson/04-python/working-with-files-python)
