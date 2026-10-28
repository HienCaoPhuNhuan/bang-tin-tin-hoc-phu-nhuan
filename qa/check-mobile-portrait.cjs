const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('assert'),fs=require('fs'),path=require('path');
const base=process.argv[2]||'http://127.0.0.1:8765/mobile/';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try {
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(base,{waitUntil:'networkidle'});await page.waitForFunction(()=>window.mobileReady);
 const report={portrait:[],landscape:[]};
 for(const width of [320,390,430,768]){
  await page.setViewportSize({width,height:1024});
  const sizes=await page.locator('.story').evaluateAll(es=>es.map(e=>({width:e.getBoundingClientRect().width,font:parseFloat(getComputedStyle(e.querySelector('p:not(.eyebrow)')).fontSize)})));
  assert(sizes.every(s=>Math.abs(s.width-width)<1));
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  report.portrait.push({width,storyWidths:sizes.map(s=>s.width)});
 }
 await page.setViewportSize({width:390,height:844});
 const team=page.locator('.team-story');await team.scrollIntoViewIfNeeded();await page.waitForTimeout(1200);
 const positions=await team.evaluate(e=>({image:e.querySelector('.gallery').getBoundingClientRect().top,text:e.querySelector('.team-intro>p:not(.eyebrow)').getBoundingClientRect().top}));
 assert(positions.image<positions.text,'Team image must precede description');
 await page.screenshot({path:path.join(__dirname,'preview-portrait-team.png')});
 await page.evaluate(()=>{const e=document.querySelector('#topic-08');scrollTo({top:e.getBoundingClientRect().top+scrollY-280,behavior:'instant'})});
 await page.waitForFunction(()=>document.querySelector('#topic-08').dataset.portraitPlayed==='true');
 await page.waitForTimeout(170);
 const entrance=await page.locator('#topic-08').evaluate(e=>({image:parseFloat(getComputedStyle(e.querySelector('.gallery')).opacity),text:parseFloat(getComputedStyle(e.querySelector('.photo-notes')).opacity),transform:getComputedStyle(e).transform}));
 assert(entrance.image>entrance.text,'Image must appear before description');assert(entrance.text<.1);report.entrance=entrance;
 await page.waitForTimeout(1200);
 assert.equal(await page.locator('#topic-08 .photo-notes').evaluate(e=>getComputedStyle(e).opacity),'1');
 await page.screenshot({path:path.join(__dirname,'preview-portrait-activity.png')});
 const footer=await page.locator('.site-footer').evaluate(e=>({children:[...e.children].map(x=>x.tagName),text:e.innerText,logo:e.querySelector('img').getAttribute('src')}));
 assert.deepEqual(footer.children,['IMG','P']);assert(footer.logo.endsWith('logo-to.png'));assert(!footer.text.includes('tham khảo'));report.footer=footer;
 // Compare landscape against the same page without the portrait additions.
 const original=await browser.newPage();await original.route('**/portrait.*',r=>r.abort());
 const metrics=p=>p.locator('.story').evaluateAll(es=>es.map(e=>({x:e.getBoundingClientRect().x,width:e.getBoundingClientRect().width,font:getComputedStyle(e.querySelector('p')).fontSize})));
 for(const width of [667,844,1440]){
  await page.setViewportSize({width,height:390});await original.setViewportSize({width,height:390});await original.goto(base,{waitUntil:'networkidle'});await original.waitForFunction(()=>window.mobileReady);
  for(const p of [page,original]) await p.addStyleTag({content:'.story{transform:none!important;transition:none!important}'});
  await page.waitForTimeout(800);assert.deepEqual(await metrics(page),await metrics(original));report.landscape.push(width);
 }
 await page.setViewportSize({width:844,height:390});await page.screenshot({path:path.join(__dirname,'preview-portrait-landscape.png')});
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});
 await page.locator('#topic-08').scrollIntoViewIfNeeded();assert.equal(await page.locator('#topic-08').evaluate(e=>getComputedStyle(e).opacity),'1');
 assert.deepEqual(errors,[]);report.errors=errors;fs.writeFileSync(path.join(__dirname,'portrait-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
