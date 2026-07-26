# Loops: repeat things

Repeating an action many times is how one attacker tries 10,000 passwords in a minute, or how one defender checks 1,000 log lines for a pattern. Loops turn "one" into "many."

## for — do X for each item

The `for` loop walks through each item of something and runs a block of code for each one.

```python
ports = [22, 80, 443, 3306]
for port in ports:
    print(f"Checking port {port}...")
```

Read it in English: "for each port in the list `ports`, print a message." Same shape works on:

```python
# Each character of a string:
for char in "kashsec":
    print(char)

# Each line of a file:
with open("hosts.txt") as f:
    for line in f:
        print(line.strip())

# Each key/value in a dict:
user = {"name": "admin", "id": 1}
for key, value in user.items():
    print(f"{key} = {value}")
```

## range — counting loops

`range(n)` gives you the numbers `0, 1, 2, ..., n-1`. Perfect for "do this N times."

```python
for i in range(5):
    print(i)          # 0 1 2 3 4

for i in range(1, 11):     # start, stop
    print(i)               # 1..10

for i in range(0, 100, 10):   # start, stop, step
    print(i)                  # 0 10 20 ... 90
```

Handy pattern for retries:

```python
for attempt in range(1, 4):     # attempts 1, 2, 3
    print(f"Attempt {attempt}")
    # try something...
```

## while — keep going until a condition changes

`while` runs as long as its condition is `True`.

```python
count = 5
while count > 0:
    print(count)
    count -= 1
print("Boom!")

# Common shape — read input until user says stop:
answer = ""
while answer.lower() != "quit":
    answer = input("> ")
    print(f"You said: {answer}")
```

**When to use which?**

- **`for`** — you already know what you're iterating over (a list, a range, a file).
- **`while`** — you don't know how many times you'll loop; you'll stop when a condition changes.

## break and continue

Two escape hatches inside loops:

- **`break`** — leave the loop entirely.
- **`continue`** — skip the rest of this iteration and go to the next one.

```python
for line in open("emails.txt"):
    line = line.strip()
    if not line:
        continue          # skip empty lines
    if line == "STOP":
        break             # end the loop
    print(f"Processing: {line}")
```

### Avoiding accidental infinite loops

A `while` loop only stops when its condition becomes false — if you forget to actually update the variable the condition depends on, the loop runs forever, freezing your script (and sometimes your terminal):

```python
# BUG: count never changes, this loop never ends
count = 0
while count < 5:
    print("stuck")
    # forgot: count += 1

# FIXED:
count = 0
while count < 5:
    print(count)
    count += 1   # this line is what actually lets the loop finish
```

If a script you run seems to hang forever with no output, an infinite loop is one of the first things worth suspecting — `Ctrl+C` in the terminal force-stops it, and re-reading your loop's condition (and whether anything inside the loop actually changes it) is the fix.

## Nested loops

You can put a loop inside another loop. Useful for combinations like "every user × every password":

```python
users = ["admin", "root", "user"]
passwords = ["password", "123456", "letmein"]

for user in users:
    for password in passwords:
        print(f"Trying {user}:{password}")
```

That's genuinely the shape of a login brute-force script. In Path 11 you'll build a *responsible*, in-lab-only version of this against a deliberately-vulnerable target.

## The security learner's most-used loop pattern

Reading a wordlist, doing something with each entry:

```python
with open("subdomains.txt") as f:
    for name in f:
        name = name.strip()
        full = f"{name}.example.com"
        # try to resolve it, HTTP-probe it, etc.
        print(full)
```

If you find yourself doing something 5+ times manually, that's a signal to write a loop.

## List comprehensions — a Pythonic shortcut

For simple "make a new list from another list" work, Python has a beautiful one-line syntax:

```python
# Regular way:
squared = []
for n in [1, 2, 3, 4, 5]:
    squared.append(n * n)

# Comprehension:
squared = [n * n for n in [1, 2, 3, 4, 5]]

# With a filter:
even_ports = [p for p in ports if p % 2 == 0]

# String cleanup pattern you'll use constantly:
lines = [line.strip() for line in open("hosts.txt") if line.strip()]
```

Comprehensions are idiomatic Python. Learn to recognise them; use them when they don't hurt readability.

## enumerate — index and value together

When you need both position and value:

```python
for index, port in enumerate(ports, start=1):
    print(f"{index}. Port {port}")
```

## zip — walk two lists in parallel

```python
users = ["alice", "bob", "carol"]
scores = [92, 87, 78]

for user, score in zip(users, scores):
    print(f"{user}: {score}")
```

## 🧪 Lab — Port sweeper (safe local version)

Save as `sweep.py` and run only against **`127.0.0.1`** (your own machine — always in scope!).

```python
# sweep.py — a beginner port sweeper against your own machine
import socket

TARGET = "127.0.0.1"
PORTS_TO_CHECK = [22, 80, 139, 443, 445, 3306, 3389, 5432, 8080]

print(f"Sweeping {TARGET}...")
open_ports = []

for port in PORTS_TO_CHECK:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(0.5)
    try:
        s.connect((TARGET, port))
        print(f"[+] {port} OPEN")
        open_ports.append(port)
    except (socket.timeout, ConnectionRefusedError):
        print(f"[-] {port} closed")
    finally:
        s.close()

print(f"\nSummary: {len(open_ports)} open ports: {open_ports}")
```

Notice you already have the shape of a real security tool — a loop, a network operation, exception handling, and a summary. You'll add features throughout Path 04.

:::danger LEGALITY REMINDER
`127.0.0.1` is your own machine, so this is fine. Scanning any other IP, even briefly, without permission is illegal — see Path 01 lesson 4. Use `scanme.nmap.org` if you want to try against something not yours.
:::

:::challenge Test yourself
You want to print the numbers 1 to 100 inclusive. Which is the correct `range()`?

- A. `range(100)`
- B. `range(1, 100)`
- C. `range(1, 101)`

<details><summary>Show answer</summary>C — <code>range(1, 101)</code>. <code>range</code> is exclusive at the end, so <code>range(1, 100)</code> stops at 99.</details>
:::

## Key terms

- **`for` loop** — repeat for each item.
- **`while` loop** — repeat while a condition is true.
- **`range()`** — generate a sequence of numbers.
- **`break` / `continue`** — leave / skip an iteration.
- **List comprehension** — one-line list construction.
- **`enumerate` / `zip`** — index+value / parallel iteration.

## Recap

- `for` walks over items; `while` runs while a condition holds.
- `range(a, b, step)` is your counting loop.
- `break` exits, `continue` skips.
- List comprehensions turn small loops into one readable line.
- Loops turn "one attempt" into "one thousand attempts" — the heart of a lot of tooling.

???refs
- [Python docs — for and while](https://docs.python.org/3/tutorial/controlflow.html#for-statements) — official.
- [Real Python — Loops](https://realpython.com/python-for-loop/)
- [Python list comprehensions guide](https://realpython.com/list-comprehension-python/)
???

**Next up →** [Error handling & exceptions](#/lesson/04-python/error-handling-exceptions)
