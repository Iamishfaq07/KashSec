/* Shared by the main academy, the preview, and the static page generator.
   No dependencies or requests until mount() is called. All evidence is fictional. */
export const EXPERT_LABS = [
  {
    id:'tenant-boundary', suite:'tenant', title:'Tenant isolation under pressure', track:'AppSec', minutes:60,
    summary:'Review an invoice API where a valid session, a support role, and a client-supplied tenant create three different trust boundaries.',
    mission:'A customer can fetch an invoice from another account. Keep legitimate customer and support access working while closing the cross-account and cross-tenant paths.',
    prerequisites:[{key:'22-devsecops-appsec/secure-code-review',label:'Secure code review'},{key:'21-api-security/bola-and-bfla',label:'Object and function authorization'}],
    evidence:[
      {name:'request-and-identity.txt',body:'Trusted session: user=bob tenant=acme role=customer active=true\nGET /invoices/42?tenant=birch&owner=alice\nInvoice 42: tenant=birch owner=alice amount=45\nObserved response: 200 with invoice data\nNote: query parameters are controlled by the caller.'},
      {name:'handler.py',body:'def get_invoice(session, request, store):\n    assert session.authenticated\n    tenant = request.query.get("tenant", session.tenant)\n    invoice = store.find(tenant, request.invoice_id)\n    if request.query.get("role") == "billing-support":\n        return invoice\n    return invoice  # login is the only effective check'},
      {name:'access-contract.txt',body:'A customer may read only their own invoice in their trusted session tenant.\nA trusted billing-support role may read invoices in that same tenant.\nA support role is assigned by the server, never by a query field.\nInactive or unauthenticated identities are denied.\nA denial must not return the invoice body.'}
    ],
    tasks:['Draw the trust boundary between the authenticated actor and the request fields. Name two distinct authorization failures with evidence-file references.','Edit tenant_invoice in the downloadable exercise. Derive tenant and role from the trusted actor; preserve the owner and authorized support cases.','Run the tenant suite without --reference. Add a proposed endpoint test proving a client cannot spoof the trusted identity before this function is called.','Write a short finding with impact, reproduction, fix, allowed/denied results, and the remaining identity-integration risk.'],
    hints:['Authentication identifies an actor. It does not grant access to every invoice.','Check the tenant before applying the support exception, then check ownership or a trusted role.'],
    limits:'The Python exercise uses in-memory dictionaries. It does not implement sessions, database queries, HTTP status codes, or a real support approval process.',
    questions:[
      {q:'Which identity field should determine the invoice tenant?',options:['The tenant in the query string','The invoice owner supplied by the browser','The tenant in the server-resolved authenticated actor','The first tenant in the database'],correct:2,explain:'request-and-identity.txt marks query parameters as caller-controlled. The actor tenant comes from the trusted authentication boundary.'},
      {q:'Which support rule matches access-contract.txt?',options:['Support can read every tenant','A trusted support role can read invoices in its own tenant','Any request with role=billing-support is allowed','Support must be blocked from every invoice'],correct:1,explain:'The support exception is tenant-scoped and server-assigned. A blanket deny would break legitimate access; a global exception would cross tenants.'},
      {q:'Which regression set gives the most useful evidence?',options:['One successful login','A scan with zero alerts','Only one denied request','Owner allowed, other owner denied, other tenant denied, scoped support allowed, spoofed role denied'],correct:3,explain:'Both positive and negative cases are necessary. They show that the permission rule is enforced without disabling the feature.'},
      {q:'What remains unproven after the function tests pass?',options:['Whether the real endpoint resolves the actor from a trusted session','Whether the fixture contains invoice 42','Whether the Python interpreter can import unittest','Whether the reference implementation exists'],correct:0,explain:'The function assumes a trusted actor. A separate integration test must verify how the endpoint constructs that actor.'}
    ]
  },
  {
    id:'webhook-replay', suite:'webhook', title:'Signed once, processed twice', track:'AppSec', minutes:75,
    summary:'Separate message integrity, freshness, and idempotency in a payment webhook. A valid signature is only one of the three checks.',
    mission:'A fictional billing webhook accepts a tampered payload and applies a valid event twice. Repair the verification contract and explain how durable processing would differ.',
    prerequisites:[{key:'22-devsecops-appsec/secure-code-review',label:'Follow data through a review'},{key:'21-api-security/webhook-security',label:'Webhook security'}],
    evidence:[
      {name:'delivery.log',body:'10:00:00 event=evt-42 signature=valid decision=accepted credits=1\n10:00:03 event=evt-42 signature=valid decision=accepted credits=2\n10:00:05 event=evt-43 body_changed=true signature=unchecked decision=accepted\nThese are synthetic observations, not a real payment provider log.'},
      {name:'verification-contract.txt',body:'Fictional training contract, not vendor-specific:\nHMAC-SHA256(secret, ASCII(timestamp) + b"." + exact_raw_body_bytes)\nCompare the hexadecimal digest with a constant-time comparison.\nReject timestamps more than 300 seconds away from the trusted current time.\nVerify integrity and freshness before parsing or recording an event.\nEvent id must be a non-empty string of at most 64 characters.\nA repeated verified event is acknowledged as duplicate with no second effect.\nRejected messages must not consume an event id.'},
      {name:'worker-design.txt',body:'Current demo: JSON parse -> credit account -> remember event id.\nTwo workers can read "not seen" at the same time.\nRequired production design: durable event identity and atomic state transition.\nFor a database-local credit, a unique inbox row and credit update can share one transaction.\nFor an external side effect, design an outbox/idempotent consumer and recovery path.\nA Python set demonstrates only serial deduplication, not concurrency safety.'}
    ],
    tasks:['Explain why valid signatures did not stop the first two deliveries. Identify the evidence for a separate integrity failure.','Edit webhook_event in the exercise. Authenticate the exact raw bytes, enforce freshness, validate the event ID, and suppress serial duplicates.','Run the webhook suite without --reference. Document the changed-body, wrong-signature, stale, future, malformed, and replay results.','Sketch a durable inbox/outbox or transaction design. Describe a two-worker race and a crash between committing a result and acknowledging delivery.'],
    hints:['Re-serializing parsed JSON can change the bytes that were signed. Verify the original body first.','A signature proves integrity under a key. It does not prove an event is new or that its side effect has not already happened.'],
    limits:'The reference is a serial, in-memory model. It does not guarantee concurrent or durable exactly-once delivery. Real integrations must follow their provider’s signature and retry contract.',
    questions:[
      {q:'Which body should be authenticated under this training contract?',options:['The exact received raw bytes','JSON re-serialized with sorted keys','Only the event ID','A browser-formatted version of the JSON'],correct:0,explain:'verification-contract.txt defines the MAC over the timestamp and raw body. Changing serialization can change the authenticated message.'},
      {q:'What does the second evt-42 entry demonstrate?',options:['The secret must have been guessed','The timestamp must be invalid','A new transaction was created by the provider','A verified event can still cause a duplicate business effect'],correct:3,explain:'delivery.log shows the same event being accepted twice. Valid signatures do not provide idempotency.'},
      {q:'What should an invalid signature do to the processed-event store?',options:['Reserve the event ID forever','Leave it unchanged','Credit the account and log a warning','Delete all earlier event IDs'],correct:1,explain:'An unauthenticated request must not poison deduplication state or trigger a business side effect.'},
      {q:'What production property does a serial Python set fail to establish?',options:['The presence of a test runner','Whether HMAC is available','Atomic, durable deduplication across workers and crashes','Whether the fixture has an event ID'],correct:2,explain:'worker-design.txt describes races and crash recovery. A durable uniqueness constraint plus a transactional/idempotent processing design needs integration tests.'}
    ]
  },
  {
    id:'release-trust', suite:'release', title:'The signed artifact from the wrong build', track:'AppSec', minutes:60,
    summary:'Review a release gate that accepts any signed artifact. Bind trust to the expected repository, workflow, source ref, environment, and artifact digest.',
    mission:'A fork-produced artifact has a valid signature and reaches a production approval queue. Define which build context is trusted, then enforce that policy on verified metadata.',
    prerequisites:[{key:'22-devsecops-appsec/cicd-security',label:'CI/CD trust boundaries'},{key:'22-devsecops-appsec/secrets-supply-chain',label:'Software supply chain'}],
    evidence:[
      {name:'candidate.json',body:'{\n  "signature_verified": true,\n  "issuer": "https://token.actions.githubusercontent.com",\n  "repository": "fork/billing",\n  "workflow": ".github/workflows/pr.yml",\n  "source_ref": "refs/heads/feature",\n  "event": "pull_request",\n  "environment": "preview",\n  "artifact_digest": "bbbb... (64 hex characters)"\n}\nThis is already-verified synthetic metadata, not an unsigned payload to trust directly.'},
      {name:'production-policy.txt',body:'Only verifier-produced metadata may enter the gate.\nSignature result must be boolean true.\nExpected issuer: https://token.actions.githubusercontent.com\nRepository: acme/billing\nWorkflow: .github/workflows/release.yml\nSource ref: refs/heads/main; event: push; environment: production\nArtifact digest must equal the separately approved digest (64 lowercase hex characters).\nThe deployer must consume those exact immutable bytes, not a mutable tag.\nClaim names here are a simplified contract, not a portable attestation schema.'},
      {name:'gate.py',body:'def release_allowed(verified_metadata):\n    return bool(verified_metadata.get("signature_verified"))\n\n# Later: deploy("registry.example.test/billing:latest")\n# A signature check alone neither constrains the builder nor binds this tag.'}
    ],
    tasks:['Identify two separate gaps: trusting an unexpected build identity and deploying bytes that are not bound to the reviewed digest.','Edit release_allowed. Deny missing or incorrect verified claims and mismatched digests while allowing the approved build.','Run the release suite without --reference. Map each policy field to a rejected mutation and save the result.','Describe how a real verifier supplies authenticated claims and how the deployment job selects the exact approved digest. Include one compromise scenario this gate cannot prevent.'],
    hints:['Verified is a cryptographic result, not an authorization policy. Ask who signed, from which workflow, and for which artifact.','Never let the candidate choose its own approved_digest. That value must come from a separate trusted approval record.'],
    limits:'This exercise evaluates a simplified policy on already-verified metadata. It does not verify an OIDC token, certificate, signature, SLSA predicate, registry, or cloud deployment.',
    questions:[
      {q:'Why is candidate.json insufficient for production approval?',options:['All signed artifacts must be rejected','Only the signature key length matters','Its verified build identity and context do not match the production policy','A pull request is always malicious'],correct:2,explain:'The artifact can be genuinely signed by an identity that this deployment does not trust. production-policy.txt binds that authorization decision to specific claims.'},
      {q:'Where should approved_digest come from?',options:['A separate trusted approval record','A field supplied by the untrusted candidate','The current value of latest after deployment','An arbitrary digest with the right length'],correct:0,explain:'If the candidate controls both the artifact and its approved value, digest equality gives no independent approval evidence.'},
      {q:'What prevents swapping reviewed bytes for a different image under latest?',options:['A green build badge','A longer tag name','Repeating the same signature check after changing the tag','Deploying the verified, approved immutable digest'],correct:3,explain:'gate.py shows a mutable-tag gap. The deploy step must consume the exact digest that the policy approved.'},
      {q:'What does passing this exercise still not establish?',options:['Whether a missing claim is rejected','That the trusted builder itself is uncompromised or the application is vulnerability-free','Whether two fixture digests match','Whether the policy names a repository'],correct:1,explain:'A trusted build can still produce vulnerable software or be compromised. Supply-chain integrity is one part of the release decision.'}
    ]
  },
  {
    id:'cloud-scope', suite:'iam', title:'Cloud permissions with a tenant boundary', track:'Cloud', minutes:60,
    summary:'Reduce an over-broad object-store grant and prove the intended action, principal, bucket, and tenant prefix. Separate a small contract test from real IAM evaluation.',
    mission:'The billing service needs to download only Acme invoice objects. Its current role can read another tenant and write objects. Produce a narrower policy and an evidence-based verification plan.',
    prerequisites:[{key:'16-advanced/cloud-security',label:'Cloud security'},{key:'22-devsecops-appsec/iac-security-scanning',label:'Infrastructure as code review'}],
    evidence:[
      {name:'current-policy.json',body:'{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": "s3:*",\n    "Resource": ["arn:aws:s3:::billing-prod", "arn:aws:s3:::billing-prod/*"]\n  }]\n}\nThis identity policy is attached to the fictional billing-api role.\nRole trust, bucket policy, permission boundary, session policy, SCP and KMS grants are not included.'},
      {name:'required-access.txt',body:'Principal: billing-api\nAction: s3:GetObject only\nObject prefix: arn:aws:s3:::billing-prod/tenants/acme/\nNo bucket listing, writes, deletes, other tenant, lookalike bucket, or other principal.\nThe exercise models objects with a non-empty suffix under that prefix.\nA real S3 prefix is a key prefix, not a filesystem path.\nScope assumes each deployed tenant has a separately trusted role assignment.'},
      {name:'review-notes.txt',body:'Observed: role can GetObject tenants/birch/invoice-7.pdf.\nNo evidence yet of historical downloads or data exfiltration.\nA scanner marks the wildcard action as High.\nA proposed fix changes s3:* to s3:GetObject but keeps billing-prod/*.\nAnother proposed fix grants tenants/acme* (also matches acme-backups).\nEncryption, a public-access block, or a severity label does not narrow this authenticated role grant.'}
    ],
    tasks:['Write a minimal identity-policy statement for the required object downloads. Explain why a GetObject grant uses an object ARN and does not need a bucket ListBucket grant.','Edit object_download_allowed to model the exact principal, action, bucket, and tenant-prefix contract. Run the iam suite without --reference.','Design a real policy-validation matrix with one allow and at least five denies. State how you would inspect all applicable policy layers in an isolated authorized account.','Write a finding that distinguishes observed access from unproven historical exfiltration. Include policy version, test principal, tested objects, and remaining KMS/resource-policy questions.'],
    hints:['Narrowing the action does not narrow the resource. Review both.','The slash after acme is part of the boundary. acme* includes more names than acme/*.'],
    limits:'The Python predicate is a small access contract, not an AWS IAM simulator. Real decisions can depend on explicit denies, resource policies, SCPs, boundaries, sessions, role trust, and KMS.',
    questions:[
      {q:'Which resource most closely expresses the required GetObject scope?',options:['arn:aws:s3:::billing-prod','arn:aws:s3:::billing-prod/tenants/acme/*','arn:aws:s3:::billing-prod/*','arn:aws:s3:::billing-prod/tenants/acme*'],correct:1,explain:'required-access.txt scopes objects to the acme/ prefix. A bucket ARN is not an object ARN, and acme* also matches other prefixes.'},
      {q:'Why is the proposed GetObject-only fix still incomplete?',options:['It does not rename the role','It removes bucket listing','It still grants reads across every tenant in billing-prod/*','GetObject always grants writes too'],correct:2,explain:'Action and resource scope are independent. review-notes.txt says the resource wildcard remains broad.'},
      {q:'Which claim is supported by the supplied evidence?',options:['The role could read the tested Birch object; historical bulk extraction is not established','Every customer invoice was stolen','The KMS key is public','All organization policies permit this role'],correct:0,explain:'Observed cross-tenant access is enough to report the issue. The fixture does not establish historical use or unseen policy configuration.'},
      {q:'What should follow the Python contract tests?',options:['Declare the real AWS role secure','Delete all cloud logs','Assume resource policies cannot change the result','Review applicable policy layers and verify the allow/deny matrix with an authorized isolated identity'],correct:3,explain:'The model intentionally omits AWS policy composition and actual service behavior. Integration evidence is still needed.'}
    ]
  }
];

