const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs');
const path=require('path');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1600,height:1100},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(process.argv[2]||'http://127.0.0.1:8765',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 const report=await page.evaluate(()=>{
  const px=96/25.4, sheet=document.querySelector('.sheet');
  const overflow=[...document.querySelectorAll('.tile')].flatMap(tile=>{
    const r=tile.getBoundingClientRect();
    return [...tile.querySelectorAll('h1,h2,p,figure,blockquote,ol,.tags,.note,.brief')].filter(el=>{
      const b=el.getBoundingClientRect();return b.bottom>r.bottom+1||b.right>r.right+1||b.left<r.left-1;
    }).map(el=>({tile:tile.dataset.tile,tag:el.tagName,text:el.textContent.slice(0,80)}));
  });
  return {sizeMm:[sheet.offsetWidth/px,sheet.offsetHeight/px],tiles:document.querySelectorAll('.tile').length,images:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})),overflow,font:document.fonts.check('16px Noto'),documentWidth:document.documentElement.scrollWidth,viewport:innerWidth};
 });
 await page.screenshot({path:path.join(__dirname,'preview.png'),fullPage:true});
 await page.click('#guide');if(!await page.locator('#print-help').isVisible())throw Error('Help does not open');
 await page.click('#guide');
 await page.uncheck('#cut-lines');if(!await page.locator('.no-cuts').count())throw Error('Cut toggle');await page.check('#cut-lines');
 await page.emulateMedia({media:'print'});
 await page.evaluate(()=>{document.querySelector('.sheet').style.transform='none'});
 report.print = await page.evaluate(()=>{
   const overflow=[],overlap=[];
   for(const tile of document.querySelectorAll('.tile')){
     const r=tile.getBoundingClientRect();
     for(const el of tile.querySelectorAll('h1,h2,p,figure,blockquote,ol,.tags,.note,.brief,.insight,.feature-columns,.prompt-example,.security-tip')){
       const b=el.getBoundingClientRect();
       if(b.bottom>r.bottom+1||b.right>r.right+1||b.left<r.left-1)overflow.push({tile:tile.dataset.tile,text:el.textContent.slice(0,70)});
     }
     const body=tile.querySelector('.tile-body');
     if(body){const children=[...body.children];for(let i=1;i<children.length;i++)if(children[i-1].getBoundingClientRect().bottom>children[i].getBoundingClientRect().top+1)overlap.push(tile.dataset.tile);}
   }
   const school=document.querySelector('.anniversary .school-logo').getBoundingClientRect(), anniversary=document.querySelector('.anniversary img:last-child').getBoundingClientRect();
   return {overflow,overlap,logosAdjacent:school.right<=anniversary.left&&Math.abs(school.top-anniversary.top)<2,wordCount:document.querySelector('.sheet').innerText.trim().split(/\s+/).length};
 });
 fs.mkdirSync(path.join(__dirname,'../output/pdf'),{recursive:true});
 await page.pdf({path:path.join(__dirname,'../output/pdf/bang-tin-tin-hoc-60x90cm.pdf'),preferCSSPageSize:true,printBackground:true});
 await page.emulateMedia({media:'screen'});
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>dispatchEvent(new Event('resize')));
 report.mobile=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
 await page.screenshot({path:path.join(__dirname,'preview-mobile.png'),fullPage:true});
 report.errors=errors;fs.writeFileSync(path.join(__dirname,'check-report.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
 await browser.close();
 if(report.overflow.length||report.print.overflow.length||report.print.overlap.length||!report.print.logosAdjacent||report.images.some(i=>!i.loaded)||errors.length||report.tiles!==14||report.mobile.scrollWidth>390||Math.abs(report.sizeMm[0]-600)>.2||Math.abs(report.sizeMm[1]-900)>.2)process.exitCode=1;
})();


