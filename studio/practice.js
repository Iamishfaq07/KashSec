/* Graded browser labs and the 18-lab catalog.
   No DOM. Secure and vulnerable fixtures are checked by validatePractice(). */

function tally(results) {
  return { results, passed: results.every(item => item.pass), passedCount: results.filter(item => item.pass).length, total: results.length };
}

function oauthDecision(policy, item) {
  if (policy.stateCheck === 'exact' && item.state !== item.expectedState) return 'deny';
  if (policy.nonceCheck === 'exact' && item.nonce !== item.expectedNonce) return 'deny';
  if (policy.redirect === 'exact' && item.redirect !== item.registered) return 'deny';
  if (policy.redirect === 'prefix' && !String(item.redirect).startsWith('https://app.northbridge.test')) return 'deny';
  const granted = policy.scope === 'intersection'
    ? item.requested.filter(scope => item.allowed.includes(scope))
    : item.requested.slice();
  if (granted.some(scope => !item.allowed.includes(scope))) return 'deny';
  if (item.need && !granted.includes(item.need)) return 'deny';
  return 'allow';
}

const OAUTH_CASES = [
  {
    id: 'happy',
    title: 'Matching state, nonce, redirect, and openid',
    state: 's1', expectedState: 's1', nonce: 'n1', expectedNonce: 'n1',
    redirect: 'https://app.northbridge.test/callback', registered: 'https://app.northbridge.test/callback',
    requested: ['openid'], allowed: ['openid', 'profile'], need: 'openid',
    expect: 'allow',
    why: 'The values match the request this browser started, and openid is allowed.'
  },
  {
    id: 'state',
    title: 'Callback state does not match',
    state: 'other', expectedState: 's1', nonce: 'n1', expectedNonce: 'n1',
    redirect: 'https://app.northbridge.test/callback', registered: 'https://app.northbridge.test/callback',
    requested: ['openid'], allowed: ['openid', 'profile'], need: 'openid',
    expect: 'deny',
    why: 'State is how you recognise your own login attempt. A mismatch is not a successful login.'
  },
  {
    id: 'nonce',
    title: 'ID token nonce does not match',
    state: 's1', expectedState: 's1', nonce: 'other', expectedNonce: 'n1',
    redirect: 'https://app.northbridge.test/callback', registered: 'https://app.northbridge.test/callback',
    requested: ['openid'], allowed: ['openid', 'profile'], need: 'openid',
    expect: 'deny',
    why: 'Nonce binds the token to this browser’s request. A reused or swapped token should fail.'
  },
  {
    id: 'redirect',
    title: 'Redirect host is a lookalike',
    state: 's1', expectedState: 's1', nonce: 'n1', expectedNonce: 'n1',
    redirect: 'https://app.northbridge.test.evil.test/callback', registered: 'https://app.northbridge.test/callback',
    requested: ['openid'], allowed: ['openid', 'profile'], need: 'openid',
    expect: 'deny',
    why: 'A prefix check treats the lookalike host as the real app. Compare the whole registered redirect.'
  },
  {
    id: 'scope',
    title: 'The request also asks for admin',
    state: 's1', expectedState: 's1', nonce: 'n1', expectedNonce: 'n1',
    redirect: 'https://app.northbridge.test/callback', registered: 'https://app.northbridge.test/callback',
    requested: ['openid', 'admin'], allowed: ['openid', 'profile'], need: 'openid',
    expect: 'allow',
    why: 'Accept the login only when admin is dropped. Granting every requested scope keeps admin.'
  }
];

const SIGMA_EVENTS = [
  { id: 'cross', user: 'bob', status: '200', session: 'acme', query: 'birch' },
  { id: 'miss', user: 'bob', status: '404', session: 'acme', query: 'birch' },
  { id: 'own', user: 'alice', status: '200', session: 'acme', query: 'acme' }
];

function sigmaHits(rule) {
  return SIGMA_EVENTS.filter(event => {
    if (rule.status !== 'any' && rule.status !== event.status) return false;
    if (rule.relation === 'mismatch' && event.session === event.query) return false;
    if (rule.relation === 'match' && event.session !== event.query) return false;
    if (rule.user !== 'any' && rule.user !== event.user) return false;
    return true;
  }).map(event => event.id);
}

