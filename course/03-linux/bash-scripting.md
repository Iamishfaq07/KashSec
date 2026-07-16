# Your first bash script

You've learned commands. Now let's chain them into a **script** — a file the shell runs top to bottom. This is the moment "using Linux" becomes "automating Linux," and it's genuinely a superpower.

## What a script is

A **shell script** is a text file containing commands, plus a first line that tells Linux which interpreter should run them. For Bash:

```bash
#!/bin/bash
# This line above is called a "shebang".
echo "Hello from your first script!"
```

Save that as `hello.sh`, make it executable, run it:

```bash
chmod +x hello.sh
./hello.sh
```

That's it — you wrote and ran a script.

## Variables

```bash
name="Ishfaq"
echo "Hi, $name"

count=5
echo "You have $count files"

# Backticks or $() run a command and use its output:
today=$(date +%Y-%m-%d)
echo "Today is $today"

# Prompting for input:
read -p "Enter a target IP: " target
echo "You entered $target"
```

## Conditions

```bash
#!/bin/bash
read -p "Enter a number: " n
if [ "$n" -gt 100 ]; then
    echo "Big number"
elif [ "$n" -gt 10 ]; then
    echo "Medium"
else
    echo "Small"
fi
```

Common test operators:

| Test | Meaning |
|---|---|
| `-eq` / `-ne` | equal / not equal (numbers) |
| `-gt` / `-lt` / `-ge` / `-le` | greater / less / … or equal (numbers) |
| `=` / `!=` | string equal / not equal |
| `-z` | string is empty |
| `-n` | string is non-empty |
| `-f file` | file exists |
| `-d dir` | directory exists |
| `-r`/`-w`/`-x` | readable / writable / executable |

## Loops

```bash
# For each item:
for host in scanme.nmap.org example.com; do
    echo "Pinging $host..."
    ping -c 1 "$host" > /dev/null && echo "up" || echo "down"
done

# Read a file line by line:
while read -r line; do
    echo "Line: $line"
done < hosts.txt

# Classic counter:
for i in {1..10}; do
    echo "Attempt $i"
done
```

## A tiny real security script — port sweep

Here's a script that checks which of a small list of hosts responds on port 80. This is the kind of one-off tool you'll write constantly.

```bash
#!/bin/bash
# port-sweep.sh — quick check port 80 on a hosts file

if [ ! -f "$1" ]; then
    echo "Usage: $0 hosts.txt"
    exit 1
fi

while read -r host; do
    if timeout 2 bash -c "echo > /dev/tcp/$host/80" 2>/dev/null; then
        echo "[+] $host  port 80 open"
    else
        echo "[-] $host  closed/filtered"
    fi
done < "$1"
```

Save, `chmod +x port-sweep.sh`, make a `hosts.txt` with a few names, and run:

```bash
./port-sweep.sh hosts.txt
```

You just built a mini port scanner in ten lines of Bash. This is exactly the kind of throwaway tool professionals write daily.

## Functions

```bash
banner() {
    echo "==============================="
    echo "  $1"
    echo "==============================="
}

banner "Recon starting"
# do stuff
banner "Recon complete"
```

## Exit codes

Every command returns an **exit code**: `0` = success, anything else = failure. The variable `$?` holds the last one.

```bash
ls /nope
echo $?    # non-zero
ls /etc
echo $?    # 0
```

You can combine commands based on success:

```bash
apt update && apt upgrade -y      # run second only if first succeeded
curl -f http://target/ || echo "target unreachable"  # run second only if first failed
```

## Cron — schedule scripts to run themselves

```bash
crontab -e           # edit your scheduled jobs
```

A line like this runs `recon.sh` every day at 3am:

```
0 3 * * * /home/kali/recon.sh >> /home/kali/recon.log 2>&1
```

Format: `minute hour day-of-month month day-of-week command`. In Path 10 you'll use cron to keep bug-bounty recon fresh while you sleep.

## Best practices worth adopting now

```bash
#!/bin/bash
set -euo pipefail
# -e  → exit on any error
# -u  → treat unset variables as error
# -o pipefail → catch errors mid-pipeline

# Always quote your variables:
mv "$file" "$destination"

# Store constants at the top:
readonly TARGET="scanme.nmap.org"
readonly OUTDIR="/tmp/scan"

# Use meaningful names, not one-letter globals.
```

Following even half of these makes your scripts vastly more robust — and identifiable as "written by someone who knows Bash."

## When Bash isn't enough

Bash is perfect for glue and quick automation. When your script grows past ~100 lines, has complex data structures, or needs proper testing — switch to **Python** (that's Path 04). The rule of thumb: *if it needs a data structure more complex than "list of strings," reach for Python.*

## 🧪 Lab — A recon skeleton

Build this script — you'll extend it in Paths 09 and 10:

```bash
#!/bin/bash
# recon.sh — very small recon skeleton

set -euo pipefail

if [ $# -ne 1 ]; then
    echo "Usage: $0 <target-domain>"
    exit 1
fi

target=$1
outdir="./recon-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$outdir"

echo "[*] Recon on $target"
echo "[*] Output → $outdir"

# Basic DNS
echo "[*] DNS lookups..."
dig "$target" +short           > "$outdir/dns-a.txt" 2>&1
dig "$target" MX +short        > "$outdir/dns-mx.txt" 2>&1
dig "$target" TXT +short       > "$outdir/dns-txt.txt" 2>&1

# HTTP probe
echo "[*] HTTP probes..."
curl -sI "http://$target"   > "$outdir/http-headers.txt"  2>&1 || true
curl -sI "https://$target"  > "$outdir/https-headers.txt" 2>&1 || true

echo "[+] Done. See $outdir/"
```

Run it: `./recon.sh example.com`. Explore the folder it produces. You've written a real starter recon tool.

:::challenge Test yourself
What does the shebang line `#!/bin/bash` do at the top of a script?

<details><summary>Show answer</summary>Tells the system which interpreter to use for the rest of the file — in this case, Bash. Without it, the script may be run by whichever shell you happen to have, which can behave differently.</details>
:::

## Key terms

- **Shebang** — `#!` line naming the interpreter.
- **Variable / interpolation** — `x=1`, `$x`.
- **Condition / loop / function** — the building blocks of any script.
- **Exit code** — `0` success, non-zero failure.
- **cron / crontab** — schedule scripts to run automatically.
- **`set -euo pipefail`** — safer-scripts starter kit.

## Recap

- A script is a text file of commands starting with a shebang.
- Variables, conditions, loops, functions — Bash has all the essentials for glue work.
- Combine commands with `&&` and `||` for flow control.
- Cron schedules scripts to run themselves — huge for automation.
- Beyond ~100 lines or complex data, switch to Python (Path 04).

???refs
- [Bash cheat sheet — Devhints](https://devhints.io/bash) — printable one-pager.
- [Advanced Bash-Scripting Guide (TLDP)](https://tldp.org/LDP/abs/html/) — encyclopedic reference.
- [ShellCheck](https://www.shellcheck.net/) — paste any Bash script; it points out bugs and bad practice. Life-changing.
- [Google's Shell Style Guide](https://google.github.io/styleguide/shellguide.html) — a good template for professional habits.
???

## 🎉 You've finished Path 03

You now know what an OS is, how Windows/Linux/macOS differ, why security lives on Linux, how to build a lab with VirtualBox and Kali, the terminal, filesystem navigation, permissions and sudo, and how to write real Bash scripts. This is a huge foundation — most beginners never get this far.

**Next up →** [Advanced Terminal Lab](#/lesson/03-linux/advanced-terminal-lab)
