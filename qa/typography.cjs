const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage();
 await page.goto(process.argv[2]||'http://127.0.0.1:8765',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 await page.emulateMedia({media:'print'});
 const report=await page.evaluate(()=>{
  document.querySelector('.sheet').style.transform='none';
  const orphans=[];
  for(const el of document.querySelectorAll('.sheet p,.sheet h2,.sheet h3,.sheet li,.sheet figcaption')){
   if(el.matches('.eyebrow')||el.querySelector('p,li'))continue;
   const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),lines=[];
   while(walker.nextNode()){
    const node=walker.currentNode;
    for(const m of node.textContent.matchAll(/\S+/gu)){
     const r=document.createRange();r.setStart(node,m.index);r.setEnd(node,m.index+m[0].length);
     const rect=r.getBoundingClientRect();
     let line=lines.find(l=>Math.abs(l.y-rect.top)<3);
     if(!line){line={y:rect.top,words:[]};lines.push(line)}
     line.words.push(m[0]);
    }
   }
   lines.sort((a,b)=>a.y-b.y);
   if(lines.length>1&&lines.at(-1).words.length===1)orphans.push({tile:el.closest('.tile').dataset.tile,text:el.textContent,last:lines.at(-1).words[0]});
  }
  const text=document.querySelector('.sheet').textContent;
  return {orphans,fontLoaded:document.fonts.check('16px Noto'),replacementCharacters:text.includes('\uFFFD'),ready:document.documentElement.dataset.typographyReady};
 });
 console.log(JSON.stringify(report,null,2));
 await browser.close();
 if(report.orphans.length||!report.fontLoaded||report.replacementCharacters||report.ready!=='true')process.exitCode=1;
})();