export const PRACTICE_LABS = [
  {
    id: 'http',
    title: 'HTTP request inspector',
    minutes: 15,
    summary: 'Say what a status code claims. A 200 is the server’s response, not proof that authorization was correct.',
    skillId: 'web.http.status',
    mode: 'choices',
    fields: [],
    items: [
      { id: 'ok', prompt: 'GET /invoices/7 returned 200 and a JSON body.', options: [['success', 'The server returned a representation'], ['unauth', 'The caller is not logged in'], ['missing', 'No such invoice exists']], answer: 'success', why: '200 means the server chose to send a body. It does not, by itself, prove an authorization check ran.' },
      { id: 'unauth', prompt: 'GET /invoices/7 returned 401.', options: [['success', 'The invoice was returned'], ['unauth', 'The server did not accept the caller’s identity'], ['forbid', 'The caller is known, but not allowed']], answer: 'unauth', why: '401 means authentication failed or was not supplied. It is not the same as 403.' },
      { id: 'forbid', prompt: 'GET /invoices/7 returned 403.', options: [['unauth', 'The caller is not logged in'], ['forbid', 'The server knows the caller and refuses this action'], ['missing', 'The invoice does not exist']], answer: 'forbid', why: '403 means the server refused an identified caller. It is not a login failure.' },
      { id: 'missing', prompt: 'GET /invoices/999 returned 404.', options: [['forbid', 'The caller is forbidden'], ['missing', 'The server says that resource is not there'], ['success', 'The invoice was returned']], answer: 'missing', why: '404 means the server did not find that target. Some APIs hide objects this way. Do not invent a different meaning.' }
    ],
    secureInput: { ok: 'success', unauth: 'unauth', forbid: 'forbid', missing: 'missing' },
    vulnerableInput: { ok: 'unauth', unauth: 'success', forbid: 'missing', missing: 'success' }
  },
  {
    id: 'oauth',
    title: 'OAuth and OIDC debugger',
    minutes: 25,
    summary: 'Check state, nonce, the registered redirect, and scope on a fictional Northbridge login. Nothing contacts an identity provider.',
    skillId: 'web.authn.jwt',
    mode: 'policy',
    fields: [
      { name: 'stateCheck', label: 'State', options: [['ignore', 'Ignore state'], ['exact', 'Require the exact state']] },
      { name: 'nonceCheck', label: 'Nonce', options: [['ignore', 'Ignore nonce'], ['exact', 'Require the exact nonce']] },
      { name: 'redirect', label: 'Redirect', options: [['prefix', 'Allow any URL that starts with the app host'], ['exact', 'Allow only the registered redirect prefix as a whole host match']] },
      { name: 'scope', label: 'Scope', options: [['requested', 'Grant every requested scope'], ['intersection', 'Grant only scopes the app is allowed']] }
    ],
    secureInput: { stateCheck: 'exact', nonceCheck: 'exact', redirect: 'exact', scope: 'intersection' },
    vulnerableInput: { stateCheck: 'ignore', nonceCheck: 'ignore', redirect: 'prefix', scope: 'requested' },
    check(policy) {
      const results = OAUTH_CASES.map(item => {
        const got = oauthDecision(policy, item);
        return { id: item.id, title: item.title, pass: got === item.expect, why: item.why, expect: item.expect, got };
      });
      return tally(results);
    }
  },
  {
    id: 'k8s',
    title: 'Kubernetes workload check',
    minutes: 20,
    summary: 'Admit a fictional billing worker. It does not need host networking, root, a moving tag, or a secret in an environment variable.',
    skillId: 'cloud.iam.least-privilege',
    mode: 'policy',
    fields: [
      { name: 'privileged', label: 'Privileged', options: [['yes', 'Privileged container'], ['no', 'Not privileged']] },
      { name: 'hostNetwork', label: 'Network', options: [['yes', 'Use the node network'], ['no', 'Use the pod network']] },
      { name: 'runAsRoot', label: 'User', options: [['yes', 'Run as root'], ['no', 'Run as a non-root user']] },
      { name: 'imageTag', label: 'Image', options: [['latest', 'Tag :latest'], ['digest', 'Pin an immutable digest']] },
      { name: 'secretEnv', label: 'Secret', options: [['yes', 'Put the API token in an environment variable'], ['no', 'Do not put the token in an environment variable']] }
    ],
    secureInput: { privileged: 'no', hostNetwork: 'no', runAsRoot: 'no', imageTag: 'digest', secretEnv: 'no' },
    vulnerableInput: { privileged: 'yes', hostNetwork: 'yes', runAsRoot: 'yes', imageTag: 'latest', secretEnv: 'yes' },
    check(policy) {
      return tally([
        { id: 'privileged', title: 'Ordinary worker is not privileged', pass: policy.privileged === 'no', why: 'This billing worker does not need every capability on the node.' },
        { id: 'host', title: 'Pod does not join the node network', pass: policy.hostNetwork === 'no', why: 'Host networking lets the workload see the node’s network.' },
        { id: 'root', title: 'Process is not root', pass: policy.runAsRoot === 'no', why: 'Run the worker as a user that is not root.' },
        { id: 'digest', title: 'Image is pinned', pass: policy.imageTag === 'digest', why: 'A moving tag can change the bytes after review. This fixture wants a digest.' },
        { id: 'secret', title: 'Token is not an environment variable', pass: policy.secretEnv === 'no', why: 'For this fixture, refuse a token in the environment. Env vars show up in logs and process listings more easily.' }
      ]);
    }
  },
  {
    id: 'cicd',
    title: 'CI workflow permissions',
    minutes: 20,
    summary: 'A fork opens a pull request against the fictional billing repo. Decide which workflow context is allowed to see secrets.',
    skillId: 'appsec.review.trust-boundary',
    mode: 'policy',
    fields: [
      { name: 'trigger', label: 'Trigger', options: [['pull_request_target', 'pull_request_target'], ['pull_request', 'pull_request']] },
      { name: 'checkout', label: 'Checkout', options: [['pr-head', 'Checkout the pull request head'], ['base', 'Checkout the workflow’s own ref']] },
      { name: 'permissions', label: 'Token', options: [['write-all', 'permissions: write-all'], ['contents-read', 'contents: read']] },
      { name: 'pin', label: 'Action', options: [['tag', 'Use an action at @v1'], ['sha', 'Pin the action to a commit SHA']] }
    ],
    secureInput: { trigger: 'pull_request', checkout: 'base', permissions: 'contents-read', pin: 'sha' },
    vulnerableInput: { trigger: 'pull_request_target', checkout: 'pr-head', permissions: 'write-all', pin: 'tag' },
    check(policy) {
      const forkRunsSecrets = policy.trigger === 'pull_request_target' && policy.checkout === 'pr-head';
      return tally([
        { id: 'fork', title: 'Fork code does not run with the base repository token', pass: !forkRunsSecrets, why: 'pull_request_target runs in the base repository and can see its secrets. Checking out the pull request head runs the fork’s code in that context.' },
        { id: 'perm', title: 'The job token is read-only on contents', pass: policy.permissions === 'contents-read', why: 'This fixture job only needs to read the repo. write-all is more than that.' },
        { id: 'pin', title: 'The action is pinned to a commit', pass: policy.pin === 'sha', why: 'A version tag can move. A full commit SHA is the pin this fixture accepts.' }
      ]);
    }
  },
  {
    id: 'phish',
    title: 'Phishing mailbox',
    minutes: 20,
    summary: 'Four synthetic Northbridge messages. Judge the sender, the authentication result, and what the message asks for.',
    skillId: 'soc.phishing.signals',
    mode: 'choices',
    items: [
      { id: 'vpn', prompt: 'From it@northbridge.test. Display name Northbridge IT. SPF pass, DKIM pass. Link https://vpn.northbridge.test. Asks the user to open the company VPN.', options: [['likely-real', 'Looks consistent with the company domain'], ['spoof', 'Display name hides a different domain'], ['auth-failed', 'SPF or DKIM failed'], ['ask', 'It asks for a password by reply']], answer: 'likely-real', why: 'The visible domain, the authenticated domain, and the link host agree. That still is not a reason to disable MFA. It is just not the failure the others show.' },
      { id: 'lookalike', prompt: 'Display name Northbridge IT. From it@northbridge-support.test. Link https://northbridge.test.evil.test/vpn.', options: [['likely-real', 'Looks consistent with the company domain'], ['spoof', 'The real from-address is not the company'], ['auth-failed', 'SPF failed on northbridge.test'], ['ask', 'It asks for a password by reply']], answer: 'spoof', why: 'The display name is not the sender. northbridge-support.test and the lookalike link are different hosts.' },
      { id: 'spf', prompt: 'From payroll@northbridge.test. SPF fail. The body is a payslip notice with no link.', options: [['likely-real', 'Payroll mail is always safe'], ['spoof', 'Only the display name is wrong'], ['auth-failed', 'SPF failed for the company domain'], ['ask', 'It asks for a password by reply']], answer: 'auth-failed', why: 'SPF fail means the sending server was not authorised for that domain. Do not treat the message as a clean payslip.' },
      { id: 'password', prompt: 'From boss@northbridge.test. SPF pass. The body says to reply with the VPN password before the 4 p.m. outage.', options: [['likely-real', 'The boss domain authenticated, so comply'], ['spoof', 'The domain is unrelated'], ['auth-failed', 'SPF failed'], ['ask', 'A password request is the problem']], answer: 'ask', why: 'A matching domain does not make a password reply legitimate. The company does not collect VPN passwords by email in this fixture.' }
    ],
    secureInput: { vpn: 'likely-real', lookalike: 'spoof', spf: 'auth-failed', password: 'ask' },
    vulnerableInput: { vpn: 'spoof', lookalike: 'likely-real', spf: 'likely-real', password: 'likely-real' }
  },
  {
    id: 'ransom',
    title: 'Ransomware timeline',
    minutes: 20,
    summary: 'Order a fictional endpoint timeline. The backup job is context. Deleting shadow copies and renaming files are not the same step.',
    skillId: 'soc.triage.logs',
    mode: 'choices',
    items: [
      { id: 'backup', prompt: '08:00 the nightly backup job reported success.', options: [['context', 'Context, not the attack'], ['open', 'User opened an untrusted attachment'], ['prep', 'Encryption preparation'], ['impact', 'Files were encrypted']], answer: 'context', why: 'A successful backup is useful later. It is not evidence that ransomware started at 08:00.' },
      { id: 'attach', prompt: '09:00 the user opened an attachment from outside the company.', options: [['context', 'Context only'], ['open', 'An untrusted file was opened'], ['prep', 'Shadow copies were deleted'], ['impact', 'Files were renamed']], answer: 'open', why: 'Opening the attachment is the start of this fixture’s user action. It is not yet encryption.' },
      { id: 'shadow', prompt: '09:20 vssadmin deleted shadow copies.', options: [['context', 'Context only'], ['open', 'The user opened mail'], ['prep', 'Preparation for encryption'], ['impact', 'The files are already renamed']], answer: 'prep', why: 'Deleting shadow copies is a preparation step in this timeline. The rename has not happened yet.' },
      { id: 'lock', prompt: '09:40 thousands of files were renamed to .locked.', options: [['context', 'Context only'], ['prep', 'Still only preparation'], ['impact', 'Impact: files were renamed'], ['open', 'This is the attachment']], answer: 'impact', why: 'The rename is the impact in this fixture. Do not call it preparation after it has happened.' }
    ],
    secureInput: { backup: 'context', attach: 'open', shadow: 'prep', lock: 'impact' },
    vulnerableInput: { backup: 'impact', attach: 'context', shadow: 'impact', lock: 'prep' }
  },
  {
    id: 'sigma',
    title: 'Detection on the invoice log',
    minutes: 15,
    summary: 'Build a filter for the fictional Northbridge log. Precise means the cross-tenant 200, and not the 404 or Alice’s own invoice.',
    skillId: 'detect.rule.precision',
    mode: 'policy',
    fields: [
      { name: 'status', label: 'Status', options: [['any', 'Any status'], ['200', '200 only'], ['404', '404 only']] },
      { name: 'relation', label: 'Tenant', options: [['any', 'Any tenant pair'], ['mismatch', 'Session tenant differs from the query tenant'], ['match', 'Session tenant matches the query tenant']] },
      { name: 'user', label: 'User', options: [['any', 'Any user'], ['bob', 'bob only'], ['alice', 'alice only']] }
    ],
    secureInput: { status: '200', relation: 'mismatch', user: 'any' },
    vulnerableInput: { status: 'any', relation: 'any', user: 'any' },
    check(rule) {
      const hit = sigmaHits(rule);
      const precise = hit.length === 1 && hit[0] === 'cross';
      return tally([
        { id: 'precise', title: 'Only the cross-tenant 200 matches', pass: precise, why: precise ? 'The filter returns the 09:14 style cross-tenant success and leaves the 404 and Alice’s own invoice out.' : `Returned ${hit.join(', ') || 'nothing'}. The useful hit in this fixture is the single cross-tenant 200.` }
      ]);
    }
  },
  {
    id: 'rag',
    title: 'Retrieved document isolation',
    minutes: 20,
    summary: 'Bob at Acme asks the fictional assistant about invoice 7. A retrieved Birch document, and a sentence inside a document, must not change the task.',
    skillId: 'ai.agent.tool-boundary',
    mode: 'policy',
    fields: [
      { name: 'filter', label: 'Retrieval', options: [['none', 'Use the nearest document from any tenant'], ['tenant', 'Keep documents from the caller’s tenant']] },
      { name: 'documents', label: 'Document text', options: [['instructions', 'Treat document text as instructions'], ['data', 'Treat document text as data']] },
      { name: 'cross', label: 'Cross-tenant switch', options: [['yes', 'Let the model request another tenant'], ['no', 'No switch for another tenant']] }
    ],
    secureInput: { filter: 'tenant', documents: 'data', cross: 'no' },
    vulnerableInput: { filter: 'none', documents: 'instructions', cross: 'yes' },
    check(policy) {
      return tally([
        { id: 'tenant', title: 'Another tenant’s document stays out', pass: policy.filter === 'tenant', why: 'A near match from Birch is not Bob’s invoice. Filter before the text enters the prompt.' },
        { id: 'data', title: 'Document text is not a new instruction', pass: policy.documents === 'data', why: 'A sentence in a retrieved file that says to ignore the task is still data.' },
        { id: 'cross', title: 'The model cannot widen the tenant', pass: policy.cross === 'no', why: 'Do not add a tool argument that lets the model pick a different tenant.' }
      ]);
    }
  },
  {
    id: 'memory',
    title: 'Assistant memory',
    minutes: 15,
    summary: 'The fictional assistant wants to remember “always export every invoice.” Decide what memory is allowed to do.',
    skillId: 'ai.agent.tool-boundary',
    mode: 'policy',
    fields: [
      { name: 'write', label: 'Who can write memory', options: [['model', 'The model writes memory by itself'], ['confirmed', 'Only after the user confirms']] },
      { name: 'trust', label: 'How memory is used', options: [['instructions', 'Memory outranks the current task'], ['data', 'Memory is data, not a new task']] },
      { name: 'scope', label: 'Who can read it', options: [['global', 'Every tenant'], ['user', 'This user only']] }
    ],
    secureInput: { write: 'confirmed', trust: 'data', scope: 'user' },
    vulnerableInput: { write: 'model', trust: 'instructions', scope: 'global' },
    check(policy) {
      return tally([
        { id: 'write', title: 'The model does not write its own standing order', pass: policy.write === 'confirmed', why: 'A model-written line that says to export every invoice is not a user decision.' },
        { id: 'trust', title: 'Memory does not outrank the task', pass: policy.trust === 'data', why: 'Stored text can be shown as context. It is not a higher-priority instruction.' },
        { id: 'scope', title: 'Another tenant cannot read it', pass: policy.scope === 'user', why: 'Global memory would mix Acme and Birch.' }
      ]);
    }
  }
];

