// Portrait uses independent full-width chapters, with native continuous scrolling.
(() => {
  const portrait = matchMedia('(orientation:portrait) and (max-width:1024px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const running = new Set();
  const stories = [...document.querySelectorAll('.story')];
  stories.forEach((story,index) => story.dataset.chapterNumber = String(index+1).padStart(2,'0'));
  const allowed = () => portrait.matches && !reduced.matches && !document.documentElement.classList.contains('motion-paused');

  function animate(element, frames, timing) {
    const animation = element.animate(frames, {...timing,fill:'backwards'});
    running.add(animation);
    animation.finished.then(() => running.delete(animation),() => running.delete(animation));
  }
  function enter(story) {
    if (!allowed() || story.dataset.portraitPlayed === 'true') return;
    story.dataset.portraitPlayed = 'true';
    const body = story.querySelector('.tile-body');
    animate(story,[{opacity:.2,transform:'translate3d(0,90px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:680,easing:'cubic-bezier(.16,1,.3,1)'});
    const gallery = body.querySelector('.gallery');
    const visual = gallery || body.querySelector('.topic-art');
    if (visual) animate(visual,[{opacity:0,transform:'translate3d(0,34px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:650,delay:80,easing:'cubic-bezier(.16,1,.3,1)'});
    const headings = body.querySelectorAll(':scope>h2,:scope>.eyebrow,.team-intro>h2,.team-intro>.eyebrow');
    headings.forEach(el => animate(el,[{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:470,delay:60,easing:'ease-out'}));
    const textBlocks = [...body.children].filter(el => el!==gallery && !el.matches('h2,.eyebrow,.topic-head,.team-intro'));
    if (story.classList.contains('team-story')) textBlocks.push(...body.querySelectorAll('.team-intro>p:not(.eyebrow),.team-intro>.motto,.team-intro>.legacy-logo'));
    textBlocks.forEach((el,index) => animate(el,[{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:620,delay:380+Math.min(index,3)*65,easing:'cubic-bezier(.2,.75,.2,1)'}));
    window.lastPortraitEntrance = story.id;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {if(entry.isIntersecting) enter(entry.target)});
  },{rootMargin:'0px 0px -18% 0px',threshold:0});
  stories.forEach(story => observer.observe(story));

  function resetForPreference() {
    if (!allowed()) {
      running.forEach(animation => animation.cancel());
      running.clear();
    }
    if (portrait.matches) {
      requestAnimationFrame(() => stories.forEach(story => {
        const rect=story.getBoundingClientRect();
        if(rect.top<innerHeight*.82 && rect.bottom>75) enter(story);
      }));
    }
    document.documentElement.dataset.readingLayout = portrait.matches ? 'portrait-chapters' : 'landscape-original';
  }
  portrait.addEventListener('change',resetForPreference);
  reduced.addEventListener('change',resetForPreference);
  document.querySelector('#motion-toggle').addEventListener('click',resetForPreference);
  resetForPreference();
})();
