import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright';

const preview=process.env.CHECK_FRONTEND==='preview';
const BASE=process.env.BASE||(preview?'http://127.0.0.1:8080':'http://127.0.0.1:8000');
const route=preview?'/lesson/03-linux/terminal-basics':'/lesson/03-linux/terminal-basics.html';
const key=preview?'kashsec-desk-v1':'kashsec_state_v1';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
async function setup(){
  const c=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce'});
  c.setDefaultTimeout(12000);
  await c.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  await c.addInitScript(()=>{try{if(!localStorage.getItem('kashsec_state_v1'))localStorage.setItem('kashsec_state_v1',JSON.stringify({tourSeen:true}));}catch{}});
  const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  return {c,p,errors};
}
async function open(p){
  await p.goto(BASE+route);
  if(preview){
    await p.waitForFunction(()=>!document.querySelector('button[aria-label="Search the academy"]')?.disabled);
    await p.locator('.prose-lesson').waitFor();
  }else{
    await p.locator('#content[aria-busy="false"]').waitFor();
    await p.locator('.notes-panel summary').click();
  }
}
const note=p=>preview?p.locator('textarea'):p.locator('#lessonNotes');
const download=p=>p.getByRole('button',{name:'Download lesson notes',exact:true});
async function fileText(p){
  const pending=p.waitForEvent('download');await download(p).click();const d=await pending;
  assert.match(d.suggestedFilename(),/^kashsec-03-linux--terminal-basics-notes\.txt$/);
  return fs.readFile(await d.path(),'utf8');
}
try{
  {
    const {c,p,errors}=await setup();await open(p);
    assert.ok(await download(p).isDisabled());
    const text='My notes: naïve café 🔐\n<svg onload=alert(1)>\nKeep the final line.  ';
    await note(p).fill(text);
    const exported=await fileText(p);
    assert.ok(exported.startsWith('Lesson: '));
    assert.ok(exported.includes('https://kashsec.vercel.app/lesson/03-linux/terminal-basics.html'));
    assert.ok(exported.endsWith('\n\n'+text),'download preserves the latest text, Unicode and trailing whitespace');
    const saved=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
    assert.equal(preview?saved.state.notes['03-linux/terminal-basics']:saved.notes['03-linux/terminal-basics'],text);
    assert.ok(!(preview?saved.state.done:saved.completed)['03-linux/terminal-basics'],'export does not mark the lesson finished');
    await p.reload();if(!preview)await p.locator('.notes-panel summary').click();
    await p.waitForFunction(({preview,text})=>document.querySelector(preview?'textarea':'#lessonNotes')?.value===text,{preview,text});
    assert.ok((await fileText(p)).endsWith(text));
    assert.deepEqual(errors,[]);await c.close();
    console.log('PASS: exact current notes download, UTF-8/literal text, existing persistence, reload and unchanged completion.');
  }
  {
    const {c,p,errors}=await setup();await open(p);
    const text='Keep this draft when storage is full. 🔐';
    await p.evaluate(key=>{
      const set=Storage.prototype.setItem;
      window.__restoreNoteStorage=()=>{Storage.prototype.setItem=set;};
      Storage.prototype.setItem=function(k,v){if(k===key)throw new DOMException('Full','QuotaExceededError');return set.call(this,k,v);};
    },key);
    await note(p).fill(text);
    await p.getByText('Could not save in this browser.',{exact:false}).waitFor();
    assert.equal(await note(p).inputValue(),text);
    assert.ok((await fileText(p)).endsWith(text));
    assert.ok(await p.getByRole('button',{name:'Retry saving notes',exact:true}).isVisible());
    for(const width of [320,768,1440]){
      await p.setViewportSize({width,height:900});
      const box=await download(p).boundingBox();assert.ok(box&&box.height>=44&&box.x>=0&&box.x+box.width<=width+1);
      assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    }
    await p.evaluate(()=>window.__restoreNoteStorage());
    await p.getByRole('button',{name:'Retry saving notes',exact:true}).click();
    await p.getByRole('button',{name:'Retry saving notes',exact:true}).waitFor({state:'hidden'});
    const saved=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
    assert.equal(preview?saved.state.notes['03-linux/terminal-basics']:saved.notes['03-linux/terminal-basics'],text);
    await p.reload();if(!preview)await p.locator('.notes-panel summary').click();
    await p.waitForFunction(({preview,text})=>document.querySelector(preview?'textarea':'#lessonNotes')?.value===text,{preview,text});
    assert.deepEqual(errors,[]);await c.close();
    console.log('PASS: quota failure is visible, draft remains downloadable, retry saves after recovery, controls fit 320–1440px.');
  }
  if(preview){
    const {c,p,errors}=await setup();
    await c.addInitScript(()=>{
      const get=Storage.prototype.getItem,set=Storage.prototype.setItem;
      Storage.prototype.getItem=function(k){if(k==='kashsec-desk-v1')throw new DOMException('Blocked','SecurityError');return get.call(this,k);};
      Storage.prototype.setItem=function(k,v){if(k==='kashsec-desk-v1')throw new DOMException('Blocked','SecurityError');return set.call(this,k,v);};
    });
    await open(p);await p.getByText('Browser storage is unavailable.',{exact:false}).waitFor();
    await note(p).fill('x'.repeat(4100));
    assert.equal((await note(p).inputValue()).length,4000);
    assert.ok((await p.locator('#lessonNoteHelp').innerText()).includes('4,000 / 4,000'));
    assert.ok((await fileText(p)).endsWith('x'.repeat(4000)));
    await p.getByRole('button',{name:'Mark finished',exact:true}).click();
    assert.ok(await p.getByRole('button',{name:'Finished',exact:true}).isVisible());
    await p.getByRole('button',{name:'Retry saving notes',exact:true}).click();
    assert.ok(await p.getByRole('button',{name:'Retry saving notes',exact:true}).isVisible());
    assert.deepEqual(errors,[]);await c.close();
    console.log('PASS: denied storage does not break editing or progress; the existing 4,000-character limit is visible and enforced.');
  }
}finally{await browser.close();}
