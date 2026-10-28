export type Lab = {
  id: string;
  title: string;
  summary: string;
  playable?: boolean;
  steps: string[];
};

export const labs: Lab[] = [
  {
    id: "sqli",
    title: "SQL injection sandbox",
    playable: true,
    summary: "A fake login shows the exact query your input becomes. Break in, then read why the fix is parameterized queries.",
    steps: ["Watch the query update as you type.", "Try a classic tautology.", "Notice the password is never checked once the logic is short-circuited."],
  },
  {
    id: "phishing",
    title: "Phishing spotter",
    playable: true,
    summary: "Four short messages. Decide which ones are trying to steal a session, and which are ordinary.",
    steps: ["Read the sender and the ask, not the logo.", "Hover the destination in your head.", "Check the explanation after each pick."],
  },
  {
    id: "jwt",
    title: "JWT lab",
    playable: true,
    summary: "Decode a token, edit the payload, and watch a real HMAC signature fail. alg:none is called out, not rewarded.",
    steps: ["Read header and payload.", "Change the role.", "Verify against the demo secret."],
  },
  {
    id: "prompt-injection",
    title: "Prompt injection simulator",
    playable: true,
    summary: "A toy assistant summarizes a document. Instructions hidden in the document try to override it. You see both the naive and the defended result.",
    steps: ["Read the system rule.", "Leave the planted instruction, or write your own.", "Compare the two outcomes."],
  },
  { id: "ad-attack", title: "Active Directory attack lab", playable: true, summary: "Walk a three-stage story: recon, Kerberoasting, and why a golden ticket means the domain is already lost.", steps: ["Map trusts before touching a password.", "Kerberoast only service accounts you are allowed to test.", "Treat a golden ticket as an incident, not a trophy."] },
  { id: "agentic-risk", title: "Agentic risk scenario", playable: true, summary: "An agent with tools can be talked into actions the user never asked for. Practice spotting over-broad tool grants.", steps: ["List every tool the agent can call.", "Ask what happens if a web page contains instructions.", "Shrink the tool set before you ship."] },
  { id: "bola-bfla", title: "BOLA / BFLA playground", playable: true, summary: "Object IDs and function names are not authorization. Practice swapping identifiers and roles.", steps: ["You are Ada, a customer.", "Open someone else's order.", "Call the admin export the UI hides."] },
  { id: "clickjacking", title: "Clickjacking simulator", playable: true, summary: "A transparent frame steals a click meant for something else.", steps: ["Click the sticker.", "See which control actually received it.", "Turn framing off."] },
  { id: "clouddockersecrets", title: "Leaked secret hunt", playable: true, summary: "Secrets in git history, env files, and image layers.", steps: ["Search for AKIA.", "Open the Dockerfile note.", "Treat a found key as already compromised."] },
  { id: "cmdinjection", title: "Command injection sandbox", playable: true, summary: "User input concatenated into a shell command.", steps: ["Read the command string.", "Add a separator.", "Compare that with an argument array."] },
  { id: "csrf", title: "CSRF playground", playable: true, summary: "A browser will send cookies to a site the user did not mean to call.", steps: ["See a transfer that includes a token.", "Submit the same transfer from another page, without the token.", "The cookie alone is not permission."] },
  { id: "deserialization", title: "Insecure deserialization toy", playable: true, summary: "Untrusted bytes that become objects can become code.", steps: ["Leave the extra key in the JSON.", "See the naive merge.", "A schema keeps one field."] },
  { id: "dnsrecon", title: "DNS recon playground", playable: true, summary: "Public DNS already tells an attacker the shape of a network.", steps: ["Read the four records.", "Pick the one that points somewhere unclaimed.", "Recon is not permission to connect."] },
  { id: "dockerescape", title: "Docker escape playground", playable: true, summary: "A container is a boundary only if it is configured like one.", steps: ["Check the socket mount.", "Check privileged and capabilities.", "Assume a mounted docker.sock is host root."] },
  { id: "graphql-introspection", title: "GraphQL introspection", playable: true, summary: "An open schema is a map of every query, including the ones the UI never shows.", steps: ["Read the schema note.", "Ask for passwordHash.", "See it disappear when the field is removed."] },
  { id: "iammisconfig", title: "Cloud IAM misconfig", playable: true, summary: "Wildcard actions and trust policies that trust the world.", steps: ["Read the star.", "Tighten to the one call the job makes.", "A star on Action is every API."] },
  { id: "idor", title: "IDOR playground", playable: true, summary: "A predictable id plus a missing check.", steps: ["You are signed in as Ada.", "Change the record id.", "Compare what the naive API returns with what a checked API returns."] },
  { id: "indirect-injection", title: "Indirect prompt injection", playable: true, summary: "The malicious instruction is not in the chat. It is in a page, email, or ticket the model was asked to read.", steps: ["Find the instruction in the retrieved text.", "See which tool it tries to fire.", "Treat retrieved text as data."] },
  { id: "irtabletop", title: "Incident tabletop", playable: true, summary: "A timed scenario: detect, contain, tell the truth, recover.", steps: ["Write the first three actions.", "Name who you tell.", "Do not wipe the evidence you will need."] },
  { id: "jailbreak", title: "Jailbreak playground", playable: true, summary: "Role-play and override prompts are not a personality. They are an input-handling bug.", steps: ["Read the original instruction.", "See the override attempt.", "The product should ignore instructions that fight the policy."] },
  { id: "kerberoast", title: "Kerberoasting simulator", playable: true, summary: "An authenticated domain user can usually request a service ticket. A weak service-account password can expose its encrypted part to offline cracking.", steps: ["Identify the SPN.", "See what leaves the domain controller.", "Use long random service passwords or managed service accounts."] },
  { id: "linuxprivesc", title: "Linux privilege escalation", playable: true, summary: "SUID, sudo, cron, and writable paths. Local, after you already have a foothold you were given.", steps: ["Read the three findings.", "Pick the one that becomes root.", "A readable hostname is not it."] },
  { id: "loganalysis", title: "Log analysis", playable: true, summary: "An incident hidden in ordinary lines.", steps: ["Read them in order.", "Compare the source addresses.", "The success is the interesting line."] },
  { id: "malwarestrings", title: "Malware strings triage", playable: true, summary: "Strings are a first look, not a verdict.", steps: ["Pull readable strings.", "Separate URLs, paths, and noise.", "Do not run the sample."] },
  { id: "mass-assignment", title: "Mass assignment", playable: true, summary: "The API binds every JSON field onto the model, including isAdmin.", steps: ["Save a normal name.", "Add role in the extra JSON.", "See the allowlist drop it."] },
  { id: "oauthredirect", title: "OAuth redirect hijack", playable: true, summary: "If the redirect URI is loose, the authorization code goes to the attacker.", steps: ["Compare with the registered URI.", "Try a lookalike host.", "Exact match refuses it. A prefix match does not."] },
  { id: "openredirect", title: "Open redirect", playable: true, summary: "A next= parameter that will send the browser anywhere.", steps: ["Try a path on this site.", "Try a full URL.", "See which one a strict check allows."] },
  { id: "osint", title: "OSINT sandbox", playable: true, summary: "What a username, a cert, and a job post already reveal.", steps: ["Stay on public sources.", "Write what you can prove.", "Stop before you touch a login."] },
  { id: "passwordcrack", title: "Password cracking lab", playable: true, summary: "Why a fast hash and a human password lose, and why a slow hash still needs a long secret.", steps: ["Run the six-word list.", "See which guess hits.", "This hash belongs to the lab, not to a person."] },
  { id: "pcap", title: "Packet capture viewer", playable: true, summary: "Read a small capture: who talked, on which port, in cleartext or not.", steps: ["Group by conversation.", "Find the credential or the beacon.", "Do not capture networks you do not own."] },
  { id: "racecondition", title: "Race condition lab", playable: true, summary: "Two requests, one balance, no lock.", steps: ["Send the withdrawals one after the other.", "Send the pair together.", "Both read the old balance."] },
  { id: "rate-limit-bypass", title: "Rate-limit bypass", playable: true, summary: "Limits that key on a header the client sets are not limits.", steps: ["Hit the limit.", "Change X-Forwarded-For.", "The real client counter does not reset."] },
  { id: "ssrf", title: "SSRF playground", playable: true, summary: "The server fetches a URL you supply, including addresses it can see and you cannot.", steps: ["Point it at a link-local address.", "Point it at the public status host.", "The allowlist only knows one host."] },
  { id: "subdomaintakeover", title: "Subdomain takeover", playable: true, summary: "A dangling CNAME to a service nobody claimed.", steps: ["Read the DNS.", "See the unclaimed target.", "Delete the record or claim it on purpose."] },
  { id: "terminal", title: "Terminal simulator", playable: true, summary: "A small shell for people who have not lived in one yet.", steps: ["pwd, ls, cd.", "cat a file.", "Pipe it into wc."] },
  { id: "traversal", title: "Path traversal", playable: true, summary: "../ sequences that walk out of the folder the app meant to serve.", steps: ["Open a file inside public.", "Step upward with ../.", "See the path the server actually joined."] },
  { id: "vendortiering", title: "Vendor risk tiering", playable: true, summary: "Not every supplier gets the same questionnaire. Data and access decide the tier.", steps: ["What data can they touch?", "What if they vanish tomorrow?", "Write the tier in one line."] },
  { id: "webapp", title: "Vulnerable web app", playable: true, summary: "A single small app with several bugs stacked, the way real ones are.", steps: ["Map the requests.", "Pick one bug and finish it.", "Write the fix next to the finding."] },
  { id: "webhookforge", title: "Webhook signature forgery", playable: true, summary: "A webhook without a checked signature is just an open endpoint.", steps: ["Check the original body.", "Change a byte.", "The MAC no longer matches."] },
  { id: "winprivesc", title: "Windows privilege escalation", playable: true, summary: "Services, weak permissions, and tokens. Local practice after a foothold you were given.", steps: ["Who is the service running as?", "Who can write the binary path?", "A service restart is the moment it matters."] },
  { id: "xxe", title: "XXE playground", playable: true, summary: "An XML parser that still resolves external entities.", steps: ["Leave the doctype in place.", "Parse with entities on, then off.", "The file read is simulated."] },
  { id: "yarabuilder", title: "YARA rule builder", playable: true, summary: "A rule that matches the sample and not the whole disk.", steps: ["Start with malware-demo.", "Try a short string like a.", "A useful rule misses the invoice."] },
];