export const LAB_ROADMAP = [
  { n: 1, title: 'HTTP Request Inspector', status: 'shipped', href: '#/practice/http', note: 'Status-code claims on a fictional invoice request.' },
  { n: 2, title: 'API Authorization Repair', status: 'existing', href: '#/fix-verify', note: 'Northbridge invoice policy, with allow and deny cases.' },
  { n: 3, title: 'OAuth/OIDC Debugger', status: 'shipped', href: '#/practice/oauth', note: 'State, nonce, redirect, and scope. No identity provider is contacted.' },
  { n: 4, title: 'Kubernetes Configuration Security', status: 'shipped', href: '#/practice/k8s', note: 'A billing worker manifest. Not a cluster.' },
  { n: 5, title: 'Cloud IAM Investigator', status: 'existing', href: '#/cybercity/cloud', note: 'The Northbridge billing role.' },
  { n: 6, title: 'CI/CD Supply Chain Case', status: 'shipped', href: '#/practice/cicd', note: 'Fork pull request, token scope, and action pin. The expert release-trust lab is the longer version.' },
  { n: 7, title: 'Static analysis workshop', status: 'existing', href: '#/tools/codereview', note: 'The secure code review toy flags a few patterns. It is not CodeQL and it does not compile the code.' },
  { n: 8, title: 'SIEM query builder', status: 'existing', href: '#/cybercity/soc', note: 'Five synthetic lines and a narrow filter. Not Microsoft KQL.' },
  { n: 9, title: 'Phishing mailbox investigation', status: 'shipped', href: '#/practice/phish', note: 'Four synthetic messages. The older phishing spotter lab is still there.' },
  { n: 10, title: 'Ransomware timeline', status: 'shipped', href: '#/practice/ransom', note: 'One fictional endpoint timeline. No malware sample.' },
  { n: 11, title: 'Detection rule on a labeled log', status: 'shipped', href: '#/practice/sigma', note: 'A small field match on the invoice log. Not a Sigma compiler and not a SIEM.' },
  { n: 12, title: 'Network forensics', status: 'existing', href: '#/lab/pcap', note: 'The packet capture viewer uses the sample already in the course.' },
  { n: 13, title: 'MCP tool permission', status: 'existing', href: '#/cybercity/agent', note: 'Northbridge assistant boundary, plus the downloadable expert lab.' },
  { n: 14, title: 'RAG isolation', status: 'shipped', href: '#/practice/rag', note: 'Tenant filter and document-as-data. The expert lab is the longer Python exercise.' },
  { n: 15, title: 'Agent memory', status: 'shipped', href: '#/practice/memory', note: 'Who may write memory, and who may read it.' },
  { n: 16, title: 'Secure mobile storage review', status: 'specified', href: '#/lesson/11-web-security/jwt-advanced-lab', note: 'Not shipped as an interactive lab. There is no mobile runtime in this static app. Read the token lesson, and do not treat a browser demo as a phone’s keystore.' },
  { n: 17, title: 'Threat modeling studio', status: 'existing', href: '#/tools/stride', note: 'The STRIDE worksheet exports Markdown. It does not score a model for you.' },
  { n: 18, title: 'Pentest reporting capstone', status: 'existing', href: '#/cybercity/report', note: 'The Northbridge case note. Unrun desks stay blank.' }
];

