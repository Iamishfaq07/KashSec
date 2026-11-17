#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
const paths=new Function(read('app.js').match(/const PATHS = \[[\s\S]*?\n\];/)[0]+';return PATHS;')();
const totalLessons=paths.reduce((n,p)=>n+p.subs.length,0);
const definition=source=>source.match(/function parseSearchIndex\(source, expectedName\)\{[\s\S]*?\n\}/)[0];
assert.equal(definition(read('app.js')),definition(read('sw.js')),'browser and worker must share the same parser');
const parse=new Function(definition(read('app.js'))+';return parseSearchIndex;')();
for(const [file,name] of [['search-preview.js','SEARCH_PREVIEW'],['search-index.js','SEARCH_CONTENT']]){
  const rows=parse(read(file),name);assert.equal(rows.length,totalLessons);assert.ok(rows.every(row=>row.b.length<=(name==='SEARCH_PREVIEW'?400:2500)));
}
const row={p:'18-ai-security',s:'mcp-tool-authorization',n:'18.24',pt:'AI',t:'MCP',b:'invoice <img src=x> & a semicolon; in text'};
const wrap=rows=>'const SEARCH_CONTENT = '+JSON.stringify(rows)+';';
assert.deepEqual(parse(wrap([row]),'SEARCH_CONTENT'),[row]);
for(const payload of [wrap([row])+'window.__executed=true;', 'const SEARCH_CONTENT=[]; throw Error("executed");', '<html>error</html>', 'const SEARCH_PREVIEW=[];',wrap([{...row,b:42}]),wrap([{...row,p:'../private'}]),wrap([{...row,extra:'unexpected'}]),wrap([null]),wrap([{...row,b:'x'.repeat(3001)}])])assert.throws(()=>parse(payload,'SEARCH_CONTENT'));
assert.throws(()=>parse(wrap([row]),'SEARCH_CONTENT.*'));
console.log(`PASS: both ${totalLessons}-lesson indexes and the shared parser; invalid wrappers, executable tails, unsafe IDs and malformed rows are rejected as data.`);