export function getLab(id: string) {
  return labs.find((lab) => lab.id === id);
}

const pathLabs: Record<string, string> = {
  "00-fresher-basics": "terminal",
  "01-introduction": "phishing",
  "02-networking": "pcap",
  "03-linux": "linuxprivesc",
  "04-python": "cmdinjection",
  "05-web-basics": "openredirect",
  "06-crypto-fundamentals": "jwt",
  "07-windows-security": "winprivesc",
  "08-cloud-basics": "iammisconfig",
  "09-digital-privacy": "osint",
  "10-fundamentals": "loganalysis",
  "11-web-security": "sqli",
  "12-network-security": "ssrf",
  "13-mobile-security": "idor",
  "14-ethical-hacking": "webapp",
  "15-bug-bounty": "idor",
  "16-advanced": "kerberoast",
  "17-malware-re": "malwarestrings",
  "18-ai-security": "prompt-injection",
  "19-ctf-challenges": "yarabuilder",
  "20-career-prep": "vendortiering",
  "21-api-security": "bola-bfla",
  "22-devsecops-appsec": "clouddockersecrets",
  "23-grc-compliance": "irtabletop",
  "24-zero-trust": "oauthredirect",
  "25-ot-ics-security": "dnsrecon",
};

export function labForPath(pathId: string) {
  return getLab(pathLabs[pathId] ?? "");
}
