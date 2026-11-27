// Author-navigation, fail closed. Never exports a POV fact package.
import {execFileSync} from "node:child_process";
import {readFileSync,writeFileSync,mkdirSync,readdirSync,unlinkSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {makePage,makeManifest} from "./navigation_core.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const git=(...args)=>execFileSync("git",args,{cwd:root,encoding:"utf8",maxBuffer:32*1024*1024});
const mode=process.argv[2];
if(!["--write","--check"].includes(mode)||process.argv.length!==3)throw Error("Usage: node rag/build_navigation.mjs --write|--check");
const head=git("rev-parse","HEAD").trim();
const branch=git("branch","--show-current").trim();
if(branch!=="main"&&process.env.GITHUB_REF!=="refs/heads/main")throw Error("Use main");
const registry=JSON.parse(git("show",head+":rag/source_registry.json"));
function readTree(commit){
 return git("ls-tree","-r","-z","-l",commit).split("\0").filter(Boolean).map(r=>{
  const tab=r.indexOf("\t"),[mode,type,sha,size]=r.slice(0,tab).trim().split(/\s+/);
  return {path:r.slice(tab+1),mode,type,sha,size:Number(size)};
 }).filter(x=>x.type==="blob");
}
const tree=readTree(head),map=new Map(tree.map(x=>[x.path,x]));
const manifest=makeManifest(registry,tree,head);
const pages=Object.fromEntries(registry.sources.map(e=>[e.id+".json",makePage(e,map.get(e.path),git("show",head+":"+e.path))]));
const dir=resolve(root,"rag/navigation"),json=x=>JSON.stringify(x,null,2)+"\n";
if(mode==="--check"){
 const existing=JSON.parse(readFileSync(resolve(dir,"manifest.json"),"utf8"));
 if(!/^[0-9a-f]{40}$/.test(existing.source_commit))throw Error("invalid source commit");
 git("merge-base","--is-ancestor",existing.source_commit,head);
 const old=new Map(readTree(existing.source_commit).map(x=>[x.path,x.sha]));
 for(const x of manifest.sources)if(old.get(x.path)!==x.blob_sha)throw Error("stale source: "+x.path);
 manifest.source_commit=existing.source_commit;
}
const expected={"manifest.json":manifest,...pages};
if(mode==="--check"){
 const actual=readdirSync(dir).filter(x=>x.endsWith(".json")).sort();
 if(JSON.stringify(actual)!==JSON.stringify(Object.keys(expected).sort()))throw Error("missing or obsolete pointers");
 for(const [name,data] of Object.entries(expected))if(readFileSync(resolve(dir,name),"utf8")!==json(data))throw Error("stale navigation: "+name);
 console.log("OK: source blobs and pointers match; NOT a POV coverage test");
}else{
 mkdirSync(dir,{recursive:true});
 for(const name of readdirSync(dir))if(name.endsWith(".json")&&!Object.hasOwn(expected,name))unlinkSync(resolve(dir,name));
 for(const [name,data] of Object.entries(expected))writeFileSync(resolve(dir,name),json(data),"utf8");
 console.log("Generated "+manifest.sources.length+" pointers");
}
