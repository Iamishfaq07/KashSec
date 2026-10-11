# gRPC & Protobuf Security

The REST vs. GraphQL lesson compared the two most common web API paradigms. This lesson covers a third, genuinely different one increasingly common in internal, service-to-service communication — **gRPC** — directly connecting to Path 16's containers-and-Kubernetes lesson, since gRPC has become something close to the default choice for internal microservice communication in exactly the containerized, Kubernetes-orchestrated environments that lesson covered.

## Why gRPC exists, and why it looks different from REST/GraphQL

**gRPC** is a high-performance RPC (Remote Procedure Call) framework built on HTTP/2, using **Protocol Buffers (protobuf)** — a compact, binary serialization format — instead of REST's typical JSON. Where REST and GraphQL are both fundamentally designed for broad accessibility (readable by any HTTP client, inspectable in a browser), gRPC is optimized for performance between services that both explicitly know the exact message schema in advance, which is exactly why it's become the default for internal microservice-to-microservice traffic rather than public-facing APIs.

## The security implication of binary, schema-defined messages

A genuinely important consequence worth understanding directly: because gRPC messages are binary and schema-defined (via a `.proto` file describing the exact structure), they're **not human-readable** the way JSON is by default, and standard web security tools built around inspecting readable HTTP traffic (Burp Suite's default proxy view, browser DevTools) don't display gRPC traffic usefully without additional tooling or plugins specifically built to decode protobuf using the correct schema.

```protobuf
// Example .proto schema definition
message GetUserRequest {
  int32 user_id = 1;
}
message UserResponse {
  string name = 2;
  string email = 3;
  bool is_admin = 4;
}
```

## Why this makes testing genuinely different, not just harder

Directly connecting to the api-testing lesson's recon-to-report workflow: testing a gRPC service for the exact same vulnerability classes this path has covered (BOLA, mass assignment, injection) requires first obtaining or reconstructing the `.proto` schema — without it, you're attempting to test a binary format you can't even parse meaningfully. If **server reflection** is enabled (a gRPC feature letting a client query the service's own schema dynamically, directly analogous to GraphQL introspection from the graphql-security lesson), a tester can retrieve the schema directly; if reflection is disabled, schema recovery requires decompiling client applications that embed the compiled `.proto` definitions, directly connecting to Path 17's reverse-engineering coverage.

## Authentication and authorization in gRPC — the same problems, different plumbing

Directly connecting to the authn-authz-apis lesson: gRPC doesn't inherently solve authentication or authorization any differently than REST does at a conceptual level — it still needs the exact same "verify identity, then check permission for this specific object/action" logic this entire path has emphasized. What differs is the transport-level plumbing: gRPC commonly uses **mutual TLS (mTLS)** for service-to-service authentication (both client and server present certificates, verifying each other's identity), directly connecting to Path 22's Zero Trust coverage of exactly this mechanism for service mesh security.

## Why internal-only doesn't mean unauthenticated

:::danger "It's only reachable internally" is not an authorization control
A genuinely common, dangerous assumption specifically with gRPC services, precisely because they're so often deployed for internal-only microservice communication: treating network reachability (only accessible within a Kubernetes cluster or VPC) as sufficient authorization. Directly connecting to the api-gateway-security lesson's Zero Trust point: an attacker who compromises any single service or pod within that internal network (through an entirely unrelated vulnerability) can then reach every other "internal-only" gRPC service directly, with zero additional authentication required, if those services never independently verify caller identity via mTLS or an equivalent mechanism.
:::

:::challenge Test yourself
Why does gRPC's binary, schema-defined message format require a genuinely different testing approach than REST's readable JSON, beyond simply being less convenient to read?
:::

## Key terms

- **gRPC** — a high-performance RPC framework using Protocol Buffers, common for internal service-to-service communication.
- **Protocol Buffers (protobuf)** — gRPC's compact, binary, schema-defined serialization format.
- **Server reflection** — a gRPC feature allowing schema discovery at runtime, analogous to GraphQL introspection.
- **Mutual TLS (mTLS)** — a service-to-service authentication mechanism where both parties present and verify certificates.

## Recap

gRPC's binary, schema-defined protobuf messages are optimized for internal service-to-service performance but aren't human-readable without dedicated tooling and the correct schema, changing how testing must be approached compared to REST/GraphQL. Server reflection (when enabled) or client decompilation are the two paths to schema recovery. gRPC needs the same authentication and authorization logic this path has emphasized throughout, commonly implemented via mutual TLS — and network reachability within an internal environment is never a substitute for that verification.

???refs
- [gRPC official documentation](https://grpc.io/docs/)
- [Protocol Buffers documentation](https://protobuf.dev/)
- [OWASP — gRPC Security](https://owasp.org/www-project-api-security/)
???
