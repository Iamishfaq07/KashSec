# Object-oriented Python basics

You've built the password checker using functions and data working together, but kept somewhat separate. This lesson introduces **classes** — Python's way of bundling data and the functions that operate on it into a single, reusable unit, genuinely common in larger real-world security tools.

## What a class actually is

A **class** is a blueprint for creating **objects** that bundle together data (called **attributes**) and behavior (called **methods**):

```python
class ScanTarget:
    def __init__(self, ip_address, port):
        self.ip_address = ip_address
        self.port = port
        self.is_open = None

    def check(self):
        # (simplified — a real version would use the socket module from earlier)
        self.is_open = True
        return self.is_open

target = ScanTarget("192.168.1.1", 80)
target.check()
print(f"{target.ip_address}:{target.port} — open: {target.is_open}")
```

`__init__` is a special method that runs automatically when you create a new object, setting up its initial data — here, every `ScanTarget` object starts with an IP address, a port, and an unknown open/closed state.

## Why this matters beyond just "another way to organize code"

The dictionaries lesson showed you how to represent structured data. A class goes one step further: it keeps the data (`ip_address`, `port`, `is_open`) bundled *together with* the specific behavior that operates on that exact data (`check()`), rather than having separate functions that each need the data passed in every time. As a script grows into a genuinely larger tool — scanning many targets, each with its own results — this bundling keeps related code and data organized together instead of scattered across many loosely-connected functions and dictionaries.

## A slightly larger example: multiple targets

```python
class ScanTarget:
    def __init__(self, ip_address, port):
        self.ip_address = ip_address
        self.port = port
        self.is_open = None

    def check(self):
        self.is_open = True   # simplified
        return self.is_open

targets = [
    ScanTarget("192.168.1.1", 80),
    ScanTarget("192.168.1.1", 443),
    ScanTarget("192.168.1.5", 22),
]

for target in targets:
    target.check()
    status = "open" if target.is_open else "closed"
    print(f"{target.ip_address}:{target.port} is {status}")
```

Each `ScanTarget` object independently tracks its own state — this pattern of "one object per real-world thing being tracked" is genuinely how many real security tools (vulnerability scanners, asset inventory tools) are actually structured internally.

:::tip You don't need to master this immediately
Object-oriented programming is a genuinely deep topic, and plenty of useful, working security scripts get written using just functions and dictionaries, the way earlier lessons in this path did. The goal here is recognition — knowing what a class is and roughly why it's useful — so that when you read real-world security tool source code (and you will, constantly, in this field) the pattern looks familiar rather than mysterious.
:::

:::challenge Test yourself
Why might bundling `ip_address`, `port`, and `is_open` together inside a `ScanTarget` class be more organized than tracking the same information using three separate lists (one for IPs, one for ports, one for results)?
<details><summary>Show answer</summary>With three separate lists, you'd need to carefully keep track of which index in each list corresponds to the same target — item 5 in the IP list, item 5 in the port list, and item 5 in the results list would all need to line up correctly, and it's genuinely easy to introduce a bug where one list gets out of sync with the others (say, after sorting one list but not the others). Bundling the related data into a single <code>ScanTarget</code> object keeps everything about one specific target — its address, its port, its result — inherently together as one unit, making it structurally impossible for that specific target's own data to get mismatched with a different target's data, regardless of how the collection of targets gets sorted, filtered, or reordered.</details>
:::

## Key terms

- **Class** — a blueprint for creating objects that bundle data and behavior together.
- **Object** — a specific instance created from a class.
- **`__init__`** — the special method that runs automatically when a new object is created, setting up its initial data.

## Recap

- A class bundles related data (attributes) and behavior (methods) into a single reusable unit, rather than keeping them separate.
- This pattern — one object per real-world thing being tracked — is genuinely how many real security tools are structured internally.
- You don't need to master object-oriented programming to write useful scripts, but recognizing the pattern helps enormously when reading real-world tool source code.

**Next up →** [Writing Secure Python Code](#/lesson/04-python/writing-secure-python-code)
