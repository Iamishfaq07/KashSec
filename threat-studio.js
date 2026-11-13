/* Local STRIDE workspace. Drafts are separate from course progress and account sync. */
const KEY = 'kashsec_threat_studio_v1';
const STATUSES = ['open', 'planned', 'tested', 'na'];
const PRIORITIES = ['high', 'medium', 'low'];
const SOURCES = [
  ['OWASP threat modeling', 'https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html'],
  ['OWASP authorization', 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html'],
  ['OWASP file uploads', 'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html']
];

export function mountThreatStudio({root, categories, escapeHtml: esc}) {
  const blank = () => ({schemaVersion:1, system:'', scope:'', flows:'', categories:Object.fromEntries(categories.map(c=>[c.id,{threat:'',response:'',verification:'',status:'open',priority:'medium'}]))});
  function validate(value) {
    if(!value || value.schemaVersion !== 1 || !value.categories || typeof value.categories !== 'object') throw new Error('Unsupported worksheet format.');
    const result = blank();
    const text = (value, max) => { if(typeof value !== 'string' || value.length > max) throw new Error('Invalid or oversized worksheet field.'); return value; };
    for(const key of ['system','scope','flows']) result[key] = text(value[key], key === 'system' ? 200 : 6000);
    for(const c of categories) {
      const row = value.categories[c.id];
      if(!row || !STATUSES.includes(row.status) || !PRIORITIES.includes(row.priority)) throw new Error('Invalid category or review status.');
      result.categories[c.id] = {status:row.status,priority:row.priority};
      for(const key of ['threat','response','verification']) result.categories[c.id][key] = text(row[key],6000);
    }
    return result;
  }
  let draft = blank(), baseline = null, dirty = false;
  let initialMessage = 'Start a worksheet or choose an example. Save your work before leaving.';
  try {
    baseline = localStorage.getItem(KEY);
    if(baseline) { draft = validate(JSON.parse(baseline)); initialMessage = 'Saved worksheet restored from this browser.'; }
  } catch(_) { initialMessage = 'The saved worksheet could not be read. This new draft will replace it only if you choose Save.'; }
  root.innerHTML = `
    <div class="ts-intro"><div><span class="sec-eyebrow">Design → question → verify</span><h2>Turn a risk into a testable decision.</h2><p>Map a feature, question its boundaries, then describe how you will check each control. Your worksheet stays in this browser, separately from course progress and account sync.</p></div><a class="btn-ghost" href="#/lesson/22-devsecops-appsec/threat-modeling-sdlc">Learn the method →</a></div>
    <div class="ts-toolbar"><label>Start from an example<select id="tsExample" class="fc-select"><option value="">Choose a starting point</option><option value="api">Invoice API</option><option value="upload">Document uploads</option></select></label><button class="btn-ghost" id="tsUseExample" type="button">Use example</button><button class="btn-ghost" id="tsBlank" type="button">New worksheet</button></div>
    <p class="tool-note">Examples are fictional starting points. Adapt them to your system; they are not complete threat models.</p>
    <div class="ts-layout"><div class="ts-editor">
      <section class="ts-scope" aria-labelledby="tsScopeHeading"><span class="sec-eyebrow">01 / Understand the system</span><h2 id="tsScopeHeading">What are you building?</h2>
        <label class="tool-field">System / feature being modeled<input class="tool-input" id="stSystem" maxlength="200" placeholder="e.g. Customer invoice API"></label>
        <label class="tool-field">Assets, users and scope<textarea class="tool-textarea" id="tsScope" rows="3" maxlength="6000" placeholder="Who uses it? What needs protecting? What is outside this review?"></textarea></label>
        <label class="tool-field">Data flows and trust boundaries<textarea class="tool-textarea" id="tsFlows" rows="3" maxlength="6000" placeholder="Browser → API → database. Where do identity, ownership or privilege change?"></textarea></label>
      </section>
      <section aria-labelledby="tsThreatsHeading"><span class="sec-eyebrow">02 / Make the decisions</span><h2 id="tsThreatsHeading">Work through STRIDE</h2><p class="tool-note">For each category, describe a plausible threat, a response, and the evidence you need. For “Not applicable,” explain why in the threat field.</p>
        <div id="stFields">${categories.map((c,i)=>`<details class="ts-category" ${i===0?'open':''}><summary><span class="ts-letter" aria-hidden="true">${['S','T','R','I','D','E'][i]}</span><span>${c.t}</span><span class="ts-summary-status" data-summary="${c.id}">Open</span></summary><div class="ts-category-body"><p>${c.d}</p>
          <label class="tool-field">Threat or reason this category does not apply<textarea class="tool-textarea" id="st-${c.id}" data-category="${c.id}" data-field="threat" maxlength="6000" rows="3"></textarea></label>
          <div class="ts-row"><label class="tool-field">Priority<select class="fc-select" data-category="${c.id}" data-field="priority"><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label><label class="tool-field">Review status<select class="fc-select" data-category="${c.id}" data-field="status"><option value="open">Open</option><option value="planned">Control planned</option><option value="tested">Tested — evidence recorded</option><option value="na">Not applicable</option></select></label></div>
          <label class="tool-field">Response / control<textarea class="tool-textarea" data-category="${c.id}" data-field="response" maxlength="6000" rows="2" placeholder="What will reduce or remove the threat? Who will do it?"></textarea></label>
          <label class="tool-field">Verification plan and results<textarea class="tool-textarea" data-category="${c.id}" data-field="verification" maxlength="6000" rows="3" placeholder="Which allowed and denied cases will you test? Record actual results when available."></textarea></label>
        </div></details>`).join('')}</div>
      </section>
    </div><aside class="ts-review" aria-labelledby="tsReviewHeading"><span class="sec-eyebrow">03 / Review the model</span><h2 id="tsReviewHeading">Ready for a discussion?</h2><p id="tsCoverage"></p><div class="ts-meter" aria-hidden="true"><span id="tsMeter"></span></div><p class="tool-note">This tracks worksheet coverage, not system security. “Tested” is your recorded assessment.</p><details><summary>Review prompts</summary><ul id="tsGaps"></ul></details>
      <button class="btn-amber" id="tsSave" type="button">Save in this browser</button><p id="tsStatus" role="status" aria-live="polite"></p><button class="btn-ghost" id="tsLoad" type="button">Load saved worksheet</button>
      <div class="ts-exports"><button class="btn-ghost" id="stDownload" type="button">Download as Markdown</button><button class="btn-ghost" id="tsExport" type="button">Export backup (JSON)</button><label class="tool-field">Import worksheet backup<input id="tsImport" type="file" accept=".json,application/json"></label></div>
      <details><summary>Research and references</summary><p class="tool-note">Prompts follow OWASP’s system, threat, response and validation approach. Example controls draw on its authorization and file upload guidance.</p><ul>${SOURCES.map(([name,url])=>`<li><a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a></li>`).join('')}</ul></details>
    </aside></div>`;
  root.closest('.tool-page')?.classList.add('ts-page');
  const $ = selector => root.querySelector(selector);
  const status = message => { $('#tsStatus').textContent = message; };
  const fields = [...root.querySelectorAll('[data-category]')];
  function read() {
    draft.system=$('#stSystem').value; draft.scope=$('#tsScope').value; draft.flows=$('#tsFlows').value;
    for(const field of fields) draft.categories[field.dataset.category][field.dataset.field] = field.value;
  }
  function review() {
    let complete = 0;
    const gaps=[];
    if(!draft.system.trim()) gaps.push('Name the system or feature.');
    if(!draft.scope.trim()) gaps.push('Describe the assets, users and scope.');
    if(!draft.flows.trim()) gaps.push('Describe the flows and trust boundaries.');
    for(const c of categories) {
      const r=draft.categories[c.id];
      const ready = r.status === 'na' ? !!r.threat.trim() : !!(r.threat.trim() && r.response.trim() && r.verification.trim());
      if(ready) complete++; else gaps.push(`${c.t}: ${r.status==='na'?'explain why it does not apply':'add the missing threat, response or verification'}.`);
      if(r.status==='open') gaps.push(`${c.t}: decide how to handle this threat.`);
      root.querySelector(`[data-summary="${c.id}"]`).textContent = {open:'Open',planned:'Planned',tested:'Tested',na:'N/A'}[r.status];
    }
    $('#tsCoverage').textContent=`${complete} of ${categories.length} categories documented`;
    $('#tsMeter').style.width=(complete/categories.length*100)+'%';
    $('#tsGaps').innerHTML=gaps.length?gaps.map(g=>`<li>${esc(g)}</li>`).join(''):'<li>Bring the model and verification evidence to your reviewers. Revisit it when the design changes.</li>';
  }
  function fill() {
    $('#stSystem').value=draft.system;$('#tsScope').value=draft.scope;$('#tsFlows').value=draft.flows;
    for(const field of fields) field.value=draft.categories[field.dataset.category][field.dataset.field];
    review();
  }
  for(const field of [$('#stSystem'),$('#tsScope'),$('#tsFlows'),...fields]) field.addEventListener('input',()=>{read();dirty=true;review();status('Unsaved changes — save or export before leaving.');});
  const canReplace=()=>!dirty || window.confirm('Replace your unsaved worksheet? Export it first if you want to keep a copy.');
  $('#tsSave').addEventListener('click',()=>{
    read();
    const raw=JSON.stringify(draft), expectedBaseline=baseline;
    const save=()=>{
      try {
        if(localStorage.getItem(KEY)!==expectedBaseline) {status('The saved worksheet changed in another tab. Export your draft, then load the saved worksheet before saving.');return;}
        localStorage.setItem(KEY,raw);baseline=raw;
        dirty=JSON.stringify(draft)!==raw;
        status(dirty ? 'Earlier draft saved. Unsaved changes remain — save or export before leaving.' : 'Saved in this browser. Export a backup to keep a separate copy.');
      }catch(_){status('Could not save in this browser. Export a backup to keep your work.');}
    };
    if(navigator.locks?.request) navigator.locks.request(KEY,save).catch(()=>status('Could not save in this browser. Export a backup to keep your work.'));
    else save();
  });
  $('#tsLoad').addEventListener('click',()=>{
    if(!canReplace())return;
    try {
      const raw=localStorage.getItem(KEY);
      if(!raw){status('No saved worksheet found. Your current draft is still here.');return;}
      const next=validate(JSON.parse(raw));draft=next;baseline=raw;dirty=false;fill();status('Saved worksheet loaded.');
    }catch(_){status('Could not load the saved worksheet. Your current draft is still here.');}
  });
  $('#tsBlank').addEventListener('click',()=>{if(!canReplace())return;draft=blank();dirty=true;fill();status('New worksheet — save to replace the saved version.');$('#stSystem').focus();});
  $('#tsUseExample').addEventListener('click',()=>{
    const key=$('#tsExample').value;
    if(!key){status('Choose an example first.');return;}
    if(!canReplace())return;
    draft=blank();
    if(key==='api') {
      draft.system='Example: customer invoice API';draft.scope='Customers view invoices belonging to their own organization. Protect invoice details and organization membership. Billing provider internals are outside this review.';draft.flows='Customer browser → authenticated API → invoice database. The API must bind each lookup to the caller’s permitted organization; an invoice ID is not proof of access.';
      Object.assign(draft.categories.infodisclosure,{threat:'A customer changes an invoice ID and reads another organization’s invoice.',response:'Enforce organization and object authorization on every request; deny access unless the caller is permitted to read the invoice.',verification:'Plan: verify an allowed same-organization read and a denied cross-organization read, including guessed valid IDs. Record results here after testing.',status:'planned',priority:'high'});
      Object.assign(draft.categories.elevation,{threat:'An ordinary customer invokes a billing administrator action.',response:'Check the requested action and caller permissions on the server.',verification:'Plan: test the same action as an administrator, a normal customer and an unauthenticated caller. Record results.',status:'planned',priority:'high'});
    } else {
      draft.system='Example: document upload portal';draft.scope='Signed-in customers upload PDFs and retrieve their own documents. Protect document privacy, processing workers and storage capacity.';draft.flows='Customer browser → upload API → isolated processing worker → private storage. Uploaded bytes and filenames are untrusted; download access crosses another authorization boundary.';
      Object.assign(draft.categories.tampering,{threat:'A supplied filename targets another document or a file outside the upload area.',response:'Generate storage names on the server and keep files outside the web root; do not use the supplied name as a path.',verification:'Plan: test duplicate and traversal-style names and verify that no existing file changes. Record actual results.',status:'planned',priority:'high'});
      Object.assign(draft.categories.dos,{threat:'Oversized or costly-to-process uploads exhaust worker or storage resources.',response:'Apply upload size and request limits plus processing time and memory limits.',verification:'Plan: test an allowed file and a file just above the limit; check rejection and worker resource bounds. Record results.',status:'planned',priority:'high'});
    }
    dirty=true;fill();status('Example loaded as an unsaved draft. Complete the remaining categories and adapt the controls.');
  });
  function download(content,type,extension) {
    const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download='stride-'+(draft.system.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,40)||'worksheet')+extension;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  $('#tsExport').addEventListener('click',()=>{read();download(JSON.stringify(draft,null,2),'application/json','.json');});
  $('#stDownload').addEventListener('click',()=>{
    read();let md=`# STRIDE threat model: ${draft.system.trim()||'Untitled system'}\n\nWorksheet coverage is not a security assessment. Example content must be adapted and verified.\n\n## Scope and assets\n\n${draft.scope||'_(not filled in)_'}\n\n## Data flows and trust boundaries\n\n${draft.flows||'_(not filled in)_'}\n\n`;
    for(const c of categories){const r=draft.categories[c.id];md+=`## ${c.t}\n\nPriority: ${r.priority}\nReview status: ${r.status}\n\n### Threat / applicability\n\n${r.threat||'_(not filled in)_'}\n\n### Response / control\n\n${r.response||'_(not filled in)_'}\n\n### Verification plan and results\n\n${r.verification||'_(not filled in)_'}\n\n`;}
    md+='## References\n\n'+SOURCES.map(([name,url])=>`- [${name}](${url})`).join('\n')+'\n';download(md,'text/markdown','.md');
  });
  $('#tsImport').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try{
      if(file.size>512000)throw new Error('Backup is too large (maximum 500 KB).');
      const next=validate(JSON.parse(await file.text()));
      if(!root.isConnected || !canReplace())return;
      draft=next;dirty=true;fill();status('Backup imported as an unsaved draft. Save to replace the browser copy.');
    }catch(error){status('Import failed. '+(error instanceof SyntaxError?'The file is not valid JSON.':error.message)+' Your draft is unchanged.');}
    finally{event.target.value='';}
  });
  fill();status(initialMessage);
}
