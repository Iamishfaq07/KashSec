# Files, folders & organizing yourself

This lesson looks basic — and it is — but skipping it is one of the most common reasons beginners get stuck later in this course. Nearly every hands-on lab from here on involves navigating folders, running scripts from the right location, and finding files by their path. Get comfortable with this now and everything downstream gets easier.

## The core building blocks

- **File** — a single unit of data: a document, a photo, a script, a video. Every file has a **name** and usually an **extension** (the part after the dot, like `.txt`, `.jpg`, `.py`) that hints at what type of file it is and which program should open it.
- **Folder (directory)** — a container that holds files and other folders, used purely for organization. Folders can be nested inside other folders, forming a tree.
- **Path** — the full "address" of a file or folder, describing exactly where it lives in that tree.

```mermaid
flowchart TD
    Root["/ (root)"] --> Home["Users/you"]
    Home --> Docs["Documents"]
    Home --> Down["Downloads"]
    Docs --> Notes["MySecurityNotes/"]
    Notes --> File1["passwords-policy.txt"]
    Notes --> File2["phishing-examples.png"]
```

## Absolute vs. relative paths

There are two ways to describe where a file lives:

- **Absolute path** — the full address starting from the very top (the "root"). On Windows: `C:\Users\You\Documents\MySecurityNotes\notes.txt`. On macOS/Linux: `/Users/you/Documents/MySecurityNotes/notes.txt`.
- **Relative path** — the address *relative to where you currently are*. If you're already inside the `Documents` folder, you could just refer to `MySecurityNotes/notes.txt`.

You'll see both constantly once you start using the command line (covered in depth in Path 03 — Linux & Operating Systems), and understanding the difference now will save you real confusion later.

## Hidden files — more relevant to security than you'd think

Most operating systems hide certain files by default — usually configuration files that regular users don't need to touch. On macOS/Linux, any file starting with a dot (like `.bashrc` or `.ssh`) is hidden by default. This matters in security because:

- Attackers sometimes hide malicious files by naming them like normal hidden system files, hoping you won't look closely.
- Sensitive configuration — like saved passwords for tools, API keys, or SSH credentials — often lives in these hidden files, which is exactly why they're a common target once an attacker gains access to a machine.

:::tip
On Windows, show hidden files via File Explorer → View → check "Hidden items." On macOS, press `Cmd + Shift + .` inside Finder. On Linux, run `ls -a` in a terminal. You'll be surprised how much lives in those "hidden" folders.
:::

## File extensions can lie

An extension is just a *hint*, not a guarantee, about what a file actually is — the operating system mostly trusts it, and so does the human looking at it. Attackers exploit this constantly:

:::danger Double extensions and disguised malware
A file named `invoice.pdf.exe` might display with just a PDF icon on a system configured to hide "known" extensions — tricking a victim into thinking they're opening a harmless PDF when they're actually launching an executable program. Always be suspicious of unexpected attachments, and configure your OS to always show full file extensions (Windows: File Explorer → View → check "File name extensions").
:::

## 🧪 Hands-on lab — build your own organized structure

1. Create a new top-level folder called `MySecurityNotes` somewhere convenient (like your Documents folder).
2. Inside it, create three subfolders: `labs`, `notes`, and `certificates`.
3. Move (or copy) any files you've downloaded from this course so far into the appropriate subfolder.
4. Turn on hidden files (see the tip above) and spend two minutes just looking around your own system's hidden folders — don't change anything, just observe. Notice how many configuration files exist that you never knew about.
5. Turn on "always show file extensions" if it isn't already (see the danger box above) — this is a genuinely useful permanent security habit, not just a one-time lab step.

:::challenge Test yourself
Why is "always show file extensions" considered a security best practice, rather than just a cosmetic preference?
<details><summary>Show answer</summary>When extensions are hidden, an attacker can name a malicious executable something like <code>photo.jpg.exe</code>, and depending on OS settings, it may display to the victim as simply <code>photo.jpg</code> with an image-like icon — hiding the fact that it's actually a runnable program. Showing full extensions removes that disguise: you'd immediately see <code>photo.jpg.exe</code> and recognize it as suspicious. It's a small setting that closes off an entire category of social-engineering trick.</details>
:::

## Key terms

- **File** — a single unit of stored data, identified by a name and extension.
- **Folder / directory** — a container for organizing files and other folders.
- **Path** — the full address describing where a file or folder lives.
- **Absolute path** — a path from the very top of the file system.
- **Relative path** — a path relative to your current location.
- **Hidden file** — a file not shown by default, often used for configuration.

## Recap

- Files and folders form a tree structure, navigated via paths — absolute (from the root) or relative (from where you are).
- Hidden files are common on every OS and often hold sensitive configuration data.
- File extensions are just hints an attacker can fake — always show full extensions and stay suspicious of unexpected attachments.
- Getting comfortable navigating folders now pays off immediately once you reach the command-line labs later in this course.

???refs
- [Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html) — the official spec for how Linux organizes its folder structure (useful reference for Path 03).
???

**Next up →** [Passwords & accounts basics](#/lesson/00-fresher-basics/passwords-accounts)
