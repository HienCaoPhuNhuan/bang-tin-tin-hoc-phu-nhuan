// Native page scrolling drives lightweight visual accents; no scroll interception.
(() => {
  const active = new Set();
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) active.add(entry.target);
      else active.delete(entry.target);
    }
    update();
  }, {rootMargin: '100px'});
  document.querySelectorAll('.story,.section-heading').forEach(el => observer.observe(el));

  function update() {
    header.classList.toggle('scrolled', scrollY > 24);
    if (document.documentElement.classList.contains('motion-paused')) return;
    const height = innerHeight;
    const measurements = [...active].map(el => ({el, rect:el.getBoundingClientRect()}));
    for (const {el, rect} of measurements) {
      const progress = Math.max(0, Math.min(1, (height * .78 - rect.top) / (height * .78 + rect.height * .35)));
      if (el.classList.contains('story')) el.style.setProperty('--read-progress', progress.toFixed(3));
      else el.style.setProperty('--chapter-line', `${22 + progress * 65}px`);
    }
    if (scrollY < hero.offsetHeight + 100) hero.style.setProperty('--hero-shift', `${Math.min(20, scrollY * .035)}px`);
  }
  window.updateScrollEffects = update;

  const mediaObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.classList.add('media-seen');
      else if (entry.boundingClientRect.top > 0) entry.target.classList.remove('media-seen');
    }
  }, {rootMargin: '0px 0px -10% 0px',threshold: .12});
  function observeMedia(root = document) {
    root.querySelectorAll('.cover-preview:not(.media-reveal)').forEach(el => {
      el.classList.add('media-reveal');
      mediaObserver.observe(el);
    });
  }
  observeMedia();
  new MutationObserver(records => {
    if (records.some(record => record.addedNodes.length)) observeMedia();
  }).observe(document.querySelector('.content-shell'), {childList:true,subtree:true});
  addEventListener('resize', update, {passive:true});
  update();
})();
