# Dictionaries & sets

Variables gave you one labelled box at a time. This lesson gives you two more powerful containers: **dictionaries**, which pair a label with a value, and **sets**, which automatically keep every item unique.

## Dictionaries: labelled data, not just numbered

A **list** (which you'll meet properly two lessons from now) accesses items by position — item 0, item 1. A **dictionary** accesses items by a meaningful **key** instead:

```python
user = {
    "username": "admin",
    "login_attempts": 3,
    "is_locked": False
}

print(user["username"])       # admin
user["login_attempts"] += 1   # update a value
```

This is genuinely how a huge amount of real security data actually gets represented in Python — a parsed log entry, a JSON API response (you'll meet this properly in the requests-and-APIs lesson), a configuration file — all naturally map onto dictionaries far more cleanly than a plain numbered list ever could.

## Looping through a dictionary

```python
for key, value in user.items():
    print(f"{key}: {value}")
```

## Sets: automatically unique

A **set** is like a list, but it automatically removes duplicates and doesn't preserve order:

```python
suspicious_ips = {"10.0.0.5", "10.0.0.9", "10.0.0.5"}
print(suspicious_ips)   # {"10.0.0.5", "10.0.0.9"} — the duplicate is gone automatically
```

Sets are genuinely useful in security scripting specifically for exactly this: given a huge log file with a source IP on every line, converting the full list into a set instantly gives you the unique addresses involved, with zero manual duplicate-checking logic required.

```python
all_ips = ["10.0.0.5", "10.0.0.9", "10.0.0.5", "10.0.0.1"]
unique_ips = set(all_ips)
print(len(unique_ips))   # 3 — three distinct addresses appeared
```

:::challenge Test yourself
You have a list of 10,000 IP addresses extracted from a log file, and you want to know how many *distinct* addresses appear. Why is converting the list to a set a faster, simpler solution than writing your own loop to check for duplicates manually?
<details><summary>Show answer</summary>A set's entire job, built directly into the language, is guaranteeing every item it contains is unique — converting a list to a set (<code>set(all_ips)</code>) does in one line exactly what a hand-written duplicate-checking loop would take several lines and much more careful logic to achieve correctly. Sets are also implemented internally for fast lookups, meaning checking "is this item already in the set?" is significantly faster than manually scanning a list every time, which matters when you're working with genuinely large amounts of data like a real log file. This is a good example of a broader Python habit worth building: before writing your own logic for something, check whether a built-in data type already solves the problem more simply.</details>
:::

## Key terms

- **Dictionary** — a collection of key-value pairs, accessed by meaningful key rather than numeric position.
- **Set** — a collection that automatically enforces uniqueness among its items.

## Recap

- Dictionaries pair keys with values, mapping naturally onto real-world security data like log entries and API responses.
- Sets automatically eliminate duplicates, making them genuinely useful for tasks like counting distinct IP addresses in a log.
- Reaching for the right built-in data type often solves a problem more simply than writing custom logic from scratch.

**Next up →** [Decisions with if/else](#/lesson/04-python/if-else)
