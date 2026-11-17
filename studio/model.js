/* KashSec studio model: skills graph, CertLab, Research Vault, Fix & Verify.
   Pure data and functions. No DOM. Safe to import from Node tests and the browser. */

export const STUDIO_VERSION = 1;
export const VERIFIED_ON = '2026-11-18';

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

export const SKILLS = [
  {
    id: 'foundations.cia',
    title: 'Confidentiality, integrity, and availability',
    outcome: 'Explain which security goal a simple control protects, without memorising a slogan.',
    minutes: 20,
    difficulty: 'foundation',
    prerequisites: [],
    lessons: [{ path: '01-introduction', id: 'cia-triad-explained', title: 'CIA triad explained' }],
    labs: [],
    tools: [],
    expertLabs: [],
    research: ['nist-csf-2'],
    objectives: ['secplus.concepts'],
    careers: [{ id: 'soc', title: 'SOC Analyst' }, { id: 'grc', title: 'GRC Analyst' }]
  },
  {
    id: 'networking.dns.resolution',
    title: 'How a name becomes an address',
    outcome: 'Describe a normal DNS lookup well enough to notice a broken or unexpected answer.',
    minutes: 25,
    difficulty: 'foundation',
    prerequisites: ['foundations.cia'],
    lessons: [{ path: '02-networking', id: 'dns', title: 'DNS' }],
    labs: [{ id: 'dnsrecon', title: 'DNS recon lab' }],
    tools: [],
    expertLabs: [],
    research: ['nist-csf-2'],
    objectives: ['secplus.concepts', 'oscp.enum'],
    careers: [{ id: 'soc', title: 'SOC Analyst' }, { id: 'pentest', title: 'Penetration Tester' }]
  },
  {
    id: 'web.http.status',
    title: 'Read an HTTP status before guessing',
    outcome: 'Use the method and status code to say what the server claims happened.',
    minutes: 25,
    difficulty: 'foundation',
    prerequisites: ['networking.dns.resolution'],
    lessons: [{ path: '05-web-basics', id: 'http-methods-status-codes', title: 'HTTP methods and status codes' }],
    labs: [],
    tools: [{ id: 'headers', title: 'Security header analyzer' }],
    expertLabs: [],
    research: ['portswigger-academy'],
    objectives: ['secplus.concepts', 'oscp.web'],
    careers: [{ id: 'appsec', title: 'AppSec Engineer' }, { id: 'pentest', title: 'Penetration Tester' }]
  },
  {
    id: 'web.authz.object-level',
    title: 'Object-level authorization',
    outcome: 'Show why a valid login does not grant access to every record, and name the trust boundary.',
    minutes: 40,
    difficulty: 'core',
    prerequisites: ['web.http.status'],
    lessons: [{ path: '21-api-security', id: 'bola-and-bfla', title: 'BOLA and BFLA' }],
    labs: [{ id: 'bola-bfla', title: 'BOLA and BFLA lab' }],
    tools: [],
    expertLabs: [{ id: 'tenant-boundary', title: 'Tenant isolation under pressure' }],
    research: ['owasp-api', 'kashsec-invoice-boundary'],
    objectives: ['secplus.architecture', 'oscp.web'],
    careers: [{ id: 'appsec', title: 'AppSec Engineer' }, { id: 'pentest', title: 'Penetration Tester' }]
  },
  {
    id: 'appsec.review.trust-boundary',
    title: 'Review a trust boundary before patching',
    outcome: 'Separate caller-controlled fields from server-resolved identity, then describe a fix and a residual risk.',
    minutes: 45,
    difficulty: 'core',
    prerequisites: ['web.authz.object-level'],
    lessons: [{ path: '22-devsecops-appsec', id: 'secure-code-review', title: 'Secure code review' }],
    labs: [],
    tools: [{ id: 'stride', title: 'STRIDE worksheet' }],
    expertLabs: [{ id: 'tenant-boundary', title: 'Tenant isolation under pressure' }],
    research: ['owasp-asvs', 'kashsec-invoice-boundary'],
    objectives: ['oscp.report', 'secplus.operations'],
    careers: [{ id: 'appsec', title: 'AppSec Engineer' }]
  },
  {
    id: 'soc.triage.logs',
    title: 'Triage a log before escalating',
    outcome: 'Say what a log line supports, what it does not, and which question to ask next.',
    minutes: 35,
    difficulty: 'core',
    prerequisites: ['foundations.cia'],
    lessons: [{ path: '10-fundamentals', id: 'incident-response-basics', title: 'Incident response basics' }],
    labs: [{ id: 'loganalysis', title: 'Log analysis lab' }],
    tools: [{ id: 'logparser', title: 'Log filter playground' }, { id: 'cvss', title: 'CVSS calculator' }],
    expertLabs: [],
    research: ['mitre-attack', 'cisa-advisories', 'kashsec-northbridge-soc'],
    objectives: ['sc200.respond', 'secplus.operations'],
    careers: [{ id: 'soc', title: 'SOC Analyst' }]
  },
  {
    id: 'ai.agent.tool-boundary',
    title: 'Keep an agent inside its tool boundary',
    outcome: 'Reject a model-supplied tool call that changes the tenant, object, or action.',
    minutes: 40,
    difficulty: 'core',
    prerequisites: ['web.authz.object-level'],
    lessons: [{ path: '18-ai-security', id: 'mcp-tool-authorization', title: 'MCP tool authorization' }],
    labs: [{ id: 'prompt-injection', title: 'Prompt injection lab' }],
    tools: [],
    expertLabs: [{ id: 'agent-tool-boundary', title: 'AI tool authorization' }],
    research: ['owasp-llm', 'kashsec-agent-boundary'],
    objectives: ['secplus.threats'],
    careers: [{ id: 'aisec', title: 'AI Security Engineer' }]
  }
];

