'use strict';

const chapters = window.atlasChapters;
const topics = chapters.slice(1);
const byId = new Map(chapters.map(chapter => [chapter.id, chapter]));
const main = document.querySelector('main');
const dialog = document.querySelector('#search-dialog');
const input = document.querySelector('#search-input');
const results = document.querySelector('#search-results');
const groups = [...new Set(topics.map(topic => topic.group))];
const chains = [
  ['材料', '衬底 · 外延', 'materials'],
  ['设计', '架构 · 版图', 'fab'],
  ['制造', '光刻 · 刻蚀', 'fab'],
  ['器件', '逻辑 · 功率 · 光电', 'logic'],
  ['封装', '固晶 · 互连', 'package'],
  ['测试', '良率 · 可靠性', 'test'],
];
const icon = {
  materials: '◇', fab: '▦', logic: '◫', power: 'ϟ', optics: '◎',
  package: '▱', test: '◈', routes: '⇄', glossary: '☷',
};
let selectedGroup = '全部';
const escape = text => text.replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));

function card(topic) {
  return '<a class="topic-card" href="#chapter/' + topic.id + '"><span class="topic-icon" aria-hidden="true">' + icon[topic.id] + '</span><h3>' + topic.title + '</h3><p>' + topic.description + '</p><span class="topic-terms">' + topic.terms + '</span></a>';
}

function topicList() {
  return '<div class="filters" role="group" aria-label="按类别筛选">' + ['全部', ...groups].map(group =>
    '<button type="button" data-group="' + group + '" aria-pressed="' + (group === selectedGroup) + '">' + group + '</button>').join('') +
    '</div><div class="topic-grid" id="topic-grid">' + topics.filter(t => selectedGroup === '全部' || t.group === selectedGroup).map(card).join('') + '</div>';
}

function home() {
  return '<div class="wrap home">' +
    '<section class="hero"><div class="hero-copy"><p class="eyebrow"><span></span> 半导体全链条图谱</p><h1>半导体<br>技术知识库</h1>' +
    '<p class="hero-description">从材料和器件原理，到晶圆制造、先进封装和量产测试。按工序查技术，按场景比路线。</p>' +
    '<div class="hero-actions"><a class="primary" href="#topics">浏览全部专题</a><a class="secondary" href="#chapter/routes">查看路线对照</a></div></div>' +
    '<div class="hero-visual" aria-hidden="true"><canvas id="wafer" width="850" height="640"></canvas><span class="visual-label top-label">WAFER STRUCTURE</span><span class="visual-label bottom-label">SILICON WAFER / DIE ARRAY</span><span class="corner tl"></span><span class="corner br"></span></div></section>' +
    '<section class="chain-section"><div class="section-heading"><h2>从材料到量产</h2><a href="#chapter/overview">查看全链条地图</a></div><div class="chain">' +
    chains.map(([title, detail, id]) => '<a href="#chapter/' + id + '"><span class="chain-node" aria-hidden="true"></span><strong>' + title + '</strong><small>' + detail + '</small></a>').join('') +
    '</div></section><section class="topics-section"><div class="section-heading"><h2>技术专题</h2><span>' + topics.length + ' 个专题</span></div>' + topicList() + '</section></div>';
}

function topicPage() {
  return '<div class="wrap catalog"><div class="crumb"><a href="#home">总览</a><span> / 全部专题</span></div><h1>全部专题</h1><p>按技术环节筛选，或搜索正文中的具体术语。</p>' + topicList() + '</div>';
}

