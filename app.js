'use strict';

const equipmentRows = [
  ["m8-pd","M8-PD","PD 探针测试一体设备","光通信","光电测试","对 Ge/Si PIN 等光探测器执行晶圆级光学与电性测试，供后续筛选和分档。",10],
  ["ppb-f300","PPB-F300","全自动巴条排列设备（双工位）","光通信","巴条前后处理","端面镀膜前，把 LD Bar 与陪条交错排入镀膜夹具，为镀膜备料。",11],
  ["ust-b200","UST-B200","全自动拆巴设备","光通信","巴条前后处理","端面镀膜后，从夹具中取出巴条和陪条并分开收料，接入后续巴条工序。",12],
  ["aoi-ld410","AOI-LD410","全自动巴条四面外观检测设备","光通信","AOI 外观检测","在 LD Bar 工序检测巴条四面外观缺陷，为后续加工筛选来料。",13],
  ["dt01","DT01","激光器芯片测试机","光通信","光电测试","在激光器裸片阶段测试光电参数，支持芯片性能筛选。",14],
  ["aoi-ld420","AOI-LD420 / AOI-LD430 / AOI-LD440","全自动芯片四面外观检测设备","光通信","AOI 外观检测","在单颗激光器芯片阶段检查四面外观，为晶粒筛选提供缺陷结果。",15],
  ["ts-f200","TS-F200","平移式翻转分选设备","光通信","分选与排片","在裸片转盘和备料阶段做平移、翻转和摆盘，使晶粒的方向和载具匹配后续工位。",16],
  ["pdb-10","PDB-10","高精度固晶设备","光通信","固晶与倒装","面向光通信 COB、BOX 等产品的固晶工序，执行取晶、视觉对位和多芯片贴装。",17],
  ["oma-1000","OMA-1000","光模块自动组装线","光通信","模组组装","用于高速光模块整机组装阶段，按工艺配置自动或半自动组装工位。",18],
  ["ms-wtw","MS-WTW-2S / MS-WTW-6S","晶圆检测分选设备","IC 封测","分选与排片","将单颗晶粒从蓝膜转移到另一张蓝膜，分选过程中集成 AOI 检查。",19],
  ["ms-wtw-hr","MS-WTW-HR","高精度晶圆检测分选设备","IC 封测","分选与排片","将晶圆上的晶粒高精度重排至蓝膜，适用于后续工序要求规整阵列的备料环节。",20],
  ["ms-wtp","MS-WTP","晶圆排片板级设备","IC 封测","分选与排片","将单颗晶粒从蓝膜排至粘性基板，接入以板为载体的后续工序。",21],
  ["wtr","WTR","晶粒检测分选编带设备","IC 封测","检测与编带","输入为蓝膜上的未塑封裸片，完成六面外观检测、分选与编带。",22],
  ["da6008","DA6008 / DA6008+","软焊料固晶设备","IC 封测","固晶与倒装","以软焊料将功率裸片接合到框架，适用于 TO-220、TO-247、DPAK 等功率器件固晶。",23],
  ["mdb20","MDB20 · MDB20std / MDB20max / NXB1600","多芯片固晶设备","IC 封测","固晶与倒装","面向 CIS、MEMS、存储芯片、功率器件和光器件等产品的多芯片贴装，倒装按机型配置。",24],
  ["mdb-fc300","MDB-FC300","高精度多芯片倒装贴片设备","IC 封测","固晶与倒装","用于多裸片视觉对位和倒装贴装，可对应 FC-BGA、FOWLP、FOPLP 等路线中的贴装工位。",25],
  ["ptr","PTR","板级编带分选设备","IC 封测","检测与编带","对板级封装的 IC 器件做六面外观检测、分选和编带。与 WTR 的主要区别是前端来料为板级封装品。",26],
  ["m6","M6","LED 探针测试一体设备","显示半导体","光电测试","对 LED 晶粒执行光学、电性测试，为后续分档和晶粒分选提供数据。",27],
  ["ms3300","MS3300","全自动 LED 芯片高速分选设备","显示半导体","分选与排片","依据晶圆图或分档信息执行 LED 晶粒高速重排、分选，供后续固晶。",28],
  ["mlb100","MLB100","全自动 Mini LED 固晶设备","显示半导体","固晶与倒装","对应 Mini LED 直显产品的 COB、MIP、COG 等固晶工位，按目标阵列逐颗贴装。",29],
  ["mlu45","MLU45","全自动 Mini LED 固晶设备","显示半导体","固晶与倒装","对应 Mini LED 背光（Mini BLU）固晶，面向大尺寸和超大尺寸背光基板贴装。",30]
];

