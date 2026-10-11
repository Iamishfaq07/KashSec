import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Button, Field, inputClass } from "@/components/ui";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/tools")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: typeof search.tab === "string" ? search.tab : "",
  }),
  head: () => ({ meta: [{ title: "Tools · KashSec" }] }),
  component: ToolsPage,
});

const tabs = ["Encode", "Decode", "Hash", "JWT", "Subnet", "Password", "Regex", "Time", "Headers"] as const;
type Tab = (typeof tabs)[number];

function ToolsPage() {
  const requested = Route.useSearch().tab;
  const initial = tabs.find((item) => item.toLowerCase() === requested.toLowerCase()) ?? "Encode";
  const [tab, setTab] = useState<Tab>(initial);
  return (
    <Shell>
      <p className="text-sm uppercase tracking-[0.18em] text-amber">In the browser</p>
      <h1 className="mt-2 font-display text-5xl">Tools</h1>
      <p className="mt-3 max-w-xl text-muted">Nothing you type here is sent anywhere. Hashing and signatures use the browser's own crypto.</p>
      <div className="mt-6 flex gap-2 overflow-x-auto">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "press h-11 shrink-0 rounded-full px-4 text-sm",
              tab === item ? "bg-amber text-amber-ink" : "border border-line text-muted",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab === "Encode" ? <EncodeTool /> : null}
        {tab === "Decode" ? <DecodeTool /> : null}
        {tab === "Hash" ? <HashTool /> : null}
        {tab === "JWT" ? <JwtTool /> : null}
        {tab === "Subnet" ? <SubnetTool /> : null}
        {tab === "Password" ? <PasswordTool /> : null}
        {tab === "Regex" ? <RegexTool /> : null}
        {tab === "Time" ? <TimeTool /> : null}
        {tab === "Headers" ? <HeaderTool /> : null}
      </div>
    </Shell>
  );
}

function EncodeTool() {
  const [text, setText] = useState("KashSec");
  let base64 = "";
  let url = "";
  let hex = "";
  let error = "";
  try {
    base64 = btoa(text);
    url = encodeURIComponent(text);
    hex = [...new TextEncoder().encode(text)].map((byte) => byte.toString(16).padStart(2, "0")).join(" ");
  } catch {
    error = "Base64 here only accepts Latin-1 text. Hex still works for Unicode if you clear the error by using the hash tool.";
  }
  return (
    <ToolFrame>
      <Field label="Text">
        <textarea className={`${inputClass} h-28 py-2`} value={text} onChange={(event) => setText(event.target.value)} />
      </Field>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Out label="Base64" value={base64} />
      <Out label="URL encoded" value={url} />
      <Out label="UTF-8 hex" value={hex} />
    </ToolFrame>
  );
}

function HashTool() {
  const [text, setText] = useState("KashSec");
  const [sha256, setSha256] = useState("");
  const [sha1, setSha1] = useState("");

  async function run() {
    const data = new TextEncoder().encode(text);
    const a = await crypto.subtle.digest("SHA-256", data);
    const b = await crypto.subtle.digest("SHA-1", data);
    setSha256(hex(a));
    setSha1(hex(b));
  }

  return (
    <ToolFrame>
      <Field label="Text">
        <textarea className={`${inputClass} h-28 py-2`} value={text} onChange={(event) => setText(event.target.value)} />
      </Field>
      <Button onClick={() => void run()}>Hash</Button>
      <Out label="SHA-256" value={sha256} />
      <Out label="SHA-1 — broken for signatures, still useful as a fingerprint" value={sha1} />
    </ToolFrame>
  );
}

function JwtTool() {
  const [token, setToken] = useState("");
  let header = "";
  let payload = "";
  let error = "";
  if (token.trim()) {
    const parts = token.trim().split(".");
    try {
      header = JSON.stringify(JSON.parse(decode(parts[0] ?? "")), null, 2);
      payload = JSON.stringify(JSON.parse(decode(parts[1] ?? "")), null, 2);
    } catch {
      error = "Could not decode a header and payload. Paste the whole token.";
    }
  }
  return (
    <ToolFrame>
      <Field label="Token">
        <textarea className={`${inputClass} h-28 py-2`} value={token} onChange={(event) => setToken(event.target.value)} placeholder="eyJhbGciOi..." />
      </Field>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Out label="Header" value={header} />
      <Out label="Payload" value={payload} />
      <p className="text-xs text-faint">Decoding does not mean the signature is valid. Use the JWT lab to check one.</p>
    </ToolFrame>
  );
}

