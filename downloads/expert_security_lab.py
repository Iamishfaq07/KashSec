#!/usr/bin/env python3
"""KashSec expert review exercises. Python 3.10+, standard library only.

Run: python expert_security_lab.py --lab tenant
Compare: python expert_security_lab.py --lab tenant --reference
Choices: tenant, webhook, release, iam, all (default).

Edit only the four starter functions. Keep tests, fixtures, and reference
functions unchanged. Reference mode tests supplied answers, not your edits.
All data is synthetic; no server, network, credentials, or cloud account is used.
The webhook contract is fictional, not a vendor integration. The release
exercise consumes already-verified metadata; it does not verify signatures.
The IAM exercise models one permission contract, not the AWS policy engine.
"""
import argparse
import hashlib
import hmac
import json
import unittest


# STARTER FUNCTIONS: deliberately incomplete. Fix these, not the tests.
def tenant_invoice(actor, invoice, request_claims):
    return invoice if actor.get("authenticated") else None


def webhook_event(secret, raw_body, timestamp, signature, now, seen):
    event = json.loads(raw_body)
    seen.add(event["id"])
    return "accepted"


def release_allowed(metadata):
    return bool(metadata.get("signature_verified"))


def object_download_allowed(principal, action, resource):
    return action in ("s3:GetObject", "s3:ListBucket") and resource.startswith("arn:aws:s3:::billing")


# WORKED REFERENCES. Do not call these from a starter to claim a fix.
def reference_tenant_invoice(actor, invoice, request_claims):
    # actor is resolved by trusted authentication, never from request_claims.
    if actor.get("authenticated") is not True or not actor.get("active"):
        return None
    if actor.get("tenant") != invoice.get("tenant"):
        return None
    if actor.get("id") == invoice.get("owner") or actor.get("role") == "billing-support":
        return invoice
    return None


def reference_webhook_event(secret, raw_body, timestamp, signature, now, seen):
    if type(timestamp) is not int or abs(now - timestamp) > 300:
        return "rejected"
    expected = hmac.new(secret, str(timestamp).encode() + b"." + raw_body, hashlib.sha256).hexdigest()
    if (not isinstance(signature, str) or len(signature) != 64
            or any(c not in "0123456789abcdef" for c in signature)
            or not hmac.compare_digest(expected, signature)):
        return "rejected"
    try:
        event = json.loads(raw_body)
    except (ValueError, UnicodeDecodeError):
        return "rejected"
    event_id = event.get("id") if isinstance(event, dict) else None
    if not isinstance(event_id, str) or not 1 <= len(event_id) <= 64:
        return "rejected"
    if event_id in seen:
        return "duplicate"
    # Serial, in-memory example only. Production needs durable uniqueness and
    # an atomic transaction or inbox/outbox workflow for business side effects.
    seen.add(event_id)
    return "accepted"


def reference_release_allowed(metadata):
    required = {
        "signature_verified": True,
        "issuer": "https://token.actions.githubusercontent.com",
        "repository": "acme/billing",
        "workflow": ".github/workflows/release.yml",
        "source_ref": "refs/heads/main",
        "event": "push",
        "environment": "production",
    }
    if metadata.get("signature_verified") is not True:
        return False
    if any(metadata.get(key) != value for key, value in required.items()):
        return False
    actual, expected = metadata.get("artifact_digest"), metadata.get("approved_digest")
    return (isinstance(actual, str) and isinstance(expected, str)
            and len(actual) == len(expected) == 64
            and all(c in "0123456789abcdef" for c in actual + expected)
            and hmac.compare_digest(actual, expected))


def reference_object_download_allowed(principal, action, resource):
    prefix = "arn:aws:s3:::billing-prod/tenants/acme/"
    return (principal == "billing-api" and action == "s3:GetObject"
            and resource.startswith(prefix) and len(resource) > len(prefix))


