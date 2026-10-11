# Working with files in Python

Every security script you write eventually needs to read a wordlist, parse a log file, or save results somewhere. This lesson covers Python's file-handling basics — directly connecting to the lists-functions lesson's wordlist example and setting up the automation work later in this path.

## Opening and reading a file

```python
with open("wordlist.txt", "r") as f:
    for line in f:
        print(line.strip())   # strip() removes the trailing newline character
```

The `with` statement is the standard, recommended pattern — it automatically closes the file when the block finishes, even if an error occurs partway through, directly connecting to the error-handling lesson's theme of writing code that behaves sensibly when something goes wrong.

## Reading an entire file at once vs. line by line

```python
with open("log.txt", "r") as f:
    contents = f.read()        # entire file as one string
    lines = f.readlines()      # entire file as a list of lines
```

For genuinely large files (a huge log file, a massive wordlist), looping line by line (as in the first example) is generally more memory-efficient than reading everything into memory at once — a small but genuinely important distinction once you're working with realistic file sizes rather than short example files.

## Writing to a file

```python
with open("results.txt", "w") as f:
    f.write("Scan completed successfully.\n")

with open("results.txt", "a") as f:
    f.write("Additional finding logged.\n")   # "a" appends instead of overwriting
```

`"w"` mode overwrites the file entirely if it already exists — a genuinely easy mistake to make accidentally, worth double-checking before running a script against a file you actually care about.

## A realistic example: combining files with the password checker

Directly extending the password-checker lesson later in this path: a genuinely useful upgrade checks a candidate password against a file of known-common, breached passwords rather than just checking length and character variety:

```python
def is_common_password(password, wordlist_file):
    with open(wordlist_file, "r") as f:
        common_passwords = {line.strip() for line in f}   # a set, from the earlier lesson
    return password in common_passwords
```

Notice this combines three concepts from earlier in this path at once: file reading, a set (for fast lookup), and a function — genuinely representative of how real scripts assemble small pieces you already know into something more useful.

:::challenge Test yourself
Why does the example above use a set (`{line.strip() for line in f}`) to store the common passwords, rather than a plain list?
<details><summary>Show answer</summary>Checking whether an item exists in a set is significantly faster than checking a list, especially as the collection grows — a wordlist of common passwords might contain hundreds of thousands of entries, and a set's fast lookup makes checking "is this password in the list?" efficient even at that scale, while a list would require checking each entry one at a time in the worst case. This directly builds on the dictionaries-and-sets lesson's point about reaching for the right built-in data type for the job — here, fast membership checking is exactly what a set is optimized for.</details>
:::

## Key terms

- **`with open(...)`** — the standard, recommended pattern for opening a file, automatically closing it when finished.
- **Read mode ("r") / write mode ("w") / append mode ("a")** — the three most common file access modes in Python.

## Recap

- `with open(...)` is the standard, safe pattern for file handling, automatically closing files even when errors occur.
- Reading line by line is more memory-efficient than loading an entire large file at once.
- "w" mode overwrites a file entirely — a genuinely easy and consequential mistake to make by accident.
- Combining file reading with a set for fast lookup is a realistic, practical pattern you'll use constantly in security scripting.

**Next up →** [Python Modules & Packages](#/lesson/04-python/python-modules-packages)
