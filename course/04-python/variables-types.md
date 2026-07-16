# Variables & data types

You can't write programs without a way to store and label information. That's what **variables** and **types** are for.

## Variables — labelled boxes

A **variable** is a labelled box you put a value into. You give it a name, put a value in, and later use the name to get the value back.

```python
name = "Ishfaq"      # a text value
age = 32             # a whole number
is_admin = False     # a yes/no value
score = 87.5         # a decimal number
```

Every one of those lines follows the same shape: **`name = value`**. The name is on the left, the value on the right, the `=` puts the value into the box.

## Reading and changing values

```python
name = "Ishfaq"
print(name)             # → Ishfaq

name = "Alice"          # replace the value
print(name)             # → Alice

age = 32
age = age + 1           # bump age by 1
print(age)              # → 33

# Shorthand for common changes:
age += 1        # same as age = age + 1
score *= 2      # score = score * 2
```

## The main data types

Python has a handful of built-in types you'll use daily:

| Type | Looks like | Example |
|---|---|---|
| **`str`** (string) | text in quotes | `"password123"`, `'hello'` |
| **`int`** (integer) | whole numbers | `42`, `-7`, `0` |
| **`float`** | decimals | `3.14`, `-0.5` |
| **`bool`** | True/False | `True`, `False` |
| **`list`** | ordered sequence | `["nmap", "burp", "sqlmap"]` |
| **`dict`** | key/value pairs | `{"user": "admin", "id": 42}` |
| **`None`** | "nothing" | `None` |

You can always check a type with `type()`:

```python
type("hello")     # → <class 'str'>
type(42)          # → <class 'int'>
type(True)        # → <class 'bool'>
```

## Strings — the security worker's bread and butter

Text is where nearly all security work happens: URLs, headers, payloads, tokens, logs.

```python
url = "https://example.com/login"
print(url.upper())               # HTTPS://EXAMPLE.COM/LOGIN
print(url.lower())               # https://example.com/login
print(url.startswith("https"))   # True
print(url.endswith(".com/login"))# True
print(len(url))                  # 27
print("example" in url)          # True

# Slicing — grab pieces of a string:
print(url[:5])       # "https"
print(url[8:])       # "example.com/login"
print(url[-5:])      # "login"

# Concatenation and formatting:
user = "admin"
print("Welcome, " + user)                 # concatenation
print(f"Welcome, {user}")                 # f-string (best modern way)
print("Welcome, {}".format(user))         # older .format()
```

**F-strings** (the `f"..."` style) are the modern, readable way to inject values into text. Use them.

## Numbers

```python
a = 10
b = 3
print(a + b)   # 13
print(a - b)   # 7
print(a * b)   # 30
print(a / b)   # 3.3333... (always float)
print(a // b)  # 3   (integer division)
print(a % b)   # 1   (remainder — great for "every 5th item")
print(a ** b)  # 1000 (a to the power of b)
```

## Booleans and comparisons

```python
print(5 == 5)   # True
print(5 != 3)   # True
print(5 > 10)   # False
print(5 >= 5)   # True

# Combining:
age = 25
print(age > 18 and age < 65)    # True
print(age < 18 or age > 65)     # False
print(not True)                 # False
```

### Dynamic typing — no need to declare a type upfront

Unlike some languages (Java, C), Python never requires you to declare a variable's type in advance — you just assign a value, and Python figures out the type automatically:

```python
x = 5          # Python infers: this is an integer
x = "hello"    # now the SAME variable holds a string instead — totally legal
print(type(x)) # <class 'str'>
```

This flexibility (called **dynamic typing**) is a big part of why Python reads so cleanly for beginners — but it's also a real source of subtle bugs once scripts grow larger, since nothing stops you from accidentally reassigning a variable to an unexpected type partway through a script. The `type()` function, used above, is your go-to tool whenever you're unsure what a variable currently holds — genuinely useful during debugging.

## Type conversion