export const CERT_TRACKS = [
  {
    id: 'security-plus',
    certId: 'security-plus',
    name: 'CompTIA Security+',
    vendor: 'CompTIA',
    level: 'Entry',
    purpose: 'Entry-level control vocabulary: goals, threats, architecture, operations, and what a written policy does not prove.',
    status: 'Two versions can overlap. Confirm which code you will sit before you book.',
    verifiedOn: VERIFIED_ON,
    official: [
      { label: 'Security+ overview', url: 'https://www.comptia.org/en-us/certifications/security/' },
      { label: 'Security+ V8 (SY0-801)', url: 'https://www.comptia.org/en-us/certifications/security/v8/' },
      { label: 'Security+ V7 (SY0-701)', url: 'https://www.comptia.org/en-us/certifications/security/v7/' }
    ],
    versions: [
      {
        code: 'SY0-801',
        name: 'Security+ V8',
        note: 'CompTIA’s V8 page lists exam code SY0-801, English at launch, up to 90 multiple-choice and performance-based questions, 90 minutes, and a passing score of 750 on a 100–900 scale. Checked 18 Nov 2026.'
      },
      {
        code: 'SY0-701',
        name: 'Security+ V7',
        note: 'CompTIA’s V7 page lists retirement of the English exam on 11 June 2027, and Japanese, Portuguese, Spanish, and Thai on 13 August 2027. Same question cap, time, and passing score. Checked 18 Nov 2026.'
      }
    ],
    domains: [
      { version: 'SY0-801', name: 'General Security Concepts', weight: '16%' },
      { version: 'SY0-801', name: 'Threats, Vulnerabilities, and Attacks', weight: '24%' },
      { version: 'SY0-801', name: 'Security Architecture', weight: '19%' },
      { version: 'SY0-801', name: 'Security Operations', weight: '27%' },
      { version: 'SY0-801', name: 'Security Program Management and Oversight', weight: '14%' },
      { version: 'SY0-701', name: 'General Security Concepts', weight: '12%' },
      { version: 'SY0-701', name: 'Threats, Vulnerabilities, and Mitigations', weight: '22%' },
      { version: 'SY0-701', name: 'Security Architecture', weight: '18%' },
      { version: 'SY0-701', name: 'Security Operations', weight: '28%' },
      { version: 'SY0-701', name: 'Security Program Management and Oversight', weight: '20%' }
    ],
    notClaimed: 'KashSec estimated readiness is not a CompTIA pass prediction, and these questions are not from any CompTIA exam bank.',
    objectives: [
      {
        id: 'secplus.concepts',
        domain: 'General security concepts',
        title: 'Name the goal a control protects',
        minutes: 30,
        skills: ['foundations.cia', 'web.http.status'],
        lesson: { path: '01-introduction', id: 'cia-triad-explained' },
        practice: { kind: 'lesson', href: '#/lesson/05-web-basics/http-methods-status-codes', label: 'Read HTTP methods and status codes' }
      },
      {
        id: 'secplus.threats',
        domain: 'Threats and attacks',
        title: 'Separate a real technique from a product name',
        minutes: 40,
        skills: ['ai.agent.tool-boundary'],
        lesson: { path: '18-ai-security', id: 'mcp-tool-authorization' },
        practice: { kind: 'lab', href: '#/labs/prompt-injection', label: 'Try the prompt-injection lab' }
      },
      {
        id: 'secplus.architecture',
        domain: 'Security architecture',
        title: 'Put the authorization check on the server',
        minutes: 45,
        skills: ['web.authz.object-level'],
        lesson: { path: '21-api-security', id: 'bola-and-bfla' },
        practice: { kind: 'fix', href: '#/fix-verify', label: 'Fix and verify the invoice policy' }
      },
      {
        id: 'secplus.operations',
        domain: 'Security operations',
        title: 'Triage evidence before you escalate',
        minutes: 40,
        skills: ['soc.triage.logs'],
        lesson: { path: '10-fundamentals', id: 'incident-response-basics' },
        practice: { kind: 'lab', href: '#/labs/loganalysis', label: 'Open the log analysis lab' }
      },
      {
        id: 'secplus.program',
        domain: 'Program management',
        title: 'Say what a policy does not prove',
        minutes: 25,
        skills: ['foundations.cia'],
        lesson: { path: '10-fundamentals', id: 'defense-in-depth-basics' },
        practice: { kind: 'tool', href: '#/tools/cvss', label: 'Score one finding in the CVSS tool' }
      }
    ],
    questions: [
      {
        id: 'secplus.q1',
        objective: 'secplus.architecture',
        prompt: 'A customer is logged in. The invoice API uses the tenant value from the query string. What is the main problem?',
        choices: [
          'The customer should have used a longer password.',
          'The server is trusting a caller-controlled field for an authorization decision.',
          'HTTP status codes cannot represent a denial.',
          'DNS must be disabled for invoice APIs.'
        ],
        answer: 1,
        explanation: 'Authentication established who the caller is. The tenant used for the lookup still has to come from the trusted session, not from a field the caller can change.'
      },
      {
        id: 'secplus.q2',
        objective: 'secplus.operations',
        prompt: 'A single log line shows a successful login from a new country. What can you honestly say?',
        choices: [
          'The account is compromised and must be wiped.',
          'The line is evidence of a login. It does not, by itself, prove theft or malware.',
          'The log is useless because it is text.',
          'The right next step is to publish the username.'
        ],
        answer: 1,
        explanation: 'Triage starts by stating what the evidence supports. A login anomaly is a reason to gather more evidence, not a finished incident story.'
      },
      {
        id: 'secplus.q3',
        objective: 'secplus.concepts',
        prompt: 'Which pairing is the most precise?',
        choices: [
          'A backup that restores last night’s files primarily supports availability.',
          'A backup primarily proves that nobody altered the files.',
          'A backup replaces the need for access control.',
          'A backup is only a confidentiality control.'
        ],
        answer: 0,
        explanation: 'Restoring a usable copy supports availability. Integrity still needs a separate check, because a backup can store a bad copy too.'
      },
      {
        id: 'secplus.q4',
        objective: 'secplus.program',
        prompt: 'A team has a written “least privilege” policy. Production still grants a wildcard cloud role. What is true?',
        choices: [
          'The policy text is enough to close the finding.',
          'The policy describes intent. The role grant is the evidence of what the system allows.',
          'Wildcard grants are safe if the policy mentions least privilege.',
          'Only a paid scanner can see a wildcard grant.'
        ],
        answer: 1,
        explanation: 'Program documents and technical enforcement are different. A review should compare the policy with the actual permission.'
      }
    ]
  },
  {
    id: 'oscp-plus',
    certId: 'oscp',
    name: 'OffSec OSCP+',
    vendor: 'OffSec',
    level: 'Intermediate practical',
    purpose: 'Practical habits: enumerate, stay in scope, separate login from object access, and write a finding a stranger can retest.',
    status: 'This is a lab-and-report exam. A multiple-choice quiz is not a substitute.',
    verifiedOn: VERIFIED_ON,
    official: [
      { label: 'PEN-200 / OSCP course page', url: 'https://www.offsec.com/courses/pen-200/' },
      { label: 'OSCP+ exam guide', url: 'https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide' }
    ],
    versions: [
      {
        code: 'OSCP+',
        name: 'OffSec Certified Professional Plus',
        note: 'The exam guide checked 18 Nov 2026 says you have 23 hours and 45 minutes. The published structure is 3 stand-alone machines (60 points) and one Active Directory set of 3 machines (40 points). A professional PDF report is required. Exams starting on or after 1 December 2026 at 08:00 GMT use scaled scoring. KashSec does not know your exam set’s scaled cutoff.'
      }
    ],
    domains: [],
    notClaimed: 'Nothing here is an OffSec lab, an exam machine, or a guarantee you will pass. Practise only on systems you are allowed to test.',
    objectives: [
      {
        id: 'oscp.enum',
        domain: 'Enumeration',
        title: 'Write down what a service claims before you touch it',
        minutes: 40,
        skills: ['networking.dns.resolution', 'web.http.status'],
        lesson: { path: '02-networking', id: 'dns' },
        practice: { kind: 'lab', href: '#/labs/dnsrecon', label: 'Practise DNS observations in the lab' }
      },
      {
        id: 'oscp.web',
        domain: 'Web and API access',
        title: 'Treat object access as a separate bug from login',
        minutes: 50,
        skills: ['web.authz.object-level'],
        lesson: { path: '21-api-security', id: 'bola-and-bfla' },
        practice: { kind: 'fix', href: '#/fix-verify', label: 'Repair the fictional invoice check' }
      },
      {
        id: 'oscp.report',
        domain: 'Evidence and reporting',
        title: 'Make a finding reproducible',
        minutes: 45,
        skills: ['appsec.review.trust-boundary'],
        lesson: { path: '22-devsecops-appsec', id: 'secure-code-review' },
        practice: { kind: 'expert', href: '#/expert-labs/tenant-boundary', label: 'Open the tenant-isolation expert case' }
      },
      {
        id: 'oscp.scope',
        domain: 'Scope discipline',
        title: 'Stop at the boundary you were given',
        minutes: 20,
        skills: ['foundations.cia'],
        lesson: { path: '01-introduction', id: 'the-golden-rule' },
        practice: { kind: 'lesson', href: '#/lesson/01-introduction/cybersecurity-laws-and-ethics', label: 'Read the ethics lesson' }
      }
    ],
    questions: [
      {
        id: 'oscp.q1',
        objective: 'oscp.report',
        prompt: 'You reached a proof file on a fictional lab machine. Which note is useful in a report?',
        choices: [
          '“I hacked it.”',
          'The exact request or command, the observed result, and a screenshot that shows the proof and the target address.',
          'A list of every tool installed on your laptop.',
          'The admin password of an unrelated company.'
        ],
        answer: 1,
        explanation: 'OffSec’s exam guide requires a professional report that another competent reader can follow, including proof screenshots. A vague claim does not transfer the point.'
      },
      {
        id: 'oscp.q2',
        objective: 'oscp.scope',
        prompt: 'Your notes for a practice lab mention a hostname you do not own and were not given. What should you do?',
        choices: [
          'Scan it quickly because it might be in scope.',
          'Leave it alone and stay inside the target you were authorised to use.',
          'Ask a friend to scan it for you.',
          'Post it publicly so others can check.'
        ],
        answer: 1,
        explanation: 'Scope is part of the skill. KashSec labs are fictional. Real systems outside your written permission are not practice targets.'
      },
      {
        id: 'oscp.q3',
        objective: 'oscp.web',
        prompt: 'A practice API returns another user’s invoice when you change the id. You are still logged in as yourself. What kind of issue is that?',
        choices: [
          'A missing object-level authorization check.',
          'Proof that passwords are stored in clear text.',
          'A DNS cache problem.',
          'Evidence that the login page is offline.'
        ],
        answer: 0,
        explanation: 'The session may be valid and the object lookup still wrong. Those are different controls.'
      },
      {
        id: 'oscp.q4',
        objective: 'oscp.enum',
        prompt: 'Why is a browser quiz a poor stand-in for OSCP+ preparation?',
        choices: [
          'Because OffSec publishes the exam answers in the handbook.',
          'Because the published exam is a timed practical against machines plus a report, not a multiple-choice paper.',
          'Because certificates never require notes.',
          'Because enumeration is only a vocabulary word.'
        ],
        answer: 1,
        explanation: 'Use KashSec questions to check concepts. Book time in a lab you are allowed to attack, and practise the report, if OSCP+ is the goal.'
      }
    ]
  },
  {
    id: 'sc-200',
    certId: 'sc-200',
    name: 'Microsoft Security Operations Analyst (SC-200)',
    vendor: 'Microsoft',
    level: 'Intermediate',
    purpose: 'Analyst habits on synthetic logs: separate a lead from a conclusion, and say what a filter cannot see.',
    status: 'Conceptual practice only. A real Sentinel or Defender tenant is a separate, optional lab.',
    verifiedOn: VERIFIED_ON,
    official: [
      { label: 'SC-200 certification page', url: 'https://learn.microsoft.com/en-us/credentials/certifications/security-operations-analyst/' },
      { label: 'SC-200 study guide', url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/sc-200' }
    ],
    versions: [
      {
        code: 'SC-200',
        name: 'Microsoft Certified: Security Operations Analyst Associate',
        note: 'The English certification page, last updated 21 Oct 2026 and re-checked 18 Nov 2026, lists three assessed areas: manage a security operations environment, respond to security incidents, and perform threat hunting. It states a 100-minute assessment and a 12-month renewal. It does not show domain percentages or a question count on that page, so KashSec does not invent them.'
      }
    ],
    domains: [
      { version: 'SC-200', name: 'Manage a security operations environment', weight: 'Not shown on the certification page checked 18 Nov 2026' },
      { version: 'SC-200', name: 'Respond to security incidents', weight: 'Not shown on the certification page checked 18 Nov 2026' },
      { version: 'SC-200', name: 'Perform threat hunting', weight: 'Not shown on the certification page checked 18 Nov 2026' }
    ],
    notClaimed: 'These exercises use synthetic logs. They are not Microsoft KQL, not a scoring engine for SC-200, and not evidence that a production tenant is secure.',
    objectives: [
      {
        id: 'sc200.environment',
        domain: 'Security operations environment',
        title: 'Know which tool would answer the question',
        minutes: 30,
        skills: ['soc.triage.logs'],
        lesson: { path: '12-network-security', id: 'ids-ips-siem' },
        practice: { kind: 'tool', href: '#/tools/logparser', label: 'Filter a synthetic log locally' }
      },
      {
        id: 'sc200.respond',
        domain: 'Incident response',
        title: 'Decide true positive, false positive, or needs data',
        minutes: 40,
        skills: ['soc.triage.logs'],
        lesson: { path: '10-fundamentals', id: 'incident-response-basics' },
        practice: { kind: 'lab', href: '#/investigations', label: 'Open an Incident Workbench case' }
      },
      {
        id: 'sc200.hunt',
        domain: 'Threat hunting',
        title: 'Turn a technique name into a question about your logs',
        minutes: 35,
        skills: ['soc.triage.logs'],
        lesson: { path: '12-network-security', id: 'ids-ips-siem' },
        practice: { kind: 'soc', href: '#/cybercity/soc', label: 'Triage the Northbridge logs' }
      }
    ],
    questions: [
      {
        id: 'sc200.q1',
        objective: 'sc200.respond',
        prompt: 'Synthetic mail logs show one user clicked a link. No mailbox rule changed and no token was issued. What is a careful status?',
        choices: [
          'Confirmed tenant-wide compromise.',
          'Suspicious click. Containment may be premature until mailbox and identity evidence agree.',
          'False positive, because the user has a job.',
          'Ignore it. Clicks are normal and never investigated.'
        ],
        answer: 1,
        explanation: 'One click is a lead. Incident status should match the evidence you actually have.'
      },
      {
        id: 'sc200.q2',
        objective: 'sc200.hunt',
        prompt: 'You want to hunt for a technique listed in ATT&CK. What is a sound first step in this course?',
        choices: [
          'Copy a production query you found on a blog and run it against a customer you do not own.',
          'Write the question in plain language, then try it on synthetic logs and note what the query cannot see.',
          'Treat the technique name as proof the attack already happened.',
          'Disable logging so the alert stops.'
        ],
        answer: 1,
        explanation: 'Hunting starts with a hypothesis and an honest limit. KashSec’s log tools are local fixtures, not Microsoft Sentinel.'
      },
      {
        id: 'sc200.q3',
        objective: 'sc200.environment',
        prompt: 'Which statement about this CertLab track is accurate?',
        choices: [
          'Finishing it provisions a Microsoft tenant for you.',
          'It teaches the workflow with synthetic data and links to Microsoft’s study guide. A real tenant is optional and separate.',
          'It is an official Microsoft practice assessment.',
          'Passing the three questions renews an SC-200 credential.'
        ],
        answer: 1,
        explanation: 'KashSec does not operate your cloud account. Renewal and registration happen on Microsoft’s site.'
      },
      {
        id: 'sc200.q4',
        objective: 'sc200.respond',
        prompt: 'An identity log shows a risky sign-in, and the device log shows nothing. What should the case say?',
        choices: [
          'The device is clean, so the identity event is impossible.',
          'The identity event stands. The absence of device data is a gap, not a rebuttal.',
          'Close the case because two products disagree.',
          'Delete the identity log to remove the conflict.'
        ],
        answer: 1,
        explanation: 'Missing telemetry does not cancel positive evidence from another source. Record the gap.'
      }
    ]
  }
];

export const RESEARCH = [
  {
    id: 'owasp-api',
    title: 'OWASP API Security Top 10',
    kind: 'curated-external',
    author: 'OWASP',
    publisher: 'OWASP',
    url: 'https://owasp.org/API-Security/',
    published: null,
    checked: VERIFIED_ON,
    license: 'Link only. KashSec does not republish the OWASP document.',
    topics: ['api', 'appsec'],
    minutes: 40,
    difficulty: 'core',
    skills: ['web.authz.object-level'],
    objectives: ['secplus.architecture', 'oscp.web'],
    summary: 'The project page describes API-specific risks for people who build and test APIs. Use it as the external source of the category names, then practise the invoice case here.',
    happened: 'APIs often authorize the action (“this user may read invoices”) and forget the object (“this invoice belongs to this user”).',
    evidence: 'The page loaded on 18 Nov 2026 as the OWASP API Security project. This card does not quote the list text.',
    uncertainty: 'Edition numbers change. Open the project page rather than trusting a year remembered from an older blog.',
    defensive: 'Authorize on the server with the trusted identity, and add tests for another owner and another tenant.',
    check: 'In one sentence, what is the difference between “logged in” and “allowed to read this invoice”?',
    portfolio: 'Write a short finding for a fictional API that returns another tenant’s invoice, including the denied retest you expect.'
  },
  {
    id: 'owasp-asvs',
    title: 'OWASP Application Security Verification Standard',
    kind: 'curated-external',
    author: 'OWASP',
    publisher: 'OWASP',
    url: 'https://owasp.org/www-project-application-security-verification-standard/',
    published: null,
    checked: null,
    license: 'Link only. Not re-fetched for this release.',
    topics: ['appsec'],
    minutes: 35,
    difficulty: 'core',
    skills: ['appsec.review.trust-boundary'],
    objectives: ['oscp.report'],
    summary: 'ASVS is a verification catalogue, not a scanner result. Use the project page to see how requirements are grouped, then map one KashSec lab to a requirement in your own words.',
    happened: 'Teams need a shared way to say “this control was verified,” not only “a tool ran.”',
    evidence: 'This card links to the OWASP project homepage. The page itself was not re-fetched on 18 Nov 2026.',
    uncertainty: 'The current version number is whatever the project page says when you open it.',
    defensive: 'Pick one requirement and write the positive and negative test that would satisfy it.',
    check: 'Why is “the scanner was green” weaker evidence than a named requirement plus a test?',
    portfolio: 'Add one ASVS-style requirement and test note to a lab report you already wrote.'
  },
  {
    id: 'portswigger-academy',
    title: 'PortSwigger Web Security Academy',
    kind: 'curated-external',
    author: 'PortSwigger',
    publisher: 'PortSwigger',
    url: 'https://portswigger.net/web-security',
    published: null,
    checked: VERIFIED_ON,
    license: 'External course. Do not copy their lab solutions into KashSec.',
    topics: ['web', 'appsec'],
    minutes: 30,
    difficulty: 'foundation',
    skills: ['web.http.status', 'web.authz.object-level'],
    objectives: ['oscp.web', 'secplus.concepts'],
    summary: 'A free web-security course with its own labs. KashSec links to it for HTTP and access-control practice that this site does not try to duplicate.',
    happened: 'The Academy page loaded on 18 Nov 2026 as free online web-security training.',
    evidence: 'Page title confirmed. Individual lab contents were not copied.',
    uncertainty: 'Lab lists and accounts change. Follow their terms when you create an account.',
    defensive: 'After a lab, write the fix, not only the bypass.',
    check: 'Which KashSec lesson should you read before you start their access-control labs?',
    portfolio: 'Keep notes on your own words. Do not paste their solution text into a public writeup.'
  },
  {
    id: 'mitre-attack',
    title: 'MITRE ATT&CK',
    kind: 'curated-external',
    author: 'MITRE',
    publisher: 'MITRE',
    url: 'https://attack.mitre.org/',
    published: null,
    checked: VERIFIED_ON,
    license: 'Link only. ATT&CK’s site says the knowledge base is available to use at no charge.',
    topics: ['soc', 'detection'],
    minutes: 25,
    difficulty: 'core',
    skills: ['soc.triage.logs'],
    objectives: ['sc200.hunt', 'secplus.threats'],
    summary: 'A public catalogue of adversary tactics and techniques. Use a technique as a question about logs, not as proof that the technique happened in your environment.',
    happened: 'The homepage loaded on 18 Nov 2026 and describes ATT&CK as a knowledge base of tactics and techniques based on real-world observations.',
    evidence: 'Homepage wording only. No technique page was copied.',
    uncertainty: 'Technique IDs are updated. Cite the ID and the date you opened the page.',
    defensive: 'For one technique, name the log source that could confirm or refute it.',
    check: 'Does a technique name in a report prove that technique occurred? Why or why not?',
    portfolio: 'Map one Incident Workbench case to a technique only where the fictional evidence supports it.'
  },
  {
    id: 'nist-csf-2',
    title: 'NIST Cybersecurity Framework',
    kind: 'curated-external',
    author: 'NIST',
    publisher: 'NIST',
    url: 'https://www.nist.gov/cyberframework',
    published: null,
    checked: VERIFIED_ON,
    license: 'Link only. KashSec does not republish the CSF publication.',
    topics: ['grc', 'foundations'],
    minutes: 30,
    difficulty: 'foundation',
    skills: ['foundations.cia'],
    objectives: ['secplus.program'],
    summary: 'NIST’s framework page for talking about cybersecurity outcomes with people who do not want a tool tour. The page identified CSF 2.0 on 18 Nov 2026.',
    happened: 'The framework gives functions you can use to organise a programme. It is not a control you can “install.”',
    evidence: 'The NIST framework page loaded and named CSF 2.0. The PDF at the DOI linked from coverage of that page was not copied.',
    uncertainty: 'Profiles and quick-start guides are updated. Read the current page before you cite a function name in a policy.',
    defensive: 'Pick one outcome, such as recover or detect, and point to a KashSec lab that practises it.',
    check: 'Name one thing CSF does not tell you how to configure.',
    portfolio: 'Write five lines mapping a lab you finished to a framework outcome, and mark anything you have not done.'
  },
  {
    id: 'cisa-advisories',
    title: 'CISA cybersecurity advisories',
    kind: 'curated-external',
    author: 'CISA',
    publisher: 'Cybersecurity and Infrastructure Security Agency',
    url: 'https://www.cisa.gov/news-events/cybersecurity-advisories',
    published: null,
    checked: null,
    license: 'Link only. Not re-fetched for this release. Do not paste advisory text.',
    topics: ['soc', 'vuln'],
    minutes: 20,
    difficulty: 'core',
    skills: ['soc.triage.logs'],
    objectives: ['sc200.respond', 'secplus.operations'],
    summary: 'A public list of advisories. Practise reading one advisory for affected products and the required action, then stop. Do not scan the internet to “see if it is true.”',
    happened: 'Advisories tell defenders what to check. They are not invitations to exploit the described issue.',
    evidence: 'The URL is CISA’s advisory index. This card was not re-checked against the live page on 18 Nov 2026.',
    uncertainty: 'The newest advisory changes daily. Open the page.',
    defensive: 'Write who owns the patch and what evidence would show it is deployed.',
    check: 'Which sentence in an advisory is the action, and which sentence is background?',
    portfolio: 'Summarise one public advisory in your own words and list the evidence you would collect. Link the source.'
  },
  {
    id: 'owasp-llm',
    title: 'OWASP Top 10 for Large Language Model Applications',
    kind: 'curated-external',
    author: 'OWASP',
    publisher: 'OWASP',
    url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
    published: null,
    checked: null,
    license: 'Link only. Not re-fetched for this release.',
    topics: ['ai'],
    minutes: 30,
    difficulty: 'core',
    skills: ['ai.agent.tool-boundary'],
    objectives: ['secplus.threats'],
    summary: 'A project page for risks that show up when an application trusts model output. Read it next to the KashSec agent-boundary lab, which is a simulation.',
    happened: 'Models follow text. If that text can choose a tool or a document, the application has to constrain the choice.',
    evidence: 'Link not re-fetched on 18 Nov 2026. The KashSec lab evidence is fictional and separate.',
    uncertainty: 'The Top 10 ordering changes between project versions.',
    defensive: 'Allow only the tool, tenant, and object that the trusted task already named.',
    check: 'Why is a field named approved inside a model’s tool call not a permission?',
    portfolio: 'Describe one allowed tool call and one rejected call from the expert lab, in your own words.'
  },
  {
    id: 'kashsec-invoice-boundary',
    title: 'Case: the invoice that trusted the query string',
    kind: 'original-kashsec',
    author: 'KashSec',
    publisher: 'KashSec Academy',
    url: '#/fix-verify',
    published: VERIFIED_ON,
    checked: VERIFIED_ON,
    license: 'Original KashSec explanation. The incident is fictional.',
    topics: ['api', 'appsec'],
    minutes: 15,
    difficulty: 'core',
    skills: ['web.authz.object-level', 'appsec.review.trust-boundary'],
    objectives: ['secplus.architecture', 'oscp.web', 'oscp.report'],
    summary: 'A fictional billing API returned invoice 42 from another company because the handler preferred the tenant in the query string over the tenant in the session.',
    happened: 'Bob at Acme was logged in. A request asked for Birch invoice 42 and the service answered 200. Nothing in this case left KashSec. The company, invoices, and log lines are made up.',
    evidence: 'The only evidence is the fixture in Fix & Verify and the expert lab “Tenant isolation under pressure.” There is no external victim.',
    uncertainty: 'A real bug of this shape still needs the application’s session code, which this browser exercise does not include.',
    defensive: 'Read tenant and role from the server-side actor. Allow support only inside that tenant. Require the owner to match for everyone else.',
    check: 'Which two fields in the request are unsafe to trust for authorization?',
    portfolio: 'Finish Fix & Verify, save the note, and compare it with the downloadable expert-lab report.'
  },
  {
    id: 'kashsec-agent-boundary',
    title: 'Case: the assistant that tried a second tool',
    kind: 'original-kashsec',
    author: 'KashSec',
    publisher: 'KashSec Academy',
    url: '#/expert-labs/agent-tool-boundary',
    published: VERIFIED_ON,
    checked: VERIFIED_ON,
    license: 'Original KashSec explanation. The agent and documents are fictional.',
    topics: ['ai', 'appsec'],
    minutes: 15,
    difficulty: 'core',
    skills: ['ai.agent.tool-boundary'],
    objectives: ['secplus.threats'],
    summary: 'A fictional assistant was allowed to read one invoice. Text in the retrieved document asked it to send a different invoice and to treat its own “approved” flag as permission.',
    happened: 'The trusted task named the actor, tenant, tool, and invoice. The model output did not get to widen that task. This is a teaching fixture, not a test of a live model provider.',
    evidence: 'See the expert lab evidence files. They are synthetic JSON, not a customer transcript.',
    uncertainty: 'A simulated allow/deny does not prove that a hosted model will behave the same way.',
    defensive: 'Check tool name, tenant, object, and actor against the trusted task. Ignore approval flags that arrive inside the call.',
    check: 'What is the trusted source of the invoice id the tool is allowed to read?',
    portfolio: 'Export the expert-lab notes and label them as a simulation.'
  },
  {
    id: 'kashsec-northbridge-soc',
    title: 'Case: Northbridge Billing, one invoice and three jobs',
    kind: 'original-kashsec',
    author: 'KashSec',
    publisher: 'KashSec Academy',
    url: '#/cybercity',
    published: VERIFIED_ON,
    checked: VERIFIED_ON,
    license: 'Original KashSec explanation. Northbridge, Acme, and Birch are fictional. The host uses the reserved .test domain.',
    topics: ['soc', 'api', 'appsec'],
    minutes: 25,
    difficulty: 'core',
    skills: ['soc.triage.logs', 'web.authz.object-level'],
    objectives: ['sc200.hunt', 'sc200.respond', 'secplus.architecture', 'oscp.web'],
    summary: 'The same fictional invoice bug, seen by a tester, an AppSec engineer, and a SOC analyst. No system outside this browser is involved.',
    happened: 'Bob at Acme was signed in. A request asked billing.northbridge.test for Birch invoice 42 and the API returned 200. The log line is a fixture, not a capture from a real company.',
    evidence: 'The request, the five log lines, and the policy cases are all in the Northbridge pages. They were written for this course.',
    uncertainty: 'A matching log line in a real tenant would still need the application’s session code and a change ticket. This fixture does not include either.',
    defensive: 'Alert when the query tenant and the session tenant differ and the status is 200. Do not treat a missing endpoint log as proof the laptop is clean.',
    check: 'Which single log line supports the cross-tenant read, and which lines are only context?',
    portfolio: 'Write three short notes: what the tester showed, what the policy change denies, and what the analyst can and cannot claim.'
  }
];

export const INVOICE_CASES = [
  {
    id: 'owner',
    title: 'Customer reads their own invoice',
    actor: { user: 'bob', tenant: 'acme', role: 'customer', active: true },
    query: { tenant: 'acme', role: 'customer' },
    invoice: { id: '7', tenant: 'acme', owner: 'bob' },
    expect: 'allow',
    why: 'The trusted actor owns this invoice in the same tenant.'
  },
  {
    id: 'other-owner',
    title: 'Customer asks for a colleague’s invoice',
    actor: { user: 'bob', tenant: 'acme', role: 'customer', active: true },
    query: { tenant: 'acme', role: 'customer' },
    invoice: { id: '8', tenant: 'acme', owner: 'carol' },
    expect: 'deny',
    why: 'Same tenant is not enough. Bob does not own invoice 8, and he is not support.'
  },
  {
    id: 'other-tenant',
    title: 'Customer points the query at another company',
    actor: { user: 'bob', tenant: 'acme', role: 'customer', active: true },
    query: { tenant: 'birch', role: 'customer' },
    invoice: { id: '42', tenant: 'birch', owner: 'alice' },
    expect: 'deny',
    why: 'The query tenant is caller-controlled. Bob’s session tenant is Acme.'
  },
  {
    id: 'support-same',
    title: 'Billing support reads a customer invoice in-tenant',
    actor: { user: 'sam', tenant: 'acme', role: 'billing-support', active: true },
    query: { tenant: 'acme', role: 'customer' },
    invoice: { id: '8', tenant: 'acme', owner: 'carol' },
    expect: 'allow',
    why: 'The server-side role is billing support, and the invoice is in that same tenant.'
  },
  {
    id: 'support-cross',
    title: 'Support tries another company’s invoice',
    actor: { user: 'sam', tenant: 'acme', role: 'billing-support', active: true },
    query: { tenant: 'birch', role: 'billing-support' },
    invoice: { id: '42', tenant: 'birch', owner: 'alice' },
    expect: 'deny',
    why: 'Support is scoped to the trusted tenant. A query cannot widen it.'
  },
  {
    id: 'spoof-role',
    title: 'Customer sends role=billing-support',
    actor: { user: 'bob', tenant: 'acme', role: 'customer', active: true },
    query: { tenant: 'acme', role: 'billing-support' },
    invoice: { id: '8', tenant: 'acme', owner: 'carol' },
    expect: 'deny',
    why: 'The role in the query is not the role on the session.'
  },
  {
    id: 'inactive',
    title: 'Inactive session',
    actor: { user: 'bob', tenant: 'acme', role: 'customer', active: false },
    query: { tenant: 'acme', role: 'customer' },
    invoice: { id: '7', tenant: 'acme', owner: 'bob' },
    expect: 'deny',
    why: 'An inactive or signed-out actor is denied before ownership is considered.'
  }
];

export const VULNERABLE_INVOICE_POLICY = {
  tenantSource: 'query',
  roleSource: 'query',
  ownerCheck: 'none',
  supportScope: 'any-tenant'
};

export const SECURE_INVOICE_POLICY = {
  tenantSource: 'session',
  roleSource: 'session',
  ownerCheck: 'match-user',
  supportScope: 'same-tenant'
};

const KIND_LABEL = {
  'curated-external': 'Curated external link',
  'original-kashsec': 'Original KashSec study',
  'permissioned-republish': 'Permissioned republish',
  'student-submission': 'Student submission',
  'interactive-reconstruction': 'Interactive reconstruction'
};

export function researchKindLabel(kind) {
  return KIND_LABEL[kind] || kind;
}

export function skillById(id) {
  return SKILLS.find(skill => skill.id === id) || null;
}

export function trackById(id) {
  return CERT_TRACKS.find(track => track.id === id) || null;
}

export function researchById(id) {
  return RESEARCH.find(item => item.id === id) || null;
}

export const SOC_EVENTS = [
  {
    id: 'login',
    time: '09:14:02',
    source: 'identity',
    text: 'bob@acme.northbridge.test signed in. Result success. MFA satisfied. Client 203.0.113.10.',
    verdict: 'not-enough',
    why: 'A successful login shows Bob authenticated. It does not show which invoice was read.'
  },
  {
    id: 'cross',
    time: '09:14:11',
    source: 'api',
    text: 'GET /invoices/42?tenant=birch&role=billing-support actor=bob@acme.northbridge.test sessionTenant=acme status=200',
    verdict: 'suspicious',
    why: 'The session tenant is acme and the query tenant is birch, and the API still returned 200.'
  },
  {
    id: 'own',
    time: '09:14:12',
    source: 'api',
    text: 'GET /invoices/7?tenant=acme actor=bob@acme.northbridge.test sessionTenant=acme status=200',
    verdict: 'expected',
    why: 'The query tenant matches the session tenant. This line fits Bob reading an Acme invoice.'
  },
  {
    id: 'endpoint-gap',
    time: '09:15:01',
    source: 'endpoint',
    text: 'No process events for bob-laptop.northbridge.test between 09:14 and 09:16.',
    verdict: 'not-enough',
    why: 'Missing endpoint data is a gap. It does not clear the API line and it does not prove malware.'
  },
  {
    id: 'reset',
    time: '09:16:40',
    source: 'identity',
    text: 'sam@acme.northbridge.test password reset failed. Reason: unknown recovery address.',
    verdict: 'not-enough',
    why: 'A failed reset for a different user is a separate lead. Do not attach it to the invoice finding without more evidence.'
  }
];

export const TRIAGE_LABELS = [
  ['expected', 'Expected for this user’s own work'],
  ['suspicious', 'Supports a cross-tenant read'],
  ['not-enough', 'Not enough to decide']
];

export const HUNT_SOURCES = ['any', 'identity', 'api', 'endpoint'];
export const HUNT_TOKENS = ['status=200', 'tenant=birch', 'sessionTenant=acme', 'password reset failed'];

export const PENTEST_EXCHANGE = {
  request: 'GET /invoices/42?tenant=birch&role=billing-support HTTP/1.1\nHost: billing.northbridge.test\nCookie: session=bob-acme',
  response: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"id":"42","tenant":"birch","owner":"alice","total":"1840.00"}',
  session: 'Bob · tenant acme · role customer · active',
  prompt: 'Which part of this exchange is unsafe to use as the authorization decision?',
  choices: [
    'The session that says Bob is an Acme customer',
    'The tenant and role in the query string',
    'The fact that the response is JSON',
    'The reserved .test hostname'
  ],
  answer: 1,
  explanation: 'The session already names the tenant and the role. The query repeats them, and the service believed the query. The hostname only marks the fixture as fictional.'
};

