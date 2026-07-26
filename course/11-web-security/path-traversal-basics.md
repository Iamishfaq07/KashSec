# Path Traversal Basics

Web recon showed you how to map out an application's structure. This lesson covers one of the simplest, most classic vulnerabilities you'll find once you have that map — one that exploits nothing more sophisticated than a filesystem path.

## What path traversal actually is

**Path traversal** (also called directory traversal) exploits an application that builds a file path from user input without properly sanitizing it, letting an attacker navigate *outside* the intended directory using `../` sequences:

```
GET /download?file=report.pdf HTTP/1.1
```

If the server naively builds a file path like `/var/www/uploads/report.pdf`, an attacker can potentially request:

```
GET /download?file=../../../../etc/passwd HTTP/1.1
```

Directly connecting to Path 03's filesystem-hierarchy lesson: `../` means "go up one directory level" — stacking several of these can walk all the way from an intended upload folder back to the filesystem root, then down into sensitive system files like `/etc/passwd`.

## Why this remains a real, recurring vulnerability

Despite being a genuinely old, well-understood attack, path traversal keeps appearing in real applications because file-handling code is written in countless different places, each needing its own careful sanitization — a single unvalidated file-path parameter anywhere in a large application is enough.

## Common bypass techniques worth recognizing

- **URL encoding** — `%2e%2e%2f` decodes to `../`, sometimes bypassing naive filters checking for the literal string
- **Double encoding** — `%252e%252e%252f`, useful against filters that only decode once
- **Null byte injection** (largely historical, but worth recognizing) — older systems sometimes truncated a string at a null byte, letting an attacker append `%00` to bypass an extension check
- **Absolute paths** — some vulnerable implementations accept a full path like `/etc/passwd` directly, with no traversal sequence needed at all

## The defense: never trust user input for filesystem operations

- **Never build a file path directly from user input** — instead, use an internal identifier (a database ID, a UUID) that maps to a real file path only on the server side, never trusting the client to specify the actual path
- **Canonicalize and validate** — resolve the requested path to its absolute form and verify it still falls within the intended directory before using it
- **Least privilege at the OS level** (Path 03's users-permissions lesson) — the web server process itself shouldn't have read access to sensitive files like `/etc/shadow` in the first place, providing a defense-in-depth backstop even if the application-level validation fails

:::challenge Test yourself
Why is mapping user-supplied filenames to an internal database ID a stronger defense than trying to filter out `../` sequences from the input directly?
<details><summary>Show answer</summary>Filtering for <code>../</code> specifically is a blocklist approach, and blocklists are notoriously incomplete — URL encoding, double encoding, and other bypass techniques (all covered in this lesson) exist specifically because attackers keep finding new ways to represent the same traversal sequence that a naive filter didn't anticipate. Mapping user input to an internal ID instead removes the entire attack surface structurally: the actual file path is never derived from anything the client supplies at all, meaning there's no traversal sequence, however cleverly encoded, that could possibly reach a file outside the intended directory — the server simply never asks "what does this user-supplied string resolve to on disk" in the first place.</details>
:::

## Key terms

- **Path traversal (directory traversal)** — exploiting unsanitized file paths to access files outside an intended directory.
- **Canonicalization** — resolving a path to its absolute, fully-normalized form before validating it.

## Recap

- Path traversal exploits `../` sequences (and various encoded variants) to escape an intended directory and reach sensitive files elsewhere on the filesystem.
- This remains a real, recurring vulnerability precisely because file-handling code appears in many different places throughout an application, each needing its own careful validation.
- The strongest defense avoids the problem structurally — mapping user input to an internal identifier rather than trusting any client-supplied path at all.

**Next up →** [IDOR — Broken Access Control](#/lesson/11-web-security/idor)
