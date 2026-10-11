import { useState } from "react";
import { Button, Field, inputClass } from "@/components/ui";

function Panel({ title, body, bad }: { title: string; body: string; bad?: boolean }) {
  return (
    <article className="rounded-card border border-line p-4">
      <p className={bad ? "text-xs uppercase tracking-wider text-danger" : "text-xs uppercase tracking-wider text-teal"}>{title}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm">{body}</p>
    </article>
  );
}

const FILES: Record<string, string> = {
  "README.md": "Academy web. Nothing sensitive in the current tree.",
  ".env": "AWS_ACCESS_KEY_ID=AKIADEMO0000000000\nAWS_SECRET_ACCESS_KEY=desk-demo-not-a-real-secret",
  "Dockerfile": "FROM node:20\n# an old layer still has ENV DB_PASSWORD=desk-demo",
};

export function SecretLab() {
  const [query, setQuery] = useState("AKIA");
  const needle = query.trim().toLowerCase();
  const hits = Object.entries(FILES).filter(([name, body]) => `${name}\n${body}`.toLowerCase().includes(needle));
  return (
    <div className="grid gap-4">
      <Field label="Search names and contents">
        <input className={inputClass} value={query} onChange={(event) => setQuery(event.target.value)} />
      </Field>
      <ul className="grid gap-2">
        {(hits.length ? hits : Object.entries(FILES)).map(([name, body]) => (
          <li key={name} className="rounded-card border border-line p-3">
            <p className="text-sm text-amber">{name}</p>
            <pre className="mt-2 whitespace-pre-wrap text-sm text-muted">{body}</pre>
          </li>
        ))}
      </ul>
      <p className="text-sm text-faint">The values are placeholders. A real key in git history or an image layer is already compromised. Rotate it.</p>
    </div>
  );
}

export function GraphqlLab() {
  const [query, setQuery] = useState("{ users { email passwordHash } }");
  const [ran, setRan] = useState(false);
  const asksHash = /passwordHash/.test(query);
  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted">Schema includes User.email and User.passwordHash. The UI never asks for the hash.</p>
      <Field label="Query">
        <textarea className={`${inputClass} h-24 py-2 font-mono`} value={query} onChange={(event) => setQuery(event.target.value)} />
      </Field>
      <Button onClick={() => setRan(true)}>Run</Button>
      {ran ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Panel title="Introspection open" bad={asksHash} body={asksHash ? "Returned a placeholder hash. No real password was stored here." : "Returned emails only."} />
          <Panel title="Field removed" body={asksHash ? "passwordHash is not in the production schema." : "The query is fine."} />
        </div>
      ) : null}
    </div>
  );
}

const LOGS = [
  "10:01 sshd Failed password for ada from 203.0.113.8",
  "10:02 sshd Failed password for ada from 203.0.113.8",
  "10:03 sshd Failed password for ada from 203.0.113.8",
  "10:04 sshd Accepted password for ada from 198.51.100.77",
  "10:05 cron backup ok",
];

export function LogLab() {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="grid gap-2">
      {LOGS.map((line, index) => (
        <button
          key={line}
          type="button"
          onClick={() => setPicked(index)}
          className="rounded-xl border border-line px-3 py-2 text-left font-mono text-sm"
        >
          {line}
        </button>
      ))}
      {picked === null ? null : picked === 3 ? (
        <p className="text-sm text-teal">That is the one. Failures from one address, then a success from another.</p>
      ) : (
        <p className="text-sm text-muted">Look again at the source address on the success.</p>
      )}
    </div>
  );
}

const WORDS = ["123456", "password", "qwerty", "kashsec", "letmein", "admin"];

export function CrackLab() {
  const [found, setFound] = useState("");
  async function run() {
    const target = await sha256("password");
    for (const word of WORDS) {
      if ((await sha256(word)) === target) {
        setFound(`${word} matched SHA-256 in this short list. A slow password hash would make even this list expensive. Length still matters more.`);
        return;
      }
    }
    setFound("No hit.");
  }
  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted">One SHA-256, six guesses. This is a demo hash, not someone's password.</p>
      <Button onClick={() => void run()}>Try the list</Button>
      {found ? <p className="text-sm text-muted">{found}</p> : null}
    </div>
  );
}