export function gradeTriage(answers = {}) {
  const results = SOC_EVENTS.map(event => {
    const got = answers[event.id] || '';
    return { id: event.id, expect: event.verdict, got, pass: got === event.verdict, why: event.why, time: event.time };
  });
  return { results, passed: results.every(result => result.pass), passedCount: results.filter(result => result.pass).length, total: results.length };
}

export function filterEvents(source, token) {
  return SOC_EVENTS.filter(event => {
    const sourceOk = !source || source === 'any' || event.source === source;
    const tokenOk = !token || event.text.includes(token);
    return sourceOk && tokenOk;
  }).map(event => event.id);
}

export function gradeHunt(source, token) {
  const ids = filterEvents(source, token);
  const precise = ids.length === 1 && ids[0] === 'cross';
  let note = 'This filter missed the cross-tenant 200. It cannot be the hunt for this incident.';
  if (precise) note = 'This filter returns only the cross-tenant 200. That is a usable hunt for this fixture.';
  else if (ids.includes('cross')) note = 'The cross-tenant line is in the result, but so is other activity. Narrow the source or the token.';
  return { ids, precise, note };
}

export function gradePentest(selected) {
  return { pass: selected === PENTEST_EXCHANGE.answer, explanation: PENTEST_EXCHANGE.explanation };
}