export const FOUNDATIONS = [
  { path: '10-fundamentals', id: 'cia-triad', title: 'The CIA triad', why: 'People use these three words as labels. The useful version is being able to say which goal a control is for.', outcomes: ['Name confidentiality, integrity, or availability for a simple control.', 'Say which goal a control does not cover.'], try: '#/skills/foundations.cia', next: '#/lesson/10-fundamentals/phishing' },
  { path: '10-fundamentals', id: 'phishing', title: 'Phishing', why: 'Most early incidents start with a message, not a novel exploit. You need to separate the display name from the sender.', outcomes: ['Point at the actual from-address.', 'Say what a passing SPF result does not prove.'], try: '#/practice/phish', next: '#/lab/phishing' },
  { path: '10-fundamentals', id: 'passwords-hashing', title: 'Passwords and hashing', why: 'A password that is stored so it can be read back is already a different problem from a password that is slow to guess.', outcomes: ['Explain why encryption is the wrong tool for password storage.', 'Name why a fast hash is a poor password hash.'], try: '#/tools/hash', next: '#/lesson/10-fundamentals/protect-yourself' },
  { path: '10-fundamentals', id: 'incident-response-basics', title: 'Incident response basics', why: 'A first note that overclaims is hard to walk back. Practice saying what a fact supports.', outcomes: ['Separate a finding from context.', 'Refuse to call missing evidence a clean result.'], try: '#/cybercity/timeline', next: '#/practice/ransom' },
  { path: '08-cloud-basics', id: 'shared-responsibility-model', title: 'Shared responsibility', why: '“It is in the cloud” does not say who patches the application or who sets the role.', outcomes: ['Give one task the provider does.', 'Give one task the customer still does.'], try: '#/lesson/08-cloud-basics/cloud-identity-access', next: '#/practice/k8s' },
  { path: '08-cloud-basics', id: 'cloud-identity-access', title: 'Cloud identity and access', why: 'A role that can do everything is a standing incident. The practice is naming the action and the resource.', outcomes: ['Reject a wildcard action for a single job.', 'Reject a second principal copying a role.'], try: '#/cybercity/cloud', next: '#/practice/k8s' },
  { path: '11-web-security', id: 'sqli', title: 'SQL injection', why: 'The database cannot tell your query from the part a caller typed, unless you keep them separate.', outcomes: ['Show input changing the query.', 'Name parameter binding as the fix, not a longer password.'], try: '#/lab/sqli', next: '#/lesson/11-web-security/idor' },
  { path: '11-web-security', id: 'idor', title: 'IDOR', why: 'A page that loads “your” invoice by a number will load someone else’s if the server never checks the owner.', outcomes: ['Change the object id in a safe lab and see the result.', 'Say that a valid login is not ownership.'], try: '#/lab/idor', next: '#/fix-verify' },
  { path: '11-web-security', id: 'xss', title: 'Cross-site scripting', why: 'A page that inserts a name into HTML will run script if that name was chosen by someone else.', outcomes: ['Recognise HTML context as the problem.', 'Prefer escaping or a safe API over a filter list you invent.'], try: '#/lab/webapp', next: '#/lesson/21-api-security/bola-and-bfla' },
  { path: '21-api-security', id: 'bola-and-bfla', title: 'BOLA and BFLA', why: 'Authentication answers who is calling. Authorization answers which object and which action. Stopping after the first question is the bug.', outcomes: ['Tell object-level failure from function-level failure.', 'Repair a policy where the query string supplies the tenant.'], try: '#/fix-verify', next: '#/cybercity' }
];

