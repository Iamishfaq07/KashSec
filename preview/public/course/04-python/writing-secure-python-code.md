# Writing Secure Python Code

Path 03's shell-scripting lesson covered command injection in bash. This lesson covers the same underlying danger, plus a few genuinely Python-specific pitfalls, worth knowing before your scripts start touching real, potentially untrusted data.

## eval() and exec(): Python's version of the same danger

```python
# Dangerous — never do this with untrusted input
user_input = input("Enter a calculation: ")
result = eval(user_input)   # if user_input is "__import__('os').system('rm -rf /')", this runs it
```

`eval()` and `exec()` interpret a string as actual Python code and run it — exactly the same category of danger Path 03's shell-scripting lesson described for bash's `eval`, just in Python instead. If any part of that string comes from outside your own control, you've handed an attacker the ability to run arbitrary code with your script's own privileges.

## Command injection via subprocess

```python
import subprocess

# Dangerous — if filename contains "; rm -rf ~", shell=True executes it too
filename = input("Enter filename: ")
subprocess.run(f"cat {filename}", shell=True)

# Safer — pass arguments as a list, no shell interpretation of the string
subprocess.run(["cat", filename])
```

`shell=True` tells Python to hand your command string to the system shell for interpretation — exactly reintroducing the shell-injection risk Path 03 warned about, now from inside Python. Passing arguments as a list instead avoids the shell interpreting the string at all.

## Hardcoded secrets: the mistake that shows up everywhere

```python
# Dangerous — this credential is now permanently in your script and version history
API_KEY = "sk_live_abc123xyz789"

# Better — read from an environment variable instead
import os
API_KEY = os.environ.get("API_KEY")
```

Directly connecting to Path 08's cloud-cost-billing lesson and Path 22's DevSecOps material: hardcoded credentials in source code are a genuinely leading real-world cause of credential leaks, especially once that code gets committed to a shared or public repository — an environment variable, or a proper secrets manager for anything more serious, keeps the actual secret value out of the code itself entirely.

## Deserializing untrusted data with pickle

```python
import pickle
# Dangerous — pickle.load() can execute arbitrary code embedded in the data
data = pickle.load(untrusted_file)
```

Python's `pickle` module can serialize and deserialize almost any Python object — but deserializing (`load`) data from a source you don't fully trust can execute arbitrary code embedded in that data, a genuinely surprising and serious risk most beginners never expect from what looks like ordinary data loading. For untrusted data, formats like JSON (which can only represent plain data, never executable code) are the safer choice.

:::danger The common thread across every example in this lesson
Every single pitfall here shares the same root cause: **treating untrusted input as if it were trusted code or trusted data.** This is the exact same lesson Path 03 taught for shell scripts and Path 11 will teach for web applications — the specific mechanism differs by language and context, but the underlying principle (never let untrusted input control what your program actually executes) is genuinely universal across this entire course.
:::

:::challenge Test yourself
Why is `subprocess.run(["cat", filename])` meaningfully safer than `subprocess.run(f"cat {filename}", shell=True)`, even though both ultimately run the same `cat` command?
<details><summary>Show answer</summary>With <code>shell=True</code> and a formatted string, the entire string gets handed to the system shell for interpretation — meaning shell special characters embedded in <code>filename</code> (like a semicolon starting a second, separate command) get interpreted and executed by the shell, exactly the command-injection risk covered in Path 03. Passing arguments as a list (<code>["cat", filename]</code>) bypasses shell interpretation entirely — Python passes <code>filename</code>'s exact literal value directly to the <code>cat</code> program as a single argument, with no shell ever getting a chance to reinterpret special characters within it. This is precisely why the list form is the recommended default whenever you're building a command from a variable, especially one that might contain data you don't fully control.</details>
:::

## Key terms

- **eval() / exec()** — Python functions that interpret and run a string as actual code, dangerous with untrusted input.
- **shell=True** — a subprocess option that hands a command string to the system shell for interpretation, reintroducing shell-injection risk.
- **pickle** — Python's object serialization module, unsafe to deserialize from untrusted sources.

## Recap

- `eval()`/`exec()` and `subprocess` with `shell=True` both reintroduce the same command-injection risk Path 03 covered for bash, now inside Python.
- Hardcoded secrets in source code are a leading real-world credential-leak cause — environment variables or a real secrets manager keep secrets out of the code itself.
- `pickle.load()` can execute arbitrary code from untrusted data — use JSON or a similarly safe format for anything you don't fully trust.
- Every pitfall in this lesson shares the same root cause: treating untrusted input as trusted code or data, the same universal lesson this entire course keeps returning to.

**Next up →** [Where to go next with Python](#/lesson/04-python/where-next)
