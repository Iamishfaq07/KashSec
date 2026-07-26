# Error handling & exceptions

Every program you've written so far has assumed everything goes right. Real programs — especially security tools reaching out to real networks and real files — constantly encounter things going wrong. This lesson covers handling that gracefully instead of crashing.

## What happens when Python hits an error

When something goes wrong — a file that doesn't exist, a network connection that times out, dividing by zero — Python raises an **exception**, and without any handling, your entire program stops immediately:

```python
port = int(input("Enter a port number: "))   # if the user types "abc", this crashes
```

## try/except: catching the problem instead of crashing

```python
try:
    port = int(input("Enter a port number: "))
    print(f"Checking port {port}...")
except ValueError:
    print("That's not a valid number. Try again.")
```

The `try` block contains code that might fail; the `except` block runs only if it actually does, letting your program respond sensibly instead of dying immediately.

## Why this matters especially for security scripts

Recall the loops lesson's port-checking example. A real port scanner reaching out to hundreds of addresses will inevitably hit some that don't respond, some that actively refuse the connection, and some that time out entirely — without error handling, the very first one of these would crash the entire scan:

```python
import socket

targets = ["192.168.1.1", "192.168.1.99", "10.0.0.5"]
for ip in targets:
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        sock.connect((ip, 80))
        print(f"{ip}: port 80 is open")
        sock.close()
    except (socket.timeout, ConnectionRefusedError):
        print(f"{ip}: port 80 is closed or unreachable")
```

This exact pattern — try the risky operation, catch the specific failures you expect, keep going — is what turns a fragile script that dies on the first hiccup into a genuinely usable tool.

## Catching specific exceptions, not everything blindly

```python
# Too broad — silently hides bugs you'd genuinely want to know about
try:
    risky_operation()
except:
    pass

# Better — catch specifically what you expect, let genuine surprises surface
try:
    risky_operation()
except ConnectionError:
    print("Network issue, skipping this target.")
```

Catching every possible exception with a bare `except:` is a genuinely common beginner mistake — it silently swallows real bugs along with the errors you actually expected, making problems far harder to diagnose later. Catching specific exception types keeps your error handling honest about what you actually anticipated.

:::challenge Test yourself
Why is `except:` (catching everything) considered worse practice than `except ConnectionError:` (catching something specific), even though both technically "handle" errors?
<details><summary>Show answer</summary>A bare <code>except:</code> catches every possible error, including genuine bugs in your own code that have nothing to do with the specific risky operation you were trying to handle — a typo in a variable name, a logic error, anything at all gets silently swallowed and hidden, making it far harder to notice and fix real problems in your script. Catching a specific exception type like <code>ConnectionError</code> only handles the exact failure mode you actually anticipated and know how to respond to sensibly, while letting genuinely unexpected errors surface loudly so you can actually see and fix them, rather than having your script silently misbehave with no indication anything went wrong at all.</details>
:::

## Key terms

- **Exception** — an error Python raises when something goes wrong during execution.
- **try/except** — the structure for attempting risky code and handling specific failures gracefully.

## Recap

- Without error handling, any unexpected failure crashes your entire program immediately.
- `try`/`except` lets a script attempt something risky and respond sensibly if it fails, rather than dying — essential for any script that touches real networks or files.
- Catching specific exception types, rather than everything blindly, keeps your error handling honest and real bugs visible.

**Next up →** [Why Python for security](#/lesson/04-python/why-python)
