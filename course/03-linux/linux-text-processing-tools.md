# Text Processing Tools: Beyond grep

The files-and-folders lesson called `grep` "gold" — and it is. This lesson introduces the rest of the toolkit that, combined with `grep`, lets you slice, transform, and summarize text data on the command line without ever opening a text editor.

## sed: find and replace, at scale

**`sed`** (stream editor) applies text transformations to every line of input, most commonly for find-and-replace:

```bash
sed 's/old-text/new-text/' file.txt      # replace first match per line
sed 's/old-text/new-text/g' file.txt     # replace every match per line
```

Genuinely useful for quickly fixing a config file across many lines, or transforming log output into a more readable format before further analysis.

## awk: column-aware text processing

**`awk`** treats each line of input as a set of columns (fields), letting you extract, filter, or reformat based on column position — extremely useful for structured text like `/etc/passwd` or command output:

```bash
awk -F: '{print $1}' /etc/passwd    # print just the username column
awk '{print $1, $NF}' file.txt      # print first and last column of each line
```

## cut and sort: simpler, complementary tools

- **`cut`** — a lighter-weight alternative to `awk` for simple column extraction: `cut -d: -f1 /etc/passwd` does the same username extraction as the `awk` example above
- **`sort`** — sorts lines alphabetically or numerically (`sort -n` for numeric sort), commonly chained after other commands to organize output

## Chaining it all together with pipes

The bash-scripting lesson (later in this path) covers pipes properly, but the real power of this lesson's tools comes from combining them:

```bash
cat /var/log/auth.log | grep "Failed password" | awk '{print $11}' | sort | uniq -c | sort -rn
```

This one chained command — find failed login attempts, extract the source IP, then count and rank how often each IP appears — is a genuinely realistic example of the kind of quick command-line log analysis this course's incident-response and log-analysis material (Path 16) builds on directly.

:::tip
You don't need to memorize every flag for every tool right now. What matters is recognizing that grep, sed, awk, cut, sort, and uniq form a genuinely composable toolkit — each does one thing well, and chaining them together with pipes lets you build surprisingly sophisticated analysis without writing a full script.
:::

:::challenge Test yourself
Why is `awk -F: '{print $1}' /etc/passwd` a more precise tool for extracting just usernames than a simple `grep` command would be?
<details><summary>Show answer</summary><code>grep</code> is built for finding lines matching a pattern — it has no built-in concept of columns or fields, so it can't cleanly extract "just the first piece of each line" without much clumsier pattern-matching. <code>awk</code>, by contrast, is specifically built to treat each line as a set of fields separated by a delimiter (here, <code>:</code>, since that's how <code>/etc/passwd</code> is structured) — <code>$1</code> then directly and reliably refers to the first field (the username) regardless of what appears in the rest of the line. This is exactly why each tool in this lesson exists separately rather than one tool trying to do everything: grep excels at finding matching lines, awk excels at working with structured columns within those lines.</details>
:::

## Key terms

- **sed** — a stream editor for line-by-line text transformation, most commonly find-and-replace.
- **awk** — a column-aware text processing tool for extracting or reformatting structured text.
- **Pipe (`|`)** — chains the output of one command directly into the input of the next.

## Recap

- `sed` handles find-and-replace transformations; `awk` handles column-aware extraction and reformatting; `cut` and `sort` handle simpler, complementary tasks.
- Chaining these tools together with pipes is what turns a handful of simple, single-purpose commands into genuinely sophisticated on-the-fly text and log analysis.
- This exact composable-toolkit approach is what the log-analysis and incident-response material later in this course builds directly on.

**Next up →** [Users, permissions & sudo](#/lesson/03-linux/users-permissions)
