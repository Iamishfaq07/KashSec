# RAG Tenant Isolation and Safe Retrieval

Retrieval-augmented generation (RAG) gives a model relevant documents before it answers. A document can be relevant to a question and still be private to somebody else. Similarity is not authorization.

**You will learn:** how to filter documents before model context is built, why chunk metadata matters, and how to test stale permissions. Allow about 25 minutes, plus the lab. Read the existing RAG risks lesson first.

## Follow one document through the system

Imagine a support assistant serving two customers, Acme and Birch. Their invoices live in the same search index. A Birch invoice happens to be the closest text match for an Acme question.

If the application retrieves all tenants' documents, puts the top matches into the prompt, and asks the model to hide private material, the data boundary has already failed. The model received the wrong document. Removing its citation from the final answer does not undo that disclosure.

```text
Authenticated actor -> tenant and document permissions
Question -> authorized search candidates -> ranking -> context -> answer
```

Permissions must come from the authenticated actor and the document service. Do not accept `tenant=birch` from a chat message as evidence that the user belongs to Birch.

## Filter before ranking and context construction

A useful design performs an authorization-aware search, ranks only allowed candidates, and rechecks access when fetching the selected document. Keep private result counts, titles, snippets, and error details out of unauthorized responses too.

Some search backends support server-side filters. Verify whether they apply **before** approximate-nearest-neighbor selection or only after a global top-k selection. Filtering a global top-k afterward can leave too few useful results and may create observable side channels. It is never acceptable to send the unfiltered candidate set to the model.

For a tiny local fixture, the policy might be:

```python
allowed = [doc for doc in documents
           if doc["tenant"] == actor["tenant"]
           and doc["id"] in actor["allowed_ids"]
           and doc["active"] is True]
```

The code assumes `actor` and document metadata were resolved by trusted services. Real systems also need role rules, sharing policies, storage authorization, and consistent identity propagation.

## Protect chunks, caches, and permission changes

An index often stores chunks rather than whole documents. Every chunk needs a reliable link to its source and access policy. Splitting text must not drop the tenant or document identifier. Treat chunks with missing access metadata as ineligible until the problem is resolved.

Cache keys need the relevant authorization context. A shared cache keyed only by the question can return another user's previous answer. A permission revocation must affect retrieval, cached answers, stored conversations, and follow-up fetches according to your product's retention rules.

Re-indexing delay is not a reason to keep serving a revoked document. Use an authoritative access check and a clear invalidation strategy. Avoid logging full confidential prompts while trying to diagnose the issue.

## Isolation does not solve prompt injection

A document that the user may read can still contain malicious instructions. Keep document text separate from trusted instructions, constrain tool authority, and test malicious retrieved content. Access control and instruction handling protect different boundaries; both are needed.

## Practice: prove the retrieval boundary

Open [the RAG isolation expert lab](/expert-labs/rag-document-scope.html). The Python fixture has two tenants, an inactive document, and an explicit list of permitted document IDs.

```bash
python expert_security_lab.py --lab rag
```

Repair `rag_documents`. Show that the permitted Acme document remains available, a Birch document never enters context, an inactive document is excluded, and a request-supplied tenant cannot override the trusted actor. Check that your function leaves the input fixtures unchanged.

The exercise models eligibility only. It has no embedding model, vector database, cache, or real authentication. In your report, propose an integration test that records context document IDs at the model boundary without recording their private contents.

## Check your understanding

Is hiding a private document's citation sufficient? No: it must never reach unauthorized model context. Should a missing ACL mean “public”? No: use an explicit documented public-sharing policy; missing metadata should not silently broaden access.

## Key terms

- **Tenant isolation:** keeping one customer's data and authority separate from another's.
- **ACL:** the access-control rules for a resource.
- **Chunk:** a searchable part of a source document that must retain its access metadata.
- **Revocation:** removal of a previously granted permission.

## Sources and review

Source review: 30 October 2026.

???refs
- [OWASP GenAI LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) — vector/embedding weaknesses and sensitive information disclosure.
- [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) — how retrieved data can interact with agent actions.
