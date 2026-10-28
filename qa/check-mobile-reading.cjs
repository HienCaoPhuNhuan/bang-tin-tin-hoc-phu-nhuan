const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('assert'),fs=require('fs'),path=require('path');
const base=process.argv[2]||'http://127.0.0.1:8765/mobile/';
const delay=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'});
 await page.goto(base,{waitUntil:'networkidle'});await page.waitForFunction(()=>window.mobileReady&&window.updateScrollEffects);await page.evaluate(()=>document.fonts.ready);
 assert((await page.locator('.site-footer>img').getAttribute('src')).endsWith('logo-to.png'));
 const sizes=[];
 for(const width of [320,375,390,430,768]){
  await page.setViewportSize({width,height:844});
  const size=await page.evaluate(()=>({viewport:innerWidth,cardWidth:document.querySelector('#topic-11').offsetWidth,textSize:parseFloat(getComputedStyle(document.querySelector('#topic-11 .context-copy p')).fontSize),columns:getComputedStyle(document.querySelector('#topic-09 .photo-notes')).gridTemplateColumns,overflow:document.documentElement.scrollWidth>innerWidth}));
  assert(size.cardWidth/width>.94);assert(size.textSize>=17);assert.equal(size.columns.split(' ').length,1);assert(!size.overflow);sizes.push(size);
 }
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 const initial=await page.locator('#topic-11').evaluate(e=>({opacity:+getComputedStyle(e).opacity,seen:e.classList.contains('seen')}));assert.equal(initial.seen,false);
 await page.locator('#topic-11').evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-innerHeight+220,behavior:'instant'}));
 await page.waitForFunction(()=>document.querySelector('#topic-11').classList.contains('seen'));
 const start=await page.locator('#topic-11').evaluate(e=>({opacity:+getComputedStyle(e).opacity,transform:getComputedStyle(e).transform}));
 await delay(320);
 const middle=await page.locator('#topic-11').evaluate(e=>({opacity:+getComputedStyle(e).opacity,transform:getComputedStyle(e).transform}));
 assert(middle.opacity>start.opacity||middle.transform!==start.transform,'Scroll entry must visibly animate over time');await delay(650);
 const end=await page.locator('#topic-11').evaluate(e=>({opacity:+getComputedStyle(e).opacity,transform:getComputedStyle(e).transform,progress:parseFloat(getComputedStyle(e).getPropertyValue('--read-progress'))}));assert.equal(end.opacity,1);
 const cover=page.locator('#topic-11 .cover-preview');
 await cover.evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-innerHeight-130,behavior:'instant'}));await page.waitForFunction(()=>!document.querySelector('#topic-11 .cover-preview').classList.contains('media-seen'));
 await cover.evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-145,behavior:'instant'}));await page.waitForFunction(()=>document.querySelector('#topic-11 .cover-preview').classList.contains('media-seen'));
 const clipStart=await cover.evaluate(e=>getComputedStyle(e).clipPath);await delay(300);const clipMiddle=await cover.evaluate(e=>getComputedStyle(e).clipPath);assert.notEqual(clipStart,clipMiddle,'Photo reveal must animate as it enters the screen');await delay(850);
 const progressBefore=await page.locator('#topic-11').evaluate(e=>parseFloat(e.style.getPropertyValue('--read-progress')));await page.evaluate(()=>scrollBy({top:140,behavior:'instant'}));await delay(100);const progressAfter=await page.locator('#topic-11').evaluate(e=>parseFloat(e.style.getPropertyValue('--read-progress')));assert(progressAfter>progressBefore);
 await page.locator('#topic-11').evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-85,behavior:'instant'}));await delay(500);await page.screenshot({path:path.join(__dirname,'preview-mobile-wide-reading.png')});
 await page.locator('.site-footer').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(__dirname,'preview-mobile-footer.png')});
 await page.locator('#motion-toggle').click();assert.equal(await cover.evaluate(e=>getComputedStyle(e).clipPath),'none');
 const report={sizes,cardAnimation:{start,middle,end},photoReveal:{clipStart,clipMiddle},scrollProgress:{before:progressBefore,after:progressAfter},footerLogo:'logo-to.png'};
 console.log(JSON.stringify(report,null,2));fs.writeFileSync(path.join(__dirname,'mobile-reading-report.json'),JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
