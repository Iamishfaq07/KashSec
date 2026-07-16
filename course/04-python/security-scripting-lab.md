# Security Scripting Lab

This is the capstone lab for Path 04 — turning everything from variables and loops through to the password checker project into genuinely useful security tools, the same category of small custom scripts referenced throughout Path 03's Advanced Terminal Lab and Path 13's portfolio advice.

## Lab tasks

1. **A URL status checker.** Write a script that reads a list of URLs and reports the HTTP status code for each:
   ```python
   import requests

   with open("urls.txt") as f:
       urls = [line.strip() for line in f]

   for url in urls:
       try:
           r = requests.get(url, timeout=5)
           print(f"{url} -> {r.status_code}")
       except requests.exceptions.RequestException as e:
           print(f"{url} -> ERROR ({e})")
   ```
   This exact pattern — reading a list, trying each item, handling failures gracefully — is the backbone of most real recon automation.
2. **A simple port scanner using `socket`.** No external libraries required — Python's built-in `socket` module is enough for a basic scanner:
   ```python
   import socket

   target = "127.0.0.1"
   for port in range(1, 1025):
       s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
       s.settimeout(0.3)
       result = s.connect_ex((target, port))
       if result == 0:
           print(f"Port {port} is open")
       s.close()
   ```
   Run it against `127.0.0.1` (your own machine) first — never against a target you don't have permission to scan.
3. **Extend your earlier password checker.** Go back to the password-strength checker you built earlier in this path and add one real improvement: check the password against a small list of the most common leaked passwords (several free "top 10,000 passwords" lists exist for exactly this kind of exercise) and flag an immediate fail if it matches, regardless of length/complexity — a genuinely important real-world check, since attackers try these lists first, before any brute-forcing.
4. **Automate something with `requests` and `BeautifulSoup`.** If you have `beautifulsoup4` installed (`pip install beautifulsoup4`), write a small script that fetches a page and extracts every link on it:
   ```python
   import requests
   from bs4 import BeautifulSoup

   r = requests.get("https://example.com")
   soup = BeautifulSoup(r.text, "html.parser")
   for link in soup.find_all("a"):
       print(link.get("href"))
   ```
   This exact technique — fetch, parse, extract — underlies real reconnaissance tools that map out a site's structure automatically.

5. **Multi-threaded port scanning.** Task 2's scanner checks ports one at a time, sequentially — genuinely slow across a wide range. Use Python's `concurrent.futures.ThreadPoolExecutor` to check many ports simultaneously instead:
   ```python
   import socket
   from concurrent.futures import ThreadPoolExecutor

   def check_port(port, target="127.0.0.1"):
       s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
       s.settimeout(0.3)
       if s.connect_ex((target, port)) == 0:
           print(f"Port {port} is open")
       s.close()

   with ThreadPoolExecutor(max_workers=50) as executor:
       executor.map(check_port, range(1, 1025))
   ```
   Time both versions against your own machine and compare — the speed difference is genuinely dramatic, and this exact threading pattern underlies why real tools like Nmap and Nuclei can scan large ranges in a reasonable time.
6. **Add rate limiting to your URL checker.** Revisit Task 1's URL status checker and add a small `time.sleep()` delay between requests, per this path's automation lesson — practice the responsible-automation habit now, on your own small script, before it matters on a real authorized engagement.

:::tip Combine what you've built
Each of these four scripts does one thing well — the real skill, and the direction Path 10's recon pipeline lesson goes next, is chaining small single-purpose tools together into a pipeline, exactly like real tools such as `subfinder → httpx → gau → nuclei` do.
:::

:::challenge Build a combined recon script
Write one script that takes a domain as input, checks whether it responds on port 80 and 443 using your port-scanning knowledge, and — if it does — fetches the page and prints its `<title>` tag using BeautifulSoup. This "open ports + HTTP title" pattern is a genuinely useful, portfolio-worthy mini recon tool, and a great addition to the GitHub portfolio Path 13 recommends building.
:::

## Key takeaway

Every one of these scripts is short — 10 to 20 lines — but each one automates something that would take minutes to do by hand, and minutes saved per target compounds fast once you're testing dozens or hundreds of hosts. This is exactly why scripting ability, even at a modest level, is such a consistent multiplier across every offensive and defensive security role.

**Explore more →** [Path 05 — How the Web Works](#/lesson/05-web-basics)