const STORAGE_KEY='kashsec_expert_labs_v1';
const VERSION=1;
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function readDrafts(){
  const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
  if(!parsed||Array.isArray(parsed)||typeof parsed!=='object')throw Error('Invalid drafts');
  return parsed;
}
function draftSummary(record){
  const answers=Array.isArray(record?.answers)?record.answers:[];
  const answered=answers.slice(0,4).filter(a=>Number.isInteger(a)&&a>=0&&a<4).length;
  const hasNotes=typeof record?.notes==='string'&&record.notes.trim().length>0;
  return {started:answered>0||hasNotes,text:answered||hasNotes?`Saved draft · ${answered}/4 answers · ${hasNotes?'report started':'no report notes yet'}`:'No saved draft'};
}
let stylePromise=null;
export function prepareExpertStyles(){
  const existing=document.getElementById('expertLabsStyles');
  if(existing?.sheet)return Promise.resolve();
  if(stylePromise)return stylePromise;
  stylePromise=new Promise((resolve,reject)=>{
    const link=existing||document.createElement('link');
    const fail=()=>{clearTimeout(timer);link.remove();stylePromise=null;reject(new Error('Expert styles unavailable'));};
    const timer=setTimeout(fail,8000);
    link.onload=()=>{clearTimeout(timer);resolve();};link.onerror=fail;
    if(!existing){link.id='expertLabsStyles';link.rel='stylesheet';link.href=new URL('./expert-labs.css',import.meta.url).href;document.head.append(link);}
  });
  return stylePromise;
}
export function mountExpertLabs({root,id=null,href=lab=>lab?`/expert-labs/${lab}.html`:'/expert-labs/',lessonHref=key=>`/lesson/${key}.html`,navigate=null}){
  // Keep compatibility with older shells while current callers await styles
  // before mounting, so a visible case always has bounded code and inputs.
  void prepareExpertStyles().catch(()=>{});
  const labsHref='/labs/';
  const tabs=`<nav class="ex-tabs" aria-label="Lab collections"><a href="${labsHref}">All labs</a><a href="${href(null)}" data-expert="" aria-current="page">Expert Labs</a></nav>`;
  const lab=EXPERT_LABS.find(item=>item.id===id);
  const download=(name,content,type)=>{
    const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const wireNavigation=()=>{
    if(!navigate)return;
    root.querySelectorAll('[data-expert]').forEach(a=>a.addEventListener('click',event=>{
      if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      event.preventDefault();navigate(a.dataset.expert||null);
    }));
  };
  if(id&&!lab){root.innerHTML=`<section class="ex-page">${tabs}<h1>That expert lab is not available</h1><a href="${href(null)}" data-expert="">Browse Expert Labs</a></section>`;wireNavigation();return ()=>{};}
  if(!lab){
    root.innerHTML=`<section class="ex-page">${tabs}<p class="ex-eyebrow">Advanced practice · four evidence-led cases</p><h1>Expert Labs</h1><p class="ex-lead">Move from spotting a bug to proving a fix. Read the evidence, repair a small implementation, and write a review another engineer can reproduce.</p><p>Each case combines browser review with a downloadable Python exercise. Python 3.10+ is required for the coding work; no packages, account, network, or cloud spend are needed. Time estimates include writing your report.</p><p id="exCollectionStatus" role="status"></p><p class="ex-note">Saved drafts show where you left off. Draft status does not mark coding work complete.</p><div class="ex-grid">${EXPERT_LABS.map(item=>`<article class="ex-card" data-expert-card="${item.id}"><p class="ex-eyebrow">${item.track} · about ${item.minutes} min</p><h2><a href="${href(item.id)}" data-expert="${item.id}">${item.title}</a></h2><p>${item.summary}</p><p><strong>Deliver:</strong> a fix, passing tests, and a review with remaining risks.</p><p data-draft-status="${item.id}" class="ex-note"></p><a class="ex-button" href="${href(item.id)}" data-expert="${item.id}" data-case-action="${item.id}">Open case →</a></article>`).join('')}</div><section class="ex-card"><h2>Go further with maintained lab platforms</h2><p>Use these after the local cases. Their requirements and progress are separate from KashSec.</p><ul><li><a href="https://portswigger.net/web-security/all-labs" target="_blank" rel="noopener noreferrer">PortSwigger Web Security Academy</a> — use the Expert difficulty filter for advanced web labs. A free account and an HTTP testing tool may be needed; individual labs describe requirements.</li><li><a href="https://github.com/OWASP/crAPI" target="_blank" rel="noopener noreferrer">OWASP crAPI</a> — a full intentionally vulnerable API. Follow its current local-install instructions; it requires a container environment.</li><li><a href="https://github.com/OWASP/juice-shop" target="_blank" rel="noopener noreferrer">OWASP Juice Shop</a> — a full web application with advanced challenges. Use your own local instance and its current companion guide.</li></ul></section></section>`;
    let saved={},canReadDrafts=true;
    try{saved=readDrafts();}catch(_){canReadDrafts=false;root.querySelector('#exCollectionStatus').textContent='Saved drafts could not be read in this browser. You can still open any case.';}
    for(const item of EXPERT_LABS){
      const summary=draftSummary(Object.hasOwn(saved,item.id)?saved[item.id]:null);
      root.querySelector(`[data-draft-status="${item.id}"]`).textContent=canReadDrafts?summary.text:'Draft status unavailable';
      root.querySelector(`[data-case-action="${item.id}"]`).textContent=summary.started?'Continue case →':'Open case →';
    }
    wireNavigation();return ()=>{};
  }
  let drafts={},storageError=false;
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(raw){const parsed=JSON.parse(raw);if(!parsed||Array.isArray(parsed)||typeof parsed!=='object')throw Error('Invalid drafts');drafts=parsed;}
  }catch(_){storageError=true;}
  const stored=Object.hasOwn(drafts,lab.id)&&drafts[lab.id]&&typeof drafts[lab.id]==='object'?drafts[lab.id]:{};
  let answers=lab.questions.map((q,i)=>Number.isInteger(stored.answers?.[i])&&stored.answers[i]>=0&&stored.answers[i]<q.options.length?stored.answers[i]:null);
  let notes=typeof stored.notes==='string'?stored.notes.slice(0,12000):'';
  let review=null;
  let baseline=JSON.stringify(Object.hasOwn(drafts,lab.id)?drafts[lab.id]:null);
  let conflict=false;
  root.innerHTML=`<section class="ex-page">${tabs}<p><a href="${href(null)}" data-expert="">← All expert cases</a></p><p class="ex-eyebrow">${lab.track} · about ${lab.minutes} min · expert case</p><h1>${lab.title}</h1><p class="ex-lead">${lab.mission}</p><p class="ex-notice">This is fictional evidence and local coding practice. A browser review is a self-check, not proof that you completed the implementation or mastered the subject.</p><nav class="ex-steps" aria-label="Case steps"><a data-case-step href="#exEvidenceHeading">1. Evidence</a><a data-case-step href="#exFixHeading">2. Fix & verify</a><a data-case-step href="#exReasoningHeading">3. Reasoning</a><a data-case-step href="#exReportHeading">4. Report</a></nav><h2>Before you start</h2><ul>${lab.prerequisites.map(item=>`<li><a href="${lessonHref(item.key)}">${item.label}</a></li>`).join('')}</ul><h2 id="exEvidenceHeading" tabindex="-1">1. Inspect the evidence</h2><p>Use the filenames when citing evidence in your report.</p><div class="ex-evidence">${lab.evidence.map(file=>`<details open><summary>${file.name}</summary><pre tabindex="0" aria-label="${file.name}"><code>${escape(file.body)}</code></pre></details>`).join('')}</div><button class="ex-button" type="button" id="exEvidence">Download evidence JSON</button><h2 id="exFixHeading" tabindex="-1">2. Build and verify a fix</h2><ol>${lab.tasks.map(task=>`<li>${escape(task)}</li>`).join('')}</ol><p><a class="ex-button" href="/downloads/expert_security_lab.py" download>Download Python exercise</a> · Python 3.10+, standard library only</p><pre tabindex="0" aria-label="Exercise commands"><code>python expert_security_lab.py --lab ${lab.suite}
# Edit the matching starter function; keep tests unchanged.
python expert_security_lab.py --lab ${lab.suite}
# Optional comparison, which tests the supplied reference only:
python expert_security_lab.py --lab ${lab.suite} --reference</code></pre><p><strong>Expected:</strong> starter mode initially fails. After your fix, the selected test method and its subcases pass. The full file contains four test methods, one per lab. Passing reference mode does not verify your edits.</p><details><summary>Hint 1 — find the boundary</summary><p>${lab.hints[0]}</p></details><details><summary>Hint 2 — plan the repair</summary><p>${lab.hints[1]}</p></details><p class="ex-notice"><strong>Limits:</strong> ${lab.limits}</p><h2 id="exReasoningHeading" tabindex="-1">3. Check your reasoning</h2><p>Answer all four questions, then review the evidence-based explanations. You can revise and review again without a timer or penalty.</p><form id="exReviewForm">${lab.questions.map((q,qi)=>`<fieldset><legend>${qi+1}. ${escape(q.q)}</legend>${q.options.map((option,oi)=>`<label><input type="radio" name="ex-q-${qi}" value="${oi}" ${answers[qi]===oi?'checked':''}> <span>${escape(option)}</span></label>`).join('')}</fieldset>`).join('')}<button type="submit" class="ex-button">Review my reasoning</button><p id="exReviewStatus" role="status"></p></form><section id="exResults" hidden aria-labelledby="exResultHeading"></section><h2 id="exReportHeading" tabindex="-1">4. Keep a reproducible report</h2><label for="exNotes">Your findings, fix, test results, and remaining risk</label><textarea id="exNotes" maxlength="12000" rows="10" placeholder="Evidence filenames and observations:
Allowed and denied cases:
Fix and test command (without --reference):
Result from my implementation:
Remaining integration risk:"></textarea><p class="ex-note">Drafts stay on this browser, separately from course progress and account sync. Download your report to keep a copy. It contains only what you enter here and your self-check answers.</p><p id="exSaveStatus" role="status"></p><aside id="exConflict" class="ex-notice" hidden><p>The saved version is protected. Download your current report to keep both versions before loading the saved draft.</p><details><summary>View the saved report draft</summary><pre id="exOtherDraft" tabindex="0" aria-label="Saved report draft"></pre></details><button type="button" id="exUseSaved" class="ex-button">Load saved draft</button><p>This replaces the answers and notes currently shown here.</p></aside><button class="ex-button" id="exReport" type="button">Download my report</button><p id="exDownloadStatus" role="status"></p><nav class="ex-sequence" aria-label="Case sequence"><a class="ex-button" href="${href(null)}" data-expert="">All expert cases</a>${EXPERT_LABS[EXPERT_LABS.indexOf(lab)+1]?`<a class="ex-button" href="${href(EXPERT_LABS[EXPERT_LABS.indexOf(lab)+1].id)}" data-expert="${EXPERT_LABS[EXPERT_LABS.indexOf(lab)+1].id}">Next case: ${EXPERT_LABS[EXPERT_LABS.indexOf(lab)+1].title} →</a>`:""}</nav></section>`;
  const saveStatus=root.querySelector('#exSaveStatus');
  const paintSave=()=>{saveStatus.textContent=storageError?'Could not read or save browser drafts. Your current work is available here; download a report before leaving.':conflict?'Another tab changed this case. Auto-save is paused to protect that saved draft. Your current work is still here and can be downloaded.':'Draft saved on this browser.';};
  const persist=()=>{
    // If reading failed, preserve the original record instead of overwriting it.
    if(storageError||conflict){paintSave();return;}
    try{
      const latest=readDrafts();
      const remote=Object.hasOwn(latest,lab.id)?latest[lab.id]:null;
      if(JSON.stringify(remote)!==baseline){
        conflict=true;
        root.querySelector('#exConflict').hidden=false;
        root.querySelector('#exOtherDraft').textContent=typeof remote?.notes==='string'?remote.notes.slice(0,12000):'(No report notes in the saved draft.)';
        paintSave();return;
      }
      drafts={...latest,[lab.id]:{answers,notes,version:VERSION}};
      localStorage.setItem(STORAGE_KEY,JSON.stringify(drafts));
      baseline=JSON.stringify(drafts[lab.id]);
    }
    catch(_){storageError=true;}
    paintSave();
  };
  root.querySelector('#exNotes').value=notes;
  root.querySelector('#exUseSaved').addEventListener('click',()=>{
    try{
      const latest=readDrafts();
      const saved=Object.hasOwn(latest,lab.id)?latest[lab.id]:null;
      if(!saved||Array.isArray(saved)||typeof saved!=='object'||typeof saved.notes!=='string'||saved.notes.length>12000||
         !Array.isArray(saved.answers)||saved.answers.length!==lab.questions.length||
         saved.answers.some((answer,i)=>answer!==null&&(!Number.isInteger(answer)||answer<0||answer>=lab.questions[i].options.length))){
        saveStatus.textContent='The saved draft is no longer available. Your current work is still here and can be downloaded.';
        return;
      }
    }catch(_){storageError=true;paintSave();return;}
    mountExpertLabs({root,id,href,lessonHref,navigate});
    root.querySelector('#exNotes').focus();
  });
  root.querySelectorAll('[data-case-step]').forEach(link=>link.addEventListener('click',event=>{
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const heading=root.querySelector(link.getAttribute('href'));
    if(!heading)return;
    event.preventDefault();heading.scrollIntoView({behavior:'instant',block:'start'});heading.focus({preventScroll:true});
  }));
  if(storageError)paintSave();else saveStatus.textContent=stored.notes||stored.answers?'Draft restored from this browser.':'Your draft will save on this browser as you work.';
  root.querySelector('#exNotes').addEventListener('input',event=>{notes=event.target.value;persist();});
  root.querySelector('#exReviewForm').addEventListener('change',event=>{
    const match=event.target.name?.match(/^ex-q-(\d)$/);if(!match)return;
    answers[Number(match[1])]=Number(event.target.value);review=null;
    root.querySelector('#exResults').hidden=true;root.querySelector('#exReviewStatus').textContent='Answer changed. Review again to update the explanations.';persist();
  });
  root.querySelector('#exReviewForm').addEventListener('submit',event=>{
    event.preventDefault();const missing=answers.findIndex(answer=>answer===null);
    if(missing!==-1){root.querySelector('#exReviewStatus').textContent=`Choose an answer for question ${missing+1} before reviewing.`;root.querySelector(`[name="ex-q-${missing}"]`).focus();return;}
    review={score:answers.filter((answer,i)=>answer===lab.questions[i].correct).length,at:new Date().toISOString()};
    const result=root.querySelector('#exResults');result.hidden=false;
    result.innerHTML=`<h3 id="exResultHeading" tabindex="-1">Reasoning reviewed: ${review.score} of 4</h3><p>This does not mark a course lesson or coding exercise complete.</p><ol>${lab.questions.map((q,i)=>`<li><strong>${answers[i]===q.correct?'Matches the evidence.':'Review this decision.'}</strong> ${escape(q.explain)}</li>`).join('')}</ol>`;
    root.querySelector('#exReviewStatus').textContent='Review ready below.';result.querySelector('h3').focus({preventScroll:true});result.scrollIntoView({behavior:'instant',block:'start'});persist();
  });
  root.querySelector('#exEvidence').addEventListener('click',()=>{
    download(`kashsec-${lab.id}-evidence.json`,JSON.stringify({lab:lab.id,version:VERSION,fictional:true,evidence:lab.evidence},null,2),'application/json');
  });
  root.querySelector('#exReport').addEventListener('click',()=>{
    const text=`# ${lab.title}\n\nKashSec expert case: ${lab.id} · version ${VERSION}\nExported: ${new Date().toISOString()}\nFictional lab. Self-reported work; no certification or coding completion is asserted.\n\n## My report\n\n${notes||'(No findings or test results entered.)'}\n\n## Browser self-check\n\n${lab.questions.map((q,i)=>`${i+1}. ${q.q}\n   My answer: ${answers[i]===null?'Unanswered':q.options[answers[i]]}`).join('\n\n')}\n\n${review?`Current answers reviewed: ${review.score}/4 at ${review.at}`:'Current answers have not been reviewed in this visit.'}\n\n## Exercise\n\npython expert_security_lab.py --lab ${lab.suite}\nReference mode tests supplied code, not my edited starter.\n\n## Limits\n\n${lab.limits}\n`;
    download(`kashsec-${lab.id}-report.md`,text,'text/markdown');root.querySelector('#exDownloadStatus').textContent='Report download prepared. Check your browser downloads.';
  });
  wireNavigation();
  return ()=>{};
}

// Public module scripts let the preview load this shared file without asking
// its bundler to transform an asset from public/. Node imports stay inert.
if(typeof window!=='undefined')window.KashExpertLabs={EXPERT_LABS,mountExpertLabs,prepareExpertStyles};
