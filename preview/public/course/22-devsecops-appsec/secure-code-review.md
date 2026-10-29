# Secure Code Review: Follow the Data and the Permission

A scanner can point to suspicious code. A reviewer connects that code to what the application is allowed to do.

In this lesson, review a small invoice lookup. You will separate two bugs that often appear together: SQL injection and missing authorization.

## A repeatable review loop

1. Identify the entry point: what values arrive from a request, file, message, or external service?
2. Identify the trusted identity: where did the server establish who the user is?
3. Follow the values to a sensitive operation: database query, file read, command, or outbound request.
4. Check both input handling and permission at that operation.
5. Write a test that demonstrates the failure, fix it, and keep the test.

Do not start by memorizing every vulnerability name. Start with a small flow you can explain.

## Review this function

```python
def get_invoice(db, actor, invoice_id):
    row = db.execute(
        f"SELECT id, owner, amount FROM invoices WHERE id = '{invoice_id}'"
    ).fetchone()
    return dict(row) if row else None
```

Here `actor` is the user ID from a **trusted server session**. The client may choose `invoice_id`; it must not choose its own trusted identity. The example uses Python's SQLite interface.

### Finding 1: input becomes SQL syntax

The f-string puts input directly into a query. Use query parameters so the driver treats values as data. An input allowlist is useful, but is not a substitute for parameter binding.

### Finding 2: the user is never checked

The function accepts `actor` but does not use it. A valid invoice ID might belong to a different customer. Fixing the SQL injection alone leaves this authorization bug in place.

Random IDs can make guessing harder. They do not replace a permission check.

## A small corrected version

```python
def get_invoice(db, actor, invoice_id):
    if type(actor) is not int or actor <= 0:
        raise ValueError("actor must be a positive integer")
    if type(invoice_id) is not int or invoice_id <= 0:
        raise ValueError("invoice_id must be a positive integer")
    row = db.execute(
        "SELECT id, owner, amount FROM invoices WHERE id = ? AND owner = ?",
        (invoice_id, actor),
    ).fetchone()
    return dict(row) if row else None
```

This teaching example deliberately accepts positive Python integers only. The web boundary of a real application would parse the route input, validate the session, and map outcomes to an appropriate response. `bool` is a subclass of `int` in Python, which is why this narrow contract uses an exact type check.

The owner condition enforces this application's simple rule at the data lookup. Real applications may also have roles, teams, tenants, delegated access, or revocation. Model those rules explicitly; do not assume every system uses a single owner column.

## Test both allowed and denied behavior

| Case | Expected result |
|---|---|
| Customer 7 reads their invoice 101 | The correct invoice |
| Customer 7 asks for customer 8's invoice 202 | No invoice contents |
| An unknown invoice is requested | No invoice contents |
| SQL syntax is passed as the invoice ID | Rejected by the input contract |
| Customer 8 reads their own invoice 202 | The correct invoice |

The last row matters. A fix that blocks everyone is not a working fix.

Tests against this function are useful, but limited. An application also needs integration tests to prove that its server derives `actor` from the session and cannot be tricked by a request's `owner` field.

## Write a finding a developer can use

Record the affected route and function, the required starting access, the smallest reproduction using synthetic data, the impact, and a proposed change. Link the failing test. After the fix, record the reviewed commit and the passing result.

Avoid claiming a breach when you demonstrated a bug in a local exercise. Keep customer data and tokens out of screenshots and reports.

## More review questions

- File upload: can uploaded bytes become executable, or be read without permission?
- Outbound URL: can the requester reach internal services or follow a redirect around validation?
- Password reset: is a token bound to the intended account, time-limited, and unusable after consumption?
- Dependency change: is the new package necessary, maintained, and obtained from the intended source?

Use the relevant framework guidance for each flow. One generic input filter cannot make all these operations safe.

## Key terms

- **Parameter binding** — passing query values separately from SQL syntax
- **Authorization** — deciding whether a trusted identity may perform an action on a resource
- **Regression test** — a test kept to detect the return of a previously fixed problem

## Ready to advance

- [ ] I can point to both bugs in the starter function.
- [ ] I can explain why parameterized SQL does not enforce authorization.
- [ ] My test plan includes two identities and a legitimate success after the fix.

Later in this path, the Fix & Verify lab lets you run this exact review as a local exercise.

## Go deeper: review a tenant boundary

The owner check in this lesson is one permission boundary. A multi-tenant service adds another: a customer from one organisation must not read another organisation's data, even if an object ID or role name happens to match.

Write a small permission matrix before editing code:

| Actor | Object | Expected result |
| --- | --- | --- |
| Owner in tenant A | Own invoice in A | Allow |
| Different customer in A | Someone else's invoice in A | Deny |
| Customer in B | Invoice in A | Deny |
| Server-assigned billing support in A | Invoice in A | Allow only if the documented support rule permits it |
| Support in B | Invoice in A | Deny |

Treat tenant, owner, and role fields from a request as untrusted claims. The endpoint must resolve the actor from authenticated server-side state. A database lookup should apply the required tenant and ownership policy; a hidden form field is not an authorization control.

Try [Tenant isolation under pressure](/expert-labs/tenant-boundary.html). It includes request evidence, a local Python repair exercise, positive and negative cases, and a report template. Passing the function tests still leaves the endpoint's identity construction to verify.

???refs
- [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [OWASP Authorization Guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [Python sqlite3 parameter substitution](https://docs.python.org/3/library/sqlite3.html#how-to-use-placeholders-to-bind-values-in-sql-queries)
???
