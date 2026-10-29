const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');
const base=process.argv[2]||'http://127.0.0.1:8765/mobile/';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(base,{waitUntil:'networkidle'});await page.waitForFunction(()=>window.mobileReady===true);
 await page.evaluate(()=>document.fonts.ready);await page.locator('.hero-photo img').evaluate(i=>i.decode());
 const report=await page.evaluate(()=>({title:document.title,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,stories:document.querySelectorAll('[data-tile]').length,photos:mobileGalleries.total,newPhotos:mobileGalleries.newPhotos,albums:Object.keys(mobileGalleries.galleries).length,rails:document.querySelectorAll('.rail-viewport').length}));
 const expected=JSON.parse(fs.readFileSync(path.join(__dirname,'../mobile/galleries.json'),'utf8'));
 assert.equal(report.stories,15);assert.equal(report.photos,expected.total);assert.equal(report.newPhotos,expected.newPhotos);assert.equal(report.width,report.scrollWidth);
 await page.screenshot({path:path.join(__dirname,'preview-mobile-hero.png')});
 const printPage=await context.newPage();await printPage.goto(new URL('../',base).href,{waitUntil:'networkidle'});
 const approved=await printPage.evaluate(()=>[...document.querySelectorAll('.tile:not(.masthead) p,.tile:not(.masthead) h2,.tile:not(.masthead) h3,.tile:not(.masthead) li')].map(e=>e.textContent.replace(/\s+/g,' ').trim()).filter(Boolean));
 const mobileText=await page.locator('body').textContent();report.missingContent=approved.filter(t=>!mobileText.replace(/\s+/g,' ').includes(t));assert.deepEqual(report.missingContent,[]);await printPage.close();
 const rail=page.locator('#topic-08 .rail-viewport');await rail.scrollIntoViewIfNeeded();await page.mouse.move(0,0);await wait(600);
 const before=await rail.evaluate(e=>e.scrollLeft);await wait(800);const after=await rail.evaluate(e=>e.scrollLeft);report.autoAdvance=after-before;assert(report.autoAdvance>8,'Rail must auto-scroll right to left');
 const pause=page.locator('#topic-08 .rail-pause');await pause.click();const paused=await rail.evaluate(e=>e.scrollLeft);await wait(400);assert(Math.abs(await rail.evaluate(e=>e.scrollLeft)-paused)<2);await pause.click();
 const box=await rail.boundingBox();await page.mouse.move(box.x+box.width*.8,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width*.2,box.y+box.height/2,{steps:12});await page.mouse.up();await wait(200);report.mouseDrag=await rail.evaluate(e=>e.scrollLeft)-paused;assert(report.mouseDrag>80);assert.equal(await page.locator('#photo-viewer').evaluate(d=>d.open),false);
 const cdp=await context.newCDPSession(page);async function swipe(x,y,dx,dy){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let n=1;n<=5;n++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*n/5,y:y+dy*n/5}]});await wait(35)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await wait(250)}
 let bounds=await rail.boundingBox(),start=await rail.evaluate(e=>e.scrollLeft);await swipe(bounds.x+bounds.width*.8,bounds.y+45,-bounds.width*.6,0);report.touchDrag=await rail.evaluate(e=>e.scrollLeft)-start;assert(report.touchDrag>60);
 bounds=await rail.boundingBox();const top=await page.evaluate(()=>scrollY);await swipe(bounds.x+bounds.width*.5,bounds.y+45,0,-145);report.verticalScroll=await page.evaluate(()=>scrollY)-top;assert(report.verticalScroll>60,'Horizontal album must not block page scrolling');
 await rail.scrollIntoViewIfNeeded();await wait(400);await page.locator('#topic-08 .thumb').first().click();await page.waitForFunction(()=>document.querySelector('#photo-viewer').open);await page.locator('#viewer-image').evaluate(i=>i.decode());const count=await page.locator('#viewer-count').textContent();await page.locator('#viewer-next').click();assert.notEqual(await page.locator('#viewer-count').textContent(),count);await page.locator('#viewer-zoom').click();assert.equal(await page.locator('#viewer-zoom').getAttribute('aria-pressed'),'true');await page.locator('#viewer-close').click();assert.equal(await page.locator('body').evaluate(e=>e.classList.contains('modal-open')),false);
 await page.locator('#topic-08').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(__dirname,'preview-mobile-album.png')});
 await page.locator('[data-answer="1"]').click();assert((await page.locator('.quiz-result').textContent()).includes('Đúng'));
 await page.locator('#motion-toggle').click();assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'),'true');await page.locator('#run-loop').click();await page.waitForFunction(()=>document.querySelector('#loop-output').textContent==='15');
 await page.locator('#loop-n').fill('10');await page.locator('#run-loop').click();await page.waitForFunction(()=>document.querySelector('#loop-output').textContent==='55');
 await page.locator('[data-index="0"][data-delta="1"]').last().click();assert((await page.locator('#dynamic-total').textContent()).includes('11'));
 const domain=page.locator('.domains li').first();await domain.click();assert.equal(await domain.getAttribute('aria-expanded'),'false');await domain.press('Enter');assert.equal(await domain.getAttribute('aria-expanded'),'true');
 await page.locator('#menu-toggle').click();await page.locator('#site-menu a[href="#knowledge"]').click();assert.equal(await page.locator('#site-menu').evaluate(e=>e.hidden),true);
 for(const width of [320,375,430,768]){await page.setViewportSize({width,height:844});await wait(80);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Horizontal overflow at ${width}px`)}
 await context.close();
 const desktop=await browser.newPage({viewport:{width:1440,height:1000}});await desktop.goto(base,{waitUntil:'networkidle'});await desktop.waitForFunction(()=>window.mobileReady);await desktop.evaluate(()=>document.fonts.ready);await desktop.screenshot({path:path.join(__dirname,'preview-mobile-desktop.png')});assert(await desktop.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await desktop.close();
 const reducedContext=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),reducedPage=await reducedContext.newPage();await reducedPage.goto(base,{waitUntil:'networkidle'});await reducedPage.waitForFunction(()=>window.mobileReady);await reducedPage.locator('#topic-08 .rail-viewport').scrollIntoViewIfNeeded();const reducedBefore=await reducedPage.locator('#topic-08 .rail-viewport').evaluate(e=>e.scrollLeft);await wait(500);assert.equal(await reducedPage.locator('#topic-08 .rail-viewport').evaluate(e=>e.scrollLeft),reducedBefore);assert.equal(await reducedPage.locator('#motion-toggle').getAttribute('aria-pressed'),'true');await reducedContext.close();
 report.errors=errors;assert.deepEqual(errors,[]);report.interactions='passed';fs.writeFileSync(path.join(__dirname,'mobile-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
