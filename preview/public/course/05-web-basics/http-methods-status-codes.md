# HTTP methods & status codes

The client-vs-server lesson established the two sides of every web conversation. This lesson gets specific about the actual *vocabulary* they use to talk to each other — the HTTP methods and status codes you'll see constantly for the rest of this course.

## HTTP methods: what the client is asking for

| Method | What it means |
|---|---|
| **GET** | Retrieve data — loading a page, fetching a resource. Should never change anything on the server. |
| **POST** | Submit new data — creating an account, posting a comment. |
| **PUT** | Replace an existing resource entirely. |
| **PATCH** | Partially update an existing resource. |
| **DELETE** | Remove a resource. |

That distinction between GET and the others matters more than it might seem: GET requests are meant to be **safe** (no side effects) and are commonly cached, logged in browser history, and even prefetched by browsers automatically — which is exactly why a genuinely well-built application never performs a sensitive, state-changing action (like deleting an account) through a GET request, a real and recurring vulnerability pattern covered properly in Path 11.

## Status codes: what the server is telling you back

Status codes come in five families, each starting with a different digit:

```
1xx — Informational (rarely seen directly)
2xx — Success            (200 OK, 201 Created)
3xx — Redirection        (301 Moved Permanently, 302 Found)
4xx — Client error       (404 Not Found, 401 Unauthorized, 403 Forbidden)
5xx — Server error       (500 Internal Server Error, 503 Service Unavailable)
```

## The 401 vs. 403 distinction — genuinely worth knowing precisely

A common point of confusion, and a genuinely useful one to get right: **401 Unauthorized** actually means "you're not authenticated at all — who are you?", while **403 Forbidden** means "I know who you are, but you're not allowed to do this." This distinction matters directly for security assessment: a 403 on an endpoint you're not logged into at all can be a meaningful signal that the endpoint exists and is doing *some* kind of access check, even before you've authenticated — genuinely useful reconnaissance information.

## Why status codes leak information, sometimes unintentionally

A server returning a different status code depending on whether a specific username exists (say, 404 for "user not found" versus 403 for "user exists but access denied") can accidentally enable **username enumeration** — an attacker systematically probing many usernames and using the status code difference alone to determine which accounts are real, without ever needing a correct password. This is exactly the kind of subtle information leak Path 11's web security material covers as a genuine, common real-world finding.

:::challenge Test yourself
Why might a security-conscious application deliberately return the *same* status code and error message for "wrong password" and "username doesn't exist," rather than distinguishing between them?
<details><summary>Show answer</summary>Returning different responses for these two cases — even something as subtle as a different status code, a different error message, or a different response time — creates a <strong>username enumeration</strong> vulnerability: an attacker can systematically try many usernames and use the response difference alone to determine which ones correspond to real accounts on the system, entirely without needing to guess a correct password at all. Once an attacker has confirmed a real username this way, they can focus password-guessing or credential-stuffing efforts (from Path 00) specifically on known-valid accounts rather than wasting effort on nonexistent ones. Returning an identical, generic response ("invalid username or password") regardless of which specific thing was actually wrong closes this information leak entirely.</details>
:::

## Key terms

- **HTTP method** — the verb (GET, POST, PUT, PATCH, DELETE) describing what action a request is asking the server to perform.
- **Status code** — the three-digit code a server returns indicating the result of a request.
- **Username enumeration** — determining which usernames correspond to real accounts based on subtle differences in server responses.

## Recap

- GET should never change server state — a genuinely important distinction, since GET requests are cached, logged, and prefetched in ways state-changing requests shouldn't be.
- Status codes fall into five families (2xx success, 3xx redirect, 4xx client error, 5xx server error), and the 401-vs-403 distinction ("who are you" vs. "you can't do that") carries real reconnaissance value.
- Subtle differences in server responses — including status codes — can accidentally enable username enumeration, a genuine, common real-world finding covered properly in Path 11.

**Next up →** [Cookies, sessions, logins](#/lesson/05-web-basics/cookies-sessions)