class ExpertSecurityTests(unittest.TestCase):
    reference = False

    def function(self, name):
        return globals()[("reference_" if self.reference else "") + name]

    def test_tenant(self):
        fn = self.function("tenant_invoice")
        actor = {"authenticated": True, "active": True, "tenant": "acme", "id": "alice", "role": "customer"}
        invoice = {"tenant": "acme", "owner": "alice", "amount": 45}
        cases = [
            ("owner allowed", actor, invoice, {}, invoice),
            ("same tenant other owner denied", {**actor, "id": "bob"}, invoice, {}, None),
            ("cross tenant denied", {**actor, "tenant": "birch"}, invoice, {}, None),
            ("client role cannot grant support", {**actor, "id": "bob"}, invoice, {"role": "billing-support", "owner": "alice"}, None),
            ("trusted support same tenant allowed", {**actor, "id": "support", "role": "billing-support"}, invoice, {}, invoice),
            ("support cross tenant denied", {**actor, "tenant": "birch", "role": "billing-support"}, invoice, {}, None),
            ("inactive actor denied", {**actor, "active": False}, invoice, {}, None),
            ("anonymous denied", {**actor, "authenticated": False}, invoice, {}, None),
        ]
        for name, identity, record, claims, expected in cases:
            with self.subTest(case=name):
                self.assertEqual(fn(identity, record, claims), expected)

    def test_webhook(self):
        fn = self.function("webhook_event")
        secret, raw, now = b"synthetic-training-key", b'{"id":"evt-42","amount":45}', 2000000000

        def signature(body, timestamp):
            return hmac.new(secret, str(timestamp).encode() + b"." + body, hashlib.sha256).hexdigest()

        seen = set()
        with self.subTest(case="valid event allowed"):
            self.assertEqual(fn(secret, raw, now, signature(raw, now), now, seen), "accepted")
        with self.subTest(case="replay has no second side effect"):
            self.assertEqual(fn(secret, raw, now, signature(raw, now), now, seen), "duplicate")
        cases = [
            ("changed body denied", raw.replace(b"45", b"99"), now, signature(raw, now)),
            ("wrong signature denied", raw, now, "0" * 64),
            ("stale signed event denied", raw, now - 301, signature(raw, now - 301)),
            ("future signed event denied", raw, now + 301, signature(raw, now + 301)),
            ("missing event id denied", b'{"amount":45}', now, signature(b'{"amount":45}', now)),
            ("malformed signed JSON denied", b"{", now, signature(b"{", now)),
        ]
        for name, body, timestamp, sig in cases:
            with self.subTest(case=name):
                untouched = set()
                self.assertEqual(fn(secret, body, timestamp, sig, now, untouched), "rejected")
                self.assertEqual(untouched, set(), "Rejected requests must not consume an event ID")

    def test_release(self):
        fn = self.function("release_allowed")
        metadata = {"signature_verified": True, "issuer": "https://token.actions.githubusercontent.com",
                    "repository": "acme/billing", "workflow": ".github/workflows/release.yml",
                    "source_ref": "refs/heads/main", "event": "push", "environment": "production",
                    "artifact_digest": "a" * 64, "approved_digest": "a" * 64}
        with self.subTest(case="trusted matching artifact allowed"):
            self.assertIs(fn(metadata), True)
        changes = [("signature_verified", False), ("signature_verified", "true"),
                   ("issuer", "https://identity.example.test"), ("repository", "fork/billing"),
                   ("workflow", ".github/workflows/pr.yml"), ("source_ref", "refs/heads/feature"),
                   ("event", "pull_request"), ("environment", "preview"),
                   ("artifact_digest", "b" * 64), ("artifact_digest", "latest"), ("approved_digest", None)]
        for key, value in changes:
            with self.subTest(field=key, value=value):
                self.assertIs(fn({**metadata, key: value}), False)
        with self.subTest(case="missing claims denied"):
            self.assertIs(fn({}), False)

    def test_iam(self):
        fn = self.function("object_download_allowed")
        allowed = "arn:aws:s3:::billing-prod/tenants/acme/invoice-42.pdf"
        cases = [
            ("billing-api", "s3:GetObject", allowed, True),
            ("support-tool", "s3:GetObject", allowed, False),
            ("billing-api", "s3:PutObject", allowed, False),
            ("billing-api", "s3:ListBucket", "arn:aws:s3:::billing-prod", False),
            ("billing-api", "s3:GetObject", allowed.replace("acme/", "acme-backups/"), False),
            ("billing-api", "s3:GetObject", allowed.replace("acme/", "birch/"), False),
            ("billing-api", "s3:GetObject", allowed.replace("billing-prod/", "billing-prod-copy/"), False),
            ("billing-api", "s3:GetObject", "arn:aws:s3:::billing-prod/tenants/acme/", False),
        ]
        for principal, action, resource, expected in cases:
            with self.subTest(principal=principal, action=action, resource=resource):
                self.assertIs(fn(principal, action, resource), expected)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--lab", choices=["tenant", "webhook", "release", "iam", "all"], default="all")
    parser.add_argument("--reference", action="store_true")
    args = parser.parse_args()
    ExpertSecurityTests.reference = args.reference
    suite = unittest.TestSuite(ExpertSecurityTests("test_" + name) for name in
                               (["tenant", "webhook", "release", "iam"] if args.lab == "all" else [args.lab]))
    print("REFERENCE implementation" if args.reference else "YOUR STARTER implementation", flush=True)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    raise SystemExit(0 if result.wasSuccessful() else 1)
