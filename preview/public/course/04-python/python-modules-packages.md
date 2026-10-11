# Python modules & packages

Everything you've written so far has lived in one file, using only Python's built-in features. This lesson covers **modules** — how to organize and reuse your own code — and **packages** — how to use code other people have already written, both essential for any real-world Python security tool.

## Built-in modules: Python's own toolkit

Python ships with a large standard library, organized into **modules** you `import` as needed:

```python
import random
print(random.randint(1, 100))    # a random number between 1 and 100

import datetime
print(datetime.datetime.now())    # the current date and time
```

You'll meet several security-relevant standard modules directly — `socket` (already used in the error-handling lesson), `hashlib`, and `re` (from the string-manipulation lesson) — throughout the rest of this path.

## Third-party packages: code the community has already written

Beyond Python's built-in modules, an enormous ecosystem of third-party packages exists for nearly any task imaginable, installed using **pip**, Python's package installer:

```bash
pip install requests
```

```python
import requests
response = requests.get("https://example.com")
print(response.status_code)
```

The `requests` library (covered properly in this path's requests-and-APIs lesson) is genuinely one of the most widely used Python packages in existence, precisely because making HTTP requests by hand using only built-in modules is considerably more tedious.

## Virtual environments: keeping projects isolated

A **virtual environment** creates an isolated Python installation for a specific project, so different projects can use different (even conflicting) package versions without interfering with each other:

```bash
python3 -m venv myproject-env
source myproject-env/bin/activate    # Linux/Mac, from Path 03
myproject-env\Scripts\activate       # Windows
pip install requests
```

:::tip Why this matters more than it might seem
Without virtual environments, installing a package for one project can silently break a different project relying on an older, incompatible version of that same package. This is a genuinely common, entirely avoidable source of "it worked yesterday" frustration — creating a dedicated virtual environment per project is a small habit that prevents it entirely.
:::

## Organizing your own code into modules

As scripts grow beyond a single file, you can split your own code into separate files and import between them, exactly like a built-in module:

```python
# helpers.py
def is_valid_ip(address):
    parts = address.split(".")
    return len(parts) == 4

# main.py
from helpers import is_valid_ip
print(is_valid_ip("192.168.1.1"))
```

:::challenge Test yourself
Why might two different Python projects on the same machine need genuinely different, even conflicting versions of the same third-party package?
<details><summary>Show answer</summary>Software projects are frequently built and tested against a specific version of a dependency, and a newer version of that same package can sometimes introduce changes that break code written for the older version — meaning a project written a year ago might genuinely require an older package version to keep working correctly, while a brand-new project might require the latest version to access a feature that didn't exist before. Without virtual environments, installing the version one project needs can silently break the other project relying on a different version, since there'd only be one shared, global installation of that package on the entire machine. A virtual environment solves this by giving each project its own genuinely isolated set of installed packages, entirely independent of any other project's requirements.</details>
:::

## Key terms

- **Module** — a file containing reusable Python code, imported with `import`.
- **pip** — Python's standard package installer for third-party libraries.
- **Virtual environment** — an isolated Python installation, keeping one project's package versions independent of others.

## Recap

- Python's built-in modules and the third-party package ecosystem (installed via `pip`) provide an enormous amount of ready-made functionality you don't need to build yourself.
- Virtual environments keep each project's dependencies isolated, preventing one project's package requirements from silently breaking another's.
- Splitting your own growing scripts into separate, importable files applies the same modular organization to code you write yourself.

**Next up →** [Build a password checker](#/lesson/04-python/password-checker)
