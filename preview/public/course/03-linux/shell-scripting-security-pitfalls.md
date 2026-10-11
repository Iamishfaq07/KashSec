# Shell Scripting Security Pitfalls

The bash-scripting lesson taught you to write your first automation. This lesson covers the mistakes that turn a convenient script into a genuine vulnerability — the shell-scripting equivalent of Path 11's SQL injection material, applied to the command line instead of a web form.

## Command injection: the shell's version of SQL injection

Just as Path 11 will cover SQL injection (untrusted input getting interpreted as database commands instead of pure data), a shell script that builds a command by directly concatenating unvalidated input is vulnerable to **command injection**:

```bash
# Dangerous: if $filename contains "; rm -rf /", this executes it too
eval "cat $filename"

# Also dangerous, for the same underlying reason
bash -c "process_file $user_input"
```

If `$filename` or `$user_input` comes from anywhere an attacker could influence — a web form passing data to a backend script, a filename uploaded by a user — an attacker can potentially inject entirely different, arbitrary commands that the shell will happily execute alongside (or instead of) the intended one.

## Unquoted variables: a smaller mistake with real consequences

```bash
# Dangerous: word-splitting and glob expansion can break this in surprising ways
if [ $filename = "test.txt" ]; then

# Safer: quoting prevents the shell from reinterpreting spaces or special characters
if [ "$filename" = "test.txt" ]; then
```

Failing to quote variables is a genuinely common source of both ordinary bugs *and* security issues — an unquoted variable containing spaces, wildcards, or special shell characters can behave in ways the script's author never intended, sometimes exploitably.

## Trusting input from files or environment variables

Scripts frequently read configuration from files or environment variables without validating them — but anything a script trusts implicitly is a potential injection point if an attacker can influence that source, directly connecting to the input-validation principle covered throughout Path 11's web security material, just applied here to the shell instead of a web request.

## Running scripts as root unnecessarily

Exactly extending the least-privilege principle from the users-permissions and process-management lessons: a script that only needs to read a log file shouldn't be run with `sudo` out of habit or convenience — every unnecessary privilege a script runs with is additional potential damage if that script (or something it calls) turns out to be exploitable.

:::danger A real, minimal example worth internalizing
```bash
#!/bin/bash
filename=$1
eval "cat $filename"
```
Run as `./script.sh "test.txt; rm -rf ~"`, this script doesn't just display `test.txt` — the semicolon breaks out of the intended command entirely, and `rm -rf ~` executes as a completely separate, attacker-controlled command. This exact pattern — building a command string from unvalidated input and handing it to `eval` or a similar interpreter — is responsible for a genuinely large share of real-world shell scripting vulnerabilities.
:::

## Practical defenses

- **Quote every variable**, as a near-universal default habit, not just where you think it matters
- **Avoid `eval` entirely wherever possible** — it's specifically designed to interpret a string as a command, which is exactly the dangerous behavior this lesson has been describing
- **Validate and sanitize any input from outside the script's own control** — user input, file contents, environment variables — before using it in any command
- **Run scripts with the minimum privilege they actually need**, never `sudo` by default habit

:::challenge Test yourself
Why does quoting a variable like `"$filename"` meaningfully reduce security risk, beyond just preventing ordinary bugs?
<details><summary>Show answer</summary>Without quotes, the shell performs word-splitting (breaking a value into multiple separate words wherever spaces appear) and glob expansion (interpreting characters like <code>*</code> as wildcards) on a variable's contents before your script's logic ever sees it — meaning a value containing spaces, semicolons, or wildcard characters can be reinterpreted by the shell in ways the script's author never intended, sometimes letting an attacker smuggle extra commands or unexpected arguments through what was meant to be a single, simple value. Quoting the variable tells the shell to treat its entire contents as one literal string, exactly as written, closing off this entire category of unintended reinterpretation — a small habit that closes a genuinely real vulnerability class.</details>
:::

## Key terms

- **Command injection** — untrusted input being interpreted as executable shell commands rather than pure data.
- **Word-splitting** — the shell's default behavior of breaking an unquoted variable's value into multiple separate words at spaces.
- **eval** — a shell builtin that interprets a string as a command, a common source of injection vulnerabilities when combined with untrusted input.

## Recap

- Command injection is the shell scripting equivalent of SQL injection — untrusted input getting executed as commands rather than treated as pure data.
- Quoting variables, avoiding `eval` with untrusted input, validating external input, and running scripts with minimum necessary privilege are the practical defenses.
- These same input-validation principles reappear throughout this course, from Path 11's web injection attacks to Path 21's API security material — the underlying lesson (never trust unvalidated input) is genuinely universal.

**Next up →** [Linux Hardening Checklist](#/lesson/03-linux/linux-hardening-checklist)
