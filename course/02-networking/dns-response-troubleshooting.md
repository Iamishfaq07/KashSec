<!-- coderabbit-ai-generated:v1 -->

# DNS Response Troubleshooting

A site can fail to load even when its name looks correct. Rather than guessing that the whole domain is gone, record the exact question, resolver, time and response. This lesson uses fictional `lab.test` examples; it does not ask you to probe a real organization.

## Read the response, not just the empty answer

A DNS question includes a name, class and record type. A response has a status code and sections that can carry answers, authority information and additional records. Write down the full name and requested type before interpreting it. A recursive resolver can return a cached response, so also note the resolver and time.

Imagine these simplified observations for a fictional service:

| Question and observation | What it supports | What to check next |
|---|---|---|
| `web.lab.test` A: `NOERROR`, answer `192.0.2.20` | This response contains an IPv4 address for that question. | Check the service connection separately; an address is not proof the web service is healthy. |
| `web.lab.test` AAAA: `NOERROR`, no AAAA answer | The response may indicate no data for this type. | Inspect the full response, including its authority section, to distinguish a negative answer from a referral. |
| `missing.lab.test` A: `NXDOMAIN` | The response indicates a name error. | Verify the spelling and which name failed, especially if a CNAME was followed. |
| `web.lab.test` A: `SERVFAIL` | The resolver could not complete the request successfully. | Investigate resolver logs, connectivity, delegation and validation as appropriate; the status alone does not identify the cause. |

`NODATA` describes a negative answer for a requested type at an existing name; it is not a separate DNS response code. An empty answer section alone is not enough to diagnose NODATA: a referral can also have no answer records. `NXDOMAIN` is a name error, not proof that all similarly named hosts are missing. When a CNAME is involved, check the response chain and the name to which the error applies.

## Compare evidence carefully

If you operate the zone, compare the recursive resolver's response with the relevant authoritative data through your normal administration process. Record the question, status, answer and authority sections, TTLs, time and source. A comparison can reveal different answers, but it does not by itself establish why they differ. Previously cached answers, resolver policy, stale data, delegation and configuration are possible factors to investigate.

Positive and negative responses can be cached. A displayed TTL is not a universal countdown for every client. Do not assume a timeout proves that a name is absent: the query or its response may have been lost or blocked. Likewise, DNS resolution can succeed while a later TCP, TLS or HTTP step fails.

## Practice a handover

For the fictional `web.lab.test` case above, a useful handover would say: “The A query returned the documentation address `192.0.2.20`; the AAAA query returned no AAAA answer in the supplied response. The authority section and web-service health were not provided.” Avoid replacing those observations with “DNS is fixed” or “the domain is down.”

Open [DNS Record Practice](/tools/dnsrecords.html) to review A, AAAA, MX, CNAME and TXT using fixed examples. Then use [Follow a web request](#/playground/network) to see how DNS fits before the connection and page request. Both activities are local simulations.

:::challenge Test yourself
A colleague sees an empty AAAA answer and says the name does not exist. What information would you ask for before agreeing? How would your handover change if the response were `NXDOMAIN` instead?
:::

## Key terms

- **NXDOMAIN** — a DNS name-error response code; inspect the response chain to identify which name failed.
- **NODATA** — a negative result for a requested type at an existing name, not a separate DNS response code.
- **SERVFAIL** — a response indicating that a server could not complete the request successfully; it does not identify one specific cause.
- **Referral** — a response directing a resolver toward other name servers for further resolution.

## Recap

Record the exact question and full response. A missing name, a negative answer for one record type, a resolution failure and a network timeout are different observations. Keep uncertain causes separate from what the evidence establishes.

???refs
- [RFC 1035: Domain Names — Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035.html) — message sections and response codes.
- [RFC 2308: Negative Caching of DNS Queries](https://www.rfc-editor.org/rfc/rfc2308.html) — NXDOMAIN, NODATA and negative caching.
???
