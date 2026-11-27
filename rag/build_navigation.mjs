// Pilot navigation: whole-file registry, section pointers for four knowledge maps.
// Node.js standard library only; uses committed HEAD, not uncommitted edits.
import {execFileSync} from "node:child_process";
import {readFileSync,writeFileSync,mkdirSync,readdirSync,unlinkSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
function bytes(s){let n=0;for(const c of s){const x=c.codePointAt(0);n+=x<128?1:x<2048?2:x<65536?3:4}return n}
function sections(s){
 const lines=s.split(/\r\n|\n|\r/);if(lines.at(-1)==="")lines.pop();
 const headings=[];let fence=null;
 for(let i=0;i<lines.length;i++){
  const fm=lines[i].match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
  if(fence){if(fm&&fm[1][0]===fence.char&&fm[1].length>=fence.len&&/^\s*$/.test(fm[2]))fence=null;continue}
  if(fm){fence={char:fm[1][0],len:fm[1].length};continue}
  const m=lines[i].match(/^ {0,3}(#{1,6})[ \t]+(.+?)\s*$/);if(m)headings.push({level:m[1].length,title:m[2].replace(/[ \t]+#+[ \t]*$/,""),start:i+1});
 }
 const stack=[];for(const h of headings){while(stack.length&&stack.at(-1).level>=h.level)stack.pop().end=h.start-1;h.parents=stack.map(x=>x.title);stack.push(h)}
 for(const h of stack)h.end=lines.length;
 return {lines:lines.length,preamble:headings.length?(headings[0].start>1?[1,headings[0].start-1]:null):(lines.length?[1,lines.length]:null),sections:headings};
}
function buildNavigation(registry,tree,contents,commit){
 if(registry.schema_version!==1||registry.scope!=="author-navigation-only"||!/^[0-9a-f]{40}$/.test(commit))throw Error("unsupported registry or commit");
 const known=[...registry.sources.map(x=>x.path),...registry.excluded.map(x=>x.path)];
 if(new Set(known).size!==known.length)throw Error("duplicate path");
 const map=new Map(tree.map(x=>[x.path,x]));
 for(const x of tree.filter(x=>/^[^/]+\.md$|^\.cursor\/(?:rules|skills)\/.*\.(?:md|mdc)$/.test(x.path)))if(!known.includes(x.path))throw Error("unclassified source: "+x.path);
 for(const p of known)if(!map.has(p))throw Error("missing registered source: "+p);
 const ids=new Set(),pages={},sources=[];
 for(const e of registry.sources){
  if(!/^[a-z0-9-]+$/.test(e.id)||ids.has(e.id))throw Error("invalid or duplicate id: "+e.id);ids.add(e.id);
  const b=map.get(e.path);if(!/^[0-9a-f]{40}$/.test(b.sha)||!Number.isInteger(b.size))throw Error("invalid blob metadata");
  const row={...e,blob_sha:b.sha,bytes:b.size,pointer:null};
  if(registry.mandatory_knowledge.includes(e.id)){
   const s=contents[e.path];if(typeof s!=="string"||bytes(s)!==b.size)throw Error("incomplete input: "+e.path);
   const index=sections(s);for(const h of index.sections)if(h.start<1||h.end<h.start||h.end>index.lines)throw Error("bad range");
   row.pointer=e.id+".json";row.lines=index.lines;row.sections=index.sections.length;
   pages[row.pointer]={schema_version:1,scope:"author-navigation-only",id:e.id,path:e.path,blob_sha:b.sha,...index};
  }
  sources.push(row);
 }
 const holders=registry.mandatory_knowledge.map(id=>sources.find(x=>x.id===id)?.holder);
 if(holders.join(",")!=="liz,pascal,rainor,reader")throw Error("four independent knowledge sources required");
 return {manifest:{schema_version:1,generator_version:registry.generator_version,scope:"author-navigation-only",source_branch:"docs-revision",source_commit:commit,selection_ready:false,mandatory_knowledge:registry.mandatory_knowledge,sources,excluded:registry.excluded},pages};
}
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const git=(...args)=>execFileSync("git",args,{cwd:root,encoding:"utf8",maxBuffer:32*1024*1024});
const mode=process.argv[2];
if(!["--write","--check"].includes(mode)||process.argv.length!==3)throw Error("Usage: node rag/build_navigation.mjs --write|--check");
const head=git("rev-parse","HEAD").trim();
const branch=git("branch","--show-current").trim();
if(branch!=="docs-revision"&&process.env.GITHUB_REF!=="refs/heads/docs-revision")throw Error("Use docs-revision");
const registry=JSON.parse(git("show",head+":rag/source_registry.json"));
function readTree(commit){
 return git("ls-tree","-r","-z","-l",commit).split("\0").filter(Boolean).map(r=>{
  const tab=r.indexOf("\t"),[mode,type,sha,size]=r.slice(0,tab).trim().split(/\s+/);
  return {path:r.slice(tab+1),mode,type,sha,size:Number(size)};
 }).filter(x=>x.type==="blob");
}
const tree=readTree(head);
const contents=Object.fromEntries(registry.sources.filter(x=>registry.mandatory_knowledge.includes(x.id)).map(x=>[x.path,git("show",head+":"+x.path)]));
const dir=resolve(root,"rag/navigation");
const built=buildNavigation(registry,tree,contents,head);
const json=x=>JSON.stringify(x,null,2)+"\n";
if(mode==="--check"){
 const existing=JSON.parse(readFileSync(resolve(dir,"manifest.json"),"utf8"));
 if(!/^[0-9a-f]{40}$/.test(existing.source_commit))throw Error("invalid source commit");
 git("merge-base","--is-ancestor",existing.source_commit,head);
 const old=new Map(readTree(existing.source_commit).map(x=>[x.path,x.sha]));
 for(const x of built.manifest.sources)if(old.get(x.path)!==x.blob_sha)throw Error("stale source: "+x.path);
 built.manifest.source_commit=existing.source_commit;
 const expected={"manifest.json":built.manifest,...built.pages};
 const actual=readdirSync(dir).filter(x=>x.endsWith(".json")).sort();
 if(JSON.stringify(actual)!==JSON.stringify(Object.keys(expected).sort()))throw Error("missing or obsolete pointers");
 for(const [name,data] of Object.entries(expected))if(readFileSync(resolve(dir,name),"utf8")!==json(data))throw Error("stale navigation: "+name);
 console.log("OK: committed source blobs and pilot pointers match; NOT a POV coverage test");
}else{
 mkdirSync(dir,{recursive:true});
 const expected={"manifest.json":built.manifest,...built.pages};
 for(const name of readdirSync(dir))if(name.endsWith(".json")&&!Object.hasOwn(expected,name))unlinkSync(resolve(dir,name));
 for(const [name,data] of Object.entries(expected))writeFileSync(resolve(dir,name),json(data),"utf8");
 console.log("Generated "+built.manifest.sources.length+" source entries and "+Object.keys(built.pages).length+" pilot pointers");
}
