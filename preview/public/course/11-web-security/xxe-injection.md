# XXE — XML External Entity Injection

Command injection and file uploads gave you two paths to server compromise through user-supplied data. This lesson covers a third, specifically tied to a data format many applications process without a second thought: **XML**.

## What XXE actually exploits

XML supports a feature called **entities** — reusable, named references, somewhat like a variable — including **external entities**, which can reference content from outside the XML document itself, including local files or network resources:

```xml
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<user>
  <name>&xxe;</name>
</user>
```

If an application parses this XML and doesn't disable external entity processing, the `&xxe;` reference gets resolved to the actual contents of `/etc/passwd` — directly connecting to Path 03's filesystem-hierarchy lesson — and that file content potentially gets reflected back in the application's response.

## Where XXE actually shows up

XXE requires an application to parse XML input somewhere — genuinely common in SOAP APIs, file upload processing (some file formats, like `.docx` and `.svg`, are actually XML underneath), and legacy integrations still using XML rather than the JSON most modern APIs (Path 05) prefer.

## What an attacker can actually achieve with XXE

- **Local file disclosure** — reading arbitrary files the web server process has access to, exactly the path-traversal lesson's target files, reached through a completely different mechanism
- **SSRF** — an external entity referencing an internal-only URL (`http://169.254.169.254/...`, the cloud metadata endpoint from Path 08 and Path 02's networking material) can turn XXE into full server-side request forgery, covered fully in the next lesson
- **Denial of service** — the "billion laughs" attack, where nested entity references each expand exponentially, can exhaust server memory with a tiny XML payload

## The defense: disable external entity processing entirely

```python
# Vulnerable: default XML parser configuration in many languages/libraries
import xml.etree.ElementTree as ET
tree = ET.parse(untrusted_xml_file)

# Safer: explicitly disable external entity resolution
from defusedxml.ElementTree import parse
tree = parse(untrusted_xml_file)
```

The most reliable fix is disabling external entity processing at the parser configuration level entirely — most modern XML libraries default to this safer configuration today, but plenty of legacy code and older library defaults still process external entities unless explicitly told not to, which is exactly why XXE remains a genuinely real, recurring finding in security assessments of older applications.

:::challenge Test yourself
Why does the "billion laughs" attack cause a denial of service using such a small XML payload?
<details><summary>Show answer</summary>The "billion laughs" attack defines a small set of nested entities, where each entity references multiple copies of the entity defined just before it — so a handful of short definition lines can expand, once the parser actually resolves every nested reference, into an astronomically large amount of data in memory, far beyond what the tiny original payload size would suggest. This exploits the same entity-expansion mechanism XXE relies on generally, just aimed at exhausting server memory or CPU rather than reading a specific file — which is exactly why disabling (or strictly limiting) entity expansion at the parser level is such an effective, broad defense: it closes off file disclosure, SSRF, <em>and</em> this denial-of-service variant simultaneously, since all three exploit the same underlying entity-processing feature.</details>
:::

## Key terms

- **XXE (XML External Entity) injection** — exploiting an XML parser's external entity processing to read files, trigger SSRF, or cause denial of service.
- **Billion laughs attack** — an XXE-adjacent denial-of-service technique using nested entity expansion to exhaust server resources.

## Recap

- XXE exploits XML's external entity feature to read local files, trigger SSRF, or exhaust server resources, wherever an application parses untrusted XML input.
- SOAP APIs, file uploads (docx, svg), and legacy XML-based integrations are the most common places this vulnerability actually appears.
- Disabling external entity processing at the parser configuration level is the most reliable fix, closing file disclosure, SSRF, and denial-of-service variants all at once.

**Next up →** [Local & Remote File Inclusion](#/lesson/11-web-security/file-inclusion-lfi-rfi)