export const GLOSSARY = [
  { id: 'bola', term: 'BOLA', body: 'Broken object-level authorization. The caller is allowed to use the function, but the server does not check that this object is theirs. A valid session is not ownership.' },
  { id: 'bfla', term: 'BFLA', body: 'Broken function-level authorization. The caller reaches a function, such as an admin action, that their role was not meant to call.' },
  { id: '401', term: 'HTTP 401', body: 'The server did not accept the caller’s identity. It is not the same as 403, and it is not proof about which object was requested.' },
  { id: '403', term: 'HTTP 403', body: 'The server knows who is calling, or at least refuses the action. It does not mean the password was wrong.' },
  { id: '200', term: 'HTTP 200', body: 'The server returned a representation. On a buggy API that can include someone else’s invoice. The status is not an authorization proof.' },
  { id: 'spf', term: 'SPF', body: 'A domain’s list of servers allowed to send its mail. A pass means the server was on that list. It does not mean the person, the link, or the request is safe.' },
  { id: 'dkim', term: 'DKIM', body: 'A signature on selected message headers and body. A pass means those bytes were signed by a key the domain published. It does not make a password request legitimate.' },
  { id: 'oauth-state', term: 'OAuth state', body: 'A value your app creates before the login redirect and checks when the browser comes back. It is there to recognise your own request, not to identify the user.' },
  { id: 'nonce', term: 'OIDC nonce', body: 'A value you send with the login request and expect inside the ID token. It binds that token to this attempt.' },
  { id: 'least-privilege', term: 'Least privilege', body: 'Give a principal the actions and resources the job needs, and no standing extra. A wildcard Resource is excess scope when the action supports resource-level permissions; actions without that support require Resource "*".' },
  { id: 'pr-target', term: 'pull_request_target', body: 'A GitHub Actions trigger that runs in the base repository’s context. Combined with a checkout of the pull request head, it can execute fork code where secrets are available.' },
  { id: 'prompt-injection', term: 'Prompt injection', body: 'Untrusted text, often in a document or a web page, written to change what a model does. Treat it as data. Do not give it a new tool permission.' },
  { id: 'digest', term: 'Image digest', body: 'A hash of container bytes. A tag such as latest can move to new bytes. A digest stays on the bytes you reviewed until you change it.' }
];

