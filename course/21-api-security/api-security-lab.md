# API Security Capstone Lab

This lab pulls together everything from the path. You will practice the core skills on a realistic (but safe) target.

## Goal

Find and document at least **three** distinct authorization or data-exposure issues.

## Recommended targets (pick one)

- [OWASP crAPI](https://github.com/OWASP/crAPI) — modern API-heavy application designed for this exact training
- [vAPI](https://github.com/roottusk/vapi) — intentionally vulnerable API
- PortSwigger Web Security Academy — API and GraphQL labs
- Any local lab you have already set up from earlier paths

## Required tasks

### 1. Surface mapping (30–45 min)

- Create two separate user accounts
- Browse the application normally while proxying traffic
- List every API endpoint you can find (method + path + what it does)
- Note which ones take an object identifier

### 2. Object-level authorization testing

For every endpoint that accepts an ID:

- Capture a request as User A
- Replay it as User B with User A’s object ID
- Record whether access was granted

### 3. Function-level & mass-assignment testing

- Try privileged actions with the low-privilege account
- On any create/update endpoint, add fields such as `isAdmin`, `role`, `balance`, `verified`, `price`
- Observe what sticks

### 4. Data exposure review

- Examine the raw JSON of profile, order, and list endpoints
- Note any fields that should not be visible to the current user

### 5. Write-up

For each finding write:

```markdown
## Finding title
**Severity:** 
**Endpoint:** 
**Description:** 
**Steps to reproduce:** 
**Impact:** 
**Remediation:** 
```

## Stretch goals

- Find an SSRF or injection point
- Bypass a rate limit
- Discover a hidden or undocumented endpoint
- Turn one finding into a short Nuclei template

## Reflection questions

1. Which class of issue was easiest to find? Why?
2. Did the application use sequential IDs, UUIDs, or something else? Did that help or hinder you?
3. Where would you add the authorization check in the code if you were the developer?

## Key takeaway

You now have a repeatable process: map → dual-account testing → object & function authorization → mass assignment → data exposure. This process finds the majority of high-impact API vulnerabilities in the wild.

:::tip
Save your notes and the list of endpoints. The same workflow works on real bug-bounty programs and professional assessments.
:::

???refs
- [OWASP API Security Top 10 (2023)](https://owasp.org/API-Security/)
- [crAPI walkthroughs & write-ups](https://github.com/OWASP/crAPI)
???