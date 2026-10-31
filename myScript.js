'use strict';
document.documentElement.classList.add('js');
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const smallScreen = matchMedia('(max-width: 760px)');
let savedMotion;
try { savedMotion = localStorage.getItem('sulin.motion'); } catch { /* Storage is optional. */ }
let motionPaused = savedMotion === 'paused' || (savedMotion !== 'playing' && reducedMotion.matches);
let orbitPaused = false, orbitHovered = false, orbitFocused = false, orbitVisible = false;
function syncMotion() {
  document.documentElement.classList.toggle('motion-paused', motionPaused);
  $('.motion-toggle').setAttribute('aria-pressed', String(motionPaused));
  $('.motion-toggle').title = motionPaused ? '恢复页面动态' : '暂停页面动态';
  $('.motion-label').textContent = motionPaused ? '恢复动态' : '暂停动态';
  $('.motion-symbol').textContent = motionPaused ? '▷' : 'Ⅱ';
  const stopped = motionPaused || orbitPaused;
  $('.orbit-control').setAttribute('aria-pressed', String(stopped));
  $('.orbit-control-icon').textContent = stopped ? '▷' : 'Ⅱ';
  $('.orbit-control-label').textContent = stopped ? '恢复作品环绕' : '暂停作品环绕';
  $('.orbit-hint').textContent = smallScreen.matches ? '左右滑动 · 点击探索' : '悬停暂停 · 点击探索';
}
$('.motion-toggle').addEventListener('click', () => {
  motionPaused = !motionPaused;
  try { localStorage.setItem('sulin.motion', motionPaused ? 'paused' : 'playing'); } catch { /* Optional. */ }
  syncMotion();
});
$('.orbit-control').addEventListener('click', () => {
  if (motionPaused) { motionPaused = false; orbitPaused = false; } else orbitPaused = !orbitPaused;
  syncMotion();
});
reducedMotion.addEventListener('change', () => { motionPaused = reducedMotion.matches; syncMotion(); });
smallScreen.addEventListener('change', () => { syncMotion(); positionCards(); });
syncMotion();
const menu = $('.main-nav'), menuButton = $('.menu-toggle');
function setMenu(open) { menu.classList.toggle('is-open', open); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? '关闭导航' : '打开导航'); }
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
$$('a', menu).forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) setMenu(false); });
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } }), { threshold: .08 });
  $$('.reveal').forEach(element => revealObserver.observe(element));
  new IntersectionObserver(entries => { orbitVisible = entries[0].isIntersecting; }).observe($('.orbit-stage'));
} else { $$('.reveal').forEach(element => element.classList.add('is-visible')); orbitVisible = true; }
const orbitCards = $$('.orbit-card'), orbitStage = $('.orbit-stage');
let orbitAngle = -.5, frameTime = 0;
function positionCards() {
  if (smallScreen.matches) { orbitCards.forEach(card => card.style.removeProperty('transform')); return; }
  const rx = Math.min(orbitStage.clientWidth * .365, 440), ry = orbitStage.clientHeight * .365;
  orbitCards.forEach((card, index) => {
    const angle = index / orbitCards.length * Math.PI * 2 + orbitAngle;
    const x = Math.cos(angle) * rx, y = Math.sin(angle) * ry, tilt = Math.sin(angle * 1.7) * 8;
    card.style.transform = `translate(-50%,-50%) translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${tilt.toFixed(2)}deg)`;
    card.style.zIndex = String(Math.round(10 + Math.sin(angle) * 5));
  });
}
positionCards();
window.addEventListener('resize', positionCards, { passive: true });
orbitStage.addEventListener('pointerenter', () => { orbitHovered = true; });
orbitStage.addEventListener('pointerleave', () => { orbitHovered = false; });
orbitStage.addEventListener('focusin', () => { orbitFocused = true; });
orbitStage.addEventListener('focusout', () => { requestAnimationFrame(() => { orbitFocused = orbitStage.contains(document.activeElement); }); });
function animateOrbit(time) {
  const delta = Math.min((time - frameTime) / 1000, .05); frameTime = time;
  if (!motionPaused && !orbitPaused && !orbitHovered && !orbitFocused && !smallScreen.matches && orbitVisible && !document.hidden) { orbitAngle += delta * .045; positionCards(); }
  requestAnimationFrame(animateOrbit);
}
requestAnimationFrame(animateOrbit);
const hero = $('.hero');
hero.addEventListener('pointermove', event => {
  if (motionPaused || smallScreen.matches || event.pointerType !== 'mouse') return;
  const rect = hero.getBoundingClientRect();
  hero.style.setProperty('--px', ((event.clientX - rect.left) / rect.width - .5).toFixed(3));
  hero.style.setProperty('--py', ((event.clientY - rect.top) / rect.height - .5).toFixed(3));
});
hero.addEventListener('pointerleave', () => { hero.style.setProperty('--px', 0); hero.style.setProperty('--py', 0); });
let scrollPending = false;
function updateScroll() { const total = document.documentElement.scrollHeight - window.innerHeight; $('.reading-progress').style.width = `${total > 0 ? Math.min(100, Math.max(0, scrollY / total * 100)) : 0}%`; scrollPending = false; }
window.addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); } }, { passive: true });
updateScroll();
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  $$('[data-filter]').forEach(item => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
  let count = 0;
  $$('.project-card').forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; if (!card.hidden) { count++; card.classList.add('is-visible'); } });
  $('#filter-status').textContent = `显示 ${count} 个${filter === 'web' ? '网页开发' : filter === 'visual' ? '视觉探索' : ''}作品`;
}));
function selectSkill(button, moveFocus = false) {
  $$('.skill-tabs [role=tab]').forEach(tab => { const selected = tab === button; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; });
  $$('.skill-panels [role=tabpanel]').forEach(panel => { panel.hidden = panel.id !== button.getAttribute('aria-controls'); });
  if (moveFocus) button.focus();
}
selectSkill($('.skill-tabs [aria-selected=true]'));
$$('.skill-tabs [role=tab]').forEach((button, index, tabs) => {
  button.addEventListener('click', () => selectSkill(button));
  button.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectSkill(tabs[next], true); }
  });
});
const cases = {
  site: { image:'images/portfolio-preview-1265.webp', alt:'苏林个人网站页面预览', label:'01 / PERSONAL SPACE', title:'一个会慢慢生长的个人空间。', paragraphs:['这个网站记录我的前端学习和创意探索。从最初的个人介绍页面，逐渐加入响应式布局、作品展示和 JavaScript 交互。','这次让页面更有自己的性格：黑白对比的版式、环形作品墙、原创人物视觉，以及可以随时暂停的动态。希望每个访问这里的人，都能轻松找到作品与代码。'], tags:['HTML','CSS','JavaScript','响应式设计'], links:[{text:'阅读个人网站完整案例',url:'./projects/personal-website.html'},{text:'查看 GitHub 源码',url:'https://github.com/sulin1122/sulin1122.github.io',external:true}] },
  todo: { image:'images/todo-preview-1280.webp', alt:'交互待办清单页面预览', label:'02 / DAILY FOCUS', title:'让注意力，回到真正重要的事。', paragraphs:['一个用原生 JavaScript 制作的任务清单。记录想做的事，标记每一步完成，把今天安排得更清楚一点。','支持任务分类、搜索、完成状态筛选、编辑与撤销删除。任务保存在当前浏览器，刷新后仍然可以继续。'], tags:['JavaScript','DOM 事件','本地存储','小工具'], links:[{text:'阅读待办清单完整案例',url:'./projects/javascript-todo.html'},{text:'打开待办清单',url:'./1.html'},{text:'查看页面源码',url:'https://github.com/sulin1122/sulin1122.github.io/blob/main/1.html',external:true}] },
  visual: { image:'images/creative-hero-1672.webp', alt:'为本网站创作的原创红发 3D 人物', label:'03 / VISUAL PLAYGROUND', title:'认真玩，也是一种创作方式。', paragraphs:['一场关于字体、色彩与动态的视觉练习。红色、黑色与一点荧光绿，让严谨的代码也能拥有轻松、有趣的表达。','首屏人物是为本网站创作的 AI 辅助 3D 概念视觉，不是我的真实肖像。页面里的字体海报与动态排版，则用 HTML 和 CSS 实现。'], tags:['AI 辅助视觉','字体排版','动效探索'], links:[{text:'阅读视觉与动效完整案例',url:'./projects/visual-experiments.html'}] },
  reference: { image:'images/brochure-reference.webp', alt:'宣传册排版参考素材', label:'LEARNING / REFERENCE MATERIAL', title:'从观察好的排版开始。', paragraphs:['这组素材沿用网站原有的宣传册与作品集封面参考，用于观察版面留白、图文关系和色彩搭配。','它们是学习参考素材，与上方可以体验的网页项目分开展示。把观察到的规律，变成自己的下一次尝试。'], tags:['参考素材','排版学习','视觉观察'], links:[] }
};
const dialog = $('#case-dialog');
let dialogTrigger;
$$('[data-case]').forEach(button => button.addEventListener('click', event => {
  const entry = cases[button.dataset.case]; if (!entry || typeof dialog.showModal !== 'function') return; event.preventDefault(); dialogTrigger = button;
  $('#case-content').innerHTML = `<img class="case-visual" src="${entry.image}" alt="${entry.alt}"><div class="case-text"><p class="eyebrow">${entry.label}</p><h2 id="case-title">${entry.title}</h2>${entry.paragraphs.map(text => `<p>${text}</p>`).join('')}<div class="case-meta">${entry.tags.map(tag => `<span>${tag}</span>`).join('')}</div>${entry.links.length ? `<div class="case-links">${entry.links.map(link => `<a class="pill-button" href="${link.url}"${link.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${link.text}<span>↗</span></a>`).join('')}</div>` : ''}</div>`;
  dialog.showModal(); document.body.style.overflow = 'hidden';
}));
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { document.body.style.overflow = ''; dialogTrigger?.focus({ preventScroll:true }); });
let toastTimer;
function toast(message) { clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').classList.add('is-visible'); toastTimer = setTimeout(() => $('#toast').classList.remove('is-visible'), 3500); }
$('#copy-site').addEventListener('click', async () => {
  const address = 'https://sulin1122.github.io/';
  try { await navigator.clipboard.writeText(address); toast('网站地址已复制，欢迎分享。'); } catch { toast(`网站地址：${address}`); }
});
$('#year').textContent = String(new Date().getFullYear());