export function labById(id) {
  return PRACTICE_LABS.find(lab => lab.id === id) || null;
}

export function foundationFor(path, id) {
  return FOUNDATIONS.find(item => item.path === path && item.id === id) || null;
}

export const LAB_COACHING = {
  http: {
    hint: '200, 401, 403, and 404 are different claims. 401 is about identity. 403 is about permission.',
    debrief: 'You can now say what the server claimed. You still have not proved the authorization check was correct.'
  },
  oauth: {
    hint: 'Compare state and nonce exactly. A lookalike host can start with the real host name and still be a different site. Do not grant a scope the app was never allowed.',
    debrief: 'The fixture accepted a matching login and rejected the swapped values. A real identity provider still has to do this on the server.'
  },
  k8s: {
    hint: 'This worker only needs to run the billing process. Privileged, the node network, root, a moving tag, and a token in the environment are all extra.',
    debrief: 'The manifest meets this fixture. It was not applied to a cluster.'
  },
  cicd: {
    hint: 'pull_request_target plus the pull request head runs untrusted code where the base repository’s secrets can be visible. Pin the action to a commit, not a moving tag.',
    debrief: 'The workflow shape is safer for this fixture. You did not run GitHub Actions.'
  },
  phish: {
    hint: 'Read the from-address, not the display name. SPF fail is its own problem. A password request stays a password request even when the domain matches.',
    debrief: 'You separated sender, authentication, and the ask. A real mailbox has more headers than these four lines.'
  },
  ransom: {
    hint: 'Put the events in time. A successful backup is not the attack. Deleting shadow copies happens before the rename.',
    debrief: 'The timeline matches the fixture. It is not a malware sample and not an incident report for a real company.'
  },
  sigma: {
    hint: 'The useful line is a 200 where the session tenant and the query tenant differ. A filter on status alone also keeps the 404.',
    debrief: 'The filter returns one line in this fixture. It is not a Sigma rule and not a SIEM.'
  },
  rag: {
    hint: 'Keep Birch’s document out of Bob’s prompt. A sentence inside a document does not become an instruction, and the model does not get a tenant switch.',
    debrief: 'The boundary matches the fixture. No model was called.'
  },
  memory: {
    hint: 'The model must not write its own standing order. Memory can be shown as context for this user. It does not outrank the task, and another tenant does not read it.',
    debrief: 'The memory rule matches the fixture. Nothing was stored on a server.'
  }
};

