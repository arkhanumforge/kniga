// Local author-only lexical search and review queues. Never substitutes for source reading.
import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {linesOf,lexicalScore,reviewQueue} from "./navigation_core.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),".."),dir=resolve(root,"rag/navigation");
execFileSync(process.execPath,[resolve(root,"rag/build_navigation.mjs"),"--check"],{cwd:root,stdio:"inherit"});
const manifest=JSON.parse(readFileSync(resolve(dir,"manifest.json"),"utf8"));
const [mode,...args]=process.argv.slice(2),page=e=>JSON.parse(readFileSync(resolve(dir,e.pointer),"utf8"));
if(mode==="review"){
 const [holder,chapter,point]=args,e=manifest.sources.find(e=>e.id==="knowledge-"+holder);if(!e)throw Error("unknown holder");
 console.log(JSON.stringify({...reviewQueue(page(e),holder,Number(chapter),point),source_commit:manifest.source_commit},null,2));
}else if(mode==="author"){
 const q=args.join(" ").trim();if(!q)throw Error("empty query");
 const exact=q.toUpperCase().match(/^[KP]-[A-Z]+-\d{3}-\d{2,}$/);
 if(exact){
  const results=manifest.sources.filter(e=>e.kind==="knowledge").flatMap(e=>page(e).records.filter(r=>r.id===exact[0]).map(r=>({scope:"author-candidate",id:r.id,kind:"knowledge",status_hint:r.status,path:e.path,blob_sha:e.blob_sha,start:r.start,end:r.end,commit:manifest.source_commit,review_required:true})));
  console.log(JSON.stringify({scope:"author-only",mandatory_knowledge:manifest.mandatory_knowledge,warning:"Exact source ID; not proof of knowledge at a scene.",results},null,2));
  process.exit(0);
 }
 const aliases=[["лиз","элизабет","лиззи"],["райнор","райнер"],["паскаль","паск"],["пленник","кривой"]];
 const queries=[q];for(const group of aliases)if(group.some(x=>q.toLowerCase().includes(x)))queries.push(group.join(" "));
 const results=[];
 for(const e of manifest.sources){
  const p=page(e),source=execFileSync("git",["show",manifest.source_commit+":"+e.path],{cwd:root,encoding:"utf8",maxBuffer:32*1024*1024}),lines=linesOf(source);
  const starts=[1,...p.sections.map(h=>h.start)].filter((n,i,a)=>i===0||n!==a[i-1]);
  for(let i=0;i<starts.length;i++){
   const end=(starts[i+1]||lines.length+1)-1;
   for(let start=starts[i];start<=end;start+=30){
    const stop=Math.min(end,start+29),body=lines.slice(start-1,stop).join("\n"),heading=p.sections.filter(h=>h.start<=start&&h.end>=start).at(-1);
    const score=Math.max(...queries.map(x=>lexicalScore(x,body)+(heading?lexicalScore(x,heading.title)*0.5:0)));
    if(score>0)results.push({scope:"author-candidate",kind:e.kind,status_hint:e.scope,path:e.path,blob_sha:e.blob_sha,start,end:stop,section_start:heading?.start??start,section_end:heading?.end??stop,score,commit:manifest.source_commit});
   }
  }
 }
 results.sort((a,b)=>b.score-a.score||a.path.localeCompare(b.path)||a.start-b.start);
 console.log(JSON.stringify({scope:"author-only",mandatory_knowledge:manifest.mandatory_knowledge,warning:"Candidates only; open whole relevant sections and exceptions. No match does not mean no fact.",results:results.slice(0,20)},null,2));
}else throw Error("Usage: node rag/search_navigation.mjs author QUERY | review HOLDER CHAPTER start|inside|end");
