# Your first Python program

Small, complete, from-scratch: this lesson walks the whole write → save → run → fix cycle for a real program. If you follow along in Kali, by the end you'll have written and run five little programs of your own.

## Step 1 — Where to write

Two options in Kali:

**Option A: A terminal editor.**

```bash
mkdir ~/python-labs
cd ~/python-labs
nano hello.py     # write in nano
```

**Option B: A GUI editor.** Kali ships with **Mousepad**. VS Code is nicer once you install it (`sudo apt install code -y`).

Either works. What matters is *saving with a `.py` extension.*

## Step 2 — Hello world

Type this in your editor and save as `hello.py`:

```python
# hello.py — the traditional first program
print("Hello, KashSec!")
```

Save (`Ctrl+O`, Enter, `Ctrl+X` in nano). Then run it from the terminal:

```bash
python3 hello.py
```

You should see:

```
Hello, KashSec!
```

**Congratulations — you're a Python programmer.** No, really. Everything from here is variations on this loop.

## Step 3 — Input and output

Replace hello.py with:

```python
name = input("What's your name? ")
print(f"Nice to meet you, {name}!")
```

Run it — the terminal now asks for a name.

## Step 4 — Comments and doc

```python
# This is a comment — Python ignores it. Use it to explain code.

"""
Triple-quoted strings can span
multiple lines. When placed at the
top of a file or function, they become
a 'docstring' — used for documentation.
"""

# Good comments explain WHY, not just WHAT:
timeout = 5   # 5 seconds is long enough for most local checks
```

Habits worth adopting:

- **Every script** starts with a docstring saying what it does and how to use it.
- Comments explain *why* a piece of code exists, not what a line already clearly does.

## Step 5 — Errors and how to read them

When something breaks, Python tells you what and where. Save this as `crash.py`:

```python
name = input("Name: ")
print("Age: " + age)   # oops — 'age' doesn't exist
```

Run it, enter a name, and Python shows you:

```
Traceback (most recent call last):
  File "crash.py", line 2, in <module>
    print("Age: " + age)
                   ^^^
NameError: name 'age' is not defined
```

Read a traceback **bottom to top**:

1. **Type of error** (`NameError`) — the category.
2. **Message** (`name 'age' is not defined`) — the specific thing.
3. **Where** — file and line.

The three most common early errors:

| Error | Usually means |
|---|---|
| `SyntaxError` | You typed something Python can't parse — missing colon, extra bracket, wrong indent |
| `NameError` | You used a variable name that doesn't exist yet |
| `TypeError` | You tried to combine wrong types (e.g., `str + int`) |
| `IndentationError` | Your indentation is inconsistent |
| `ModuleNotFoundError` | You imported a library that isn't installed — try `pip install X` |

:::tip DEBUGGING BY PRINT
The oldest trick in programming: sprinkle `print()` calls to see what's happening at each step. Not glamorous. Extremely effective. Real professionals do this constantly.
:::

### Handling errors gracefully with try/except

