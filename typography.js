// Keep short Vietnamese phrase endings together without changing the source text.
(() => {
  const root = document.querySelector('.sheet');
  const protectedPhrases = /TP\. HCM|ĐHQG TP\. HCM|thiết kế vector|bản vẽ cơ khí|mạch điện tử/gu;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.parentElement.closest('pre,code,script,style,.keep')) nodes.push(node);
  }
  for (const node of nodes) {
    const text = node.textContent;
    const matches = [...text.matchAll(protectedPhrases)];
    if (!matches.length) continue;
    const fragment = document.createDocumentFragment();
    let index = 0;
    for (const match of matches) {
      fragment.append(text.slice(index, match.index));
      const span = document.createElement('span');
      span.className = 'keep';
      span.textContent = match[0];
      fragment.append(span);
      index = match.index + match[0].length;
    }
    fragment.append(text.slice(index));
    node.replaceWith(fragment);
  }
  for (const element of root.querySelectorAll('p,h2,h3,li,figcaption')) {
    if (element.querySelector('p,h2,h3,li,code') || element.classList.contains('eyebrow')) continue;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let last;
    while (walker.nextNode()) if (walker.currentNode.textContent.trim()) last = walker.currentNode;
    if (!last || last.parentElement.closest('.keep')) continue;
    const match = last.textContent.match(/(\S+\s+\S+\s+\S+)(\s*)$/u);
    if (!match) continue;
    const range = document.createRange();
    range.setStart(last, match.index);
    range.setEnd(last, match.index + match[1].length);
    const span = document.createElement('span');
    span.className = 'keep';
    range.surroundContents(span);
  }
  document.documentElement.dataset.typographyReady = 'true';
})();
