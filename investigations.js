/* KashSec Incident Workbench. Fictional, local training cases; no live targets.
   Loaded only when a learner opens the workbench. */
window.KashInvestigations = (()=>{
  const CASES = [
    {
      id:'mailbox-takeover', number:'01', title:'The invoice that opened a mailbox',
      category:'Identity', minutes:15, level:'Foundation', icon:'mail',
      intro:'A finance colleague reports an urgent invoice email. Minutes later, an unfamiliar sign-in and a new mailbox rule appear. Establish what the evidence supports and choose a response.',
      mission:'Correlate the message, sign-in events, and mailbox changes. Separate signs of compromise from assumptions about how much data was taken.',
      evidence:[
        {id:'message', title:'Reported email', kind:'Mail gateway export', text:`CASE 01 / E1 — Reported message (all times UTC)
2026-10-19 09:02:14
From: "Finance Desk" <billing@invoice-review.test>
To: alex@northstar.test
Subject: Action required: confirm today's supplier invoice
Reply-To: help@invoice-review.test
Link shown: Review invoice
Link destination: https://invoice-review.test/verify
Gateway verdict: delivered

09:05:00 — User report to the help desk:
"I opened the link and entered my work password. It asked me to
approve a sign-in. I approved it, but no invoice appeared."

Context: Northstar's normal invoice portal is invoices.northstar.test.
The supplied message does not contain an attachment.`},
        {id:'identity', title:'Identity events', kind:'Sign-in log excerpt', text:`CASE 01 / E2 — Identity events (UTC)
09:00:10 user=alex@northstar.test ip=192.0.2.10
  result=success device=managed-laptop-14 method=existing-session
09:04:18 user=alex@northstar.test ip=203.0.113.42
  result=success device=unknown method=password+push-mfa
  session=session-702
09:06:31 user=alex@northstar.test ip=203.0.113.42
  resource=mail result=success session=session-702

Help-desk verification:
- User recognises managed-laptop-14 and the 09:00 activity.
- User does not recognise the 09:04 device or the later mail activity.
- No approved travel or VPN change is recorded.
- This excerpt is not a complete tenant-wide search.`},
        {id:'mailbox', title:'Mailbox audit', kind:'Mailbox rule and audit export', text:`CASE 01 / E3 — Mailbox audit (UTC)
09:07:03 operation=New-InboxRule actor=alex@northstar.test
  session=session-702 ip=203.0.113.42
  rule="Invoice archive" enabled=true
  condition=subject contains "invoice"
  forwardTo=records@invoice-review.test
  markAsRead=true
09:08:40 operation=MailItemsAccessed actor=alex@northstar.test
  session=session-702 folder=Inbox

09:12:00 — User confirms they did not create the forwarding rule.
Collection note: message-by-message access detail and delivery logs
for forwarded messages have not yet been collected. No endpoint
malware evidence is included in this case.`}
      ],
      questions:[
        {id:'assessment', prompt:'What is the strongest supported assessment?',
          options:['A suspicious email arrived, but nothing suggests account access.','The account was accessed without authorisation after a reported phishing interaction.','Every message in the tenant was stolen.'], correct:1,
          why:'E1 records credential entry and approval. E2 shows a successful session the user rejects, and E3 ties that session to an unapproved rule. Together they support account compromise; they do not establish tenant-wide theft.', refs:['message','identity','mailbox']},
        {id:'containment', prompt:'Which response best addresses the observed access?',
          options:['Contain the account, revoke sessions, reset compromised credentials, and preserve audit evidence while investigating the rule.','Delete the email and leave the successful session active.','Block only the email sender and close the case.'], correct:0,
          why:'The evidence includes an active identity session and a mailbox change. Address account access and the unapproved forwarding rule through the response process; removing the message alone does not resolve those paths.', refs:['identity','mailbox']},
        {id:'scope', prompt:'What still needs investigation before reporting the impact?',
          options:['Whether a random password generator was used.','Nothing: a forwarding rule proves every attachment was delivered externally.','Which items were accessed or forwarded, and whether other accounts or persistence paths were affected.'], correct:2,
          why:'E3 explicitly lacks item-level and forwarding-delivery detail. Preserve that uncertainty, examine the relevant audit and delivery records, and expand the scope before claiming a specific data loss.', refs:['mailbox']}
      ],
      conclusion:'The linked message, unrecognised successful session, and unapproved forwarding rule support a mailbox compromise. The supplied logs do not quantify data exposure. A sound handover records both the evidence and these limits.',
      sources:[{title:'Microsoft: respond to a compromised email account',url:'https://learn.microsoft.com/en-us/defender-office-365/responding-to-a-compromised-email-account'}],
      related:[{path:'10-fundamentals',label:'Security fundamentals'}, {path:'07-windows-security',label:'Windows security'}]
    },
    {
      id:'cross-tenant-api', number:'02', title:'A valid token, the wrong customer',
      category:'Application', minutes:20, level:'Intermediate', icon:'swap',
      intro:'A support ticket says one customer can see another customer’s invoice. Compare authenticated requests with ownership records and decide what a successful fix must prove.',
      mission:'Identify the broken trust boundary, distinguish authentication from authorisation, and design a regression check for the exposed object.',
      evidence:[
        {id:'requests',title:'API requests',kind:'Application trace excerpt',text:`CASE 02 / E1 — API trace (UTC)
2026-10-19 11:10:01 request=r-301
  authenticatedUser=user-17 tenant=acme method=GET
  path=/api/invoices/inv-104 status=200 returnedTenant=acme
11:10:06 request=r-302
  authenticatedUser=user-17 tenant=acme method=GET
  path=/api/invoices/inv-105 status=200 returnedTenant=birch
11:10:08 request=r-303
  authenticatedUser=user-17 tenant=acme method=GET
  path=/api/invoices/inv-106 status=200 returnedTenant=birch

Identity service: all three requests used the same valid, unexpired
token for user-17. Its tenant claim is acme. No token modification
was detected in this controlled reproduction.`},
        {id:'ownership',title:'Ownership map',kind:'Test fixture records',text:`CASE 02 / E2 — Ownership and access policy
user-17  memberOf=acme  role=customer
user-88  memberOf=birch role=customer

invoice    tenant  customerAccount
inv-104    acme    account-a
inv-105    birch   account-b
inv-106    birch   account-b

Product policy:
Customer users may read invoices belonging to their tenant only.
There is no cross-tenant support permission for a customer role.

Reproduction: the tester is authorised to use these synthetic
accounts and records in a local test environment.`},
        {id:'handler',title:'Handler & test gap',kind:'Simplified code review notes',text:`CASE 02 / E3 — Simplified request handler
GET /api/invoices/:id
  requireValidSession(request)
  invoice = invoiceStore.findById(request.params.id)
  if invoice is missing: return 404
  return 200, invoice

Current test:
  Given user-17's valid session,
  GET inv-104 returns 200 and inv-104's expected fields.

No assertion checks invoice.tenant against the authorised tenant.
No negative test uses a valid session to request another tenant's
invoice. The interface hides invoice IDs from other customers,
but the server accepts IDs supplied directly by the caller.`}
      ],
      questions:[
        {id:'classification',prompt:'Which failure explains the reproduced access?',
          options:['Broken object-level authorisation: a valid user can read another tenant’s invoice.','SQL injection is proven by the invoice ID.','The user’s token must have expired.'],correct:0,
          why:'E1 shows successful reads with an unchanged valid token. E2 makes those records out of scope for this user. E3 looks up the object without checking tenant access: authentication succeeded, while object authorisation is missing.',refs:['requests','ownership','handler']},
        {id:'fix',prompt:'Where should the durable access check live?',
          options:['Only in the interface, by removing the invoice link.','In server-side authorisation for each requested object and action, using trusted identity and ownership context.','Only in a rule that blocks consecutive numeric IDs.'],correct:1,
          why:'The server must enforce access to the requested object for the authenticated caller. Hidden links and harder-to-guess identifiers do not establish permission to read an invoice.',refs:['ownership','handler']},
        {id:'regression',prompt:'Which regression test closes the demonstrated gap?',
          options:['Assert only that the login page loads.','Assert that all invoices return 200 for any valid session.','Verify own-tenant reads succeed and other-tenant reads disclose no invoice data, then cover the affected object actions.'],correct:2,
          why:'Use both authorised and unauthorised object relationships. The denial must avoid returning the protected invoice, and related read or write actions need their own access checks rather than assuming one fixed endpoint protects all.',refs:['requests','ownership','handler']}
      ],
      conclusion:'The reproduction establishes cross-tenant invoice disclosure, not a token forgery or a database injection. Enforce object access on the server, test allowed and denied relationships, and investigate historic access before claiming a full exposure count.',
      sources:[{title:'OWASP API1: broken object level authorization',url:'https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/'}],
      related:[{path:'21-api-security',label:'API security'}, {path:'11-web-security',label:'Web application security'}]
    },
    {
      id:'exposed-cloud-key',number:'03',title:'The key that outlived the commit',
      category:'Cloud',minutes:20,level:'Intermediate',icon:'cloud',
      intro:'A scanner flags a deployment key in a public repository. The commit is removed, but cloud audit events keep arriving. Determine what is confirmed, contain access, and scope what the key could do.',
      mission:'Connect repository exposure to an access-key identifier, interpret successful and denied audit events, and avoid treating a clean latest commit as credential revocation.',
      evidence:[
        {id:'exposure',title:'Exposure alert',kind:'Secret-scanner ticket',text:`CASE 03 / E1 — Synthetic secret exposure (UTC)
2026-10-19 14:00:00 repository=demo-release visibility=public
  commit=training-a17 file=deploy.env
  finding=long-lived cloud access key exposed
  keyId=TRAINING-KEY-042 principal=release-bot
14:07:00 maintainer removes deploy.env in commit=training-a18
14:10:00 maintainer reports "latest branch looks clean"

Credential inventory at 14:15:
  keyId=TRAINING-KEY-042 status=Active
  owner=release-bot expectedSource=192.0.2.20

The secret value is deliberately omitted. This is a fictional key,
not a usable cloud credential.`},
        {id:'audit',title:'Cloud audit events',kind:'CloudTrail-style training excerpt',text:`CASE 03 / E2 — Audit excerpt (UTC)
14:02:30 keyId=TRAINING-KEY-042 ip=198.51.100.77
  event=GetCallerIdentity result=Success
14:03:12 keyId=TRAINING-KEY-042 ip=198.51.100.77
  event=ListBuckets result=Success
14:04:05 keyId=TRAINING-KEY-042 ip=198.51.100.77
  event=CreateUser result=AccessDenied
14:11:24 keyId=TRAINING-KEY-042 ip=198.51.100.77
  event=GetObject bucket=release-artifacts key=build-314.zip
  result=Success bytesReturned=481920

Cloud operations confirms no authorised run used this source.
The GetObject entry is from separately enabled object data events.
This is a small excerpt, not a complete account-wide audit.`},
        {id:'permissions',title:'Permissions & coverage',kind:'Inventory and collection notes',text:`CASE 03 / E3 — Principal scope and collection gaps
principal=release-bot keyId=TRAINING-KEY-042
Allowed by the reviewed policy:
  list buckets; read objects in release-artifacts
No reviewed grant permits creating IAM users.

Logging notes:
- Management events are available for the incident window.
- Object data events were enabled only for release-artifacts.
- No complete search for issued temporary sessions, other keys,
  policy changes, or additional regions has been performed yet.

Response notes:
Production releases depend on this deployment identity. Coordinate
replacement access with its owner while containing the exposed key.
Retain the alert, commit references, and audit exports as evidence.`}
      ],
      questions:[
        {id:'confirmed',prompt:'Which claim is supported by this evidence?',
          options:['Removing the file revoked the key immediately.','The active exposed key was used without authorisation, including a successful object read.','The failed CreateUser event proves a new administrator exists.'],correct:1,
          why:'E1 still marks the key active after removal. E2 ties it to unapproved calls and a successful object read after the cleanup commit. The denied CreateUser event is an attempt, not evidence of successful user creation.',refs:['exposure','audit']},
        {id:'containment',prompt:'Which action addresses the exposed credential?',
          options:['Wait for the public repository cache to expire.','Delete the audit logs to prevent reuse of the key identifier.','Deactivate the compromised key, coordinate replacement access, and preserve evidence while reviewing other access paths.'],correct:2,
          why:'Repository cleanup does not invalidate a copied secret. Contain the credential at the cloud identity boundary, coordinate the dependent workload, and investigate other credentials or sessions rather than assuming one deactivation resolves every access path.',refs:['exposure','permissions']},
        {id:'limits',prompt:'What should the scope statement retain as an open question?',
          options:['Whether other resources or access paths were affected outside the supplied audit coverage.','Whether the denied request should be counted as a successful administrator login.','Whether a clean current commit guarantees the secret was never copied.'],correct:0,
          why:'E3 documents incomplete resource and audit coverage. The observed successful read establishes some access, but this excerpt cannot rule out other resources, issued sessions, or persistence. Investigate those before declaring the account clean.',refs:['audit','permissions']}
      ],
      conclusion:'A copied credential remains usable until its access is addressed. This case confirms unapproved API use and one successful object read, while wider impact remains unverified. Separate attempted actions from successful ones in the handover.',
      sources:[{title:'AWS: remediate potentially compromised credentials',url:'https://docs.aws.amazon.com/guardduty/latest/ug/compromised-creds.html'}],
      related:[{path:'08-cloud-basics',label:'Cloud fundamentals'}, {path:'22-devsecops-appsec',label:'DevSecOps & application security'}]
    }
  ];
  const GUIDES = {
    'mailbox-takeover':{terms:[['Session','The signed-in context used for later actions. A session identifier can help connect events.'],['Audit log','A record of actions, such as creating a mailbox rule.'],['MFA','Multi-factor authentication: using more than one kind of proof to sign in.']],hints:['Compare the user’s report with the successful sign-in and the new rule. What is directly supported?','Look for access that would remain after deleting the email. Which evidence shows it?','Read the collection note in E3. What information has not been collected yet?']},
    'cross-tenant-api':{terms:[['Tenant','One customer or organisation’s space in a shared application.'],['Token','A value the application uses to recognise an authenticated caller.'],['Authorisation','Checking whether this caller is allowed to perform this action on this object.']],hints:['Compare the caller’s tenant with the returned invoice’s tenant. Is the login itself invalid?','Read the handler in E3. Where would you compare the caller’s allowed scope with the invoice owner?','Use one invoice the customer may read and one they may not. What should each request return?']},
    'exposed-cloud-key':{terms:[['Access key','A credential used by software to make cloud requests. Removing a copy does not revoke the credential.'],['Principal','The user or software identity whose permissions are being used.'],['Access denied','The requested action was rejected. It is evidence of an attempt, not a successful action.']],hints:['Match the key identifier across E1 and E2. Separate events marked Success from AccessDenied.','Check the credential’s status after the cleanup commit. Did removing the file change its status?','Read the coverage gaps in E3. What cannot be ruled out from this excerpt alone?']}
  };
  const fresh = ()=>({answers:{},reviewed:[],notes:'',updatedAt:0,submittedAt:0,bestScore:0,attempts:0});
  const recordFor = id=>STATE.investigations[id] || (STATE.investigations[id]=fresh());
  const answered = (item,record)=>item.questions.filter(q=>Number.isInteger(record.answers[q.id]) && record.answers[q.id] >= 0 && record.answers[q.id] < q.options.length).length;
  const score = (item,record)=>item.questions.filter(q=>record.answers[q.id] === q.correct).length;
  const isSubmitted = (item,record)=>record.submittedAt > 0 && answered(item,record) === item.questions.length;
  const caseAction = record=>record.submittedAt?'Review debrief':record.updatedAt || record.reviewed.length?'Resume case':'Start investigation';
  function download(name, text){
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download=name;a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function renderIndex(){
    const records=CASES.map(item=>STATE.investigations[item.id] || fresh());
    const complete=records.filter(record=>record.attempts > 0).length;
    const drafts=records.filter(record=>(record.updatedAt > 0 || record.reviewed.length) && !record.submittedAt).length;
    app.innerHTML=`<section class="sec iw-hub">
      <div class="iw-hub-hero"><div class="sec-head"><div class="sec-eyebrow">Incident Workbench</div><h1>From alert to understanding.</h1><p class="sec-lead">Open the evidence, connect the events, and defend your decisions. Three self-paced investigations, entirely in your browser.</p><p class="iw-training">Fictional training cases · no account or live systems required</p></div>
      <aside class="iw-board" aria-label="Your caseboard"><span class="sec-eyebrow">Your caseboard</span><strong>${complete}<span> / ${CASES.length}</span></strong><p>cases reviewed</p><div class="iw-board-foot"><span>${drafts} draft${drafts===1?'':'s'} in progress</span><a href="#/progress">Backups & progress →</a></div></aside></div>
      <p class="pg-course-link">Want to build the basics first? <a href="#/playground">Try three short, guided experiments →</a></p>
      <div class="iw-index-head"><h2>Choose your investigation</h2><label class="iw-filter-label">Focus<select id="iwCategory" aria-label="Focus"><option value="all">All disciplines</option>${[...new Set(CASES.map(item=>item.category))].map(category=>`<option>${category}</option>`).join('')}</select></label></div>
      <div class="iw-cases">${CASES.map((item,i)=>{
        const record=records[i];
        const state=caseAction(record);
        return `<article class="iw-card" data-category="${item.category}"><div class="iw-card-top"><span class="iw-case-number">CASE / ${item.number}</span><span class="iw-category">${item.category}</span></div><div class="iw-card-icon" aria-hidden="true">${cardIco(item.icon)}</div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.intro)}</p><div class="iw-card-meta">${item.minutes} min · ${item.level} · ${item.evidence.length} evidence files</div><div class="iw-card-bottom"><span>${record.attempts?`Best review: ${record.bestScore}%`:'3 decisions to explain'}</span><a href="#/investigations/${item.id}">${state} →</a></div></article>`;
      }).join('')}</div><p class="iw-training">Your choices and notes save in this browser and are included in progress backups and optional account sync. These are practice exercises, not certification assessments.</p>
    </section>`;
    document.getElementById('iwCategory').addEventListener('change',event=>{
      app.querySelectorAll('.iw-card').forEach(card=>{card.hidden=event.target.value !== 'all' && card.dataset.category !== event.target.value;});
    });
    currentInvestigationRefresh=()=>{
      const latest=CASES.map(item=>STATE.investigations[item.id] || fresh());
      const complete=latest.filter(record=>record.attempts > 0).length;
      const drafts=latest.filter(record=>(record.updatedAt > 0 || record.reviewed.length) && !record.submittedAt).length;
      app.querySelector('.iw-board>strong').innerHTML=`${complete}<span> / ${CASES.length}</span>`;
      app.querySelector('.iw-board-foot>span').textContent=`${drafts} draft${drafts===1?'':'s'} in progress`;
      app.querySelectorAll('.iw-card').forEach((card,i)=>{
        const record=latest[i];
        card.querySelector('.iw-card-bottom span').textContent=record.attempts?`Best review: ${record.bestScore}%`:'3 decisions to explain';
        card.querySelector('.iw-card-bottom a').textContent=caseAction(record)+' →';
      });
    };
  }
  function renderCase(rawId){
    const {id,lesson}=practiceLessonContext('investigations',rawId);
    const item=CASES.find(item=>item.id===id);
    if(!item){renderNotFound();return;}
    recordFor(id);
    let active=item.evidence[0].id;
    let notesTimer;
    app.innerHTML=`<section class="sec iw-case">
      <a class="iw-back" href="#/investigations">← All investigations</a>
      ${STATE.learningGuide.updatedAt?'<a class="iw-back sg-case-back" href="#/start">Back to my starting route →</a>':''}
      ${practiceReturnHTML(lesson)}
      <div class="sec-head"><div class="sec-eyebrow">Case ${item.number} · ${item.category}</div><h1>${escapeHtml(item.title)}</h1><p class="sec-lead">${escapeHtml(item.intro)}</p><div class="iw-case-chips"><span>${item.minutes} min · self-paced</span><span>${item.level}</span><span>Fictional training environment</span></div></div>
      <details class="iw-guide"><summary>First investigation? Follow these three steps</summary><ol><li><strong>Open the evidence.</strong> Read E1, E2, and E3. The small labels tell you which file you are viewing.</li><li><strong>Connect the clues.</strong> Use the notebook to record what happened and what is still unknown. Your notes save automatically.</li><li><strong>Try a decision.</strong> Use the optional hints if you get stuck. Review your findings to see explanations, then retry freely.</li></ol><a href="#/playground">Start with a beginner experiment instead →</a></details>
      <div class="iw-brief"><strong>Your assignment</strong><p>${escapeHtml(item.mission)}</p></div>
      <div class="iw-workspace"><section class="iw-evidence" aria-labelledby="iwEvidenceHeading"><div class="iw-panel-head"><h2 id="iwEvidenceHeading">Evidence desk</h2><span id="iwInspected"></span></div>
        <label class="sr-only" for="iwFind">Find in evidence</label><input id="iwFind" class="iw-find" type="search" maxlength="80" placeholder="Find text across the evidence…" autocomplete="off"><div id="iwFindResults" class="iw-find-results" aria-live="polite"></div>
        <details class="iw-terms"><summary>Explain the terms in this case</summary><dl>${GUIDES[id].terms.map(([term,definition])=>`<dt>${term}</dt><dd>${definition}</dd>`).join('')}</dl></details>
        <div class="iw-tabs" role="tablist" aria-label="Evidence files">${item.evidence.map((file,i)=>`<button type="button" id="iwTab-${file.id}" role="tab" aria-controls="iwEvidencePanel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-evidence="${file.id}">E${i+1} · ${escapeHtml(file.title)}</button>`).join('')}</div>
        <div id="iwEvidencePanel" class="iw-evidence-panel" role="tabpanel" aria-labelledby="iwTab-${active}" tabindex="0"><div id="iwFileKind" class="iw-file-kind"></div><pre id="iwEvidenceText" tabindex="0" aria-label="Evidence file contents"></pre></div>
        <button class="btn-ghost sm" type="button" id="iwDownloadEvidence">Download evidence pack</button>
        <section class="iw-notes" aria-labelledby="iwNotesHeading"><h3 id="iwNotesHeading">Analyst notebook</h3><label for="iwNotes">What happened, what supports it, and what is still unknown?</label><textarea id="iwNotes" maxlength="12000" rows="7" placeholder="Reference E1, E2, or E3 as you connect the events…"></textarea><p class="iw-note-status" id="iwSaveStatus" role="status"></p></section>
      </section>
      <section class="iw-decisions" aria-labelledby="iwDecisionsHeading"><div class="iw-panel-head"><h2 id="iwDecisionsHeading">Your findings</h2><span id="iwAnswered"></span></div><p class="iw-training">Inspect the evidence, then choose one response for each decision. Explanations appear when you review.</p>
        <form id="iwDecisionForm">${item.questions.map((question,qi)=>`<fieldset class="iw-question"><legend><span>Decision ${qi+1}</span>${escapeHtml(question.prompt)}</legend><details class="iw-hint"><summary>Give me a starting point</summary><p>${GUIDES[id].hints[qi]}</p><button type="button" class="btn-ghost sm" data-hint-ref="${question.refs[0]}">Open the first related evidence file</button></details>${question.options.map((option,oi)=>`<label class="iw-option"><input type="radio" name="${question.id}" value="${oi}" required><span>${escapeHtml(option)}</span></label>`).join('')}</fieldset>`).join('')}<button class="btn-amber" type="submit" id="iwSubmit">Review my findings</button><p id="iwReviewStatus" class="iw-note-status" role="status"></p></form>
        <div id="iwDebrief" class="iw-debrief" aria-live="polite"></div>
      </section></div>
    </section>`;
    const notes=document.getElementById('iwNotes');
    const status=document.getElementById('iwSaveStatus');
    const search=document.getElementById('iwFind');
    notes.value=recordFor(id).notes;
    const flush=()=>{
      clearTimeout(notesTimer);
      status.textContent=saveState()?'Saved in this browser.':'Could not save locally. Copy your notes before closing this tab.';
    };
    currentInvestigationFlush=flush;
    const touch=()=>{recordFor(id).updatedAt=Date.now();};
    function highlight(text,query){
      if(!query)return escapeHtml(text);
      const parts=text.split(new RegExp(`(${escapeRegex(query)})`,'ig'));
      return parts.map((part,i)=>i%2?`<mark>${escapeHtml(part)}</mark>`:escapeHtml(part)).join('');
    }
    function paintEvidence(){
      const file=item.evidence.find(file=>file.id===active);
      const query=search.value.trim();
      document.getElementById('iwFileKind').textContent=file.kind;
      document.getElementById('iwEvidenceText').innerHTML=highlight(file.text,query);
      document.getElementById('iwEvidencePanel').setAttribute('aria-labelledby',`iwTab-${active}`);
      app.querySelectorAll('[role="tab"]').forEach(tab=>{
        const selected=tab.dataset.evidence===active;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;
      });
      const matches=query?item.evidence.filter(file=>(file.title+' '+file.text).toLowerCase().includes(query.toLowerCase())):[];
      document.getElementById('iwFindResults').innerHTML=!query?'':matches.length?`<span>Found in:</span>${matches.map(file=>`<button type="button" data-find="${file.id}">${escapeHtml(file.title)}</button>`).join('')}`:'No evidence matches this text.';
    }
    function selectEvidence(fileId){
      active=fileId;
      const record=recordFor(id);
      if(!record.reviewed.includes(fileId)){record.reviewed.push(fileId);flush();}
      paintEvidence();paintCounts();
    }
    function paintCounts(){
      const record=recordFor(id);
      document.getElementById('iwInspected').textContent=`${record.reviewed.filter(key=>item.evidence.some(file=>file.id===key)).length}/${item.evidence.length} opened`;
      document.getElementById('iwAnswered').textContent=`${answered(item,record)}/${item.questions.length} answered`;
    }
    function paintReview(){
      const record=recordFor(id);
      const submitted=isSubmitted(item,record);
      item.questions.forEach(question=>{
        app.querySelectorAll(`input[name="${question.id}"]`).forEach(input=>{input.checked=Number(input.value)===record.answers[question.id];input.disabled=submitted;});
      });
      document.getElementById('iwSubmit').hidden=submitted;
      document.getElementById('iwDebrief').innerHTML=submitted?`<div class="iw-result-heading"><div class="sec-eyebrow">Case debrief</div><h2 tabindex="-1" id="iwResultHeading">${score(item,record)} of ${item.questions.length} decisions matched</h2><p>Best review: ${record.bestScore}% · ${record.attempts} attempt${record.attempts===1?'':'s'}</p></div>
        ${item.questions.map((question,qi)=>`<article class="iw-feedback ${record.answers[question.id]===question.correct?'is-correct':'needs-review'}"><h3>Decision ${qi+1} · ${record.answers[question.id]===question.correct?'Matched':'Revisit the evidence'}</h3><p><strong>Your response:</strong> ${escapeHtml(question.options[record.answers[question.id]])}</p>${record.answers[question.id]===question.correct?'':`<p><strong>Supported response:</strong> ${escapeHtml(question.options[question.correct])}</p>`}<p>${escapeHtml(question.why)}</p><div class="iw-references">${question.refs.map(ref=>`<button type="button" class="btn-ghost sm" data-ref="${ref}">Open E${item.evidence.findIndex(file=>file.id===ref)+1}</button>`).join('')}</div></article>`).join('')}
        <div class="iw-conclusion"><h3>Model handover</h3><p>${escapeHtml(item.conclusion)}</p><h3>Continue learning</h3>${item.related.map(link=>`<a href="#/lesson/${link.path}">${escapeHtml(link.label)} →</a>`).join('')}<h3>Response references</h3>${item.sources.map(link=>`<a href="${link.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.title)} ↗</a>`).join('')}</div><div class="iw-result-actions"><button type="button" class="btn-amber" id="iwDownloadReport">Download case report</button><button type="button" class="btn-ghost" id="iwRetry">Start new attempt</button></div>`:'';
      paintCounts();
    }
    search.addEventListener('input',paintEvidence);
    app.querySelector('.iw-tabs').addEventListener('click',event=>{const tab=event.target.closest('[data-evidence]');if(tab)selectEvidence(tab.dataset.evidence);});
    app.querySelector('.iw-tabs').addEventListener('keydown',event=>{
      const tabs=[...app.querySelectorAll('[role="tab"]')];
      let index=tabs.indexOf(document.activeElement);
      if(event.key==='ArrowRight')index=(index+1)%tabs.length;
      else if(event.key==='ArrowLeft')index=(index+tabs.length-1)%tabs.length;
      else if(event.key==='Home')index=0;
      else if(event.key==='End')index=tabs.length-1;
      else return;
      event.preventDefault();selectEvidence(tabs[index].dataset.evidence);tabs[index].focus();
    });
    document.getElementById('iwFindResults').addEventListener('click',event=>{const button=event.target.closest('[data-find]');if(button){selectEvidence(button.dataset.find);document.getElementById('iwEvidencePanel').focus();}});
    notes.addEventListener('input',()=>{
      recordFor(id).notes=notes.value;touch();status.textContent='Saving notes…';
      clearTimeout(notesTimer);notesTimer=setTimeout(flush,350);
    });
    notes.addEventListener('blur',flush);
    const form=document.getElementById('iwDecisionForm');
    form.addEventListener('click',event=>{
      const hint=event.target.closest('[data-hint-ref]');
      if(hint){selectEvidence(hint.dataset.hintRef);document.getElementById('iwEvidencePanel').focus();}
    });
    form.addEventListener('change',event=>{
      if(!event.target.matches('input[type="radio"]') || isSubmitted(item,recordFor(id)))return;
      recordFor(id).answers[event.target.name]=Number(event.target.value);touch();flush();paintCounts();
    });
    form.addEventListener('submit',event=>{
      event.preventDefault();
      const record=recordFor(id);
      if(isSubmitted(item,record) || !form.reportValidity() || answered(item,record)!==item.questions.length)return;
      record.submittedAt=Date.now();record.attempts++;
      record.bestScore=Math.max(record.bestScore,Math.round(score(item,record)/item.questions.length*100));
      touch();flush();paintReview();document.getElementById('iwResultHeading').focus();
    });
    document.getElementById('iwDownloadEvidence').addEventListener('click',()=>download(`kashsec-${id}-evidence.txt`,`${item.title}\nFictional training evidence — all timestamps UTC.\n\n${item.evidence.map(file=>file.text).join('\n\n---\n\n')}`));
    document.getElementById('iwDebrief').addEventListener('click',event=>{
      const ref=event.target.closest('[data-ref]');
      if(ref){selectEvidence(ref.dataset.ref);document.getElementById('iwEvidencePanel').focus();return;}
      if(event.target.closest('#iwRetry')){
        const record=recordFor(id);record.answers={};record.submittedAt=0;touch();flush();paintReview();
        form.querySelector('input').focus();return;
      }
      if(event.target.closest('#iwDownloadReport')){
        flush();const record=recordFor(id);
        download(`kashsec-${id}-report.md`,`# ${item.title}\n\nKashSec fictional training case ${item.number}. This is a practice report, not a real incident finding.\n\nReviewed: ${new Date(record.submittedAt).toISOString()}\nDecisions matched: ${score(item,record)}/${item.questions.length}\nBest review: ${record.bestScore}%\n\n## Analyst notes\n\n${record.notes || '(No notes recorded.)'}\n\n## Decision review\n\n${item.questions.map((q,i)=>`### ${i+1}. ${q.prompt}\n\nYour response: ${q.options[record.answers[q.id]]}\nSupported response: ${q.options[q.correct]}\n\n${q.why}`).join('\n\n')}\n\n## Model handover\n\n${item.conclusion}\n\n## References\n\n${item.sources.map(source=>`${source.title}: ${source.url}`).join('\n')}`);
      }
    });
    currentInvestigationRefresh=()=>{
      if(notes.value!==recordFor(id).notes)notes.value=recordFor(id).notes;
      paintReview();
    };
    paintReview();selectEvidence(active);
  }
  return {CASES,renderIndex,renderCase};
})();