function SubnetTool() {
  const [cidr, setCidr] = useState("10.0.0.0/24");
  const result = parseCidr(cidr);
  return (
    <ToolFrame>
      <Field label="CIDR">
        <input className={inputClass} value={cidr} onChange={(event) => setCidr(event.target.value)} />
      </Field>
      {result ? (
        <dl className="grid grid-cols-2 gap-3 text-sm">
          {Object.entries(result).map(([key, value]) => (
            <div key={key}>
              <dt className="text-faint">{key}</dt>
              <dd className="text-fg">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-danger">Use an IPv4 CIDR, like 192.168.1.10/26.</p>
      )}
    </ToolFrame>
  );
}

function PasswordTool() {
  const [password, setPassword] = useState("");
  const classes = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  const pool = [26, 26, 10, 33].filter((_, index) => {
    if (index === 0) return /[a-z]/.test(password);
    if (index === 1) return /[A-Z]/.test(password);
    if (index === 2) return /\d/.test(password);
    return /[^A-Za-z0-9]/.test(password);
  }).reduce((sum, size) => sum + size, 0);
  const bits = password && pool ? Math.round(password.length * Math.log2(pool)) : 0;
  return (
    <ToolFrame>
      <Field label="Password — it stays in this tab">
        <input className={inputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </Field>
      <p className="text-sm text-muted">
        {password
          ? `${password.length} characters, ${classes} character classes, about ${bits} bits if the choice was random inside that pool.`
          : "Length matters more than a clever substitution."}
      </p>
      <p className="text-xs text-faint">This is not a strength score. A dictionary word with a symbol is still a dictionary word.</p>
    </ToolFrame>
  );
}

function DecodeTool() {
  const [text, setText] = useState("S2FzaFNlYw==");
  let base64 = "";
  let url = "";
  let hexText = "";
  let error = "";
  try {
    base64 = atob(text.trim());
  } catch {
    error = "That is not base64.";
  }
  try {
    url = decodeURIComponent(text);
  } catch {
    url = "";
  }
  const compact = text.replace(/\s+/g, "");
  if (/^[0-9a-fA-F]+$/.test(compact) && compact.length % 2 === 0 && compact.length > 0) {
    hexText = new TextDecoder().decode(Uint8Array.from(compact.match(/../g)!.map((pair) => Number.parseInt(pair, 16))));
  }
  return (
    <ToolFrame>
      <Field label="Encoded text">
        <textarea className={`${inputClass} h-28 py-2`} value={text} onChange={(event) => setText(event.target.value)} />
      </Field>
      {error ? <p className="text-sm text-danger">{error}</p> : <Out label="Base64 decoded" value={base64} />}
      <Out label="URL decoded" value={url === text ? "" : url} />
      <Out label="Hex decoded" value={hexText} />
    </ToolFrame>
  );
}

function RegexTool() {
  const [pattern, setPattern] = useState(String.raw`\b(password|secret)\b`);
  const [flags, setFlags] = useState("gi");
  const [sample, setSample] = useState("password=hunter2\nSECRET token\nnot a match");
  let error = "";
  let hits: string[] = [];
  if (pattern.length > 200) {
    error = "Keep the pattern under 200 characters.";
  } else {
    try {
      const expression = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
      hits = [...sample.matchAll(expression)].map((match) => match[0]).slice(0, 50);
    } catch (reason) {
      error = reason instanceof Error ? reason.message : "Invalid pattern.";
    }
  }
  return (
    <ToolFrame>
      <Field label="Pattern">
        <input className={inputClass} value={pattern} onChange={(event) => setPattern(event.target.value)} />
      </Field>
      <Field label="Flags">
        <input className={inputClass} value={flags} onChange={(event) => setFlags(event.target.value)} />
      </Field>
      <Field label="Sample">
        <textarea className={`${inputClass} h-28 py-2`} value={sample} onChange={(event) => setSample(event.target.value.slice(0, 4000))} />
      </Field>
      {error ? <p className="text-sm text-danger">{error}</p> : hits.length === 0 ? <p className="text-sm text-muted">No matches.</p> : <Out label={`${hits.length} match${hits.length === 1 ? "" : "es"}`} value={hits.join("\n")} />}
    </ToolFrame>
  );
}

function TimeTool() {
  const [raw, setRaw] = useState("1700000000");
  const [now, setNow] = useState("");
  let parsed = "";
  const trimmed = raw.trim();
  if (/^\d{10}$/.test(trimmed) || /^\d{13}$/.test(trimmed)) {
    const ms = trimmed.length === 13 ? Number(trimmed) : Number(trimmed) * 1000;
    const date = new Date(ms);
    parsed = Number.isNaN(date.getTime()) ? "" : date.toISOString();
  } else if (trimmed) {
    const date = new Date(trimmed);
    parsed = Number.isNaN(date.getTime()) ? "" : `${date.toISOString()} · ${Math.floor(date.getTime() / 1000)}`;
  }
  return (
    <ToolFrame>
      <Field label="Unix time or an ISO date">
        <input className={inputClass} value={raw} onChange={(event) => setRaw(event.target.value)} />
      </Field>
      <Button
        tone="ghost"
        onClick={() => {
          const date = new Date();
          setNow(`${Math.floor(date.getTime() / 1000)} · ${date.toISOString()}`);
        }}
      >
        Read the clock
      </Button>
      <Out label="Converted" value={parsed} />
      <Out label="This browser, just now" value={now} />
    </ToolFrame>
  );
}

const HEADER_CHECKS: { name: string; why: string; test: (headers: string) => boolean }[] = [
  { name: "Strict-Transport-Security", why: "Tells the browser to stay on HTTPS.", test: (headers) => /strict-transport-security\s*:/i.test(headers) },
  { name: "Content-Security-Policy", why: "Limits where scripts and frames can come from.", test: (headers) => /content-security-policy\s*:/i.test(headers) },
  { name: "X-Content-Type-Options: nosniff", why: "Stops the browser guessing a content type.", test: (headers) => /x-content-type-options\s*:\s*nosniff/i.test(headers) },
  { name: "Frame control", why: "X-Frame-Options or frame-ancestors. This is the clickjacking fix.", test: (headers) => /x-frame-options\s*:/i.test(headers) || /frame-ancestors/i.test(headers) },
  { name: "Referrer-Policy", why: "Limits what the next site sees in Referer.", test: (headers) => /referrer-policy\s*:/i.test(headers) },
];

function HeaderTool() {
  const [headers, setHeaders] = useState("HTTP/1.1 200 OK\nContent-Type: text/html\nSet-Cookie: session=demo; Path=/\nX-Powered-By: Academy");
  const cookies = headers.split("\n").filter((line) => /^\s*set-cookie\s*:/i.test(line));
  const cookieNotes = cookies.map((line) => {
    const missing = ["Secure", "HttpOnly", "SameSite"].filter((flag) => !new RegExp(flag, "i").test(line));
    return missing.length ? `Cookie is missing ${missing.join(", ")}.` : "Cookie has Secure, HttpOnly, and SameSite.";
  });
  return (
    <ToolFrame>
      <Field label="Response headers">
        <textarea className={`${inputClass} h-36 py-2 font-mono`} value={headers} onChange={(event) => setHeaders(event.target.value)} />
      </Field>
      <ul className="grid gap-2">
        {HEADER_CHECKS.map((check) => {
          const ok = check.test(headers);
          return (
            <li key={check.name} className="rounded-xl border border-line px-3 py-2 text-sm">
              <span className={ok ? "text-teal" : "text-danger"}>{ok ? "Present" : "Missing"} · {check.name}</span>
              <span className="mt-1 block text-muted">{check.why}</span>
            </li>
          );
        })}
        {cookieNotes.map((note) => (
          <li key={note} className="text-sm text-muted">{note}</li>
        ))}
      </ul>
    </ToolFrame>
  );
}

function ToolFrame({ children }: { children: React.ReactNode }) {
  return <div className="grid max-w-2xl gap-4">{children}</div>;
}

function Out({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="mb-1 text-sm text-muted">{label}</p>
      <pre className="overflow-auto whitespace-pre-wrap rounded-xl border border-line bg-bg p-3 text-sm">{value}</pre>
    </div>
  );
}

function hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function decode(part: string) {
  const padded = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
  return atob(padded);
}

function parseCidr(input: string) {
  const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/.exec(input.trim());
  if (!match) return null;
  const octets = [1, 2, 3, 4].map((index) => Number(match[index]));
  const bits = Number(match[5]);
  if (octets.some((n) => n > 255) || bits > 32) return null;
  const ip = octets.reduce((acc, n) => ((acc << 8) + n) >>> 0, 0);
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const size = 2 ** (32 - bits);
  const hosts = bits >= 31 ? size : size - 2;
  const fmt = (value: number) => [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join(".");
  return {
    Network: fmt(network),
    Broadcast: fmt(broadcast),
    Mask: fmt(mask),
    Hosts: String(hosts),
    First: bits >= 31 ? fmt(network) : fmt(network + 1),
    Last: bits >= 31 ? fmt(broadcast) : fmt(broadcast - 1),
  };
}
