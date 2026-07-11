# Path 04 — Programming & Python

> **Level:** Beginner · **Lessons:** 9 · **Assumed knowledge:** Paths 01–03 (you'll type Python in your Kali terminal).

Many people entering security are terrified of "coding." Let's kill that fear right now. Programming is not maths, it's not magic, and you do not need to be a genius. It is simply **writing step-by-step instructions for a computer** — and once you can do a little of it, whole new powers open up: you can automate boring tasks, understand how attacks work under the hood, tweak other people's tools, and build your own. This path takes you from "I've never written a line of code" to building small, genuinely useful security tools with your own hands.

We'll use **Python**, the friendliest language there is and the one security professionals use most. Type every example yourself in your Kali VM — programming is a doing skill.

---

## Module 4A — Programming Basics

## Lesson 4.1 — What is programming?

### Why this matters
If "programming" sounds scary and abstract, you'll avoid it — and miss out on the single biggest force-multiplier in security. This lesson makes it concrete and unscary in five minutes.

### The definition
**Programming is writing step-by-step instructions for a computer to follow.** That is genuinely the whole thing. A program is just a list of precise instructions, carried out in order, exactly as written.

### The recipe picture
A program is like a **cooking recipe**. A recipe lists exact steps, in order: chop the onions, heat the oil, add the onions, stir for five minutes. A cook follows those steps to produce a meal. A computer follows your program's steps to produce a result — a calculation, a file, a scan, a message.

There's one important difference, though, and it's worth knowing early: a human cook uses common sense to fill gaps ("stir until golden" — you know what that means). A computer has **zero** common sense. It does *exactly* what you say, no more, no less. If you tell it to do something silly, it'll do the silly thing perfectly. This is why beginners' programs "don't work" — usually the computer did precisely what was written, which wasn't quite what was meant. That's normal, and fixing it (called **debugging**) is a core part of the craft.

### Why security people program
- **Automation.** Anything you'd do by hand 1,000 times, a program does in seconds. Scanning, sorting results, trying combinations — all faster with a script.
- **Understanding.** Attacks like SQL injection and buffer overflows make far more sense once you understand a little code. You can read how a tool works and know *why* it works.
- **Customisation.** Real engagements need custom scripts no off-the-shelf tool provides. Even small tweaks to existing tools require reading and editing code.
- **Building tools.** The tools you admire were written by people who started exactly where you are.

> 💡 You do **not** need to be a "maths person." Programming is mostly logical thinking, breaking a problem into small steps, and patience while you get the steps right. If you can follow a recipe, you can program.

### 🚩 Challenge
Why do beginners' programs often "not work" even when the code looks fine?

<details><summary>Answer</summary>Because the computer does exactly what it's told with no common sense — it followed the instructions precisely, which wasn't quite what the programmer meant. Fixing that gap is called debugging.</details>

### Key terms
- **Program** — a list of instructions a computer follows in order.
- **Debugging** — finding and fixing mistakes in code.
- **Automation** — making a computer do repetitive work for you.

### Recap
- Programming is writing step-by-step instructions for a computer.
- It's like a recipe — but the computer has no common sense and does exactly what you say.
- Security people program to automate, understand attacks, customise, and build tools.
- It's logic and patience, not hard maths.

---

## Lesson 4.2 — Variables & data types

### Why this matters
Variables are the most basic building block of every program. Everything else — decisions, loops, tools — moves data in and out of variables. Get comfortable here and the rest follows naturally.

### A variable is a labelled box
A **variable** is a labelled box where you store a piece of information to use later. You put something in the box, give the box a name, and then whenever you use that name, you get what's inside.

```python
name = "Alex"       # a box labelled 'name' holding the text Alex
age = 25            # a box labelled 'age' holding the number 25
is_admin = False    # a box labelled 'is_admin' holding a true/false value
```

The `=` sign means "put the thing on the right into the box on the left." (This is different from checking if two things are equal, which uses `==` — a distinction we'll hit in the next lesson, and a classic beginner trip-up.)

### The main data types
The *kind* of thing in the box matters. The three you'll use constantly:

- **String** — text, always in quotes: `"Alex"`, `"password123"`, `"hello world"`.
- **Number** — integers like `25` or decimals like `3.14`.
- **Boolean** — a true/false value: `True` or `False`. Perfect for yes/no answers, like "is this user an admin?"

There are more (lists, which we'll meet later), but these three cover most early work.

### Using variables
Once something's in a box, you can use and combine it:

```python
first = "John"
last = "Smith"
full = first + " " + last     # join strings together -> "John Smith"
print(full)                   # displays: John Smith

age = 25
print(age + 5)                # displays: 30
```

`print(...)` shows something on the screen — you'll use it constantly to see what your program is doing.

### A security-flavoured example
```python
username = "admin"
attempts = 3
locked = False
print("User:", username, "| Attempts left:", attempts, "| Locked:", locked)
```

Already this looks like the kind of state a login system tracks.

### 🧪 Lab — Play with variables
1. In Kali, type `python3` and press Enter to open Python's interactive mode (you'll see `>>>`).
2. Type `name = "your name"` then `print(name)`.
3. Type `x = 10` then `print(x * 3)`.
4. Type `greeting = "Hello, " + name` then `print(greeting)`.
5. Type `exit()` to leave. Note in your own words what a variable is.

### 🚩 Challenge
What data type would you use to store a simple yes/no answer like "is the account locked?"

<details><summary>Answer</summary>A boolean (True or False).</details>

### Key terms
- **Variable** — a labelled box storing a value.
- **String / number / boolean** — text / numeric / true-false data types.
- **`=` vs `==`** — assign a value vs check for equality.
- **print()** — display something on screen.

### Recap
- A variable is a labelled box storing data; `=` puts a value in.
- The main types are strings (text), numbers, and booleans (true/false).
- You can combine variables (e.g., join strings with `+`).
- `print()` shows you what's happening — your window into a program.

---

## Lesson 4.3 — Making decisions with if / else

### Why this matters
Programs constantly need to choose: *if* something is true, do one thing; *else* do another. This is the logic behind every login check, every filter, every "access granted / denied" — so it's central to security.

### The idea
An `if` statement runs some code **only when a condition is true**. An optional `else` runs different code when it's false.

```python
password = "letmein"

if password == "secret123":
    print("Access granted")
else:
    print("Access denied")
```

Here the program checks whether `password` equals `"secret123"`. Since `"letmein"` does not, it prints **"Access denied"**. Change `password` to `"secret123"` and it would grant access. **You just wrote the core logic of a login check.**

### The `==` vs `=` trap
- `=` means *assign* (put a value in a box): `password = "letmein"`.
- `==` means *check equality* (is this equal to that?): `if password == "secret123"`.

Mixing these up is the single most common beginner mistake. Read your `if` lines carefully — they use `==`.

### More comparisons
```python
if age >= 18:        # greater than or equal to
    print("Adult")

if attempts == 0:    # exactly equal to
    print("Locked out")

if score != 100:     # not equal to
    print("Not perfect")
```

Common comparisons: `==` equal, `!=` not equal, `>` greater, `<` less, `>=` at least, `<=` at most.

### Combining conditions
```python
username = "admin"
password = "secret123"

if username == "admin" and password == "secret123":
    print("Welcome, admin!")
elif username == "guest":     # "elif" = else-if, another condition to try
    print("Welcome, guest!")
else:
    print("Unknown user")
```

`and` requires both to be true; `or` requires at least one; `elif` lets you test more conditions in a chain.

### About indentation
Notice the code *inside* an `if` is **indented** (spaces at the start of the line). In Python, indentation isn't decoration — it's how the language knows which lines belong to the `if`. Be consistent (4 spaces is standard). Getting indentation wrong is another classic beginner error, and Python will complain if it's off.

### 🚩 Challenge
In a login check, which symbol correctly checks whether the typed password equals the stored one — `=` or `==`?

<details><summary>Answer</summary>== (double equals) checks equality. A single = would try to assign and cause an error.</details>

### Key terms
- **if / elif / else** — run code based on conditions.
- **Condition** — something that is true or false.
- **and / or** — combine conditions.
- **Indentation** — the spacing that groups code in Python.

### Recap
- `if`/`else` lets a program make decisions — the logic behind every login check.
- `==` checks equality; `=` assigns. Don't mix them up.
- Combine conditions with `and`/`or`, and chain more with `elif`.
- Indentation defines what belongs to an `if` in Python.

---

## Lesson 4.4 — Loops: repeating tasks

### Why this matters
Computers are brilliant at doing boring things thousands of times without complaint. A **loop** is how you tell them to. Loops power password guessing, scanning ranges of addresses, and processing lists of results — the automation at the heart of hacking.

### The `for` loop — do something for each item
```python
for number in range(1, 6):
    print(number)
# prints 1, 2, 3, 4, 5
```

This says "for each number from 1 up to (but not including) 6, print it." Note that `range(1, 6)` stops *before* 6 — a small quirk worth remembering.

You can loop over a list of things too:

```python
passwords = ["123456", "password", "admin"]
for pw in passwords:
    print("Trying:", pw)
```

That's the skeleton of a password-guessing tool: for each candidate, try it. (On a system you're authorised to test, of course.)

### The `while` loop — keep going until a condition changes
```python
attempts = 0
while attempts < 3:
    print("Attempt number", attempts)
    attempts = attempts + 1   # increase, or the loop never ends!
```

A `while` loop repeats **as long as** its condition stays true. You must change something inside so it eventually becomes false — otherwise you get an **infinite loop** that runs forever (press **Ctrl+C** to stop a runaway program).

### Combining loops with decisions
This is where real power appears — a loop that makes a decision each time:

```python
target = "secret123"
guesses = ["abc", "password", "secret123", "letmein"]

for guess in guesses:
    if guess == target:
        print("Password found:", guess)
    else:
        print(guess, "is wrong")
```

You've now combined loops and `if` statements — the two ideas that underlie a huge amount of tooling.

### 🧪 Lab — Loop practice
1. Open Python: `python3`.
2. Type a loop:
   ```python
   for i in range(1, 4):
       print("Ping attempt", i)
   ```
   (Press Enter twice after the indented line to run it.)
3. Now loop over a list:
   ```python
   for word in ["cat", "dog", "bird"]:
       print(word)
   ```
4. `exit()` when done. Write down the difference between a `for` loop and a `while` loop.

### 🚩 Challenge
In `range(1, 6)`, what is the last number the loop actually uses?

<details><summary>Answer</summary>5 — range stops just before the second number (6), so it goes 1, 2, 3, 4, 5.</details>

### Key terms
- **Loop** — repeats a block of code.
- **for loop** — repeats once for each item (or number in a range).
- **while loop** — repeats while a condition stays true.
- **Infinite loop** — a loop that never ends (stop it with Ctrl+C).

### Recap
- Loops repeat work automatically — the engine of automation.
- `for` loops run once per item; `while` loops run until a condition changes.
- Watch out for infinite loops; change something inside a `while`.
- Loops + `if` together are the foundation of real tools like password guessers and scanners.

---

## Module 4B — Python for Beginners

## Lesson 4.5 — Why Python for security?

### Why this matters
Of all languages you could learn, Python gives beginners the fastest path to writing real, useful security code. Knowing why helps you commit to it.

### What Python is
**Python** is a programming language famous for being **easy to read** — it almost looks like plain English. Compare a line of Python to the same idea in older, denser languages and Python is dramatically clearer, which means you spend your energy on *ideas* rather than fighting the language's syntax.

### Why security folks reach for Python
- **It reads clearly**, so you learn and debug faster.
- **It's everywhere in security** — a huge number of tools, scripts, and exploits are written in Python. Reading and tweaking them is a daily skill.
- **Batteries included** — Python comes with, and has easy access to, ready-made building blocks ("libraries") for networking, web requests, cryptography, and more. You rarely start from scratch.
- **Quick to build small tools** — you can go from idea to working script in minutes, which is exactly what you need during an engagement.

### It's already installed
Kali (and most Linux systems) already have Python. Check it:

```bash
python3 --version    # shows the installed version, e.g. Python 3.11.x
```

Two ways to run Python:
1. **Interactive mode** — type `python3`, get a `>>>` prompt, and run lines one at a time. Great for experimenting.
2. **Script mode** — write your code in a `.py` file and run it all at once with `python3 file.py`. This is how you build real tools.

> 💡 Don't try to learn *all* of Python. Learn the small slice that lets you read tools and write short scripts — variables, if/else, loops, lists, functions, and making web requests. That slice covers most of what security work needs.

### 🚩 Challenge
Which command runs a Python script saved in a file called `tool.py`?

<details><summary>Answer</summary>python3 tool.py</details>

### Key terms
- **Python** — a beginner-friendly, widely-used language.
- **Library** — a ready-made bundle of code you can reuse.
- **Interactive vs script mode** — running lines live vs running a whole file.

### Recap
- Python is easy to read, which speeds up learning and debugging.
- It's the most common language in security, with libraries for everything.
- It's pre-installed on Kali; run it interactively (`python3`) or as a file (`python3 file.py`).
- Learn the useful slice, not the whole language.

---

## Lesson 4.6 — Your first Python program

### Why this matters
There's a real confidence boost in running your own program for the first time. This lesson gets you there and teaches the write-save-run cycle you'll use forever.

### The classic first program
```python
print("Hello, hacker world!")
```

`print(...)` displays text on screen. That one line is a complete, working program.

### 🧪 Lab — Write and run a program
1. In your Kali terminal, create a file with a simple editor: `nano first.py`.
2. Type: `print("Hello, hacker world!")`.
3. Save and exit nano: **Ctrl+O**, Enter, then **Ctrl+X**.
4. Run it: `python3 first.py`.
5. Your message appears. **You are officially a programmer.** 🎉

### Getting input from the user
A program becomes interactive when it can ask questions. The `input()` function reads what the user types:

```python
name = input("What is your name? ")
print("Hello, " + name + "! Welcome to cybersecurity.")
```

Save that as `greet.py`, run it with `python3 greet.py`, and it'll ask your name, then greet you. Notice how `input()` gives back a string you store in a variable.

### Watch out: input is always text
Anything from `input()` is a **string**, even if the user types a number. To do maths on it, convert it first with `int()`:

```python
age_text = input("Your age? ")     # this is text, e.g. "25"
age = int(age_text)                # convert to a number
print("Next year you'll be", age + 1)
```

Forgetting this conversion is an extremely common beginner error (you can't add 1 to the text `"25"`).

### Comments — notes to yourself
Anything after a `#` is a **comment** — ignored by Python, there to explain your code to humans (including future you):

```python
# This program greets the user
name = input("Name: ")   # ask for their name
print("Hi", name)
```

Good comments are a professional habit; start now.

### 🚩 Challenge
A user types their age with `input()`. Why can't you immediately do `age + 1`?

<details><summary>Answer</summary>Because input() always returns text (a string), not a number. You must convert it first with int() before doing maths.</details>

### Key terms
- **print()** — display output.
- **input()** — read text typed by the user.
- **int()** — convert text to a number.
- **Comment (#)** — a human note ignored by Python.

### Recap
- `print()` shows output; you wrote and ran your first program.
- `input()` reads user input as a string.
- Convert text to numbers with `int()` before doing maths.
- Use `#` comments to explain your code.

---

## Lesson 4.7 — Lists & functions

### Why this matters
Lists let you handle many items at once (like a wordlist of passwords), and functions let you package code you reuse. Together they turn short scripts into real tools.

### Lists — many things in one box
A **list** holds several items in order, written in square brackets:

```python
passwords = ["123456", "password", "admin", "letmein"]

print(passwords[0])     # the first item -> "123456"  (counting starts at 0!)
print(passwords[1])     # the second item -> "password"
print(len(passwords))   # how many items -> 4
```

A crucial quirk: **lists start counting at 0**, so the first item is `[0]`, the second is `[1]`, and so on. This catches everyone at first.

Useful list actions:
```python
passwords.append("qwerty")   # add an item to the end
print(passwords)             # now has 5 items
for pw in passwords:         # loop through every item
    print("Trying:", pw)
```

Reading a wordlist from a file (exactly how password tools work):
```python
with open("wordlist.txt") as f:
    for line in f:
        print("Trying:", line.strip())   # strip() removes the newline
```

### Functions — reusable mini-programs
A **function** is a named block of code you can run whenever you like, so you don't repeat yourself. You **define** it once with `def`, then **call** it by name.

```python
def greet(name):
    print("Hello, " + name)

greet("Alex")      # prints: Hello, Alex
greet("Sam")       # prints: Hello, Sam
```

`name` is a **parameter** — a value you pass in. Functions can also give a result back with `return`:

```python
def is_strong(password):
    if len(password) >= 12:
        return True
    else:
        return False

print(is_strong("short"))          # False
print(is_strong("a-long-passphrase"))  # True
```

Functions keep code tidy, readable, and reusable — the mark of moving from beginner scribbles to real programs.

### 🚩 Challenge
In the list `colors = ["red", "green", "blue"]`, how do you access `"green"`?

<details><summary>Answer</summary>colors[1] — because lists start counting at 0, so "red" is [0] and "green" is [1].</details>

### Key terms
- **List** — an ordered collection of items in `[ ]`; indexes start at 0.
- **append() / len()** — add an item / count items.
- **Function** — a named, reusable block of code (`def`).
- **Parameter / return** — a value passed in / a value handed back.

### Recap
- Lists hold many items; `[0]` is the first, `len()` counts, `append()` adds.
- You can loop through lists or read them from a file (like a wordlist).
- Functions are reusable named blocks defined with `def` and called by name.
- `return` hands a result back; parameters pass values in.

---

## Lesson 4.8 — Build a password-strength checker

### Why this matters
Time to combine everything — variables, if/else, functions, and length checks — into a small tool that does something genuinely useful. This is your first real security script.

### The tool
```python
def check_password(pw):
    # Rule 1: length
    if len(pw) < 8:
        return "Weak: too short (needs at least 8 characters)"
    # Rule 2: only letters is weak
    if pw.isalpha():
        return "Weak: letters only — add numbers and symbols"
    # Rule 3: only numbers is weak
    if pw.isdigit():
        return "Weak: numbers only — add letters and symbols"
    # Passed the basic checks
    return "Strong enough!"

# Test it on a few passwords
print(check_password("cat"))          # too short
print(check_password("password"))     # letters only
print(check_password("12345678"))     # numbers only
print(check_password("Sup3r$ecret"))  # strong
```

Walk through what each piece does: `len(pw)` measures length; `pw.isalpha()` is `True` if the password is only letters; `pw.isdigit()` is `True` if it's only digits. Simple rules — but this is genuinely how password checks begin, and real ones just add more rules.

### 🧪 Lab — Make it your own
1. Save the code above as `checker.py` (`nano checker.py`, paste, save, exit).
2. Run it: `python3 checker.py`. Watch it judge each password.
3. **Add interactivity** — let the user type a password to test. Add these lines at the bottom:
   ```python
   user_pw = input("Enter a password to check: ")
   print(check_password(user_pw))
   ```
4. **Add a new rule** — make it require at least one number. Add this check inside the function (before the final `return`):
   ```python
   if not any(c.isdigit() for c in pw):
       return "Weak: add at least one number"
   ```
5. Run it again and test several passwords.

### Why this matters more than it looks
You've just written a program that takes input, applies logical rules, and returns a judgement. That exact shape — input → rules → output — describes an enormous amount of security tooling, from validators to scanners to detectors. You're not doing a toy exercise; you're doing the real thing at small scale.

### 🚩 Challenge
Which built-in Python function measures how many characters are in a password?

<details><summary>Answer</summary>len() — as used in len(pw).</details>

### Key terms
- **len()** — measures length.
- **.isalpha() / .isdigit()** — true if a string is all letters / all digits.
- **any()** — true if any item in a sequence meets a condition.

### Recap
- You built a working password-strength checker.
- It combines length checks, string tests, and functions.
- The pattern input → rules → output underlies huge amounts of security code.
- You extended it with user input and a new rule — real development.

---

## Lesson 4.9 — Where to go next with Python

### Why this matters
You now have the core of Python. This lesson points you at the next practical steps so you keep momentum instead of wondering "what now?"

### The libraries security people love
As you grow, these ready-made building blocks will do a lot of heavy lifting:

- **`requests`** — send web requests from Python in a couple of lines. Perfect for interacting with websites and APIs while testing.
  ```python
  import requests
  r = requests.get("https://example.com")
  print(r.status_code)      # e.g. 200
  print(len(r.text))        # how much page content came back
  ```
- **`socket`** — low-level networking; you can write a basic port scanner with it.
- **`scapy`** — craft and read network packets (advanced, powerful).
- **`hashlib`** — hashing (turning data into fingerprints), useful for passwords and integrity.

Install extra libraries with **pip**, Python's package installer:
```bash
pip install requests
```

### A tiny taste: a mini port checker
Here's a small script (using `socket`) that checks whether a single port is open — run it only against your own machine or a legal target like `scanme.nmap.org`:

```python
import socket

target = "scanme.nmap.org"   # a legal practice target
port = 80

s = socket.socket()
s.settimeout(2)
result = s.connect_ex((target, port))   # 0 means the port is open
if result == 0:
    print(f"Port {port} is OPEN on {target}")
else:
    print(f"Port {port} is closed or filtered")
s.close()
```

Don't worry about understanding every line yet — the point is to *see* that with a handful of Python lines you can build the beginnings of real tools. You'll return to code like this after the networking and scanning paths.

### How to keep learning
- **Automate something boring** in your own life or lab — the best practice is a real problem.
- **Read others' tools.** Open a small Python security script on GitHub and try to follow it line by line.
- **Rebuild simple tools yourself.** Try writing a tiny version of a tool you use — a directory-word tester, a hash generator — to cement the concepts.
- **Don't rush.** You have enough Python now to be dangerous. Depth comes from building.

> 💡 You do not need to "finish learning Python" before moving on. You know enough right now to read tools and write helpful scripts. Return here and level up whenever a project needs it.

### 🚩 Challenge
Which Python library lets you send web requests in just a couple of lines, and how do you install it?

<details><summary>Answer</summary>The requests library; install it with pip install requests.</details>

### Key terms
- **Library / module** — reusable code you import.
- **pip** — Python's package installer.
- **requests / socket / hashlib** — libraries for web requests / networking / hashing.

### Recap
- Libraries like `requests`, `socket`, and `hashlib` do heavy lifting for you.
- Install extras with `pip install`.
- With a few lines you can build the start of real tools (web checks, port checks).
- Keep learning by automating real tasks, reading tools, and rebuilding simple ones.

---

## You've finished Path 04 🎉

You went from never having coded to understanding variables, decisions, loops, lists, and functions — and you built a real password-strength checker and saw the beginnings of network tools. You never need to fear "coding" again. You have enough Python to read tools and write your own scripts, which puts you ahead of many people in this field.

**Next up → `05-web-basics.md`:** how the web really works under the hood — requests and responses, HTML/CSS/JavaScript, client vs server, cookies and sessions, and the browser DevTools that become your first hacking tool. This is the launchpad for web hacking.