const equipmentColumns = ['设备与型号', '对应工序', '设备在这一站做什么'];
const equipmentStages = [...new Set(equipmentRows.map(row => row[4]))];
const equipmentIndustries = [...new Set(equipmentRows.map(row => row[3]))];
const equipmentSections = [
  { title: '按工序找设备', anchor: 'equipment-map', level: 2 },
  ...equipmentIndustries.map((title, index) => ({ title, anchor: 'equipment-line-' + index, level: 2 })),
];

function equipmentRow([id, model, name, , stage, role, page]) {
  return '<tr id="' + id + '"><td><strong>' + name + '</strong><br>' + model +
    '<br><small>产品册 PDF 第 ' + page + ' 页</small></td><td>' + stage + '</td><td>' + role + '</td></tr>';
}

function equipmentTable(rows) {
  return '<div class="table-scroll" role="region" aria-label="设备与工序对照" tabindex="0"><table><thead><tr>' +
    equipmentColumns.map(label => '<th scope="col">' + label + '</th>').join('') +
    '</tr></thead><tbody>' + rows.map(equipmentRow).join('') + '</tbody></table></div>';
}

function equipmentDirectory() {
  const flows = [
    'LD 巴条可按「排巴 → 端面镀膜 → 拆巴」理解，巴条级和裸片级各有外观检测点。PD 晶圆测试和高速光模块整机组装是另外两个站点。',
    '按来料和出料区分路线。蓝膜来料可重排至另一张蓝膜、排到粘性基板，或经检测后编带。固晶、倒装和板级封装品编带对应不同站点。',
    '可按「LED 晶粒测试 → 晶圆图分选 → Mini LED 固晶」理解。固晶设备按直显与背光产品分线。',
  ];
  return '<h2 id="equipment-map">按工序找设备</h2>' +
    '<p>先选客户的工序，再对照来料形态、设备动作和后续去向。产品册列出的设备主要分布在晶圆或晶粒测试、裸片备料、封装贴装和模组组装。</p>' +
    '<div class="filters" role="group" aria-label="按工序筛选设备">' +
    ['全部工序', ...equipmentStages].map((stage, i) => '<button type="button" data-equipment-stage="' + i + '" aria-pressed="' + (i === 0) + '">' + stage + '</button>').join('') +
    '</div><p id="equipment-count" aria-live="polite">共 ' + equipmentRows.length + ' 个设备条目</p>' +
    equipmentIndustries.map((industry, i) => '<section data-equipment-industry="' + i + '"><h2 id="equipment-line-' + i + '">' + industry +
      '</h2><p>' + flows[i] + '</p>' + equipmentTable(equipmentRows.filter(row => row[3] === industry)) + '</section>').join('') +
    '<p>来源为智立方《半导体专业解决方案提供商》产品册。页码按 PDF 阅读器显示的顺序标注。设备选型需按来料、载具、节拍和项目配置核对。</p>';
}

const equipmentChapter = {
  id: 'equipment',
  title: '智立方设备与工序',
  group: '装备与应用',
  description: '按光通信、IC 封测和显示半导体查看智立方设备，并按测试、检测、分选、固晶、组装及编带工序筛选。',
  terms: '光通信 · IC 封测 · Mini LED',
  html: equipmentDirectory(),
  sections: equipmentSections,
  searchable: equipmentRows.map(([id, model, name, industry, stage, role]) => ({
    title: model + '｜' + name, anchor: id, content: [model, name, industry, stage, role].join(' '),
  })),
};
const chapters = [...window.atlasChapters, equipmentChapter];

