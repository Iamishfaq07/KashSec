#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const read = file=>fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
const app = read('app.js');
const extract = name=>new Function(app.match(new RegExp(`const ${name} = \\[[\\s\\S]*?\\n\\];`))[0]+`;return ${name};`)();
const paths = extract('PATHS'), guides = extract('PATH_GUIDES'), certs = extract('CERTS');
assert.equal(guides.length,paths.length);
assert.equal(new Set(guides.map(g=>g.id)).size,paths.length);
for(const p of paths){
  const guide = guides.find(g=>g.id===p.id);
  assert.ok(guide?.goal && guide.artifact,`${p.id}: meaningful goal and evidence`);
  let start = 0;
  assert.equal(guide.stages.length,4,`${p.id}: four readable stages`);
  for(const stage of guide.stages){
    const end = p.subs.findIndex(s=>s.id===stage.through);
    assert.ok(end>=start,`${p.id}: ${stage.title} must follow the previous stage`);
    assert.ok(stage.title && stage.outcome);
    start = end+1;
  }
  assert.equal(start,p.subs.length,`${p.id}: roadmap covers every lesson exactly once`);
  assert.ok(guide.certs.length>0 && guide.certs.length<=3);
  assert.equal(new Set(guide.certs.map(c=>c.id)).size,guide.certs.length);
  for(const rec of guide.certs){
    const cert = certs.find(c=>c.id===rec.id);
    assert.ok(cert?.readiness && cert.format && cert.reviewed && rec.reason,`${p.id}/${rec.id}: decision guidance`);
    assert.equal(new URL(cert.url).protocol,'https:');
    assert.ok(!new URL(cert.url).search,`${rec.id}: direct provider URL without referral parameters`);
  }
  const html = read(`lesson/${p.id}/index.html`);
  assert.ok(html.includes('aria-label="Learning stages"'),`${p.id}: roadmap works without JavaScript`);
  for(const stage of guide.stages)assert.ok(html.includes(stage.title.replaceAll('&','&amp;')));
  for(const rec of guide.certs)assert.ok(html.includes(certs.find(c=>c.id===rec.id).url.replaceAll('&','&amp;')));
  for(const item of guide.practice){
    assert.ok(item.href.startsWith('/'));
    assert.ok(fs.existsSync(new URL('..'+item.href,import.meta.url)),`${p.id}: practice link ${item.href} resolves`);
  }
  for(const asset of guide.downloads || []){
    assert.match(asset.url,/^\/downloads\/[a-z0-9_.-]+$/);
    assert.match(asset.name,/^[a-z0-9_.-]+$/);
    assert.ok(!asset.name.includes('..'));
    const text=read(asset.url.slice(1));
    assert.ok(text.startsWith(asset.startsWith) && text.includes(asset.marker),`${p.id}: practice file passes its content contract`);
    assert.equal(text,read('preview/public'+asset.url));
  }
}
const catalog = JSON.parse(read('preview/src/data/catalog.json'));
assert.deepEqual(catalog.paths,paths.map(({subs,...p})=>({...p,lessons:subs})));
const previewGuides = JSON.parse(read('preview/src/data/path-guides.json'));
assert.deepEqual(previewGuides.guides,guides);
assert.deepEqual(previewGuides.certifications,certs);
const quizzes = new Function(read('quizzes.js').match(/const QUIZZES = \{[\s\S]*?\n\};/)[0]+';return QUIZZES;')();
assert.deepEqual(JSON.parse(read('preview/src/data/quizzes.json')).quizzes,quizzes);
const final = new Function(read('quizzes.js').match(/const FINAL_QUIZ = \{[\s\S]*?\n\};/)[0]+';return FINAL_QUIZ;')();
assert.deepEqual(JSON.parse(read('preview/src/data/quizzes.json')).final,final);
for(const p of paths)for(const lesson of p.subs){
  const file=`course/${p.id}/${lesson.id}.md`;
  assert.equal(read(file),read('preview/public/'+file),`${file}: frontends use the same lesson`);
}
assert.equal(read('downloads/appsec_invoice_lab.py'),read('preview/public/downloads/appsec_invoice_lab.py'));

// Prove the exercise is reproducible: the original demonstrates the specific
// gaps, while the reference preserves legitimate access and passes every case.
const result = execFileSync('python3',['-c',`
import importlib.util,io,json,unittest
spec=importlib.util.spec_from_file_location('invoice_lab','downloads/appsec_invoice_lab.py')
lab=importlib.util.module_from_spec(spec);spec.loader.exec_module(lab)
runner=unittest.TextTestRunner(stream=io.StringIO())
starter=runner.run(unittest.defaultTestLoader.loadTestsFromTestCase(lab.InvoiceSecurityTests))
assert starter.testsRun==7 and not starter.errors
failed={test.id().split(' (')[0].split('.')[-1] for test,_ in starter.failures}
assert failed=={'test_other_owner_cannot_read_invoice','test_sql_text_is_rejected','test_invalid_invoice_identifiers_are_rejected','test_invalid_actors_are_rejected'},failed
lab.lookup=lab.reference_get_invoice
reference=runner.run(unittest.defaultTestLoader.loadTestsFromTestCase(lab.InvoiceSecurityTests))
assert reference.testsRun==7 and reference.wasSuccessful()
print(json.dumps({'starter_failed_methods':len(failed),'reference_passed':reference.testsRun}))
`],{cwd:new URL('..',import.meta.url),encoding:'utf8'});
console.log(`Path data: ${paths.length} complete roadmaps, aligned frontends, working practice links and credential guidance. Lab: ${result.trim()}`);
