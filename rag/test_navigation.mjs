// Integration tests using an isolated synthetic Git repository (no network, no book edits).
import {execFileSync} from "node:child_process";
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,copyFileSync,rmSync,existsSync} from "node:fs";
import {tmpdir} from "node:os";
import {join,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import assert from "node:assert/strict";
import {normalize,lexicalScore} from "./navigation_core.mjs";
const source=dirname(fileURLToPath(import.meta.url)),root=mkdtempSync(join(tmpdir(),"kniga-rag-test-"));
const git=(...args)=>execFileSync("git",args,{cwd:root,encoding:"utf8",stdio:["ignore","pipe","pipe"]});
const run=(script,...args)=>execFileSync(process.execPath,[join(root,"rag",script),...args],{cwd:root,encoding:"utf8",stdio:["ignore","pipe","pipe"]});
const write=(path,content)=>writeFileSync(join(root,path),content,"utf8");
const commit=message=>{git("add","-A");git("commit","-m",message)};
const fail=fn=>assert.throws(fn);
try{
 git("init","-b","docs-revision");git("config","user.name","RAG test");git("config","user.email","test@example.invalid");
 mkdirSync(join(root,"rag"));
 for(const file of ["navigation_core.mjs","build_navigation.mjs","search_navigation.mjs"])copyFileSync(join(source,file),join(root,"rag",file));
 const holders=[["liz","LIZ"],["pascal","PAS"],["rainor","RAI"],["reader","REA"]];
 const sources=holders.map(([holder,prefix])=>({id:"knowledge-"+holder,path:holder+".md",kind:"knowledge",scope:"mixed-author",holder}));
 for(const [holder,prefix] of holders)write(holder+".md",
  "# Test\n\n## Глава 1\n\nholder="+holder+"; version=mainline; status=accepted\n\n- **K-"+prefix+"-001-01 · test** — learned_at: конец; epistemic: Ф; confidence: test; transfer: none; links: —.\n  Test record.\n\n## Глава 2\n\nholder="+holder+"; version=mainline; status=accepted\n\n- **K-"+prefix+"-002-01 · future** — learned_at: конец; epistemic: Ф; confidence: test; transfer: none; links: —.\n\n## Author\n\nscope=author; holder=author; status=accepted\nsecret author text\n\n## Plan\n\nholder="+holder+"; version=mainline; status=planned\n\n- **P-"+prefix+"-009-01** — plan\n");
 sources.push({id:"extra",path:"extra.md",kind:"world",scope:"author"});
 write("extra.md","# Test\nПленник.\n");
 write("audit.md","# excluded\n");
 const registry={schema_version:1,generator_version:"navigation-2",scope:"author-navigation-only",mandatory_knowledge:holders.map(([h])=>"knowledge-"+h),sources,excluded:[{path:"audit.md",reason:"audit"}]};
 const reg=()=>write("rag/source_registry.json",JSON.stringify(registry,null,2)+"\n");reg();commit("fixture");
 run("build_navigation.mjs","--write");run("build_navigation.mjs","--check");
 const first=JSON.parse(readFileSync(join(root,"rag/navigation/manifest.json"),"utf8"));
 assert.equal(first.sources.length,5);assert.equal(first.selection_ready,false);
 const page=JSON.parse(readFileSync(join(root,"rag/navigation/knowledge-liz.json"),"utf8"));
 assert.equal(page.records.length,3);
 const rev=run("search_navigation.mjs","review","liz","2","start");assert.ok(rev.includes("K-LIZ-001-01"));assert.ok(!rev.includes("K-LIZ-002-01")&&!rev.includes("P-LIZ")&&!rev.includes("secret author text")&&!rev.includes("topic"));
 const search=run("search_navigation.mjs","author","пленника");assert.ok(search.includes("extra.md")&&!search.includes("audit.md"));
 assert.equal(normalize("Ра́йнор Ёлка"),"райнор елка");assert.ok(lexicalScore("пленника","пленник")>0);
 git("add","rag/navigation");git("commit","-m","derived");run("build_navigation.mjs","--check");
 write("audit.md","# excluded changed\n");commit("audit only");run("build_navigation.mjs","--check");
 write("extra.md","# Test\nChanged.\n");commit("source change");fail(()=>run("build_navigation.mjs","--check"));run("build_navigation.mjs","--write");run("build_navigation.mjs","--check");
 rmSync(join(root,"extra.md"));commit("unregistered deletion");fail(()=>run("build_navigation.mjs","--write"));
 registry.sources=registry.sources.filter(x=>x.id!=="extra");reg();commit("registered deletion");run("build_navigation.mjs","--write");run("build_navigation.mjs","--check");assert.ok(!existsSync(join(root,"rag/navigation/extra.json")));
 write("new.md","# unknown\n");commit("unknown source");fail(()=>run("build_navigation.mjs","--write"));
 console.log("PASS: fixture generation, read, search, holder/plan exclusion, freshness after derived/excluded commits, edit, registered deletion, unknown source");
}finally{rmSync(root,{recursive:true,force:true})}
