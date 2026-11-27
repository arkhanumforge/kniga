function bytes(s){let n=0;for(const c of s){const x=c.codePointAt(0);n+=x<128?1:x<2048?2:x<65536?3:4}return n}

function linesOf(s){const a=s.split(/\r\n|\n|\r/);if(a.at(-1)==="")a.pop();return a}

function sections(s){
 const lines=linesOf(s),headings=[];let fence=null;
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

function knowledgeRecords(e,s,index){
 const lines=linesOf(s),records=[],prefix={liz:"LIZ",pascal:"PAS",rainor:"RAI",reader:"REA"}[e.holder];
 for(let i=0;i<lines.length;i++){
  const m=lines[i].match(/^\s*[-*] \*\*([KP]-([A-Z]+)-(\d{3})-\d{2,})(?: · (.*?))?\*\* — (.*)$/);
  if(!m){if(/^\s*[-*] \*\*[KP]-/.test(lines[i]))throw Error("unrecognized definition "+e.path+":"+(i+1));continue}
  if(m[2]!==prefix)throw Error("wrong holder "+m[1]);
  const section=index.sections.filter(h=>h.start<=i+1&&h.end>=i+1).at(-1);
  if(!section)throw Error("missing section "+m[1]);
  const meta=lines.slice(section.start,i).find(l=>/^holder=/.test(l));
  const accepted=m[1][0]==="K"&&meta?.startsWith("holder="+e.holder+"; version=mainline; status=accepted");
  const planned=m[1][0]==="P"&&meta?.includes("status=planned");
  if(!accepted&&!planned)throw Error("ambiguous section "+m[1]);
  const learned=accepted?m[5].match(/^learned_at: (.*?); epistemic:/)?.[1]:null;
  if(accepted&&!learned)throw Error("missing learned_at "+m[1]);
  let end=i+1;
  while(end<lines.length&&end<section.end&&!/^ {0,3}#{1,6} /.test(lines[end])&&!/^\s*[-*] \*\*[KP]-/.test(lines[end]))end++;
  while(end>i+1&&!lines[end-1].trim())end--;
  records.push({id:m[1],holder:e.holder,version:"mainline",status:accepted?"accepted-record":"planned",chapter_hint:Number(m[3]),start:i+1,end,review_required:true,...(accepted?{learned_at:learned,topic:m[4]}:{})});
 }
 if(new Set(records.map(r=>r.id)).size!==records.length)throw Error("duplicate knowledge ID "+e.path);
 return records;
}

function makePage(e,b,s){
 if(typeof s!=="string"||bytes(s)!==b.size||!/^[0-9a-f]{40}$/.test(b.sha))throw Error("incomplete source "+e.path);
 const index=sections(s);
 return {schema_version:1,scope:"author-navigation-only",id:e.id,path:e.path,blob_sha:b.sha,...index,...(e.kind==="knowledge"?{records:knowledgeRecords(e,s,index)}:{})};
}

function validateRegistry(registry,tree){
 if(registry.schema_version!==1||registry.scope!=="author-navigation-only")throw Error("unsupported registry");
 const known=[...registry.sources.map(x=>x.path),...registry.excluded.map(x=>x.path)];
 if(new Set(known).size!==known.length)throw Error("duplicate path");
 const map=new Map(tree.map(x=>[x.path,x]));
 for(const x of tree.filter(x=>/^[^/]+\.md$|^\.cursor\/(?:rules|skills)\/.*\.(?:md|mdc)$/.test(x.path)))if(!known.includes(x.path))throw Error("unclassified source: "+x.path);
 for(const p of known)if(!map.has(p))throw Error("missing registered source: "+p);
 const ids=new Set();for(const e of registry.sources){if(!/^[a-z0-9-]+$/.test(e.id)||ids.has(e.id))throw Error("invalid id "+e.id);ids.add(e.id)}
 if(registry.mandatory_knowledge.map(id=>registry.sources.find(x=>x.id===id)?.holder).join(",")!=="liz,pascal,rainor,reader")throw Error("four independent maps required");
 return map;
}

function makeManifest(registry,tree,commit){
 if(!/^[0-9a-f]{40}$/.test(commit))throw Error("invalid commit");
 const map=validateRegistry(registry,tree);
 return {schema_version:1,generator_version:registry.generator_version,scope:"author-navigation-only",source_branch:"docs-revision",source_commit:commit,selection_ready:false,mandatory_knowledge:registry.mandatory_knowledge,sources:registry.sources.map(e=>({...e,blob_sha:map.get(e.path).sha,bytes:map.get(e.path).size,pointer:e.id+".json"})),excluded:registry.excluded};
}

function reviewQueue(page,holder,chapter,point){
 if(!["liz","pascal","rainor","reader"].includes(holder)||page.id!=="knowledge-"+holder||!Number.isInteger(chapter)||chapter<1||chapter>8||!["start","end","inside"].includes(point))throw Error("explicit holder, mainline chapter 1–8 and point required");
 const upper=point==="start"?chapter-1:chapter;
 return {scope:"manual-review-queue-not-pov",selection_ready:false,holder,chapter,point,requires_full_map_read:true,records:page.records.filter(r=>r.holder===holder&&r.version==="mainline"&&r.status==="accepted-record"&&r.chapter_hint<=upper).map(r=>({id:r.id,path:page.path,blob_sha:page.blob_sha,start:r.start,end:r.end,review_required:true}))};
}

function normalize(s){return s.normalize("NFKC").toLowerCase().replace(/ё/g,"е").replace(/[\u0300\u0301]/g,"").normalize("NFC")}

function tokens(s){return normalize(s).match(/[\p{L}\p{N}]+/gu)||[]}

function lexicalScore(query,text){
 const q=[...new Set(tokens(query))],t=new Set(tokens(text));if(!q.length)return 0;
 const grams=w=>new Set(Array.from({length:Math.max(0,w.length-2)},(_,i)=>w.slice(i,i+3)));
 let n=0;for(const x of q){if(t.has(x)){n+=3;continue}if(x.length<4)continue;const g=grams(x);let best=0;for(const y of t){if(y.length<4)continue;const h=grams(y),overlap=[...g].filter(z=>h.has(z)).length;best=Math.max(best,2*overlap/(g.size+h.size));}if(best>=0.55)n+=best}
 return n/q.length;
}

export {bytes,linesOf,sections,knowledgeRecords,makePage,validateRegistry,makeManifest,reviewQueue,normalize,tokens,lexicalScore};