export function validateStudio() {
  const errors = [];
  const skillIds = new Set();
  for (const skill of SKILLS) {
    if (skillIds.has(skill.id)) errors.push(`duplicate skill ${skill.id}`);
    skillIds.add(skill.id);
    if (!skill.outcome || !skill.lessons.length && !skill.labs.length && !skill.tools.length) {
      errors.push(`skill ${skill.id} has no learning outcome or resource`);
    }
  }
  const visiting = new Set();
  const visited = new Set();
  function walk(id, stack) {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      errors.push(`prerequisite cycle at ${stack.concat(id).join(' -> ')}`);
      return;
    }
    const skill = skillById(id);
    if (!skill) {
      errors.push(`missing skill ${id}`);
      return;
    }
    visiting.add(id);
    for (const pre of skill.prerequisites) walk(pre, stack.concat(id));
    visiting.delete(id);
    visited.add(id);
  }
  for (const skill of SKILLS) {
    walk(skill.id, []);
    for (const objectiveId of skill.objectives) {
      if (!CERT_TRACKS.some(track => track.objectives.some(item => item.id === objectiveId))) {
        errors.push(`skill ${skill.id} cites unknown objective ${objectiveId}`);
      }
    }
    for (const item of skill.research) {
      if (!researchById(item)) errors.push(`skill ${skill.id} cites unknown research ${item}`);
    }
  }
  const objectiveIds = new Set();
  const questionIds = new Set();
  for (const track of CERT_TRACKS) {
    if (!track.official.length) errors.push(`track ${track.id} has no official link`);
    if (!track.notClaimed) errors.push(`track ${track.id} missing limitation statement`);
    for (const objective of track.objectives) {
      if (objectiveIds.has(objective.id)) errors.push(`duplicate objective ${objective.id}`);
      objectiveIds.add(objective.id);
      for (const skillId of objective.skills) {
        if (!skillById(skillId)) errors.push(`objective ${objective.id} cites unknown skill ${skillId}`);
      }
    }
    for (const question of track.questions) {
      if (questionIds.has(question.id)) errors.push(`duplicate question ${question.id}`);
      questionIds.add(question.id);
      if (!track.objectives.some(item => item.id === question.objective)) {
        errors.push(`question ${question.id} cites unknown objective ${question.objective}`);
      }
      if (!Array.isArray(question.choices) || question.choices.length < 2) errors.push(`question ${question.id} needs choices`);
      if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= question.choices.length) {
        errors.push(`question ${question.id} has an answer outside its choices`);
      }
    }
  }
  for (const item of RESEARCH) {
    if (!item.license || !item.url || !item.kind) errors.push(`research ${item.id} missing provenance`);
    if (item.kind === 'curated-external' && item.url.startsWith('#')) errors.push(`research ${item.id} external item has no source URL`);
    for (const skillId of item.skills) {
      if (!skillById(skillId)) errors.push(`research ${item.id} cites unknown skill ${skillId}`);
    }
    for (const objectiveId of item.objectives || []) {
      if (!objectiveIds.has(objectiveId)) errors.push(`research ${item.id} cites unknown objective ${objectiveId}`);
    }
  }
  const seenCases = new Set();
  for (const item of INVOICE_CASES) {
    if (seenCases.has(item.id)) errors.push(`duplicate invoice case ${item.id}`);
    seenCases.add(item.id);
    if (item.expect !== 'allow' && item.expect !== 'deny') errors.push(`invoice case ${item.id} has a bad expectation`);
  }
  const secure = gradeInvoicePolicy(SECURE_INVOICE_POLICY);
  if (!secure.passed) errors.push('secure invoice policy does not pass its own cases');
  const vulnerable = gradeInvoicePolicy(VULNERABLE_INVOICE_POLICY);
  if (vulnerable.passed) errors.push('vulnerable invoice policy unexpectedly passes');
  const triageKey = Object.fromEntries(SOC_EVENTS.map(event => [event.id, event.verdict]));
  if (!gradeTriage(triageKey).passed) errors.push('Northbridge triage key does not pass');
  const hunt = gradeHunt('api', 'tenant=birch');
  if (!hunt.precise) errors.push('Northbridge hunt fixture is not precise');
  if (gradeHunt('api', 'status=200').precise) errors.push('status=200 hunt should be too wide');
  if (!gradePentest(PENTEST_EXCHANGE.answer).pass) errors.push('pentest answer key does not pass');
  if (gradePentest(0).pass) errors.push('wrong pentest choice unexpectedly passes');
  const eventIds = new Set();
  for (const event of SOC_EVENTS) {
    if (eventIds.has(event.id)) errors.push(`duplicate soc event ${event.id}`);
    eventIds.add(event.id);
    if (!TRIAGE_LABELS.some(([value]) => value === event.verdict)) errors.push(`soc event ${event.id} has a bad verdict`);
    if (!event.text.includes('northbridge.test') && !event.text.includes('.test')) errors.push(`soc event ${event.id} left the reserved test namespace`);
  }
  return errors;
}

