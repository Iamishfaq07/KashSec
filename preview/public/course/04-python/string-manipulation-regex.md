# String manipulation & regex

Your first Python program worked with plain text. This lesson goes deeper into manipulating strings — and introduces **regular expressions**, the pattern-matching tool that shows up constantly throughout log analysis, input validation, and security tooling generally.

## String methods you'll use constantly

```python
line = "  Failed login from 10.0.0.5  "

line.strip()            # remove leading/trailing whitespace
line.lower()             # convert to lowercase — useful before comparing strings
line.split()              # split into a list of words
"10.0.0.5" in line        # check whether a substring is present
line.replace("Failed", "Blocked")   # find-and-replace
```

## f-strings: building strings from variables

You've already seen `f"Checking port {port}..."` in earlier lessons — this is an **f-string**, letting you embed variables directly inside a string, genuinely the standard, readable way to build formatted output in modern Python.

## Regular expressions: pattern matching for text

A **regular expression (regex)** describes a *pattern* a piece of text might match, rather than an exact string to search for — exactly the same underlying concept behind the regex-tester tool elsewhere in this course, now available directly inside your own Python scripts:

```python
import re

log_line = "Failed login from 192.168.1.45 at 03:14:22"

match = re.search(r"\d+\.\d+\.\d+\.\d+", log_line)
if match:
    print(f"Found IP: {match.group()}")
```

`\d+\.\d+\.\d+\.\d+` reads as "one or more digits, a literal dot, one or more digits, a literal dot..." — a pattern matching the general shape of an IPv4 address (from Path 02), regardless of the specific numbers involved.

## Common regex building blocks worth recognizing

| Pattern | Matches |
|---|---|
| `\d` | any digit |
| `\w` | any letter, digit, or underscore |
| `+` | one or more of the previous thing |
| `*` | zero or more of the previous thing |
| `.` | any single character |
| `^` / `$` | start / end of the string |

## Why this matters directly for security work

Extracting IP addresses from log files, validating that user input matches an expected format (a password-complexity check, an email format), and searching through large amounts of unstructured text for a specific pattern are all genuinely everyday security-scripting tasks, and regex is the standard tool for all three — directly extending the text-processing toolkit (`grep`, `sed`, `awk`) from Path 03 into Python itself.

:::challenge Test yourself
Why is a regex pattern like `\d+\.\d+\.\d+\.\d+` more useful for finding IP addresses in a log file than searching for one exact, specific IP address string?
<details><summary>Show answer</summary>Searching for one exact string only finds that <em>one specific</em> IP address, which is rarely the actual goal — a real log file contains many different IP addresses, and you generally want to find <em>any</em> text matching the general shape of an IP address, not one you already know in advance. A regex pattern describes that general shape (digits, a dot, digits, a dot, and so on) rather than a specific value, letting <code>re.search()</code> or <code>re.findall()</code> locate every IP-shaped string in the text regardless of its actual numbers — exactly the flexibility that makes regex genuinely essential for real-world log analysis and input validation, where you rarely know the exact value you're looking for in advance.</details>
:::

## Key terms

- **f-string** — Python's syntax for embedding variables directly inside a string.
- **Regular expression (regex)** — a pattern describing the general shape of text to match, rather than an exact string.

## Recap

- String methods (`strip`, `lower`, `split`, `replace`) and f-strings handle everyday text manipulation.
- Regular expressions describe a general text pattern rather than an exact value, letting you find or validate text whose exact content you don't know in advance.
- This is exactly the tool behind extracting data from log files, validating input formats, and countless other everyday security-scripting tasks.

**Next up →** [Lists & functions](#/lesson/04-python/lists-functions)
