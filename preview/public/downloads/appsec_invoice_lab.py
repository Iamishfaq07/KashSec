#!/usr/bin/env python3
"""KashSec AppSec Fix & Verify Lab — Python 3.10+, standard library only.

Run: python appsec_invoice_lab.py
The starter intentionally fails security tests. Edit ONLY get_invoice to fix it.
Compare: python appsec_invoice_lab.py --reference
No server, network, packages, credentials, or persistent database are used.
The actor argument represents identity from a trusted server session, NOT input
that a client is allowed to choose. This is a small teaching model, not an API.
"""

import sqlite3
import sys
import unittest


def get_invoice(db, actor, invoice_id):
    """STARTER: intentionally unsafe. Replace this implementation.

    Contract: actor and invoice_id must be positive integers (not bool/strings).
    Invalid arguments raise ValueError. Return a dict only for an invoice owned
    by actor; return None for missing or someone else's invoice.
    """
    row = db.execute(
        f"SELECT id, owner, amount FROM invoices WHERE id = '{invoice_id}'"
    ).fetchone()
    return dict(row) if row else None


def reference_get_invoice(db, actor, invoice_id):
    """REFERENCE: try fixing the starter before reading this implementation."""
    if type(actor) is not int or actor <= 0:
        raise ValueError("actor must be a positive integer")
    if type(invoice_id) is not int or invoice_id <= 0:
        raise ValueError("invoice_id must be a positive integer")
    row = db.execute(
        "SELECT id, owner, amount FROM invoices WHERE id = ? AND owner = ?",
        (invoice_id, actor),
    ).fetchone()
    return dict(row) if row else None


class InvoiceSecurityTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.row_factory = sqlite3.Row
        self.db.execute(
            "CREATE TABLE invoices (id INTEGER PRIMARY KEY, owner INTEGER, amount INTEGER)"
        )
        self.db.executemany(
            "INSERT INTO invoices VALUES (?, ?, ?)",
            [(101, 7, 1250), (202, 8, 9900)],
        )
        self.addCleanup(self.db.close)

    def test_owner_can_read_their_invoice(self):
        self.assertEqual(lookup(self.db, 7, 101), {"id": 101, "owner": 7, "amount": 1250})

    def test_other_owner_cannot_read_invoice(self):
        self.assertIsNone(lookup(self.db, 7, 202))

    def test_missing_invoice_returns_none(self):
        self.assertIsNone(lookup(self.db, 7, 999))

    def test_sql_text_is_rejected(self):
        with self.assertRaises(ValueError):
            lookup(self.db, 8, "' OR '1'='1")

    def test_invalid_invoice_identifiers_are_rejected(self):
        for value in [None, True, 0, -1, 101.0, "101"]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                lookup(self.db, 7, value)

    def test_invalid_actors_are_rejected(self):
        for value in [None, True, 0, -7, 7.0, "7"]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                lookup(self.db, value, 101)

    def test_second_owner_still_has_legitimate_access(self):
        self.assertEqual(lookup(self.db, 8, 202)["owner"], 8)


lookup = get_invoice
if __name__ == "__main__":
    if "--reference" in sys.argv:
        lookup = reference_get_invoice
        sys.argv.remove("--reference")
        print("REFERENCE mode — checking the worked solution, not your starter.", flush=True)
    else:
        print("STARTER mode — security tests should fail until you fix get_invoice.", flush=True)
    unittest.main(verbosity=2)
