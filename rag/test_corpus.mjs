// Real-corpus structural checks, plus pinned baseline retrieval probes (not POV completeness).
import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import assert from "node:assert/strict";
import {linesOf,reviewQueue} from "./navigation_core.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),".."),dir=resolve(root,"rag/navigation");
const git=(...a)=>execFileSync("git",a,{cwd:root,encoding:"utf8",maxBuffer:32*1024*1024});
const manifest=JSON.parse(readFileSync(resolve(dir,"manifest.json"),"utf8"));
const pages=manifest.sources.map(e=>JSON.parse(readFileSync(resolve(dir,e.pointer),"utf8")));
const maps=pages.filter(p=>p.records);
assert.equal(maps.length,4);
assert.equal(manifest.selection_ready,false);
const all=new Map(),mentions=[];
let queues=0;
for(const p of maps){
 const text=git("show",manifest.source_commit+":"+p.path),lines=linesOf(text),holder=manifest.sources.find(e=>e.id===p.id).holder;
 const definitions=lines.flatMap((l,i)=>{const m=l.match(/^\s*[-*] \*\*([KP]-[A-Z]+-\d{3}-\d{2,})/);return m?[{id:m[1],start:i+1}]:[]});
 assert.equal(definitions.length,p.records.length);
 for(const r of p.records){
  assert.ok(!all.has(r.id));assert.ok(definitions.some(x=>x.id===r.id&&x.start===r.start));assert.ok(r.end<=lines.length&&r.start<=r.end);assert.equal(r.holder,holder);assert.equal(r.review_required,true);all.set(r.id,{page:p,record:r});
 }
 mentions.push(...text.matchAll(/\b[KP]-[A-Z]+-\d{3}-\d{2,}\b/g));
 for(let c=1;c<=8;c++)for(const point of ["start","inside","end"]){
  const q=reviewQueue(p,holder,c,point);
  const expected=p.records.filter(r=>r.status==="accepted-record"&&r.chapter_hint<=(point==="start"?c-1:c)).map(r=>r.id);
  assert.deepEqual(q.records.map(r=>r.id),expected);
  assert.ok(q.records.every(r=>r.review_required&&!Object.hasOwn(r,"topic")&&!Object.hasOwn(r,"text")&&r.path===p.path));assert.equal(q.selection_ready,false);queues++;
 }
}
assert.ok(mentions.every(m=>all.has(m[0])),"unresolved knowledge reference");
console.log("CORPUS STRUCTURE: "+all.size+" unique definitions; "+mentions.length+" mentions; "+queues+" candidate queues; no body or planned/foreign IDs in queues");
const baseline=["d4c64d50e3462086b7a85c060f27d1a4c4ec1b8e","10adb6dbeab2b60df8e4fb9bf983c127ce3085cd","10542e47eb1cbd1f6440c483d3bae14bc02e8cd5","03ded5069d3df52d0bb25194e4ccc8854d661d20"];
if(!baseline.every(b=>maps.some(p=>p.blob_sha===b))){
 console.log("Baseline probes skipped: map blobs changed; update test expectations only after accepted canon changes.");process.exit(0);
}
assert.equal(all.size,175);
const tests=[
 ["полномочия шахматы",["K-LIZ-003-03","K-REA-003-04"]],
 ["ориентир Монклеров",["K-PAS-000-10","K-RAI-000-10"]],
 ["повторный рывок ладони",["K-LIZ-006-11"]],
 ["пятно на сиденье",["K-LIZ-008-08","K-REA-008-07"]]
];
function search(q){
 const raw=execFileSync(process.execPath,[resolve(root,"rag/search_navigation.mjs"),"author",q],{cwd:root,encoding:"utf8",maxBuffer:4*1024*1024});
 return JSON.parse(raw.slice(raw.indexOf("{"))).results;
}
const controls=["K-LIZ-003-03","K-LIZ-004-01","K-LIZ-005-02","K-LIZ-006-11","K-LIZ-008-01","K-LIZ-008-03","K-LIZ-008-06","K-LIZ-008-08","K-LIZ-008-14","K-PAS-000-10","K-PAS-006-03","K-PAS-007-02","K-PAS-008-02","K-PAS-008-04","K-RAI-000-10","K-RAI-007-01","K-RAI-008-04","K-RAI-008-05","K-REA-003-04","K-REA-008-02","K-REA-008-07"];
// Exact search route for representative records, then all control IDs resolved by direct pointer.
for(const id of controls){assert.ok(all.has(id));const {page,record}=all.get(id);assert.equal(record.review_required,true);assert.ok(page.path.endsWith(".md"))}
for(const id of ["K-LIZ-008-06","K-PAS-000-10","K-RAI-008-04","K-REA-008-02","P-LIZ-009-05"]){
 const hits=search(id),x=all.get(id);assert.equal(hits.length,1);assert.equal(hits[0].id,id);assert.equal(hits[0].path,x.page.path);assert.equal(hits[0].start,x.record.start);assert.equal(hits[0].status_hint,x.record.status);
}
console.log("BASELINE: 21 control IDs resolve; 5 exact search probes passed.");
let found=0,total=0;
for(let i=0;i<tests.length;i++){
 const [q,ids]=tests[i],results=search(q);const ranks=ids.map(id=>{const x=all.get(id);const pos=results.findIndex(r=>r.path===x.page.path&&r.start<=x.record.end&&r.end>=x.record.start);return pos<0?null:pos+1});
 found+=ranks.filter(x=>x!==null).length;total+=ids.length;
 console.log("LEXICAL PROBE "+(i+1)+": "+JSON.stringify({ids,ranks}));
}
console.log("LEXICAL PILOT TARGET COVERAGE@20: "+found+"/"+total+" (not a complete relevance gold set; no proof of POV completeness)");