```python
n = "42"        # a string!
n = int(n)      # now an int: 42
print(n + 1)    # 43

pi = "3.14"
pi = float(pi)  # 3.14 as float

x = 42
s = str(x)      # "42" as string

# Common gotcha:
count = input("How many? ")   # input() ALWAYS returns a string!
count = int(count)            # convert before doing maths
```

:::warn A CLASSIC BEGINNER BUG
`input()` gives you back a string, always. If you try `input("Number: ") + 1`, Python complains it can't add a string to an int. Convert first with `int(...)` or `float(...)`.
:::

## Variable naming conventions

Naming matters more than beginners realise — future-you (and code reviewers) read your code far more often than you write it.

```python
# Good
target_url = "https://example.com"
password_hash = "5f4dcc3b..."
open_ports = [22, 80, 443]

# Bad
u = "https://example.com"
p = "5f4dcc3b..."
op = [22, 80, 443]

# Terrible
x1 = "https://example.com"
data = "5f4dcc3b..."
list1 = [22, 80, 443]
```

Python style (PEP 8) uses **`snake_case`** for variables and functions. Constants use **`ALL_CAPS`**.

## Lists — an ordered collection

```python
ports = [22, 80, 443, 3306]

print(ports[0])       # 22 (indexes start at 0)
print(ports[-1])      # 3306 (last item)
print(len(ports))     # 4
print(80 in ports)    # True

ports.append(8080)    # add to end
ports.remove(22)      # remove a value
ports.sort()          # sort in place
print(ports)          # [80, 443, 3306, 8080]

# Loop through:
for port in ports:
    print(f"Checking port {port}...")
```

## Dictionaries — key/value pairs

```python
user = {
    "username": "admin",
    "id": 1,
    "is_admin": True
}

print(user["username"])           # admin
print(user.get("email", "n/a"))   # n/a (with default)

user["email"] = "admin@example.com"    # add a new key
user["is_admin"] = False               # update a key

for key, value in user.items():
    print(f"{key}: {value}")
```

Dicts are how you'll represent things like an HTTP response, an API user, or a scan result.

## None — the "nothing" value

```python
result = None       # placeholder for "not yet set"
if result is None:
    print("no result yet")
```

## 🧪 Lab — Play with types in the REPL

Python has an interactive mode called the **REPL** (Read-Eval-Print Loop). In a terminal, just type `python3` and press Enter. You get a prompt `>>>` where every line runs immediately.

```python
>>> name = "world"
>>> greeting = f"Hello, {name}!"
>>> greeting
'Hello, world!'
>>> greeting.upper()
'HELLO, WORLD!'
>>> len(greeting)
13
>>> exit()
```

Type `exit()` or press Ctrl+D to leave. The REPL is where you'll experiment throughout learning Python — always open a second terminal with `python3` running.

:::challenge Test yourself
`age = input("How old? ")`; then you write `age + 1`. Python errors. What's the fix?

<details><summary>Show answer</summary><code>input()</code> always returns a string. Convert with <code>age = int(input("How old? "))</code> before doing arithmetic.</details>
:::

## Key terms

- **Variable** — a labelled box for a value.
- **Type** — the kind of value (`str`, `int`, `bool`, `list`, `dict`, ...).
- **String / int / float / bool / list / dict / None** — the main built-in types.
- **f-string** — modern string formatting with `f"..."`.
- **REPL** — Python's interactive mode (`python3`).
- **PEP 8** — Python's style guide; use `snake_case`.

## Recap

- Variables hold labelled values you refer to by name.
- The main types are string, int, float, bool, list, dict, None.
- Convert types explicitly: `int()`, `str()`, `float()`.
- Use f-strings for readable formatting.
- Play in the REPL — it's the fastest way to learn.

???refs
- [Python docs — Data types](https://docs.python.org/3/library/stdtypes.html) — the official reference.
- [PEP 8 — Style Guide](https://peps.python.org/pep-0008/) — the naming and formatting standard.
- [Real Python — f-strings guide](https://realpython.com/python-f-strings/)
- [Learn Python interactively — LearnPython.org](https://www.learnpython.org/) — free browser-based exercises.
???

**Next up →** [Decisions with if/else](#/lesson/04-python/if-else)
