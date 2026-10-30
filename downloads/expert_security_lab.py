#!/usr/bin/env python3
"""KashSec expert review exercises. Python 3.10+, standard library only.

Run: python expert_security_lab.py --lab tenant
Compare: python expert_security_lab.py --lab tenant --reference
Choices: tenant, webhook, release, iam, agent, rag, all (default).

Edit only the six starter functions. Keep tests, fixtures, and reference
functions unchanged. Reference mode tests supplied answers, not your edits.
All data is synthetic; no server, network, credentials, or cloud account is used.
The webhook contract is fictional, not a vendor integration. The release
exercise consumes already-verified metadata; it does not verify signatures.
The IAM exercise models one permission contract, not the AWS policy engine.
The AI exercises use trusted synthetic actor/task metadata, not a model,
MCP server, token validator, approval service, vector index, or cache.
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


def agent_tool_allowed(actor, task, call):
    return actor.get("authenticated") is True


def rag_documents(actor, documents, request_claims):
    return list(documents)


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


def reference_agent_tool_allowed(actor, task, call):
    # Actor/task are trusted records; call is untrusted model output.
    return (actor.get("authenticated") is True
            and isinstance(actor.get("id"), str) and bool(actor["id"])
            and isinstance(actor.get("tenant"), str) and bool(actor["tenant"])
            and isinstance(actor.get("scopes"), list) and "invoice:read" in actor["scopes"]
            and task.get("actor_id") == actor["id"]
            and task.get("tenant") == actor["tenant"]
            and task.get("tool") == "invoice.read"
            and isinstance(task.get("invoice_id"), str) and bool(task["invoice_id"])
            and set(call) == {"tool", "tenant", "invoice_id"}
            and call.get("tool") == task["tool"]
            and call.get("tenant") == task["tenant"]
            and call.get("invoice_id") == task["invoice_id"])


def reference_rag_documents(actor, documents, request_claims):
    if (actor.get("authenticated") is not True
            or not isinstance(actor.get("tenant"), str) or not actor["tenant"]
            or not isinstance(actor.get("allowed_ids"), list)):
        return []
    allowed_ids = {key for key in actor["allowed_ids"] if isinstance(key, str) and key}
    return [doc for doc in documents
            if isinstance(doc.get("id"), str) and doc["id"] in allowed_ids
            and doc.get("tenant") == actor["tenant"] and doc.get("active") is True]


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


    def test_agent(self):
        fn = self.function("agent_tool_allowed")
        actor = {"id": "alice", "tenant": "acme", "authenticated": True, "scopes": ["invoice:read"]}
        task = {"actor_id": "alice", "tenant": "acme", "tool": "invoice.read", "invoice_id": "42"}
        call = {"tool": "invoice.read", "tenant": "acme", "invoice_id": "42"}
        cases = [
            ("exact read allowed", actor, task, call, True),
            ("anonymous", {**actor, "authenticated": False}, task, call, False),
            ("missing scope", {**actor, "scopes": []}, task, call, False),
            ("wrong task actor", actor, {**task, "actor_id": "bob"}, call, False),
            ("wrong task tenant", actor, {**task, "tenant": "birch"}, call, False),
            ("unsupported task", actor, {**task, "tool": "invoice.send"}, call, False),
            ("wrong call tenant", actor, task, {**call, "tenant": "birch"}, False),
            ("wrong invoice", actor, task, {**call, "invoice_id": "43"}, False),
            ("write tool", actor, task, {**call, "tool": "invoice.send"}, False),
            ("spoofed approval", actor, task, {**call, "approved": True}, False),
            ("unknown argument", actor, task, {**call, "recipient": "outside@example.invalid"}, False),
            ("empty trusted records", {}, {}, call, False),
        ]
        for name, identity, contract, proposal, expected in cases:
            with self.subTest(case=name):
                before = json.dumps([identity, contract, proposal], sort_keys=True)
                self.assertIs(fn(identity, contract, proposal), expected)
                self.assertEqual(json.dumps([identity, contract, proposal], sort_keys=True), before)

    def test_rag(self):
        fn = self.function("rag_documents")
        actor = {"authenticated": True, "tenant": "acme", "allowed_ids": ["a-1", "a-old"]}
        docs = [
            {"id": "a-1", "tenant": "acme", "active": True, "text": "Allowed guide"},
            {"id": "b-1", "tenant": "birch", "active": True, "text": "Private Birch"},
            {"id": "a-old", "tenant": "acme", "active": False, "text": "Revoked"},
            {"id": "a-2", "tenant": "acme", "active": True, "text": "Restricted"},
        ]
        cases = [
            ("allowed record only", actor, docs, {}, docs[:1]),
            ("request cannot broaden access", actor, docs, {"tenant": "birch", "allowed_ids": ["b-1", "a-2"]}, docs[:1]),
            ("unauthenticated", {**actor, "authenticated": False}, docs, {}, []),
            ("no authorized IDs", {**actor, "allowed_ids": []}, docs, {}, []),
            ("missing actor metadata", {}, docs, {}, []),
            ("missing document tenant", actor, [{"id": "a-1", "active": True}], {}, []),
            ("missing active flag", actor, [{"id": "a-1", "tenant": "acme"}], {}, []),
            ("revoked-only candidate", actor, docs[2:3], {}, []),
            ("empty candidates", actor, [], {}, []),
            ("record order preserved", {**actor, "allowed_ids": ["a-2", "a-1"]}, [docs[3], docs[0]], {}, [docs[3], docs[0]]),
        ]
        for name, identity, candidates, claims, expected in cases:
            with self.subTest(case=name):
                before = json.dumps([identity, candidates, claims], sort_keys=True)
                self.assertEqual(fn(identity, candidates, claims), expected)
                self.assertEqual(json.dumps([identity, candidates, claims], sort_keys=True), before)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--lab", choices=["tenant", "webhook", "release", "iam", "agent", "rag", "all"], default="all")
    parser.add_argument("--reference", action="store_true")
    args = parser.parse_args()
    ExpertSecurityTests.reference = args.reference
    suite = unittest.TestSuite(ExpertSecurityTests("test_" + name) for name in
                               (["tenant", "webhook", "release", "iam", "agent", "rag"] if args.lab == "all" else [args.lab]))
    print("REFERENCE implementation" if args.reference else "YOUR STARTER implementation", flush=True)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    raise SystemExit(0 if result.wasSuccessful() else 1)