export function labCoaching(id) {
  return LAB_COACHING[id] || { hint: '', debrief: '' };
}

export function glossaryById(id) {
  return GLOSSARY.find(entry => entry.id === id) || null;
}

function choiceGrade(lab, input = {}) {
  const results = lab.items.map(item => {
    const got = input[item.id] || '';
    return { id: item.id, title: item.prompt, pass: got === item.answer, why: item.why, expect: item.answer, got };
  });
  return tally(results);
}

export function gradeLab(lab, input = {}) {
  if (!lab) return tally([]);
  if (lab.mode === 'choices') return choiceGrade(lab, input);
  return lab.check(input);
}

export function validatePractice() {
  const errors = [];
  const ids = new Set();
  for (const lab of PRACTICE_LABS) {
    if (ids.has(lab.id)) errors.push(`duplicate practice lab ${lab.id}`);
    ids.add(lab.id);
    if (!gradeLab(lab, lab.secureInput).passed) errors.push(`practice lab ${lab.id} secure input does not pass`);
    if (gradeLab(lab, lab.vulnerableInput).passed) errors.push(`practice lab ${lab.id} vulnerable input unexpectedly passes`);
    if (gradeLab(lab, {}).passed) errors.push(`practice lab ${lab.id} passes with no answers`);
    if (!LAB_COACHING[lab.id]?.hint || !LAB_COACHING[lab.id]?.debrief) errors.push(`practice lab ${lab.id} is missing a hint or debrief`);
  }
  const roadmapIds = new Set(LAB_ROADMAP.map(item => item.n));
  if (roadmapIds.size !== 18) errors.push('lab roadmap is not 18 items');
  for (const item of LAB_ROADMAP) {
    if (!item.href || !item.note || !item.status) errors.push(`roadmap item ${item.n} is incomplete`);
  }
  const terms = new Set();
  for (const entry of GLOSSARY) {
    if (terms.has(entry.id)) errors.push(`duplicate glossary ${entry.id}`);
    terms.add(entry.id);
    if (!entry.term || !entry.body) errors.push(`glossary ${entry.id} is empty`);
  }
  const lessons = new Set();
  for (const item of FOUNDATIONS) {
    const key = `${item.path}/${item.id}`;
    if (lessons.has(key)) errors.push(`duplicate foundation ${key}`);
    lessons.add(key);
    if (item.outcomes.length < 2) errors.push(`foundation ${key} needs outcomes`);
  }
  return errors;
}

export function practiceEvidence(saved = {}) {
  const items = [];
  for (const lab of PRACTICE_LABS) {
    const attempt = saved[lab.id];
    if (!attempt?.ran) continue;
    const grade = gradeLab(lab, attempt.input || {});
    items.push({
      id: `practice.${lab.id}`,
      title: lab.title,
      level: grade.passed ? 'auto-verified' : 'practiced',
      note: `${grade.passedCount} of ${grade.total} checks. Fixture only.`
    });
  }
  return items;
}