function chapterPage(chapter) {
  const prev = chapters[chapters.indexOf(chapter) - 1];
  const next = chapters[chapters.indexOf(chapter) + 1];
  return '<div class="wrap reading">' +
    '<aside class="sidebar"><details open><summary>专题导航</summary><nav aria-label="专题导航">' +
    chapters.map(entry => '<a href="#chapter/' + entry.id + '"' + (entry === chapter ? ' aria-current="page"' : '') + '>' + entry.title + '</a>').join('') +
    '</nav></details></aside><article class="article"><header class="article-head"><div class="crumb"><a href="#topics">全部专题</a><span> / ' + chapter.group + '</span></div><h1>' + chapter.title + '</h1><p>' + chapter.description + '</p></header>' +
    '<details class="mobile-toc"><summary>本篇目录</summary>' + toc(chapter) + '</details>' +
    '<div class="article-body">' + chapter.html + '</div><nav class="article-pager" aria-label="相邻专题">' +
    (prev ? '<a href="#chapter/' + prev.id + '"><small>上一篇</small>' + prev.title + '</a>' : '') +
    (next ? '<a href="#chapter/' + next.id + '"><small>下一篇</small>' + next.title + '</a>' : '') + '</nav></article>' +
    '<aside class="toc"><h2>本篇目录</h2>' + toc(chapter) + '</aside></div>';
}

function toc(chapter) {
  return '<nav aria-label="本篇目录">' + chapter.sections.map(section => '<a class="level-' + section.level + '" href="#chapter/' + chapter.id + '/' + section.anchor + '">' + escape(section.title) + '</a>').join('') + '</nav>';
}

