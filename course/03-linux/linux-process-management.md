# Linux Process Management

Every running program on a Linux system is a **process**, and understanding how to inspect, monitor, and control processes from the command line is exactly the Linux-side counterpart to Path 07's Windows Task Manager and services coverage.

## Viewing what's actually running

```bash
ps aux              # snapshot of every running process
top                 # live, continuously updating process view
htop                # a more readable, interactive version of top (if installed)
```

Each process has a **PID** (Process ID) — a unique number identifying it, which you'll use constantly to inspect or control a specific process directly.

## Reading `ps aux` output

```
USER   PID  %CPU  %MEM  COMMAND
root     1   0.0   0.1  /sbin/init
kali  4821  12.3   2.1  /usr/bin/firefox
```

- **USER** — which account the process is running as, directly connecting to the users-permissions lesson's least-privilege principle: a process running as `root` has far more potential impact if compromised than one running as a limited user
- **%CPU / %MEM** — resource usage, useful both for troubleshooting and for spotting the kind of unusual resource consumption Path 07's compromise-recognition lesson described as a real indicator on Windows — the exact same signal matters on Linux too

## Killing a misbehaving or malicious process

```bash
kill <PID>          # politely ask a process to terminate
kill -9 <PID>        # forcefully terminate it immediately
```

`kill` despite the name usually sends a polite termination request first (`SIGTERM`), giving the process a chance to clean up; `kill -9` sends `SIGKILL`, an immediate, unconditional termination the process can't ignore or clean up after — genuinely useful, but the less graceful option, reserved for processes that won't respond to a normal termination request.

## systemd and services: Linux's background-process manager

Modern Linux distros use **systemd** to manage background services — directly analogous to the Windows services concept from Path 07:

```bash
systemctl status <service>      # check a service's current state
systemctl start <service>       # start a service
systemctl stop <service>        # stop a service
systemctl enable <service>      # make a service start automatically at boot
```

Just like Path 07's coverage of Windows services as an attacker persistence mechanism, a **systemd service** configured to start automatically at boot is an equally common Linux persistence technique — an unfamiliar service set to `enabled` deserves exactly the same scrutiny as an unfamiliar Windows service running under LocalSystem.

:::challenge Test yourself
Why does the USER column in `ps aux` output matter for security assessment, not just informational curiosity?
<details><summary>Show answer</summary>The account a process runs as directly determines what that process — and by extension, anything that successfully exploits it — can actually do to the system. A vulnerability in a process running as an unprivileged user limits an attacker to whatever that limited account can access; the exact same vulnerability in a process running as <code>root</code> hands the attacker full system control the moment it's exploited. This is precisely why the least-privilege principle from the users-permissions lesson matters so directly in practice: services and applications should run under the most restricted account that still lets them function, specifically to limit the blast radius if they're ever compromised.</details>
:::

## Key terms

- **Process** — a running instance of a program, identified by a unique PID.
- **systemd** — the modern Linux service and process manager for background services.
- **SIGTERM / SIGKILL** — the polite and forceful termination signals sent by `kill` and `kill -9` respectively.

## Recap

- `ps`, `top`, and `htop` reveal exactly what's running on a Linux system, including which user account each process runs under — a direct security signal, not just informational detail.
- `kill` and `kill -9` stop processes gracefully or forcefully, respectively.
- systemd manages background services on modern Linux, and an unfamiliar auto-starting service is exactly as suspicious here as an unfamiliar Windows service was in Path 07.

**Next up →** [Linux Networking Commands](#/lesson/03-linux/linux-networking-commands)
