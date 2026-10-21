/* Small, self-paced learning experiments. All activity stays in the browser. */
window.KashPlayground = (()=>{
  const EXERCISES = [
    {id:'network',number:'01',icon:'radio',title:'Follow a web request',minutes:5,
      desc:'Walk a page request through a name lookup, a connection, and a secure channel. Change one thing and see where it stops.',
      goal:'Finish a successful trip, then explore a trip that gets blocked.',
      next:'#/lesson/02-networking',nextLabel:'Explore networking',
      source:'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Session'},
    {id:'encoding',number:'02',icon:'swap',title:'Turn text into bytes',minutes:5,
      desc:'Type a message, inspect its bytes, and reverse a Base64 representation. Try a different alphabet or an emoji too.',
      goal:'Encode a message and decode it back to the same text.',
      next:'#/lesson/06-crypto-fundamentals',nextLabel:'Explore cryptography fundamentals',
      source:'https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa'},
    {id:'access',number:'03',icon:'lockKey',title:'Who can open this invoice?',minutes:7,
      desc:'Switch customers and turn an ownership check on or off. Discover why signing in is only part of the story.',
      goal:'See the missing check, block the wrong customer, and let the right customer in.',
      next:'#/investigations/cross-tenant-api',nextLabel:'Try the API investigation',
      source:'https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/'}
  ];
  const isComplete=id=>!!STATE.playgroundCompleted[id];
  function paintCompletion(){
    const count=EXERCISES.filter(item=>isComplete(item.id)).length;
    const total=document.getElementById('pgTotal');
    if(total)total.textContent=`${count} of ${EXERCISES.length} experiments completed`;
    app.querySelectorAll('[data-pg-card]').forEach(card=>{
      const done=isComplete(card.dataset.pgCard);
      card.querySelector('.pg-card-state').textContent=done?'Completed · practise again':'Start whenever you’re ready';
    });
    const badge=document.getElementById('pgComplete');
    if(badge)badge.hidden=!isComplete(badge.dataset.exercise);
  }
  function finish(id){
    if(isComplete(id))return;
    STATE.playgroundCompleted[id]=Date.now();
    document.getElementById('pgSaveStatus').textContent=saveState()?'Progress saved in this browser.':'Exercise completed in this session. Progress could not be saved locally.';
    paintCompletion();
  }
  function goalsHtml(labels){
    return `<ul class="pg-goals" aria-label="Experiment goals">${labels.map((label,i)=>`<li data-goal="${i}"><span aria-hidden="true">○</span>${escapeHtml(label)}<span class="sr-only pg-goal-status"> — not yet explored</span></li>`).join('')}</ul>`;
  }
  function setGoal(index,done){
    const row=app.querySelector(`[data-goal="${index}"]`);
    row.classList.toggle('is-done',done);row.querySelector('span').textContent=done?'✓':'○';
    row.querySelector('.pg-goal-status').textContent=done?' — complete':' — not yet explored';
  }
  function renderIndex(){
    app.innerHTML=`<section class="sec pg-hub"><div class="sec-head"><div class="sec-eyebrow">Learning Playground</div><h1>Try it. Change it. Understand it.</h1><p class="sec-lead">Start with one small experiment. See what changes, get an explanation, and go at your own pace. No prior experience needed.</p></div>
      <div class="pg-welcome"><div><h2>A gentle place to begin</h2><p>There is no timer and no penalty for trying again. Use a keyboard, touch, or mouse. You can reset each experiment whenever you like.</p></div><p id="pgTotal" class="pg-total"></p></div>
      <div class="pg-grid">${EXERCISES.map(item=>`<article class="pg-card" data-pg-card="${item.id}"><span class="sec-eyebrow">Experiment ${item.number} · ${item.minutes} minutes</span><span class="pg-card-icon" aria-hidden="true">${cardIco(item.icon)}</span><h2>${item.title}</h2><p>${item.desc}</p><span class="pg-card-state"></span><a class="btn-ghost" href="#/playground/${item.id}">Try this experiment →</a></article>`).join('')}</div>
      <p class="pg-hint">Completion is saved in this browser, included in progress backups, and available through optional account sync. Your typed messages and experiment settings are not saved.</p>
      <a class="pg-link" href="#/course">Prefer reading? Browse the course →</a></section>`;
    app.querySelector('.pg-hub').insertAdjacentHTML('beforeend','<p><a class="pg-link" href="#/start">Find a suggested starting route →</a></p>');
    currentPlaygroundRefresh=paintCompletion;paintCompletion();
  }
  function renderExercise(id,lesson=null){
    const item=EXERCISES.find(item=>item.id===id);
    if(!item){renderNotFound();return;}
    app.innerHTML=`<section class="sec pg-exercise"><a class="pg-link" href="#/playground">← All experiments</a><div class="sec-head"><div class="sec-eyebrow">Experiment ${item.number} · ${item.minutes} minutes</div><h1>${item.title}</h1><p class="sec-lead">${item.desc}</p></div>
      ${lesson?practiceReturnHTML(lesson):''}
      <div class="pg-assignment"><strong>Your goal</strong><p>${item.goal}</p><p class="pg-complete" id="pgComplete" data-exercise="${id}" hidden>✓ You’ve completed this experiment. Keep exploring or try the next one.</p></div>
      <div id="pgExperiment"></div><p id="pgSaveStatus" class="pg-hint" role="status"></p>
      <div class="pg-next"><div><h2>${lesson?'Return and explain it':'Keep the idea moving'}</h2><p>${lesson?'Go back to your reading and describe what the experiment showed.':'Use what you just tried in the next lesson or challenge.'}</p></div><a class="btn-amber" href="${lesson?lesson.href:item.next}">${lesson?'Back to my lesson':item.nextLabel} →</a></div>
      ${STATE.learningGuide.updatedAt?'<p><a class="pg-link" href="#/start">Back to my starting route →</a></p>':''}
      <details class="pg-reference"><summary>Read the reference behind this experiment</summary><a class="pg-link" href="${item.source}" target="_blank" rel="noopener noreferrer">${id==='access'?'OWASP: object-level authorisation':'MDN: how this works'} ↗</a></details></section>`;
    if(id==='network')renderNetwork();
    if(id==='encoding')renderEncoding();
    if(id==='access')renderAccess();
    currentPlaygroundRefresh=paintCompletion;paintCompletion();
  }
  function renderNetwork(){
    const stages=[
      ['Start with a name','You want to open https://learn.kashsec.test. A readable name is easier to remember than a numeric address.','Browser ready'],
      ['Find the address','A name lookup asks DNS for an address. In this fictional trip, the answer is 203.0.113.10.','DNS returns an address'],
      ['Open a connection','The browser opens a connection to that address. This example uses TCP, a way to carry an ordered stream of bytes.','Connection ready'],
      ['Check the secure channel','TLS sets up an encrypted channel and checks the server certificate before the page request is sent.','Secure channel ready'],
      ['Ask for the page','The browser sends an HTTP request for the page through that secure channel.','GET / sent'],
      ['Receive the page','The server returns a response. In this trip it is 200 OK with the page content.','200 OK · page received']
    ];
    const seen=new Set();let step=0;
    document.getElementById('pgExperiment').innerHTML=`<div class="pg-lab"><label for="pgJourney">Choose a trip</label><select id="pgJourney"><option value="success">The page loads</option><option value="dns">The name cannot be found</option><option value="certificate">The certificate check fails</option></select>
      <div class="pg-network-map" aria-label="The browser asks DNS for an address and connects separately to the web server"><div data-pg-node="browser">${cardIco('window')}<strong>Your browser</strong><span>Two different conversations</span></div><div data-pg-node="dns"><span class="pg-map-connection">↕ Name lookup</span>${cardIco('radio')}<strong>DNS</strong><span>Finds an address</span></div><div data-pg-node="server"><span class="pg-map-connection">↕ Page connection</span>${cardIco('cloud')}<strong>Web server</strong><span>Sends a response</span></div></div>
      <ol class="pg-stages" aria-label="Request steps">${stages.map((stage,i)=>`<li data-stage="${i}"><span>${i+1}</span>${stage[0]}</li>`).join('')}</ol>
      <section class="pg-feedback" id="pgJourneyFeedback" aria-live="polite" aria-atomic="true"></section>
      <div class="pg-actions"><button class="btn-ghost" type="button" id="pgBack">Previous step</button><button class="btn-amber" type="button" id="pgNext">Next step →</button><button class="btn-ghost" type="button" id="pgChangeTrip" hidden>Try a blocked trip</button><button class="btn-ghost" type="button" id="pgRestart">Restart trip</button></div>
      ${goalsHtml(['Follow a successful page request','Explore a blocked request'])}
      <details class="pg-reference"><summary>What is simplified here?</summary><p>This is a fresh HTTPS connection using HTTP/1.1, with no cached address or reused connection. Real browsers can use other protocols and caching. The addresses and failures are fictional; this demo makes no network requests.</p><a href="https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work" target="_blank" rel="noopener noreferrer">MDN: how browsers work ↗</a></details></div>`;
    const trip=document.getElementById('pgJourney');
    function paint(){
      const blocked=(trip.value==='dns'&&step===1)||(trip.value==='certificate'&&step===3);
      const ended=blocked||step===stages.length-1;
      const message=blocked?trip.value==='dns'?['The name could not be found','DNS did not return an address. This trip stops before a connection to the web server is opened.','No page request sent']:['The certificate check failed','The browser cannot establish the required server trust, so this trip stops before sending the page request. Do not bypass the warning in this example.','No page request sent']:stages[step];
      document.getElementById('pgJourneyFeedback').innerHTML=`<span class="sec-eyebrow">Step ${step+1} of ${stages.length}${blocked?' · stopped':''}</span><h2>${message[0]}</h2><p>${message[1]}</p><code>${message[2]}</code>`;
      app.querySelectorAll('[data-stage]').forEach((row,i)=>{row.classList.toggle('is-visited',i<step);if(i===step)row.setAttribute('aria-current','step');else row.removeAttribute('aria-current');});
      app.querySelectorAll('[data-pg-node]').forEach(node=>node.classList.toggle('is-active',node.dataset.pgNode===(step===0?'browser':step===1?'dns':'server')));
      document.getElementById('pgBack').disabled=step===0;
      document.getElementById('pgNext').disabled=ended;
      document.getElementById('pgChangeTrip').hidden=!ended;
      document.getElementById('pgChangeTrip').textContent=blocked?'Try a successful trip':'Try a blocked trip';
      if(ended)seen.add(blocked?'blocked':'success');
      setGoal(0,seen.has('success'));setGoal(1,seen.has('blocked'));
      if(seen.size===2)finish('network');
    }
    trip.addEventListener('change',()=>{step=0;paint();});
    document.getElementById('pgBack').addEventListener('click',()=>{step--;paint();});
    document.getElementById('pgNext').addEventListener('click',()=>{step++;paint();});
    document.getElementById('pgRestart').addEventListener('click',()=>{step=0;paint();});
    document.getElementById('pgChangeTrip').addEventListener('click',()=>{
      trip.value=trip.value==='success'?'dns':'success';step=0;paint();document.getElementById('pgNext').focus();
    });
    paint();
  }
  function renderEncoding(){
    document.getElementById('pgExperiment').innerHTML=`<div class="pg-lab"><label for="pgMessage">Type a short message</label><textarea id="pgMessage" maxlength="80" rows="2" spellcheck="false">Hello 👋</textarea><p class="pg-hint">Keep it short. Try your name, another language, or an emoji.</p>
      <div class="pg-byte-head"><h2>Your message as UTF-8 bytes</h2><span id="pgByteCount"></span></div><div id="pgBytes" class="pg-bytes" aria-label="UTF-8 bytes in hexadecimal"></div><p class="pg-hint">Each box is one byte, shown in hexadecimal (base 16). A byte has eight bits; a character can need more than one byte.</p>
      <button class="btn-amber" type="button" id="pgEncode">Encode message ↓</button>
      <label for="pgBase64">Base64 representation — you can edit this too</label><textarea id="pgBase64" rows="2" maxlength="512" spellcheck="false" placeholder="Your encoded message appears here"></textarea><div class="pg-actions"><button class="btn-ghost" type="button" id="pgDecode">Decode back to text ↓</button><button class="btn-ghost" type="button" id="pgResetEncoding">Start again</button></div>
      <div class="pg-feedback" id="pgEncodingFeedback" role="status" aria-live="polite"><h2>Encoding changes the representation</h2><p>Base64 does not ask for a secret key. Try the round trip and see why it is not a way to keep a message secret.</p></div>${goalsHtml(['Encode a message','Decode the same message successfully'])}</div>`;
    const message=document.getElementById('pgMessage');
    const encoded=document.getElementById('pgBase64');
    let original=null;
    function paintBytes(){
      const bytes=new TextEncoder().encode(message.value);
      document.getElementById('pgBytes').innerHTML=[...bytes].map(byte=>`<code>${byte.toString(16).padStart(2,'0').toUpperCase()}</code>`).join('');
      document.getElementById('pgByteCount').textContent=`${bytes.length} byte${bytes.length===1?'':'s'}`;
    }
    const feedback=(title,text)=>{
      const box=document.getElementById('pgEncodingFeedback');box.innerHTML='<h2></h2><p></p>';
      box.querySelector('h2').textContent=title;box.querySelector('p').textContent=text;
    };
    message.addEventListener('input',()=>{original=null;setGoal(0,false);setGoal(1,false);paintBytes();feedback('The message changed','Encode this version to begin a new round trip.');});
    encoded.addEventListener('input',()=>setGoal(1,false));
    document.getElementById('pgEncode').addEventListener('click',()=>{
      if(!message.value){feedback('Add a message first','Type a short word or phrase, then try encoding it.');return;}
      original=message.value;
      encoded.value=btoa(String.fromCharCode(...new TextEncoder().encode(original)));
      setGoal(0,true);setGoal(1,false);feedback('A different representation, the same bytes','Now decode it. No secret password or encryption key is needed.');
    });
    document.getElementById('pgDecode').addEventListener('click',()=>{
      try{
        if(!encoded.value.trim())throw new Error('Empty');
        const bytes=Uint8Array.from(atob(encoded.value.replace(/\s/g,'')),char=>char.charCodeAt(0));
        const text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
        const match=original!==null&&text===original&&text===message.value;
        feedback(match?'Back to your original message':'Decoded text',text);
        setGoal(1,match);if(match)finish('encoding');
      }catch(error){setGoal(1,false);feedback('That did not decode as UTF-8 text','Use valid Base64 that represents UTF-8 text, or encode your message again. Base64 can also represent non-text bytes.');}
    });
    document.getElementById('pgResetEncoding').addEventListener('click',()=>{
      message.value='Hello 👋';encoded.value='';original=null;setGoal(0,false);setGoal(1,false);paintBytes();
      feedback('Ready for another message','Change the text and encode it to explore another round trip.');
    });
    paintBytes();
  }
  function renderAccess(){
    const seen=new Set();
    document.getElementById('pgExperiment').innerHTML=`<div class="pg-lab"><p class="pg-hint">A fictional invoice app. Everything below runs locally with made-up customers and invoices.</p><div class="pg-access-controls"><label for="pgCustomer">Your customer<select id="pgCustomer" aria-label="Your customer"><option value="acme">Acme</option><option value="birch">Birch</option></select></label><label for="pgOwner">This invoice belongs to<select id="pgOwner" aria-label="Invoice owner"><option value="birch">Birch</option><option value="acme">Acme</option></select></label></div>
      <label class="pg-check"><input type="checkbox" id="pgSignedIn" checked><span>I am signed in (authentication)</span></label><label class="pg-check"><input type="checkbox" id="pgOwnership"><span>Make the server check invoice ownership (authorisation)</span></label>
      <div id="pgAccessMode" class="pg-mode"></div><button class="btn-amber" type="button" id="pgRequest">Try to open the invoice →</button><button class="btn-ghost" type="button" id="pgResetAccess">Reset experiment</button><div id="pgAccessFeedback" class="pg-feedback" role="status" aria-live="polite"><h2>Try the missing check first</h2><p>Leave the customers different and the ownership check off. What does this app return?</p></div>
      ${goalsHtml(['Observe the missing ownership check','Block the wrong customer','Allow the right customer'])}<details class="pg-reference"><summary>Explain the two words</summary><p><strong>Authentication</strong> checks who is signed in. <strong>Authorisation</strong> checks what that person is allowed to do. A valid login does not give access to every customer’s invoice.</p></details></div>`;
    const customer=document.getElementById('pgCustomer'),owner=document.getElementById('pgOwner');
    const signedIn=document.getElementById('pgSignedIn'),ownership=document.getElementById('pgOwnership');
    const paintMode=()=>{document.getElementById('pgAccessMode').textContent=ownership.checked?'Ownership check on: the server checks this customer’s access.':'Ownership check off: this deliberately broken app trusts a login alone.';};
    [customer,owner,signedIn,ownership].forEach(input=>input.addEventListener('change',()=>{
      paintMode();document.getElementById('pgAccessFeedback').innerHTML='<h2>Settings changed</h2><p>Try opening the invoice to see the result with these settings.</p>';
    }));
    document.getElementById('pgRequest').addEventListener('click',()=>{
      const same=customer.value===owner.value;
      let title,text,code;
      if(!signedIn.checked){title='Sign in first';text='The app cannot identify a signed-in customer. It returns no invoice data.';code='401 · authentication required';}
      else if(ownership.checked&&!same){title='The wrong customer is blocked';text='Your login is valid, but this invoice belongs to another customer. The server returns no invoice data.';code='403 · access denied';seen.add('blocked');}
      else if(!ownership.checked&&!same){title='A valid login opened the wrong invoice';text='That is the bug. The app returned another customer’s invoice because it never checked ownership. Turn the server check on and try the same request.';code='200 · fictional invoice disclosed';seen.add('missing');}
      else{title='The right customer can open the invoice';text=ownership.checked?'The login identifies the customer and the server confirms ownership. This request is allowed.':'This happens to be your customer’s invoice, but the app still lacks an ownership check. Enable it and test both customers.';code='200 · own invoice returned';if(ownership.checked)seen.add('allowed');}
      const box=document.getElementById('pgAccessFeedback');box.innerHTML=`<span class="sec-eyebrow">${code}</span><h2>${title}</h2><p>${text}</p>`;
      setGoal(0,seen.has('missing'));setGoal(1,seen.has('blocked'));setGoal(2,seen.has('allowed'));
      if(seen.size===3)finish('access');
    });
    document.getElementById('pgResetAccess').addEventListener('click',()=>{
      customer.value='acme';owner.value='birch';signedIn.checked=true;ownership.checked=false;seen.clear();[0,1,2].forEach(i=>setGoal(i,false));paintMode();
      document.getElementById('pgAccessFeedback').innerHTML='<h2>Ready to explore again</h2><p>The customers are different and the ownership check is off. Try a request.</p>';
    });
    paintMode();
  }
  return {EXERCISES,renderIndex,renderExercise};
})();
