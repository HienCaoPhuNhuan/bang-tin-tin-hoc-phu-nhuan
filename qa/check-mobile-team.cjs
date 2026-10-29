const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('assert'),path=require('path');
const base=process.argv[2]||'http://127.0.0.1:8765/mobile/';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(base,{waitUntil:'networkidle'});await page.waitForFunction(()=>window.mobileReady);
  const text=await page.locator('body').innerText();
  for(const unwanted of ['Ảnh do đơn vị cung cấp','Tự trôi từ phải sang trái','Vuốt/kéo để xem nhanh','KÉO ĐỂ KHÁM PHÁ'])assert(!text.includes(unwanted),unwanted);
  assert.equal(await page.locator('.gallery-hint,#gallery-total').count(),0);
  const credits=page.locator('.team-credits');await credits.scrollIntoViewIfNeeded();await page.waitForTimeout(1300);await page.mouse.move(0,0);
  const rows=page.locator('.team-credit-row');assert.equal(await rows.count(),2);
  assert.deepEqual(await page.locator('.team-credit-label').allTextContents(),['Hàng trên từ trái sang phải lần lượt:','Hàng dưới từ trái sang phải lần lượt:']);
  const expected=[['Thầy Hoàng Kim Bảo – Tổ phó chuyên môn','Thầy Đinh Công Bình','Thầy Cao Nguyễn Nam Hiền','Thầy Hà Thanh Liêm','Thầy Đàm Thanh Xuân'],['Thầy Mai Xuân Tuyên','Cô Đinh Mỹ Vân','Cô Nguyễn Thị Ngọc Nhi – Tổ trưởng chuyên môn','Cô Trần Thị Tâm','Thầy Nguyễn Quốc Nam']];
  for(let i=0;i<2;i++){const names=await rows.nth(i).locator('.names-group').first().textContent();let previous=-1;for(const name of expected[i]){const index=names.indexOf(name);assert(index>previous);previous=index}}
  const positions=()=>rows.evaluateAll(es=>es.map(e=>({label:e.querySelector('.team-credit-label').getBoundingClientRect().x,names:e.querySelector('.names-group').getBoundingClientRect().x})));
  const before=await positions();await page.waitForTimeout(650);const after=await positions();
  before.forEach((p,i)=>{assert.equal(p.label,after[i].label);assert(after[i].names<p.names-10,'Names must move right to left')});
  await page.locator('#motion-toggle').click();const stopped=await positions();await page.waitForTimeout(300);assert.deepEqual(await positions(),stopped);
  await credits.evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-110,behavior:'instant'}));await page.waitForTimeout(200);
  await page.screenshot({path:path.join(__dirname,'preview-team-credits.png')});
  for(const width of [320,390,430,768,844]){await page.setViewportSize({width,height:width===844?390:1024});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  for(const width of [667,844,1440]){
   await page.setViewportSize({width,height:390});
   const cards=await page.locator('.activity-grid>.story').evaluateAll(es=>es.map(e=>({id:e.id,x:e.offsetLeft,y:e.offsetTop,width:e.offsetWidth})));
   assert.equal(cards.length,8);for(let i=0;i<8;i+=2){assert.equal(cards[i].y,cards[i+1].y);assert(cards[i].x<cards[i+1].x);if(i)assert(cards[i].y>cards[i-2].y)}
  }
  await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.names-track').first().evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(await page.locator('.names-group').first().evaluate(e=>getComputedStyle(e).whiteSpace),'normal');
  assert.deepEqual(errors,[]);console.log(JSON.stringify({credits:'passed',labels:'fixed',names:'right-to-left',pause:'passed',reducedMotion:'passed',errors}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
