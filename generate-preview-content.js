#!/usr/bin/env node
// Keep the separately hosted preview's course content aligned with the source.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const app = fs.readFileSync(path.join(root,'app.js'),'utf8');
const extract = (name,kind='array',source=app)=>{
  const pattern = kind==='array'?`const ${name} = \\[[\\s\\S]*?\\n\\];`:`const ${name} = \\{[\\s\\S]*?\\n\\};`;
  const match = source.match(new RegExp(pattern));
  if(!match) throw new Error(`Cannot extract ${name}`);
  return new Function(match[0]+`; return ${name};`)();
};
const paths = extract('PATHS');
const guides = extract('PATH_GUIDES');
const certifications = extract('CERTS');
const prerequisites = extract('PATH_PREREQS','object');
const quizzes = extract('QUIZZES','object',fs.readFileSync(path.join(root,'quizzes.js'),'utf8'));
const final = extract('FINAL_QUIZ','object',fs.readFileSync(path.join(root,'quizzes.js'),'utf8'));
function write(relative,content){
  const file = path.join(root,'preview',relative);
  fs.mkdirSync(path.dirname(file),{recursive:true});
  if(!fs.existsSync(file) || fs.readFileSync(file,'utf8')!==content) fs.writeFileSync(file,content);
}
write('src/data/catalog.json',JSON.stringify({paths:paths.map(({subs,...p})=>({...p,lessons:subs}))}));
write('src/data/quizzes.json',JSON.stringify({quizzes,final}));
write('src/data/path-guides.json',JSON.stringify({guides,certifications,prerequisites}));
for(const p of paths) for(const lesson of p.subs){
  const relative = `course/${p.id}/${lesson.id}.md`;
  write('public/'+relative,fs.readFileSync(path.join(root,relative),'utf8'));
}
write('public/downloads/appsec_invoice_lab.py',fs.readFileSync(path.join(root,'downloads/appsec_invoice_lab.py'),'utf8'));
console.log(`Preview content aligned: ${paths.length} paths, ${paths.reduce((n,p)=>n+p.subs.length,0)} lessons, ${guides.length} guides.`);
