const poster = document.querySelector('.sheet');
const wrapper = document.querySelector('.sheet-wrap');
function fitPreview() {
  const width = document.querySelector('.viewport').clientWidth - (innerWidth < 900 ? 20 : 36);
  const scale = Math.min(1, width / poster.offsetWidth);
  poster.style.transform = `scale(${scale})`;
  wrapper.style.width = `${poster.offsetWidth * scale}px`;
  wrapper.style.height = `${poster.offsetHeight * scale}px`;
}
addEventListener('resize', fitPreview);
fitPreview();
document.querySelector('#cut-lines').addEventListener('change', e => poster.classList.toggle('no-cuts', !e.target.checked));
document.querySelector('#guide').addEventListener('click', e => {
  const help = document.querySelector('#print-help');
  help.hidden = !help.hidden;
  e.target.setAttribute('aria-expanded', String(!help.hidden));
});
document.querySelector('#print').addEventListener('click', async () => { await document.fonts.ready; window.print(); });
document.fonts.ready.then(fitPreview);
