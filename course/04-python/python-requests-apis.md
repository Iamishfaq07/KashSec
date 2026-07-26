# Python, requests & APIs

The where-next lesson mentioned the `requests` library in passing. This lesson gets properly hands-on with it — genuinely one of the highest-leverage skills in this entire path, since so much real security tooling (and so much of the modern web, per Path 05) revolves around making HTTP requests programmatically.

## Making your first real request

```python
import requests

response = requests.get("https://example.com")
print(response.status_code)   # 200, 404, 500 — from Path 05's HTTP status codes
print(response.text[:200])     # the first 200 characters of the response body
```

## Working with JSON APIs

Most modern web APIs (covered properly in Path 21's API Security path) exchange data as **JSON**, and `requests` handles the conversion automatically:

```python
response = requests.get("https://api.example.com/users/1")
data = response.json()          # automatically parses JSON into a Python dictionary
print(data["username"])
```

Notice this returns a dictionary — directly connecting to the dictionaries-and-sets lesson earlier in this path, and exactly the shape most real-world API data actually arrives in.

## Sending data: POST requests

```python
payload = {"username": "testuser", "password": "hunter2"}
response = requests.post("https://api.example.com/login", json=payload)
```

## Headers and authentication

```python
headers = {"Authorization": "Bearer your-api-token-here"}
response = requests.get("https://api.example.com/protected", headers=headers)
```

Directly connecting to the secure-Python lesson's warning about hardcoded secrets: that authorization token should come from an environment variable, never hardcoded directly in a script like the example above shows for simplicity.

## A realistic example: checking a list of URLs for a security header

Combining several concepts from across this path — files, loops, error handling, and now requests — into something genuinely useful:

```python
import requests

with open("urls.txt", "r") as f:
    urls = [line.strip() for line in f]

for url in urls:
    try:
        response = requests.get(url, timeout=5)
        if "Content-Security-Policy" not in response.headers:
            print(f"{url}: missing Content-Security-Policy header")
    except requests.exceptions.RequestException:
        print(f"{url}: couldn't connect")
```

This is a genuinely realistic, simplified version of exactly what a security header-checking tool (like the one covered elsewhere in this course) does under the hood — read a list of targets, request each one, check the response for something specific, handle failures gracefully.

:::challenge Test yourself
Why does the realistic example above use `try`/`except` around the `requests.get()` call specifically?
<details><summary>Show answer</summary>Network requests to a list of many different URLs will inevitably encounter some that don't respond, some that are misspelled or no longer exist, and some that time out — exactly the same reasoning the error-handling lesson gave for the port-scanning example earlier in this path. Without the <code>try</code>/<code>except</code>, the very first URL in the list that fails to connect would crash the entire script, meaning every URL after it in the list would never even get checked. Wrapping the risky network call in error handling lets the script skip past a single failed request and continue checking the rest of the list, which is genuinely essential for any script processing a real-world list of targets rather than a short, hand-picked example.</details>
:::

## Key terms

- **requests** — the standard third-party Python library for making HTTP requests.
- **JSON** — the standard data format for most modern web APIs, automatically parsed into a Python dictionary by `response.json()`.

## Recap

- The `requests` library is the standard tool for making HTTP requests from Python, and `response.json()` automatically converts API responses into familiar dictionaries.
- Headers carry authentication tokens and other request metadata — which, per the secure-Python lesson, should come from environment variables rather than hardcoded values.
- Combining requests with files, loops, and error handling produces genuinely realistic security tooling, not just toy examples.

**Next up →** [Python for Network Scripting](#/lesson/04-python/python-for-network-scripting)
