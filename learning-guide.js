/* A small orientation guide connecting existing lessons, experiments and cases. */
window.KashLearningGuide = (()=>{
  const EXPERIENCES=[
    {id:'new',title:'I’m starting from scratch',desc:'Begin with everyday ideas and a small experiment.'},
    {id:'some',title:'I know some basics',desc:'Connect a concept to a lesson and practical work.'},
    {id:'practice',title:'I want to practise',desc:'Begin with a challenge, then revisit the reasoning.'}
  ];
  const FOCUSES=[
    {id:'basics',title:'Build foundations',desc:'Understand computers, networks, and how data is represented.',icon:'compass'},
    {id:'web',title:'Understand web & API security',desc:'Explore requests, identity, and access to another customer’s data.',icon:'swap'},
    {id:'defense',title:'Investigate suspicious activity',desc:'Follow evidence and explain the limits of your findings.',icon:'shield'}
  ];
  const experiment=(id,title,why)=>({kind:'experiment',id,title,why,href:`#/playground/${id}`});
  const lesson=(path,id,why)=>({kind:'lesson',path,id,why,href:`#/lesson/${path}/${id}`});
  const investigation=(id,title,why)=>({kind:'case',id,title,why,href:`#/investigations/${id}`});
  const network=()=>experiment('network','Follow a web request','See the difference between finding an address and asking a server for a page.');
  const encoding=()=>experiment('encoding','Turn text into bytes','Change a message and reverse its Base64 representation.');
  const access=()=>experiment('access','Who can open this invoice?','Switch customers and observe what an ownership check changes.');
  const mailbox=()=>investigation('mailbox-takeover','The invoice that opened a mailbox','Use three evidence files to explain an unrecognised sign-in and a mailbox rule.');
  const api=()=>investigation('cross-tenant-api','A valid token, the wrong customer','Apply the ownership idea to an API investigation with evidence and hints.');
  const cloud=()=>investigation('exposed-cloud-key','The key that outlived the commit','Separate confirmed actions from attempted actions in cloud audit evidence.');
  const ROUTES={
    basics:{
      new:{path:'00-fresher-basics',reason:'Start with a familiar picture of a computer, then explore how a page loads and how text is represented.',steps:[lesson('00-fresher-basics','what-is-a-computer','Put hardware, software, and the operating system into everyday words.'),network(),lesson('00-fresher-basics','how-internet-works','Connect the experiment to a plain-language account of the internet.'),encoding()]},
      some:{path:'02-networking',reason:'Build on the basics by connecting names, addresses, and data representation.',steps:[network(),lesson('02-networking','dns','Read how a readable name becomes a network address.'),encoding(),lesson('06-crypto-fundamentals','what-is-cryptography','Distinguish representation from encryption and hashing.')]},
      practice:{path:'02-networking',reason:'Use the experiments to check your intuition, then examine the protocol details.',steps:[network(),lesson('02-networking','http-https','Explore the web request and the secure channel in more depth.'),encoding(),lesson('06-crypto-fundamentals','what-is-cryptography','Explain which transformations do and do not protect a secret.')]}
    },
    web:{
      new:{path:'11-web-security',reason:'Get comfortable with a request before exploring who should be allowed to read the response.',steps:[network(),lesson('01-introduction','what-is-cybersecurity','Start with what security protects and why access matters.'),access(),lesson('11-web-security','idor','Put a name to the ownership mistake you just explored.')]},
      some:{path:'21-api-security',reason:'Move from an access-control experiment to the same mistake in a realistic evidence set.',steps:[access(),lesson('21-api-security','bola-and-bfla','Connect object ownership and allowed actions to API authorisation.'),api()]},
      practice:{path:'21-api-security',reason:'Start with the API evidence, then revisit the underlying access boundary.',steps:[api(),lesson('21-api-security','bola-and-bfla','Use the lesson to explain the access failure and the durable fix.'),access()]}
    },
    defense:{
      new:{path:'10-fundamentals',reason:'Begin with familiar email safety before following a short incident investigation.',steps:[lesson('00-fresher-basics','email-basics-and-safety','Learn why messages and links deserve a careful look.'),network(),lesson('10-fundamentals','phishing','Recognise the human side of a suspicious message.'),mailbox()]},
      some:{path:'10-fundamentals',reason:'Connect a response framework to a case, then investigate a different kind of credential.',steps:[lesson('10-fundamentals','incident-response-basics','Build a vocabulary for organising a response.'),mailbox(),cloud()]},
      practice:{path:'16-advanced',reason:'Use two evidence sets to practise scoping an incident without overclaiming what happened.',steps:[cloud(),lesson('16-advanced','iam-deep-dive','Review the permissions behind a cloud identity.'),mailbox()]}
    }
  };
  const kindLabel=kind=>({lesson:'Lesson',experiment:'Experiment',case:'Investigation'})[kind];
  function stepInfo(step){
    if(step.kind==='lesson'){
      const ctx=findSubContext(step.path,step.id);
      return {...step,title:ctx.sub.title,done:isComplete(step.path,step.id),status:'Read and marked complete'};
    }
    if(step.kind==='experiment')return {...step,done:!!STATE.playgroundCompleted[step.id],status:'Experiment completed'};
    return {...step,done:(STATE.investigations[step.id]?.attempts || 0)>0,status:'Case reviewed'};
  }
  function render(){
    app.innerHTML=`<section class="sec sg-page"><div class="sec-head"><div class="sec-eyebrow">Start here</div><h1>Find a clear next step.</h1><p class="sec-lead">Tell us where you are and what interests you. Get a short route that brings experiments, lessons, and investigations together.</p></div>
      <div class="sg-layout"><section class="sg-choices" aria-labelledby="sgChoicesHeading"><h2 id="sgChoicesHeading">Choose your starting point</h2><p class="pg-hint">Your choices shape the suggested order. You can open any step and change direction whenever you like.</p><form id="sgForm">
        <fieldset><legend><span>1</span> What feels closest to you?</legend>${EXPERIENCES.map(item=>`<label class="sg-option"><input type="radio" name="experience" value="${item.id}" required><span><strong>${item.title}</strong><span>${item.desc}</span></span></label>`).join('')}</fieldset>
        <fieldset><legend><span>2</span> What would you like to explore?</legend>${FOCUSES.map(item=>`<label class="sg-option"><input type="radio" name="focus" value="${item.id}" required><span><strong>${item.title}</strong><span>${item.desc}</span></span></label>`).join('')}</fieldset>
        <div class="sg-form-actions"><button type="submit" class="btn-amber" id="sgSave">Save my route</button><button type="button" class="btn-ghost" id="sgJump">See my route ↓</button></div><p id="sgStatus" class="pg-hint" role="status"></p></form><p class="pg-hint">Saved choices are included in progress backups and optional account sync.</p></section>
        <section class="sg-result" aria-labelledby="sgRouteHeading" id="sgResult"></section></div>
      <p class="sg-footer"><a class="pg-link" href="#/course">Browse every course path →</a><a class="pg-link" href="#/career-quiz">Explore career interests →</a></p><p class="pg-hint">This guide works offline after your first visit. Open or save the linked activities in advance to use those offline too.</p></section>`;
    const form=document.getElementById('sgForm');
    const status=document.getElementById('sgStatus');
    const result=document.getElementById('sgResult');
    let dirty=false;
    function readSaved(){
      form.elements.experience.value=STATE.learningGuide.experience;
      form.elements.focus.value=STATE.learningGuide.focus;
    }
    function choices(){return {experience:form.elements.experience.value,focus:form.elements.focus.value};}
    function paint(){
      const {experience,focus}=choices();
      const route=ROUTES[focus][experience];
      const steps=route.steps.map(stepInfo);
      const done=steps.filter(step=>step.done).length;
      const next=steps.find(step=>!step.done);
      const focusInfo=FOCUSES.find(item=>item.id===focus);
      const experienceInfo=EXPERIENCES.find(item=>item.id===experience);
      const focusHref=result.contains(document.activeElement)?document.activeElement.getAttribute('href'):null;
      result.innerHTML=`<div class="sg-result-head"><div class="sec-eyebrow">Your starting route · ${steps.length} steps</div><h2 id="sgRouteHeading" tabindex="-1">${focusInfo.title}</h2><p class="sg-context">${experienceInfo.title}</p><p>${route.reason}</p><div class="sg-progress-label"><strong id="sgProgressCount">${done} of ${steps.length} explored</strong><span>Follow your own pace</span></div><progress class="study-progress" max="${steps.length}" value="${done}" aria-label="Starting route progress"></progress></div>
        <div class="sg-next" id="sgNext">${next?`<span class="sec-eyebrow">Next unfinished step</span><h3>${escapeHtml(next.title)}</h3><a class="btn-amber" href="${next.href}" id="sgContinue">Continue with this ${kindLabel(next.kind).toLowerCase()} →</a>`:`<h3>You’ve explored every step in this route.</h3><p>Revisit anything below, choose another interest, or continue through the course.</p><a class="btn-amber" href="#/lesson/${route.path}">Continue through the course →</a>`}</div>
        <ol class="sg-steps">${steps.map((step,i)=>`<li class="${step.done?'is-done':''}" data-step="${step.kind}/${step.id}"><span class="sg-step-number" aria-hidden="true">${step.done?'✓':i+1}</span><div><span class="sg-step-kind">${kindLabel(step.kind)}${step.done?' · '+step.status:''}</span><h3>${escapeHtml(step.title)}</h3><p>${step.why}</p><a href="${step.href}" aria-label="${step.done?'Revisit':'Open'} ${escapeHtml(step.title)}">${step.done?'Revisit this step':'Open this step'} →</a></div></li>`).join('')}</ol>
        <aside class="sg-planner"><h3>Keep going with a daily goal</h3><p>Suggested course path: <strong>${escapeHtml(findPath(route.path).title)}</strong>. You can use this focus in the study planner and keep your existing daily goal.</p><button type="button" class="btn-ghost" id="sgUsePlanner">Use this course path in my planner</button><p id="sgPlannerStatus" class="pg-hint" role="status"></p><a class="pg-link" href="#/planner">Open study planner →</a></aside>`;
      if(focusHref)[...result.querySelectorAll('a')].find(link=>link.getAttribute('href')===focusHref)?.focus({preventScroll:true});
    }
    readSaved();paint();
    status.textContent=STATE.learningGuide.updatedAt?'Your saved route is ready.':'Preview your choices, then save this route to return to it.';
    form.addEventListener('change',()=>{dirty=true;paint();status.textContent='Preview updated. Save this route to keep these choices.';});
    document.getElementById('sgJump').addEventListener('click',()=>{
      result.scrollIntoView({block:'start',behavior:'instant'});document.getElementById('sgRouteHeading').focus({preventScroll:true});
    });
    form.addEventListener('submit',event=>{
      event.preventDefault();if(!form.reportValidity())return;
      STATE.learningGuide={...choices(),updatedAt:Date.now()};dirty=false;
      status.textContent=saveState()?'Your starting route is saved.':'This route is ready for this session. Choices could not be saved locally.';
    });
    result.addEventListener('click',event=>{
      if(!event.target.closest('#sgUsePlanner'))return;
      const {experience,focus}=choices();
      const pathId=ROUTES[focus][experience].path;
      STATE.studyPlan={...STATE.studyPlan,pathId,updatedAt:Date.now()};
      document.getElementById('sgPlannerStatus').textContent=saveState()?`Planner focus saved. Your daily goal remains ${STATE.studyPlan.dailyGoal} lesson${STATE.studyPlan.dailyGoal===1?'':'s'}.`:'The planner focus changed for this session, but could not be saved locally.';
    });
    currentStartGuideRefresh=()=>{
      if(!dirty){readSaved();status.textContent=STATE.learningGuide.updatedAt?'Your saved route is up to date.':'Preview your choices, then save this route to return to it.';}
      paint();
    };
  }
  return {EXPERIENCES,FOCUSES,ROUTES,stepInfo,render};
})();
