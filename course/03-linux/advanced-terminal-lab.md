# Advanced Terminal Lab

The earlier lessons in this path got you comfortable navigating and running basic commands. This lab pushes into the terminal skills that separate someone who *can* use Linux from someone who's genuinely fast and capable in it — text processing, scripting, and persistent sessions.

## Tasks

1. **Process logs with grep, awk, and sed.** Download or create a sample log file (any web server access log format works well) and practice:
   ```bash
   grep "404" access.log                         # find all 404 errors
   awk '{print $1}' access.log | sort | uniq -c   # count requests per IP
   sed 's/GET/REQUEST/g' access.log               # find-and-replace across the file
   ```
   These three tools, chained together, are the backbone of fast command-line log analysis — genuinely used daily in real security and DevOps work, not just a classroom exercise.
2. **Write a bash script that automates something real.** A simple example: a script that pings a list of hosts and reports which are up.
   ```bash
   #!/bin/bash
   while read host; do
     if ping -c 1 -W 1 "$host" &> /dev/null; then
       echo "$host is UP"
     else
       echo "$host is DOWN"
     fi
   done < hosts.txt
   ```
   Save it, run `chmod +x script.sh`, and execute it against a small text file of hostnames.
3. **Practice pipes and redirection deliberately.** Chain at least three commands together with `|`, and practice all three redirection operators: `>` (overwrite a file), `>>` (append to a file), and `2>` (redirect only error output) — e.g., `nmap -p 1-1000 target 2> errors.log | tee results.txt`.
4. **Use tmux for persistent sessions.** Start a `tmux` session, split it into two panes (`Ctrl+B` then `"`), run a long-running command in one, detach (`Ctrl+B` then `D`), and reattach later with `tmux attach` — this is exactly how real remote work sessions survive SSH disconnections, essential once you're regularly working against remote lab machines.
5. **Master `xargs` for chaining find results into actions.** `find` locates files, but `xargs` is how you efficiently act on large result sets: `find . -name "*.txt" | xargs grep -l "password"` runs `grep` against every matched file in one efficient batch, rather than requiring a slower loop. Compare its speed and simplicity against writing the equivalent as a `for` loop over `find`'s output.
6. **Combine `watch` with a status command.** Run `watch -n 2 'ss -tulnp'` to see your machine's open ports refresh automatically every 2 seconds — genuinely useful for observing a service starting up, or watching a target's exposed ports change in real time during a lab exercise.

:::tip Building your own tools starts exactly here
Every custom recon/automation tool referenced throughout this course (Path 13's portfolio lesson specifically recommends building one) starts as exactly this: a handful of standard Unix tools chained together in a small script. You don't need to learn a "real" programming language first — Path 04 covers Python next, but a huge amount of genuinely useful security tooling is just well-composed bash.
:::

:::challenge Build a custom recon script
Write a bash script that combines at least 3 different tools/commands (e.g., `whois`, `dig`, `curl`, `nmap`) against a target you provide as an argument, and saves the combined output to a neatly organized file or set of files. This is a legitimate, portfolio-worthy first project — consider keeping and refining it as you progress through later paths.
:::

## Key takeaway

Fluency in `grep`/`awk`/`sed`, comfortable pipe-and-redirect chaining, and persistent sessions via `tmux` are what separate "I can technically use a terminal" from genuinely fast, professional command-line work — and every one of these skills compounds directly into the automation and scripting covered next in Path 04.

**Next up →** [Linux Forensics Basics Lab](#/lesson/03-linux/linux-forensics-lab)
