# Python for network scripting

The requests-and-APIs lesson covered the web-application layer. This lesson drops down to the raw networking layer from Path 02 — sockets, port checking, and the exact building blocks behind real network scanning tools.

## The socket module: raw network connections

The error-handling lesson already used Python's `socket` module briefly. This lesson explains what's actually happening:

```python
import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)   # TCP socket, from Path 02
sock.settimeout(2)

result = sock.connect_ex(("192.168.1.1", 80))
if result == 0:
    print("Port 80 is open")
else:
    print("Port 80 is closed or filtered")

sock.close()
```

`AF_INET` means "using IPv4 addressing" and `SOCK_STREAM` means "using TCP" — directly the concepts from Path 02's IP-addresses and TCP-vs-UDP lessons, now expressed in actual working code.

## Building a simple port scanner

Combining loops, error handling, and sockets into something genuinely functional:

```python
import socket

def scan_port(ip, port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1)
    result = sock.connect_ex((ip, port))
    sock.close()
    return result == 0

target = "192.168.1.1"
common_ports = [21, 22, 80, 443, 3306]

for port in common_ports:
    if scan_port(target, port):
        print(f"Port {port} is open")
```

:::danger This is exactly nmap's job, done far more simply
This lesson's simple scanner exists to teach the underlying concept, not to replace nmap (previewed back in Path 03, covered properly with full legal and ethical context in Path 14). A real scan of a network you don't have explicit permission to test remains exactly as prohibited here as anywhere else in this course — the golden rule from Path 01 applies to code you write yourself just as much as to any pre-built tool.
:::

## DNS lookups from Python

```python
import socket

ip = socket.gethostbyname("example.com")
print(ip)   # resolves the domain to an IP address, directly connecting to Path 02's DNS lesson
```

## Sending a raw HTTP request without the requests library

Genuinely useful for understanding what `requests` is actually doing underneath, and occasionally useful when you need finer control than a high-level library provides:

```python
import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect(("example.com", 80))
request = "GET / HTTP/1.1\r\nHost: example.com\r\nConnection: close\r\n\r\n"
sock.send(request.encode())
response = sock.recv(4096)
print(response.decode())
sock.close()
```

Notice this is manually building the exact HTTP request structure Path 02's HTTP/HTTPS lesson described in theory — genuinely useful for cementing that this isn't magic, it's a specifically formatted piece of text sent over a TCP connection.

:::challenge Test yourself
Why does the simple port scanner example in this lesson still require explicit authorization to run against a real target, even though it's "just Python code you wrote yourself" rather than a pre-built tool like nmap?
<details><summary>Show answer</summary>The golden rule from Path 01 and the CFAA coverage from that same path's laws-and-ethics lesson focus on <em>authorization to access a system</em>, not on which specific tool or technique was used to attempt that access. Whether you scan a target using nmap, a custom Python script, or any other method, the underlying action — probing a system's ports without permission — is what the law and ethical norms actually care about, not whether the code happened to be pre-built or something you wrote yourself. "I wrote it myself, so it's different" is not a meaningful legal or ethical distinction; the same permission requirement from Path 01 applies regardless of which tool executes the actual network traffic.</details>
:::

## Key terms

- **socket** — Python's built-in module for low-level network connections.
- **connect_ex()** — a socket method that attempts a connection and returns a result code rather than raising an exception on failure, convenient for scanning.

## Recap

- Python's `socket` module provides direct, low-level access to the networking concepts from Path 02 — TCP connections, DNS resolution, raw HTTP requests.
- A simple port scanner combines sockets, loops, and error handling into genuinely functional (if much simpler) territory that tools like nmap cover fully.
- Writing the code yourself doesn't change the authorization requirement from Path 01 — the golden rule applies to your own scripts exactly as much as to any pre-built tool.

**Next up →** [Python Security Libraries: An Overview](#/lesson/04-python/python-security-libraries-overview)
