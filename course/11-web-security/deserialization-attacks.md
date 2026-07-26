# Insecure Deserialization

Path 04's writing-secure-Python-code lesson briefly warned that `pickle.load()` can execute arbitrary code from untrusted data. This lesson expands that warning into a full vulnerability class — one that affects nearly every programming language, not just Python.

## Serialization and deserialization, quickly defined

**Serialization** converts an in-memory object (a class instance, a data structure) into a format that can be stored or transmitted — a file, a network message, a session cookie. **Deserialization** reverses the process, reconstructing the original object from that stored or transmitted data. This is a genuinely useful, common pattern — the problem arises specifically when an application deserializes data that came from an untrusted source.

## Why deserialization can lead to code execution

Many serialization formats (Java's native serialization, Python's `pickle`, PHP's `unserialize`, and others) don't just store plain data — they can encode enough information to reconstruct arbitrary objects, including, in some cases, objects whose *construction itself* triggers code execution as a side effect. An attacker who can control the serialized data being deserialized can potentially craft a malicious payload that, the moment it's deserialized, executes attacker-chosen code — without needing any separate vulnerability at all.

```python
# Dangerous: deserializing untrusted data
import pickle
data = pickle.loads(untrusted_input)   # can execute arbitrary code during this call
```

## Where this shows up in real applications

- **Session storage** — an application storing serialized session data in a cookie or file, deserialized on each request; if that serialized data isn't cryptographically signed and verified, an attacker can potentially tamper with it
- **Caching layers** — serialized objects stored in a cache (like Redis) and later deserialized, if the cache itself or the data flowing into it isn't fully trusted
- **API payloads** — some frameworks historically accepted serialized objects directly as API input, a pattern now widely recognized as dangerous and increasingly replaced by pure-data formats like JSON

## Why JSON is generally safer than native serialization formats

Directly connecting to Path 05's APIs-and-JSON lesson: JSON can only represent plain data (strings, numbers, booleans, arrays, objects) — it has no mechanism for encoding executable code or triggering arbitrary object construction the way native serialization formats can. This is exactly why modern API design has broadly moved toward JSON, and why Path 04's secure-Python-code lesson specifically recommended JSON over `pickle` for handling any data from an untrusted source.

## The defense, when native serialization is genuinely necessary

- **Never deserialize untrusted data with a native format**, full stop, wherever a safer alternative like JSON is feasible
- **Cryptographically sign serialized data** (directly applying Path 06's digital-signatures concepts) if it must round-trip through an untrusted client, verifying the signature before deserializing, so any tampering is detected before the dangerous deserialization step ever runs
- **Use allow-lists for deserializable types**, where the serialization library supports it, restricting deserialization to a small set of known-safe object types rather than allowing arbitrary object construction

:::challenge Test yourself
Why is JSON generally considered a safer format than native language serialization (pickle, Java serialization) for handling data from an untrusted source?
<details><summary>Show answer</summary>JSON's data model is deliberately limited to plain, inert data types — strings, numbers, booleans, arrays, and objects with no executable behavior of their own. Parsing JSON simply produces plain data structures, with no mechanism for the parsing process itself to construct arbitrary objects or trigger code execution as a side effect. Native serialization formats like Python's pickle or Java's native serialization, by contrast, are specifically designed to reconstruct <em>full objects</em>, including their behavior — and that reconstruction process can be abused to execute attacker-chosen code the moment deserialization runs, before the application ever gets a chance to validate what was actually deserialized. This fundamental difference in what each format is capable of representing is exactly why JSON is the safer default choice whenever the data might come from an untrusted source.</details>
:::

## Key terms

- **Serialization / deserialization** — converting an object to a storable/transmittable format and back again.
- **Insecure deserialization** — deserializing untrusted data using a format capable of triggering arbitrary code execution during reconstruction.

## Recap

- Deserializing untrusted data with a native serialization format (pickle, Java serialization, PHP unserialize) can lead directly to arbitrary code execution, since these formats can encode more than plain data.
- Session storage, caching layers, and legacy API designs are common places this vulnerability appears in real applications.
- JSON is the safer default for untrusted data specifically because its data model has no mechanism for encoding executable behavior — and where native serialization is unavoidable, cryptographic signing and type allow-listing are the practical mitigations.

**Next up →** [SSRF & authentication flaws](#/lesson/11-web-security/ssrf-and-auth)