Reading tracebacks helps you *fix* bugs while writing code — but a finished script often needs to *anticipate* errors that are expected to sometimes happen (a network request timing out, a file that doesn't exist) without crashing entirely. Python's `try`/`except` catches an error and lets your script recover instead of dying:

```python
try:
    response = requests.get(url, timeout=5)
    print(response.status_code)
except requests.exceptions.Timeout:
    print(f"{url} timed out — skipping")
except requests.exceptions.ConnectionError:
    print(f"{url} refused connection — skipping")
```

This exact pattern is genuinely essential for any recon or scanning script (Path 04's automation lesson, Path 15's recon pipeline) — checking a list of 500 URLs where 10 happen to be offline should skip those 10 gracefully and keep going, not crash the entire run on the first failure.

## Step 6 — Reading and writing files

Files are how your program remembers things between runs. This is the pattern:

```python
# Write to a file:
with open("notes.txt", "w") as f:
    f.write("This is my first Python file write.\n")
    f.write("Second line here.\n")

# Read it back:
with open("notes.txt") as f:
    content = f.read()
print(content)

# Read line by line (memory-friendly for big files):
with open("notes.txt") as f:
    for line in f:
        print(line.strip())
```

The `with` block automatically closes the file, even if something goes wrong. Always use it.

File modes:

- `"r"` — read (default)
- `"w"` — write (**overwrites!**)
- `"a"` — append
- `"rb"` / `"wb"` — binary

## Step 7 — Modules and imports

You don't have to write everything from scratch. Python's **standard library** ships with hundreds of modules.

```python
import os
import sys
import hashlib
import socket
import datetime
import json
import random

# Use them:
print(os.getcwd())              # current directory
print(sys.version)              # Python version
print(hashlib.md5(b"hi").hexdigest())    # MD5 of "hi"
print(socket.gethostname())     # your hostname
print(datetime.datetime.now())  # right now
print(json.dumps({"a": 1}))     # dict → JSON string
print(random.randint(1, 100))   # random 1–100
```

Every one of these is available without installing anything. For libraries not in the standard library, use `pip install`.

## Step 8 — A tiny password-hash lookup

Try this — save as `hash-check.py`:

```python
# hash-check.py — hash a password and see what it looks like
import hashlib

pw = input("Password: ")

# Bad old ways:
md5 = hashlib.md5(pw.encode()).hexdigest()
sha1 = hashlib.sha1(pw.encode()).hexdigest()

# The right way (with a salt):
salt = "somethingRandomPerUser"
sha256_salted = hashlib.sha256((salt + pw).encode()).hexdigest()

print(f"\nMD5:            {md5}")
print(f"SHA-1:          {sha1}")
print(f"SHA-256+salt:   {sha256_salted}")
print("\n(Never store MD5/SHA-1 for passwords. Use bcrypt/argon2 — Path 10.)")
```

You just used a real security library. Path 10 explains why MD5 and SHA-1 are unfit for passwords in detail.

## Common beginner tripwires

- Forgetting `python3 filename.py` (running `python` uses Python 2 on some systems).
- Mixing tabs and spaces in indentation.
- Adding `()` to `input` but forgetting them on `print` (or vice versa).
- Comparing with `=` instead of `==`.
- Forgetting `.encode()` when you pass a string to a hash function (they take *bytes*).

## 🧪 Lab — Small challenges

Work through these one by one. Answers hidden — try first.

1. **Personalised greeter.** Ask for name and favourite tool. Print `Hi <name>! Learn <tool> deeply this week.`
2. **Even or odd.** Ask for a number, print "even" or "odd."
3. **FizzBuzz.** Print 1 to 30, but for multiples of 3 print `Fizz`, multiples of 5 `Buzz`, both `FizzBuzz`.
4. **Line counter.** Ask for a filename, print how many lines it has.
5. **Palindrome check.** Ask for a word, print whether it's a palindrome.

<details><summary>Show sample answers</summary>

```python
# 1
name = input("Name: ")
tool = input("Favourite tool: ")
print(f"Hi {name}! Learn {tool} deeply this week.")

# 2
n = int(input("Number: "))
print("even" if n % 2 == 0 else "odd")

# 3
for i in range(1, 31):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)

# 4
path = input("File: ")
with open(path) as f:
    print(sum(1 for _ in f))

# 5
w = input("Word: ").lower()
print("palindrome" if w == w[::-1] else "not a palindrome")
```
</details>

Get the whole set working. That's your Python foundation cemented.

:::challenge Test yourself
Which built-in Python function opens a file, and what's the special block that guarantees the file is closed?

<details><summary>Show answer</summary><code>open()</code> to open a file, wrapped in a <code>with open(...) as f:</code> block to guarantee closure.</details>
:::

## Key terms

- **`.py` file** — a Python program on disk.
- **Traceback** — Python's error report, read bottom-up.
- **Standard library** — modules shipped with Python (`os`, `sys`, `hashlib`, ...).
- **`with` block** — auto-cleanup for files, sockets, etc.
- **Docstring** — triple-quoted docs at top of file/function.

## Recap

- Write a `.py` file, run with `python3 file.py`.
- `input()` reads, `print()` writes; comments explain *why*.
- Read tracebacks bottom-up to find the error type and line.
- Use `with open(...) as f:` for files.
- Explore the standard library — no install needed.

???refs
- [Python.org — Tutorial](https://docs.python.org/3/tutorial/index.html) — official, thorough.
- [Automate the Boring Stuff — Ch. 1](https://automatetheboringstuff.com/2e/chapter1/) — free, gentle intro.
- [Python standard library index](https://docs.python.org/3/library/index.html)
- [Python Cheatsheet — pythoncheatsheet.org](https://www.pythoncheatsheet.org/)
???

**Next up →** [String manipulation & regex](#/lesson/04-python/string-manipulation-regex)
