# AppSec Fix & Verify Lab

Turn a review finding into a verified fix. This exercise runs locally with Python's standard library: no Docker, paid tools, account, or network service is needed.

**Time:** plan for 30–45 minutes. **Prerequisite:** basic Python functions and the Secure Code Review lesson. Use **Python 3.10 or newer**.

## Your mission

A fictional billing service lets customers read invoices. Its lookup function has unsafe SQL construction and does not check the invoice owner. Your job is to fix the function without breaking legitimate access.

The database contains only synthetic records and exists in memory for each test. The file does not start a server or make network requests.

## 1. Get the exercise

[Download appsec_invoice_lab.py](/downloads/appsec_invoice_lab.py)

Save the file in a new folder and open a terminal there. If your browser displays the source, use Save As and keep the `.py` extension. Review the file before running it.

```bash
python --version
python appsec_invoice_lab.py
```

On systems that name Python 3 `python3`, use `python3` in these commands instead.

**Expected starter result:** 7 tests run; 3 pass and 4 test methods fail. Some failed methods report several subtest failures. A non-zero exit status is expected at this stage. If Python reports a syntax or import error, fix the setup before starting the security review.

## 2. Write the requirements first

The function contract is:

- `actor` and `invoice_id` are positive integers; strings, booleans, floats, and missing values are invalid and raise `ValueError`.
- The server has already established `actor` from a trusted session. A client must not be allowed to choose it.
- A customer can read only an invoice they own.
- An unauthorized or missing invoice returns `None`, with no invoice contents.
- Legitimate access still works for both customers.

This is a function-level exercise. It does not implement authentication, HTTP responses, or a complete billing application.

## 3. Fix only the starter function

Edit `get_invoice`, near the top of the file. Keep the tests and fixture data unchanged.

Use the failures to guide you:

1. What query condition is missing for the owner check?
2. Where should input values be bound as parameters?
3. How do you reject values outside the documented contract?

Run the same command after each change. Your target is **7 passing tests** in starter mode. Returning `None` for everything will still fail the legitimate-access tests.

## 4. Compare with the reference

Try your fix before using this option:

```bash
python appsec_invoice_lab.py --reference
```

**Expected result:** 7 tests pass. Reference mode checks the included worked implementation; it does not prove that your edited starter is correct. Run the command **without** `--reference` to verify your own change.

A useful comparison explains the reason for each change. Copying the reference without understanding the owner predicate leaves the main lesson unfinished.

## 5. Produce a small review record

Save a short Markdown report with:

1. The two findings, their local reproduction, and their impact in the fictional application.
2. Your change and why both parameter binding and the owner condition are needed.
3. The test command and the final result from your own implementation.
4. One missing application-level test, such as proving that a request cannot spoof `actor`.
5. The limits of the exercise: no real session handling, roles, deployment, or production data were tested.

Use this report as part of the program capstone. It is evidence of a small completed review, not an external certification.

## Stretch: test the integration boundary

Sketch how a real endpoint would authenticate a request, derive the user ID, parse the invoice ID, call the authorized lookup, and return a response without exposing invoice contents on denial. Write a negative test where a client tries to send someone else's `owner` value. Explain why a hidden form field is not a trusted identity.

## Completion checklist

- [ ] The unchanged suite passes against my edited starter.
- [ ] I can explain why a valid invoice ID can still be unauthorized.
- [ ] I can explain why SQL parameters alone do not solve that problem.
- [ ] My report includes one remaining integration risk.

Next, combine your evidence with the rollout plan in the AppSec Program Capstone Lab.

???refs
- [OWASP ASVS](https://asvs.owasp.org/)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
???