export function invoiceDecision(policy, item) {
  if (!item.actor.active) return 'deny';
  const tenant = policy.tenantSource === 'session' ? item.actor.tenant : item.query.tenant;
  const role = policy.roleSource === 'session' ? item.actor.role : item.query.role;
  if (tenant !== item.invoice.tenant) return 'deny';
  if (role === 'billing-support') {
    if (policy.supportScope === 'same-tenant' && item.actor.tenant === item.invoice.tenant && policy.roleSource === 'session') return 'allow';
    if (policy.supportScope === 'any-tenant') return 'allow';
    return 'deny';
  }
  if (policy.ownerCheck === 'match-user') return item.actor.user === item.invoice.owner ? 'allow' : 'deny';
  return 'allow';
}

export function gradeInvoicePolicy(policy) {
  const results = INVOICE_CASES.map(item => {
    const got = invoiceDecision(policy, item);
    return { id: item.id, title: item.title, expect: item.expect, got, pass: got === item.expect, why: item.why };
  });
  return { results, passed: results.every(result => result.pass), passedCount: results.filter(result => result.pass).length, total: results.length };
}

export function scoreTrack(track, answers) {
  const missed = [];
  let correct = 0;
  for (const question of track.questions) {
    const selected = answers[question.id];
    if (selected === question.answer) correct += 1;
    else missed.push({ id: question.id, objective: question.objective, explanation: question.explanation, selected: Number.isInteger(selected) ? selected : null });
  }
  return { correct, total: track.questions.length, missed };
}