function relatedEquipment(id) {
  const links = {
    overview: ['', '按工序查智立方设备'],
    optics: ['/equipment-line-0', '查看光通信设备和显示半导体设备'],
    package: ['/equipment-line-1', '查看 IC 封测、固晶和倒装设备'],
    test: ['/equipment-map', '查看光电测试、AOI、分选和编带设备'],
    routes: ['/equipment-line-2', '查看 Mini LED 固晶线及其他工序设备'],
  };
  const link = links[id];
  return link ? '<p><a href="#chapter/equipment' + link[0] + '">' + link[1] + '</a></p>' : '';
}

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
  package: '▱', test: '◈', routes: '⇄', glossary: '☷', equipment: '▦',
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
    '<div class="hero-actions"><a class="primary" href="#topics">浏览全部专题</a><a class="secondary" href="#chapter/routes">查看路线对照</a><a class="secondary" href="#chapter/equipment">智立方设备</a></div></div>' +
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
    '<div class="article-body">' + relatedEquipment(chapter.id) + chapter.html + '</div><nav class="article-pager" aria-label="相邻专题">' +
    (prev ? '<a href="#chapter/' + prev.id + '"><small>上一篇</small>' + prev.title + '</a>' : '') +
    (next ? '<a href="#chapter/' + next.id + '"><small>下一篇</small>' + next.title + '</a>' : '') + '</nav></article>' +
    '<aside class="toc"><h2>本篇目录</h2>' + toc(chapter) + '</aside></div>';
}

function toc(chapter) {
  return '<nav aria-label="本篇目录">' + chapter.sections.map(section => '<a class="level-' + section.level + '" href="#chapter/' + chapter.id + '/' + section.anchor + '">' + escape(section.title) + '</a>').join('') + '</nav>';
}

let renderedPage;
function visibleEquipmentAnchor(anchor) {
  const target = document.getElementById(anchor);
  return target && !target.closest('[hidden]');
}

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
      const tab = chapter && !['routes', 'equipment'].includes(chapter.id) ? 'topics' : current;
      if (link.dataset.tab === tab) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (current === 'home') drawWafer();
  }
  if (current === 'equipment' && anchor && !visibleEquipmentAnchor(anchor)) {
    main.querySelector('[data-equipment-stage="0"]').click();
  }
  const section = anchor && document.getElementById(anchor);
  if (section) {
    main.querySelector('[data-focused-equipment]')?.removeAttribute('data-focused-equipment');
    if (current === 'equipment' && section.tagName === 'TR') section.setAttribute('data-focused-equipment', '');
    section.scrollIntoView();
  }
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
  const stageButton = event.target.closest('[data-equipment-stage]');
  if (stageButton) {
    const selection = Number(stageButton.dataset.equipmentStage);
    const stage = equipmentStages[selection - 1];
    let count = 0;
    main.querySelectorAll('[data-equipment-stage]').forEach(button => {
      button.setAttribute('aria-pressed', String(button === stageButton));
    });
    main.querySelectorAll('[data-equipment-industry]').forEach(section => {
      const industry = equipmentIndustries[Number(section.dataset.equipmentIndustry)];
      const rows = equipmentRows.filter(row => row[3] === industry && (!stage || row[4] === stage));
      count += rows.length;
      section.hidden = rows.length === 0;
      section.querySelector('tbody').innerHTML = rows.map(equipmentRow).join('');
    });
    document.querySelector('#equipment-count').textContent = '共 ' + count + ' 个设备条目';
    return;
  }
  const filter = event.target.closest('[data-group]');
  if (!filter) return;
  selectedGroup = filter.dataset.group;
  main.querySelectorAll('[data-group]').forEach(button => button.setAttribute('aria-pressed', String(button === filter)));
  document.querySelector('#topic-grid').innerHTML = topics.filter(t => selectedGroup === '全部' || t.group === selectedGroup).map(card).join('');
});
const equipmentTab = document.createElement('a');
equipmentTab.href = '#chapter/equipment';
equipmentTab.dataset.tab = 'equipment';
equipmentTab.textContent = '智立方设备';
document.querySelector('.top-inner nav').append(equipmentTab);
const equipmentStyle = document.createElement('style');
equipmentStyle.textContent = 'tr[id]{scroll-margin-top:24px}tr[data-focused-equipment]{outline:2px solid #2b6493;outline-offset:-2px}@media(max-width:510px){.top-inner nav{gap:12px}.top-inner nav a{font-size:.85rem}}';
document.head.append(equipmentStyle);
window.addEventListener('hashchange', render);
render();
