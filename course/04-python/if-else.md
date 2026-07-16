# Decisions with if/else

Every login check, every password strength test, every "did this scan find something?" is really the same shape: **if this is true, do that.** Time to write that in Python.

## The basic if

```python
password = input("Password: ")

if password == "hunter2":
    print("Access granted")
else:
    print("Access denied")
```

Three things to notice:

1. `if condition:` — a *condition* that resolves to `True` or `False`.
2. The **colon** at the end of the line.
3. The next lines are **indented** (4 spaces is standard). Python uses indentation, not braces, to group code.

:::warn INDENTATION IS SYNTAX
In Python, indentation isn't cosmetic — it's how the language groups blocks. Mixing tabs and spaces, or unequal indentation, will crash your program with an `IndentationError`. Configure your editor to insert 4 spaces on Tab.
:::

## if / elif / else — choose one branch

```python
score = int(input("Score: "))

if score >= 90:
    grade = "A"
elif score >= 75:
    grade = "B"
elif score >= 50:
    grade = "C"
else:
    grade = "F"

print(f"Grade: {grade}")
```

`elif` is Python's shorthand for "else if." Only one branch runs — the first one whose condition is `True`.

## Combining conditions

```python
age = int(input("Age: "))
has_licence = input("Licence? y/n: ") == "y"

if age >= 18 and has_licence:
    print("You may drive")
elif age >= 18 and not has_licence:
    print("Get a licence first")
else:
    print("Too young")
```

- `and` — both must be true
- `or` — either can be true
- `not` — flip a boolean

Common comparison operators:

| Op | Meaning |
|---|---|
| `==` | equal (never `=` — that's assignment!) |
| `!=` | not equal |
| `>`, `<`, `>=`, `<=` | ordering |
| `in` | is a value in a collection? |
| `is` | is this the exact same object? (usually just `is None`) |

### Short-circuit evaluation — a subtle but useful behavior

Python's `and`/`or` operators **short-circuit** — they stop evaluating as soon as the overall result is already determined, without checking the remaining conditions at all. This isn't just an efficiency detail; it's genuinely useful for writing safe checks:

```python
# If 'data' is empty, len(data) == 0 is checked first and is False,
# so Python never even attempts data[0] — avoiding a crash on empty input:
if len(data) > 0 and data[0] == "admin":
    print("First entry is admin")
```

Reversing the order (`data[0] == "admin" and len(data) > 0`) would crash on an empty list, since Python would try to access `data[0]` before ever checking the length — a genuinely common beginner bug, and a useful pattern to recognize once you start validating untrusted input (Path 07's entire premise) rather than clean, well-formed data.

## A real-world check: is a port "well-known"?

```python
port = int(input("Port: "))

if 0 < port <= 1023:
    print(f"{port} is a well-known port")
elif 1024 <= port <= 49151:
    print(f"{port} is registered")
elif 49152 <= port <= 65535:
    print(f"{port} is dynamic/private")
else:
    print(f"{port} is out of range")
```

Notice **chained comparisons** (`0 < port <= 1023`) — a Python nicety that reads like maths.

## Truthiness — which values count as False?

Python treats several values as False when used in an `if`:

- `False`
- `None`
- `0`, `0.0`
- `""` (empty string)
- `[]`, `{}`, `()` (empty collections)

Everything else is True. So:

```python
name = input("Name: ")
if not name:                # empty string → False → not False → True
    print("You didn't enter anything.")
```

That's more Pythonic than `if name == "":`.

## The `in` operator — checking membership

Handy for security work:

```python
common_weak = ["password", "123456", "admin", "qwerty"]

pw = input("Choose password: ")
if pw in common_weak:
    print("That password is on the blocklist.")
else:
    print("OK, checking strength...")

# On strings, 'in' checks for a substring:
if "sql" in input("Query: ").lower():
    print("Warning: query contains 'sql'")
```

## The ternary shortcut

For one-line simple choices:

```python
age = 20
category = "adult" if age >= 18 else "minor"
```

Use sparingly — it's beautiful for simple cases, unreadable for complex ones.

## match / case — modern Python's switch

Since Python 3.10, there's a `match` statement for cleaner multi-way branches:

```python
status_code = 404

match status_code:
    case 200:
        print("OK")
    case 301 | 302:
        print("Redirect")
    case 400 | 401 | 403 | 404:
        print("Client error")
    case 500 | 502 | 503:
        print("Server error")
    case _:
        print("Unknown status")
```

The `_` case is "everything else" (like `default:` in other languages).

## 🧪 Lab — Write a login validator

Save as `login.py` and run with `python3 login.py`:

```python
# login.py — small login flow

MAX_TRIES = 3
CORRECT_USER = "admin"
CORRECT_PASS = "kashSec@2026"

tries = 0
while tries < MAX_TRIES:
    user = input("Username: ")
    pw = input("Password: ")

    if not user or not pw:
        print("Both fields are required.\n")
        tries += 1
        continue

    if user == CORRECT_USER and pw == CORRECT_PASS:
        print(f"Welcome, {user}!")
        break
    else:
        tries += 1
        remaining = MAX_TRIES - tries
        if remaining > 0:
            print(f"Wrong. {remaining} tries left.\n")
        else:
            print("Locked out.")
```

Run it. Try correct creds, wrong ones, and empty ones. Notice how the flow feels — this is the same shape as real login logic in any web app.

Now — as a security thinker — what's wrong with this code from an **attacker's perspective**? Answer at the end of the lab section.

<details><summary>Show answer</summary>
Several things beginners will spot:

- Credentials are <strong>hardcoded</strong> in the source (fine for a lab, catastrophic in real code).
- Passwords are compared in plaintext (no hashing).
- After lockout, running the script again resets the counter (no persistence).
- Error messages differ between "wrong user" and "wrong password" in more elaborate versions — a classic <strong>user enumeration</strong> flaw.

You'll fix these ideas as you go through the course.
</details>

:::challenge Test yourself
Which comparison operator do beginners most often confuse with the assignment `=`?

<details><summary>Show answer</summary><code>==</code> — assignment is <code>=</code>, equality check is <code>==</code>. Writing <code>if x = 5:</code> in Python is a <code>SyntaxError</code>.</details>
:::

## Key terms

- **Condition** — an expression that resolves to `True` or `False`.
- **`if` / `elif` / `else`** — branching statements.
- **`and` / `or` / `not`** — boolean operators.
- **Truthiness** — which non-boolean values count as False in an `if`.
- **`in`** — membership check.
- **`match`** — modern multi-way branch (Python 3.10+).

## Recap

- `if` runs a block when a condition is true; `elif` for extra cases; `else` for the fallback.
- Indentation, not braces, groups Python code — be consistent.
- Combine conditions with `and`, `or`, `not`.
- Empty strings, empty lists, `0`, and `None` are all "falsy."
- `in` checks membership on lists and substrings.

???refs
- [Python docs — Control flow](https://docs.python.org/3/tutorial/controlflow.html) — official reference.
- [Real Python — Conditional statements](https://realpython.com/python-conditional-statements/)
- [PEP 636 — Structural Pattern Matching Tutorial](https://peps.python.org/pep-0636/) — the `match` statement.
???

**Next up →** [Loops: repeat things](#/lesson/04-python/loops)
