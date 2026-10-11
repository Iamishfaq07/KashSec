import { useState } from "react";
import { Button, Field, inputClass } from "@/components/ui";

function Panel({ title, body, bad }: { title: string; body: string; bad?: boolean }) {
  return (
    <article className="rounded-card border border-line p-4">
      <p className={bad ? "text-xs uppercase tracking-wider text-danger" : "text-xs uppercase tracking-wider text-teal"}>
        {title}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm">{body}</p>
    </article>
  );
}

export function CmdLab() {
  const [host, setHost] = useState("academy.local");
  const [ran, setRan] = useState(false);
  const broken = /[;&|`$()]/.test(host);
  const joined = `ping -c 1 ${host}`;

  return (
    <div className="grid gap-4">
      <Field label="Host the app will ping">
        <input className={inputClass} value={host} onChange={(event) => setHost(event.target.value)} />
      </Field>
      <p className="font-mono text-sm text-amber">{joined}</p>
      <Button onClick={() => setRan(true)}>Run the check</Button>
      {ran ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Panel
            title="String passed to a shell"
            bad={broken}
            body={
              broken
                ? "The shell treated what followed the separator as a second command. This page only simulates that. Nothing ran."
                : "One ping, simulated. The host stayed a single argument."
            }
          />
          <Panel
            title="Argument array"
            body={
              broken
                ? `ping received one argument: "${host}". The separator is data, not a new command.`
                : "Same result. The difference shows up only when the input contains shell syntax."
            }
          />
        </div>
      ) : (
        <p className="text-sm text-faint">Try academy.local, then academy.local; id</p>
      )}
    </div>
  );
}

export function MassLab() {
  const [name, setName] = useState("Ada");
  const [extra, setExtra] = useState('{"role":"admin"}');
  const [ran, setRan] = useState(false);
  let parsed: Record<string, string> = {};
  let parseError = "";
  try {
    const value = JSON.parse(extra) as unknown;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      parsed = Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, String(item)]),
      );
    } else {
      parseError = "Send a JSON object.";
    }
  } catch {
    parseError = "That is not JSON.";
  }
  const naive: Record<string, string> = { name, ...parsed };
  const allow = { name };

  return (
    <div className="grid gap-4">
      <Field label="Display name">
        <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} />
      </Field>
      <Field label="Extra JSON the form does not show">
        <textarea className={`${inputClass} h-24 py-2 font-mono`} value={extra} onChange={(event) => setExtra(event.target.value)} />
      </Field>
      <Button onClick={() => setRan(true)}>Save profile</Button>
      {ran ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Panel
            title="Bind every field"
            bad={naive.role === "admin"}
            body={parseError || JSON.stringify(naive, null, 2)}
          />
          <Panel title="Allowlist: name only" body={parseError || JSON.stringify(allow, null, 2)} />
        </div>
      ) : null}
    </div>
  );
}

const PUBLIC = "https://status.example/health";

export function SsrfLab() {
  const [url, setUrl] = useState("http://169.254.169.254/latest/meta-data/");
  const [ran, setRan] = useState(false);
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    host = "";
  }
  const allowed = host === "status.example";
  const internal = host === "169.254.169.254" || host === "127.0.0.1" || host === "localhost" || host.endsWith(".internal");
  const naive = !host
    ? "Not a URL."
    : internal
      ? "Placeholder only: role-name demo-role. A real metadata service was not contacted."
      : `Fetched ${host}. Public body: ok.`;

  return (
    <div className="grid gap-4">
      <Field label="URL the server will fetch">
        <input className={inputClass} value={url} onChange={(event) => setUrl(event.target.value)} />
      </Field>
      <Button onClick={() => setRan(true)}>Fetch</Button>
      {ran ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Panel title="Fetch anything" bad={internal} body={naive} />
          <Panel
            title="Allowlist"
            body={allowed ? "status.example is on the list. Body: ok." : `${host || "That host"} is not on the list. Refused.`}
          />
        </div>
      ) : (
        <p className="text-sm text-faint">Try the metadata address, then {PUBLIC}.</p>
      )}
    </div>
  );
}

export function RaceLab() {
  const [note, setNote] = useState("");

  function sequential() {
    let balance = 100;
    const first = balance >= 80 ? ((balance -= 80), "approved") : "declined";
    const second = balance >= 80 ? ((balance -= 80), "approved") : "declined";
    setNote(`One after the other: ${first}, then ${second}. Balance ${balance}.`);
  }

  function together() {
    const seen = 100;
    const first = seen >= 80;
    const second = seen >= 80;
    const balance = seen - (first ? 80 : 0) - (second ? 80 : 0);
    setNote(`Both requests read ${seen} before either write. Both approved. Balance ${balance}.`);
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted">Balance starts at 100. Each withdrawal asks for 80.</p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={sequential}>Send one, then the other</Button>
        <Button tone="ghost" onClick={together}>
          Send both at once
        </Button>
      </div>
      {note ? <p className="text-sm text-muted">{note}</p> : null}
    </div>
  );
}

async function hmac(body: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode("desk-secret"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return [...new Uint8Array(signed)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function WebhookLab() {
  const original = '{"event":"lesson.finished","id":"1001"}';
  const [body, setBody] = useState(original);
  const [result, setResult] = useState("");

  async function check() {
    const expected = await hmac(original);
    const actual = await hmac(body);
    setResult(
      actual === expected
        ? "Signature matches the original body."
        : `Signature does not match.\nExpected ${expected.slice(0, 16)}…\nGot      ${actual.slice(0, 16)}…`,
    );
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted">The sender signed the original body with a shared secret. Edit a byte.</p>
      <Field label="Body that arrives">
        <textarea className={`${inputClass} h-24 py-2 font-mono`} value={body} onChange={(event) => setBody(event.target.value)} />
      </Field>
      <Button onClick={() => void check()}>Check the signature</Button>
      {result ? <p className="whitespace-pre-wrap font-mono text-sm text-muted">{result}</p> : null}
    </div>
  );
}

export function ClickjackLab() {
  const [framed, setFramed] = useState(true);
  const [hit, setHit] = useState(false);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        <Button tone={framed ? "amber" : "ghost"} onClick={() => { setFramed(true); setHit(false); }}>
          Framed
        </Button>
        <Button tone={framed ? "ghost" : "teal"} onClick={() => { setFramed(false); setHit(false); }}>
          frame-ancestors none
        </Button>
      </div>
      {framed ? (
        <div className="relative h-56 overflow-hidden rounded-card border border-line bg-surface">
          <p className="p-4 text-sm text-muted">Settings, loaded inside someone else's page.</p>
          <div className="absolute inset-x-0 bottom-8 flex justify-center">
            <button type="button" className="h-11 rounded-full bg-danger px-4 text-amber-ink" onClick={() => setHit(true)}>
              Delete account
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
            <span className="flex h-11 items-center rounded-full bg-amber px-4 text-sm text-amber-ink">See the sticker</span>
          </div>
        </div>
      ) : (
        <div className="flex h-56 items-center justify-center rounded-card border border-dashed border-line text-sm text-muted">
          The settings page refused to be framed.
        </div>
      )}
      {hit ? (
        <p className="text-sm text-danger">That click landed on Delete account. The sticker was only paint on top.</p>
      ) : (
        <p className="text-sm text-faint">Click the sticker. Then turn framing off and try again.</p>
      )}
    </div>
  );
}

const REGISTERED = "https://kashsec.example/callback";

export function OauthLab() {
  const [uri, setUri] = useState("https://kashsec.example.evil.test/callback");
  const [ran, setRan] = useState(false);
  const exact = uri === REGISTERED;
  const prefix = uri.startsWith("https://kashsec.example");

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted">Registered redirect: {REGISTERED}</p>
      <Field label="redirect_uri on the request">
        <input className={inputClass} value={uri} onChange={(event) => setUri(event.target.value)} />
      </Field>
      <Button onClick={() => setRan(true)}>Send the code</Button>
      {ran ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Panel title="Prefix match" bad={prefix && !exact} body={prefix ? `Allowed. Code would go to ${uri}` : "Refused."} />
          <Panel title="Exact match" body={exact ? "Allowed. The URI is the one that was registered." : "Refused. Not the registered URI."} />
        </div>
      ) : null}
    </div>
  );
}

export function XxeLab() {
  const [xml, setXml] = useState(
    `<?xml version="1.0"?>\n<!DOCTYPE note [\n  <!ENTITY xxe SYSTEM "file:///etc/hostname">\n]>\n<note>&xxe;</note>`,
  );
  const [ran, setRan] = useState(false);
  const hasDoctype = /<!DOCTYPE/i.test(xml);
  const fileEntity = /ENTITY[\s\S]+SYSTEM/i.test(xml);

  return (
    <div className="grid gap-4">
      <Field label="XML the parser receives">
        <textarea className={`${inputClass} h-36 py-2 font-mono`} value={xml} onChange={(event) => setXml(event.target.value)} />
      </Field>
      <Button onClick={() => setRan(true)}>Parse</Button>
      {ran ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Panel
            title="Entities on"
            bad={fileEntity}
            body={
              fileEntity
                ? "Expanded to academy-web-01. Simulated. No file on this machine was opened."
                : "No external entity. The note text is what it says."
            }
          />
          <Panel
            title="Entities off"
            body={hasDoctype ? "Rejected the document because it has a doctype." : "Parsed the note. No doctype to refuse."}
          />
        </div>
      ) : null}
    </div>
  );
}

const LIMIT = 3;

export function RateLab() {
  const [header, setHeader] = useState("203.0.113.10");
  const [byHeader, setByHeader] = useState<Record<string, number>>({});
  const [real, setReal] = useState(0);
  const [note, setNote] = useState("");

  function send() {
    const key = header.trim() || "blank";
    const headerCount = (byHeader[key] ?? 0) + 1;
    const realCount = real + 1;
    setByHeader({ ...byHeader, [key]: headerCount });
    setReal(realCount);
    const headerSays = headerCount > LIMIT ? "blocked" : "allowed";
    const realSays = realCount > LIMIT ? "blocked" : "allowed";
    setNote(`Keyed on X-Forwarded-For: ${headerSays} (${headerCount}). Keyed on the actual client: ${realSays} (${realCount}).`);
  }

  return (
    <div className="grid gap-4">
      <Field label="X-Forwarded-For you claim to be">
        <input className={inputClass} value={header} onChange={(event) => setHeader(event.target.value)} />
      </Field>
      <Button onClick={send}>Send a login</Button>
      <p className="text-sm text-faint">The limit is {LIMIT}. Change the header and the weak counter starts over. You are still the same browser.</p>
      {note ? <p className="text-sm text-muted">{note}</p> : null}
    </div>
  );
}

type Entry = string | { [name: string]: Entry };

const TREE: Entry = {
  home: {
    ada: {
      "notes.txt": "Finish path 00 before path 04.\nThen come back and cat this file again.",
      "todo.txt": "pwd, ls, cd, cat. A pipe is two of those in a row.",
    },
  },
  etc: {
    hostname: "academy-web",
  },
};

function lookup(path: string[]): Entry | null {
  let node: Entry = TREE;
  for (const part of path) {
    if (typeof node === "string" || !(part in node)) return null;
    node = node[part];
  }
  return node;
}

function resolve(cwd: string[], arg: string) {
  if (!arg) return cwd;
  const parts = arg.startsWith("/") ? [] : [...cwd];
  for (const part of arg.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return parts;
}

export function TerminalLab() {
  const [cwd, setCwd] = useState(["home", "ada"]);
  const [log, setLog] = useState<string[]>(["help lists the commands."]);
  const [input, setInput] = useState("");

  function push(next: string[], text: string) {
    setCwd(next);
    setLog((lines) => [...lines, text].slice(-24));
  }

  function runOne(line: string, at: string[], stdin: string) {
    const [cmd, ...rest] = line.trim().split(/\s+/);
    const arg = rest.join(" ");
    if (!cmd) return { out: stdin, cwd: at };
    if (cmd === "help") return { out: "pwd  ls  cd  cat  grep  wc", cwd: at };
    if (cmd === "pwd") return { out: `/${at.join("/")}`, cwd: at };
    if (cmd === "ls") {
      const path = resolve(at, arg);
      const node = lookup(path);
      if (!node) return { out: "No such path.", cwd: at };
      if (typeof node === "string") return { out: path.at(-1) ?? "", cwd: at };
      return { out: Object.keys(node).join("  "), cwd: at };
    }
    if (cmd === "cd") {
      const path = resolve(at, arg || "/home/ada");
      const node = lookup(path);
      if (!node || typeof node === "string") return { out: "Not a directory.", cwd: at };
      return { out: "", cwd: path };
    }
    if (cmd === "cat") {
      const node = lookup(resolve(at, arg));
      if (typeof node !== "string") return { out: "Not a file.", cwd: at };
      return { out: node, cwd: at };
    }
    if (cmd === "grep") {
      const word = arg.toLowerCase();
      const hits = stdin.split("\n").filter((row) => row.toLowerCase().includes(word));
      return { out: hits.join("\n") || "(no match)", cwd: at };
    }
    if (cmd === "wc") {
      const words = stdin.trim() ? stdin.trim().split(/\s+/).length : 0;
      return { out: `${stdin.split("\n").length} lines, ${words} words`, cwd: at };
    }
    return { out: "Not in this lab. Try help.", cwd: at };
  }

  function submit() {
    const raw = input.trim();
    if (!raw) return;
    const stages = raw.split("|").map((part) => part.trim());
    let at = cwd;
    let text = "";
    for (const stage of stages) {
      const step = runOne(stage, at, text);
      at = step.cwd;
      text = step.out;
    }
    push(at, `$ ${raw}${text ? `\n${text}` : ""}`);
    setInput("");
  }

  return (
    <div className="grid gap-3">
      <pre className="max-h-80 overflow-auto rounded-card border border-line bg-bg p-4 font-mono text-sm text-fg">
        {log.join("\n")}
        <span className="text-amber">{`\n/${cwd.join("/")} $`}</span>
      </pre>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <input
          className={inputClass}
          value={input}
          aria-label="Command"
          placeholder="cat notes.txt | wc"
          onChange={(event) => setInput(event.target.value)}
        />
        <Button type="submit">Run</Button>
      </form>
    </div>
  );
}