let renderedPage;
function render() {
  const [route, id, anchor] = (location.hash.slice(1) || 'home').split('/');
  if (route === 'main-content') return;
  const chapter = route === 'chapter' && byId.get(id);
  const current = chapter ? chapter.id : route === 'topics' ? 'topics' : 'home';
  if (renderedPage !== current) {
    renderedPage = current;
    main.innerHTML = chapter ? chapterPage(chapter) : current === 'topics' ? topicPage() : home();
    document.title = chapter ? chapter.title + ' | 半导体技术知识库' : (current === 'topics' ? '全部专题 | ' : '') + '半导体技术知识库';
    document.querySelectorAll('[data-tab]').forEach(link => {
      if (link.dataset.tab === (chapter && chapter.id !== 'routes' ? 'topics' : current)) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (current === 'home') drawWafer();
  }
  const section = anchor && document.getElementById(anchor);
  if (section) section.scrollIntoView();
  else if (!anchor) window.scrollTo(0, 0);
  main.querySelectorAll('.toc a, .mobile-toc a').forEach(link => {
    if (link.hash === location.hash) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

function drawWafer() {
  const canvas = document.querySelector('#wafer');
  const ctx = canvas.getContext('2d');
  const x = 475, y = 315, radius = 283, flatten = 0.56;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.20);
  ctx.scale(1, flatten);
  for (let layer = 30; layer >= 0; layer -= 2) {
    ctx.beginPath();
    ctx.arc(layer * -0.24, layer, radius, 0, 2 * Math.PI);
    ctx.fillStyle = layer ? (layer % 4 ? '#203d67' : '#345f8b') : '#10253f';
    ctx.fill();
  }
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, radius - 8, 0, 2 * Math.PI);
  ctx.clip();
  const base = ctx.createLinearGradient(-radius, -radius, radius, radius);
  base.addColorStop(0, '#315b90');
  base.addColorStop(0.42, '#0f2847');
  base.addColorStop(0.72, '#214978');
  base.addColorStop(1, '#07172e');
  ctx.fillStyle = base;
  ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
  const size = 35;
  for (let row = -9; row <= 8; row++) {
    for (let col = -9; col <= 8; col++) {
      const left = col * size, top = row * size;
      const shine = (Math.sin(row * 1.83 + col * 1.1) + 1) / 2;
      ctx.fillStyle = 'rgba(110,170,224,' + (0.03 + 0.20 * shine) + ')';
      ctx.fillRect(left + 1, top + 1, size - 2, size - 2);
      ctx.strokeStyle = 'rgba(148,194,230,0.38)';
      ctx.lineWidth = 0.85;
      ctx.strokeRect(left + 0.4, top + 0.4, size, size);
      ctx.strokeStyle = 'rgba(147,206,242,' + (0.10 + 0.24 * shine) + ')';
      ctx.strokeRect(left + 5, top + 5, size - 10, size - 10);
      for (let trace = 0; trace < 3; trace++) {
        const offset = 8 + trace * 5;
        ctx.beginPath();
        ctx.moveTo(left + offset, top + 9);
        ctx.lineTo(left + offset, top + 24 - trace);
        ctx.lineTo(left + 24, top + 24 - trace);
        ctx.stroke();
      }
    }
  }
  ctx.restore();
  ctx.strokeStyle = '#6f9ac8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, radius - 2, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(121,177,232,0.45)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, 0, radius + 15, 0.13, 2.7);
  ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = 'rgba(145,181,211,0.45)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(103, 490); ctx.lineTo(166, 490); ctx.lineTo(221, 430);
  ctx.moveTo(650, 218); ctx.lineTo(710, 155); ctx.lineTo(797, 155);
  ctx.stroke();
  ctx.fillStyle = '#9dc9ec';
  for (const [a, b] of [[221, 430], [650, 218]]) {
    ctx.beginPath(); ctx.arc(a, b, 3, 0, 2 * Math.PI); ctx.fill();
  }
}

function updateSearch() {
  const query = input.value.trim().toLowerCase();
  if (!query) {
    results.innerHTML = '<p class="search-caption">常查术语</p><div class="suggestions">' +
      ['SiC', 'GAA', '固晶', 'Chiplet', 'Mini LED', '可靠性'].map(term => '<button type="button" data-term="' + term + '">' + term + '</button>').join('') + '</div>';
    return;
  }
  const matches = [];
  for (const chapter of chapters) {
    const chapterText = (chapter.title + ' ' + chapter.description + ' ' + chapter.terms).toLowerCase();
    if (chapterText.includes(query)) matches.push({chapter, title: chapter.title, anchor: '', snippet: chapter.description, rank: chapter.title.toLowerCase().includes(query) ? 4 : 3});
    for (const section of chapter.searchable) {
      const index = section.content.toLowerCase().indexOf(query);
      const headingMatch = section.title.toLowerCase().includes(query);
      if (index < 0 && !headingMatch) continue;
      const snippet = index < 0 ? section.content.trim().slice(0, 86) : (index > 28 ? '…' : '') + section.content.slice(Math.max(0, index - 28), index + query.length + 52).trim() + '…';
      matches.push({chapter, title: section.title || chapter.title, anchor: section.anchor, snippet, rank: headingMatch ? 3 : 1});
    }
  }
  matches.sort((a, b) => b.rank - a.rank);
  const visible = matches.filter((entry, i) => matches.findIndex(other => other.chapter === entry.chapter && other.anchor === entry.anchor) === i).slice(0, 14);
  results.innerHTML = visible.length ? visible.map(({ chapter, title, anchor, snippet }) =>
    '<a class="search-result" href="#chapter/' + chapter.id + (anchor ? '/' + anchor : '') + '"><small>' + chapter.title + '</small><strong>' + escape(title) + '</strong><span>' + escape(snippet) + '</span></a>').join('') :
    '<p class="search-caption">未找到匹配项。试试较短的关键词或英文缩写。</p>';
}

function openSearch() {
  if (!dialog.open) dialog.showModal();
  updateSearch();
  input.focus();
}
document.querySelector('.search-trigger').addEventListener('click', openSearch);
document.querySelector('.close-search').addEventListener('click', () => dialog.close());
input.addEventListener('input', updateSearch);
results.addEventListener('click', event => {
  const suggestion = event.target.closest('[data-term]');
  if (suggestion) { input.value = suggestion.dataset.term; updateSearch(); input.focus(); }
  if (event.target.closest('a')) dialog.close();
});
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.addEventListener('keydown', event => {
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input, textarea, [contenteditable]')) {
    event.preventDefault();
    openSearch();
  }
  if (event.key === 'Enter' && event.target === input) results.querySelector('a')?.click();
});
main.addEventListener('click', event => {
  const filter = event.target.closest('[data-group]');
  if (!filter) return;
  selectedGroup = filter.dataset.group;
  main.querySelectorAll('[data-group]').forEach(button => button.setAttribute('aria-pressed', String(button === filter)));
  document.querySelector('#topic-grid').innerHTML = topics.filter(t => selectedGroup === '全部' || t.group === selectedGroup).map(card).join('');
});
window.addEventListener('hashchange', render);
render();