export function reviewQueue(track, answers = {}, statusMap = {}) {
  const items = [];
  const seen = new Set();
  for (const question of track.questions) {
    const selected = answers[question.id];
    if (Number.isInteger(selected) && selected !== question.answer && !seen.has(question.objective)) {
      seen.add(question.objective);
      items.push({ objectiveId: question.objective, questionId: question.id, reason: 'A formative answer on this objective was wrong.' });
    }
  }
  for (const objective of track.objectives) {
    if (statusMap[objective.id] === 'review-due' && !seen.has(objective.id)) {
      seen.add(objective.id);
      items.push({ objectiveId: objective.id, questionId: null, reason: 'You marked this objective review due.' });
    }
  }
  return items;
}

export function coverage(track, statusMap = {}) {
  const counts = { 'not-started': 0, introduced: 0, practiced: 0, demonstrated: 0, 'review-due': 0 };
  for (const objective of track.objectives) counts[statusMap[objective.id] || 'not-started'] += 1;
  const demonstrated = counts.demonstrated;
  const touched = track.objectives.length - counts['not-started'];
  return { counts, demonstrated, touched, total: track.objectives.length };
}

export function readinessLabel(track, statusMap, answers) {
  const covered = coverage(track, statusMap);
  const score = scoreTrack(track, answers);
  const parts = [
    `${covered.touched} of ${covered.total} objectives started`,
    `${covered.demonstrated} marked demonstrated`,
    `${score.correct} of ${score.total} formative questions correct on the latest answers`
  ];
  return {
    label: 'KashSec estimated readiness',
    summary: parts.join(' · '),
    limitation: track.notClaimed
  };
}

function parseISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date;
}

function formatISODate(date) {
  return date.toISOString().slice(0, 10);
}

export function buildStudyPlan(track, options = {}) {
  const minutesPerDay = Math.min(180, Math.max(15, Number(options.minutesPerDay) || 30));
  const today = parseISODate(options.today) || parseISODate(new Date().toISOString().slice(0, 10));
  const start = parseISODate(options.start) || today;
  const exam = parseISODate(options.examDate);
  const days = [];
  let bucket = [];
  let used = 0;
  let cursor = new Date(start.getTime());
  function flush() {
    if (!bucket.length) return;
    days.push({ date: formatISODate(cursor), minutes: used, objectiveIds: bucket.map(item => item.id) });
    cursor = new Date(cursor.getTime() + 86400000);
    bucket = [];
    used = 0;
  }
  for (const objective of track.objectives) {
    if (used > 0 && used + objective.minutes > minutesPerDay) flush();
    bucket.push(objective);
    used += objective.minutes;
  }
  flush();
  const last = days.length ? days[days.length - 1].date : formatISODate(start);
  const overflowsExam = Boolean(exam && last > formatISODate(exam));
  return {
    trackId: track.id,
    minutesPerDay,
    start: formatISODate(start),
    examDate: exam ? formatISODate(exam) : '',
    days,
    overflowsExam,
    totalMinutes: track.objectives.reduce((sum, item) => sum + item.minutes, 0)
  };
}