async function sha256(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function YaraLab() {
  const [needle, setNeedle] = useState("malware-demo");
  const sample = "bundle includes malware-demo-string and a mutex";
  const good = "invoice 2026 for desk repair";
  const tooShort = needle.trim().length < 4;
  const hitSample = !tooShort && sample.includes(needle.trim());
  const hitGood = !tooShort && good.includes(needle.trim());
  const verdict = tooShort ? "Too short. It will match half the disk." : hitSample && hitGood ? "Too wide. It matches the invoice too." : hitSample ? "Useful. The sample hits, the invoice does not." : "The sample does not hit.";
  return (
    <div className="grid gap-4">
      <Field label="String the rule requires">
        <input className={inputClass} value={needle} onChange={(event) => setNeedle(event.target.value)} />
      </Field>
      <Panel title="Sample" body={sample} />
      <Panel title="Boring file" body={good} />
      <p className="text-sm text-muted">{verdict}</p>
    </div>
  );
}

const RECORDS = [
  { id: "a", name: "A", value: "203.0.113.10" },
  { id: "mx", name: "MX", value: "mail.academy.example" },
  { id: "txt", name: "TXT", value: "v=spf1 include:mail.example -all" },
  { id: "cname", name: "CNAME www", value: "unclaimed.github.io" },
];

export function DnsLab() {
  const [picked, setPicked] = useState("");
  return (
    <div className="grid gap-2">
      {RECORDS.map((record) => (
        <button key={record.id} type="button" onClick={() => setPicked(record.id)} className="rounded-xl border border-line px-3 py-2 text-left text-sm">
          <span className="text-amber">{record.name}</span> {record.value}
        </button>
      ))}
      {picked ? (
        <p className="text-sm text-muted">
          {picked === "cname"
            ? "That CNAME points at a name nobody claimed. Delete it, or claim it on purpose."
            : "That record is ordinary. Look for the name that points at a service you do not control."}
        </p>
      ) : (
        <p className="text-sm text-faint">Which record is the problem?</p>
      )}
    </div>
  );
}

export function BolaLab() {
  const [call, setCall] = useState("");
  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted">Signed in as Ada, a customer. Her order is 1001.</p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setCall("order")}>GET /orders/1002</Button>
        <Button tone="ghost" onClick={() => setCall("export")}>POST /admin/export</Button>
      </div>
      {call === "order" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Panel title="No object check" bad body="Order 1002 belongs to Linus. The session was valid, the object was not hers." />
          <Panel title="Checked" body="Refused. Ada can read 1001 only." />
        </div>
      ) : null}
      {call === "export" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Panel title="Hidden button only" bad body="The route still ran. Hiding it in the UI is not authorization." />
          <Panel title="Role check" body="Refused. Customers cannot call export." />
        </div>
      ) : null}
    </div>
  );
}

const MISCONFIGS = [
  { id: "host", label: "/etc/hostname is world-readable", bad: false, note: "That file is public on purpose." },
  { id: "vim", label: "sudo NOPASSWD: /usr/bin/vim", bad: true, note: "Vim can spawn a shell. This is root." },
  { id: "home", label: "Ada can write her own home directory", bad: false, note: "That is normal. It is not privilege escalation." },
];

export function LinuxLab() {
  const [picked, setPicked] = useState("");
  const chosen = MISCONFIGS.find((item) => item.id === picked);
  return (
    <div className="grid gap-2">
      {MISCONFIGS.map((item) => (
        <button key={item.id} type="button" onClick={() => setPicked(item.id)} className="rounded-xl border border-line px-3 py-2 text-left text-sm">
          {item.label}
        </button>
      ))}
      {chosen ? <p className={chosen.bad ? "text-sm text-danger" : "text-sm text-muted"}>{chosen.note}</p> : null}
    </div>
  );
}

export function DeserialLab() {
  const [raw, setRaw] = useState('{"user":"ada","__proto__":{"admin":true}}');
  const [ran, setRan] = useState(false);
  let parsed = false;
  let proto = false;
  try {
    const value = JSON.parse(raw) as Record<string, unknown>;
    parsed = true;
    proto = Object.prototype.hasOwnProperty.call(value, "__proto__") || Object.prototype.hasOwnProperty.call(value, "constructor");
  } catch {
    parsed = false;
  }
  return (
    <div className="grid gap-4">
      <Field label="Bytes the server will trust">
        <textarea className={`${inputClass} h-24 py-2 font-mono`} value={raw} onChange={(event) => setRaw(event.target.value)} />
      </Field>
      <Button onClick={() => setRan(true)}>Deserialize</Button>
      {ran ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Panel title="Merge onto the object" bad={proto} body={!parsed ? "Not JSON." : proto ? "admin flipped to true. Simulated. Nothing in this page's prototype was changed." : "Stored the user field."} />
          <Panel title="Schema only" body={!parsed ? "Rejected." : "Kept user. Dropped every other key."} />
        </div>
      ) : null}
    </div>
  );
}

const LOOSE = `{
  "Effect": "Allow",
  "Action": "*",
  "Resource": "*"
}`;
const TIGHT = `{
  "Effect": "Allow",
  "Action": ["s3:GetObject"],
  "Resource": "arn:aws:s3:::academy-logs/*"
}`;

export function IamLab() {
  const [tight, setTight] = useState(false);
  return (
    <div className="grid gap-4">
      <pre className="overflow-auto rounded-card border border-line bg-bg p-4 text-sm">{tight ? TIGHT : LOOSE}</pre>
      <Button tone={tight ? "teal" : "amber"} onClick={() => setTight((value) => !value)}>
        {tight ? "Show the wildcard" : "Tighten to the call the job makes"}
      </Button>
      <p className="text-sm text-muted">
        {tight ? "One action, one bucket prefix." : "A star on Action is every API in the account."}
      </p>
    </div>
  );
}