export function explainNext(masteredIds) {
  const done = new Set(masteredIds || []);
  const ready = SKILLS.filter(skill => !done.has(skill.id) && skill.prerequisites.every(id => done.has(id)));
  if (!ready.length) {
    const allDone = SKILLS.every(skill => done.has(skill.id));
    return allDone
      ? { skill: null, reason: 'You have marked every skill in this starter graph. The rest of the 26 paths are still outside this graph.' }
      : { skill: null, reason: 'Nothing is ready. Mark a prerequisite, or clear a skill you did not mean to skip.' };
  }
  const skill = ready.slice().sort((a, b) => a.minutes - b.minutes || a.title.localeCompare(b.title))[0];
  const learned = skill.prerequisites.map(id => skillById(id)?.title).filter(Boolean);
  const reason = learned.length
    ? `This is next because you marked ${learned.join(' and ')} as done, and this skill still is not.`
    : 'This is a starting skill. It has no prerequisite in the starter graph.';
  return { skill, reason };
}

export function lessonHref(ref) {
  return `#/lesson/${ref.path}/${ref.id}`;
}

export function pageCopies() {
  const certText = CERT_TRACKS.map(track => {
    const versions = track.versions.map(version => `${version.code}: ${version.note}`).join(' ');
    const objectives = track.objectives.map(item => `${item.title} (${item.minutes} min)`).join(', ');
    return `${track.name}. ${track.status} ${versions} Objectives in this starter plan: ${objectives}. ${track.notClaimed}`;
  }).join(' ');
  const researchText = RESEARCH.map(item => `${item.title} (${researchKindLabel(item.kind)}). ${item.summary}`).join(' ');
  const skillText = SKILLS.map(skill => `${skill.title}: ${skill.outcome}`).join(' ');
  return [
    {
      file: 'certlab/index.html',
      path: '/certlab/',
      title: 'Certification prep hub · KashSec Academy',
      description: 'Free Security+, OSCP+, and SC-200 study plans mapped to KashSec lessons. Official links, original questions, and no vendor pass guarantee.',
      heading: 'Certification prep',
      body: `<p>Prepare for CompTIA Security+, OffSec OSCP+, or Microsoft SC-200 without leaving the course. Each plan uses lessons and labs that already exist, plus a short formative check. Passing a check is not an official score.</p><p>${esc(certText)}</p><p><a href="/skills/">See the skills behind the plans</a> · <a href="/cybercity/">Open the Northbridge case</a> · <a href="/fix-verify/">Fix an authorization bug</a> · <a href="/research/">Read the source notes</a></p>`
    },
    {
      file: 'research/index.html',
      path: '/research/',
      title: 'Research vault · KashSec Academy',
      description: 'Original KashSec case notes and curated links to OWASP, PortSwigger, MITRE ATT&CK, NIST, and CISA. Sources stay attributed.',
      heading: 'Research vault',
      body: `<p>These cards either link out or tell an original fictional case. KashSec does not copy paid writeups or exam material. A card marked “not re-fetched” still needs you to open the source.</p><p>${esc(researchText)}</p><p><a href="/certlab/">Use a source inside a certification plan</a> · <a href="/cybercity/">Follow one case across three jobs</a> · <a href="/lesson/21-api-security/bola-and-bfla.html">Read the BOLA lesson</a></p>`
    },
    {
      file: 'skills/index.html',
      path: '/skills/',
      title: 'Skills graph · KashSec Academy',
      description: 'A small connected map from lessons and labs to certification objectives and job skills. Recommendations explain why they are next.',
      heading: 'Skills graph',
      body: `<p>This starter graph connects seven skills. It does not replace the 26 learning paths. Mark a skill only after you can do the outcome, not after you open the page.</p><p>${esc(skillText)}</p><p><a href="/certlab/">Open certification prep</a> · <a href="/cybercity/">Practise the Northbridge case</a> · <a href="/labs/">Browse labs</a></p>`
    },
    {
      file: 'fix-verify/index.html',
      path: '/fix-verify/',
      title: 'Fix and verify an invoice API · KashSec Academy',
      description: 'Repair a fictional invoice authorization policy and run allow and deny cases in the browser. No network calls and no real customer data.',
      heading: 'Fix and verify: invoice access',
      body: `<p>Bob at fictional Acme can read Alice’s invoice at fictional Birch because the handler trusts the query string. Choose where tenant and role come from, then run the cases. The reference solution is not shown until your policy passes. This does not prove a production API is safe.</p><p>A customer may read only their own invoice. Billing support may read invoices in the same trusted tenant. A role or tenant supplied by the browser is not authority. Inactive sessions are denied.</p><p><a href="/cybercity/">See the same bug as a tester and as an analyst</a> · <a href="/expert-labs/tenant-boundary.html">Continue in the expert lab</a> · <a href="/lesson/21-api-security/bola-and-bfla.html">Read the lesson</a></p>`
    },
    {
      file: 'cybercity/index.html',
      path: '/cybercity/',
      title: 'Northbridge Billing case · KashSec Academy',
      description: 'One fictional invoice bug, practised as a tester, an AppSec engineer, and a SOC analyst. Synthetic logs only. No live target.',
      heading: 'Northbridge Billing',
      body: `<p>Northbridge Billing is not a company you can reach. The host name billing.northbridge.test is reserved for documentation and teaching. Bob at Acme reads Alice’s Birch invoice because the API trusts the query string.</p><p>Use three desks on the same evidence. The tester names the unsafe field. The engineer repairs the policy and runs allow and deny cases. The analyst marks five log lines and narrows a filter until only the cross-tenant response remains. None of this is a vendor lab, a Microsoft KQL hunt, or a production incident.</p><p><a href="/fix-verify/">Repair the policy</a> · <a href="/certlab/">Open a certification plan</a> · <a href="/research/">Read the case card</a></p>`
    }
  ];
}
