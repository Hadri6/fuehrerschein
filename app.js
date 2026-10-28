(() => {
  'use strict';
  const T = window.THEORIE;
  const $ = (selector, root = document) => root.querySelector(selector);
  const main = $('#main');
  const KEY = 'theorie-b:v1';
  const paths = {
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    book: '<path d="M12 5C9 3 5 3 2 4v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-3-1-7-1-10 1Zm0 0v15"/>',
    road: '<path d="m7 3-4 18m14-18 4 18M12 3v3m0 4v4m0 4v3M4 12h16"/>',
    numbers: '<path d="M5 5h3v6M4 11h6m4-6h5v3l-5 4h5M5 16h4v2H5v3h4m6-6v3h5m-2-3v6"/>',
    quiz: '<rect x="4" y="4" width="16" height="17" rx="3"/><path d="M9 4V2h6v2M8 11l2 2 5-5m-7 9h8"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    moon: '<path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
    auto: '<rect x="3" y="3" width="18" height="15" rx="2"/><path d="M12 18v4m-4 0h8m-4-19v15"/>',
    arrow: '<path d="M20 12H4m6-6-6 6 6 6"/>',
    back: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    signs: '<path d="M12 3 2 20h20Z"/><path d="M12 9v5m0 3v.1"/>',
    vocab: '<path d="M3 5h12M9 2v3m-4 0c0 6 3 9 7 11M13 5c0 6-4 10-10 12m11 4 4-11 4 11m-7-3h6"/>',
    plan: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 2v6m10-6v6M3 10h18m-13 5 3 3 5-5"/>',
    golden: '<path d="m12 2 3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
    mistakes: '<path d="M20 7v5h-5M4 17v-5h5m10-6a8 8 0 0 0-14 3m0 9a8 8 0 0 0 14-3"/>',
    flame: '<path d="M12 2c2 5-4 6-1 10 1-2 3-3 4-5 1 4 5 6 4 10a7 7 0 0 1-14-1c0-5 4-6 7-14Z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    flag: '<path d="M5 22V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0"/>',
    print: '<path d="M6 8V2h12v6M6 17H3V8h18v9h-3M6 14h12v8H6Zm11-3h1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>'
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
  const h = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const de = (value) => `<span lang="de" dir="ltr">${h(value)}</span>`;
  const blockDE = (value, cls = '') => `<div class="de ${cls}" lang="de" dir="ltr">${h(value)}</div>`;
  // Isolate Latin fragments, formulae and units even inside Arabic explanations.
  const ar = (value) => String(value ?? '').split(/([A-Za-zÄÖÜäöüß0-9][A-Za-zÄÖÜäöüß0-9 .,;:()×²/≥≤+<>→–−%‰=\-]*)/g).map((part, i) => i % 2 ? de(part.trim()) + (part.endsWith(' ') ? ' ' : '') : h(part)).join('');
  const n = value => new Intl.NumberFormat('ar', { maximumFractionDigits: 2 }).format(value);
  const latin = value => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(value);
  const localDay = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const pageNames = { home: 'الرئيسية', exam: 'كيف يعمل الامتحان', stems: 'أنماط رأس السؤال', patterns: 'أنماط الإجابات', vorfahrt: 'الأولوية والترتيب', numbers: 'الأرقام والحاسبة', signs: 'الإشارات', vocab: 'قاموس الامتحان', practice: 'تدرّبي', mistakes: 'أخطائي', plan: 'خطة اليومين', golden: 'الورقة الذهبية' };
  let storageOK = true;
  let raw = {};
  try { raw = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { storageOK = false; }
  const obj = x => x && typeof x === 'object' && !Array.isArray(x) ? x : {};
  const arr = x => Array.isArray(x) ? [...new Set(x.filter(y => typeof y === 'string'))] : [];
  const state = {
    reviewed: Object.fromEntries(Object.entries(obj(raw.reviewed)).map(([key, value]) => [key, arr(value)])),
    known: arr(raw.known), plan: arr(raw.plan), days: arr(raw.days).filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x)),
    mastery: obj(raw.mastery), mistakes: obj(raw.mistakes),
    attempts: Math.max(0, Number(raw.attempts) || 0), correct: Math.max(0, Number(raw.correct) || 0),
    theme: ['auto', 'light', 'dark'].includes(raw.theme) ? raw.theme : 'auto'
  };
  // Stored mistakes can be incomplete or from an older version; ignore invalid entries.
  for (const [key, mistake] of Object.entries(state.mistakes)) {
    if (!mistake || !['quiz', 'number', 'sign'].includes(mistake.kind) || typeof mistake.id !== 'string' || !validItem(mistake)) delete state.mistakes[key];
  }
  let currentPage = 'home';
  let session = null;
  let patternFilter = 'all';
  let numberFilter = 'all';
  let vocabGroup = 'all';
  let flash = null;
  let searchTimer;
  let toastTimer;
  let searchHits = [];
  let pendingHighlight = null;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); storageOK = true; }
    catch { storageOK = false; }
    $('#save-status').textContent = storageOK ? 'يُحفظ تقدمك على هذا الجهاز' : 'الحفظ غير متاح؛ تقدم هذه الجلسة يبقى حتى إغلاقها';
  }
  function activity() {
    const today = localDay();
    if (!state.days.includes(today)) state.days.push(today);
    state.days = state.days.sort().slice(-400);
  }
  function streak() {
    const day = new Date();
    if (!state.days.includes(localDay(day))) day.setDate(day.getDate() - 1);
    let count = 0;
    while (state.days.includes(localDay(day))) { count++; day.setDate(day.getDate() - 1); }
    return count;
  }
  function toast(text) {
    clearTimeout(toastTimer);
    const el = $('#toast'); el.textContent = text; el.classList.add('show');
    toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
  }
  function reviewed(section, id) { return (state.reviewed[section] || []).includes(id); }
  function addReview(section, id) {
    if (!reviewed(section, id)) { (state.reviewed[section] ||= []).push(id); activity(); save(); }
  }
  function mark(section, id, label = 'تمت المراجعة') {
    const done = reviewed(section, id);
    return `<button class="mark-button ${done ? 'is-done' : ''}" data-action="review" data-section="${h(section)}" data-id="${h(id)}" aria-pressed="${done}">${icon('check')}<span>${done ? label : 'حدّدي كمُراجَعة'}</span></button>`;
  }
  function progress(section) {
    const source = { patterns: [...T.patterns, ...T.stems], numbers: T.numbers, signs: T.signs };
    if (section === 'vocab') return [T.vocab.filter((_, i) => state.known.includes(String(i))).length, T.vocab.length];
    if (section === 'practice') return [T.quiz.filter(q => state.mastery[q.id] === true).length, T.quiz.length];
    if (section === 'vorfahrt') return [['rules', ...T.vorfahrt.scenarios.map(x => x.id)].filter(id => reviewed(section, id)).length, 4];
    return [source[section].filter(x => reviewed(section, x.id || x.nr)).length, source[section].length];
  }
  const bar = (value, total, label = 'التقدم') => `<div class="progress-bar" role="progressbar" aria-label="${h(label)}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="${total}"><span style="width:${total ? value / total * 100 : 0}%"></span></div>`;
  const heading = (title, subtitle, eyebrow = 'مساحة للفهم والمراجعة', action = '') => `<div class="page-heading"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1>${subtitle ? `<p>${subtitle}</p>` : ''}</div>${action}</div>`;
  const link = (page, label, cls = 'btn', ico = 'arrow') => `<a class="${cls}" href="#${page}">${label}${ico ? icon(ico) : ''}</a>`;
  const back = page => `<a class="back-link" href="#${page}">${icon('back')}${pageNames[page]}</a>`;
  function renderNav() {
    const items = [['home', 'الرئيسية', 'home'], ['patterns', 'الأنماط', 'book'], ['vorfahrt', 'الأولوية', 'road'], ['numbers', 'الأرقام', 'numbers'], ['practice', 'تدرّبي', 'quiz']];
    const primary = { stems: 'patterns', mistakes: 'practice' }[currentPage] || currentPage;
    $('#bottom-nav').innerHTML = items.map(([page, label, ico]) => `<a href="#${page}" class="nav-item ${primary === page ? 'active' : ''}" ${currentPage === page ? 'aria-current="page"' : ''}>${icon(ico)}<span>${label}</span></a>`).join('') + `<button class="nav-item ${items.some(x => x[0] === primary) ? '' : 'active'}" data-action="more" aria-haspopup="dialog" aria-controls="more-dialog">${icon('more')}<span>المزيد</span></button>`;
  }
  function theme() {
    if (state.theme === 'auto') delete document.body.dataset.theme; else document.body.dataset.theme = state.theme;
    const labels = { auto: 'تلقائي', light: 'فاتح', dark: 'داكن' };
    $('#theme-toggle').innerHTML = icon({ auto: 'auto', light: 'sun', dark: 'moon' }[state.theme]);
    $('#theme-toggle').setAttribute('aria-label', `المظهر: ${labels[state.theme]}. اضغطي للتغيير`);
    $('#theme-toggle').title = `المظهر: ${labels[state.theme]}`;
    const dark = state.theme === 'dark' || state.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    $('meta[name="theme-color"]').content = dark ? '#101c1a' : '#087f74';
  }
  function home() {
    const modules = [
      ['patterns', 'book', 'S1–S7 · W1–W21', 'اقرئي ما بين الكلمات', 'أنماط السؤال والإجابة، مع استثناءاتها.'],
      ['vorfahrt', 'road', 'Vorfahrt', 'من يمر أولاً؟', 'خطوات واضحة وتقاطعات تفاعلية.'],
      ['numbers', 'numbers', 'Zahlen & Formeln', 'أرقام لها معنى', 'بطاقات مختصرة وحاسبة مسافة التوقف.'],
      ['signs', 'signs', 'Verkehrszeichen', 'تعرّفي إلى الإشارة', 'اقلبي البطاقة واكتشفي فخ السؤال.'],
      ['vocab', 'vocab', 'Prüfungswörter', 'الألمانية تصبح أوضح', 'قاموس وبطاقات للمراجعة السريعة.'],
      ['practice', 'quiz', 'Übung macht sicher', 'جرّبي ما فهمتِه', 'أسئلة متعددة الاختيارات ونقاط خطأ.']
    ];
    const parts = modules.map(x => progress(x[0]));
    const completed = parts.reduce((sum, x) => sum + x[0], 0), total = parts.reduce((sum, x) => sum + x[1], 0);
    const percent = Math.round(completed / total * 100);
    const nextPlan = T.plan.flatMap(x => x.items).find(x => !state.plan.includes(x.id));
    const nextPage = nextPlan?.page || 'golden';
    const accuracy = state.attempts ? Math.round(state.correct / state.attempts * 100) : 0;
    return `<div class="hero"><div class="hero-copy"><span class="eyebrow">خطة مركّزة · يومان لفهم الأساس</span><h1>خطوة أقرب<br>إلى الرخصة.</h1><p>قواعد واضحة، شرح عربي،<br>وتدريب بالألمانية.</p><div class="hero-actions">${link(nextPage, completed || state.plan.length ? 'واصلي رحلتك' : 'لنبدأ معاً')}${link('plan', 'خطة اليومين', 'btn ghost', '')}</div></div><div class="hero-progress"><div class="progress-ring" role="img" aria-label="تمت مراجعة ${percent} بالمئة من المحتوى"><svg viewBox="0 0 180 180" aria-hidden="true"><circle class="ring-track" cx="90" cy="90" r="76"/><circle class="ring-value" cx="90" cy="90" r="76" stroke-dasharray="477.52" stroke-dashoffset="${477.52 * (1 - percent / 100)}"/></svg><div class="ring-text"><strong>${percent}<small>%</small></strong><small>من رحلتك</small></div></div><p>${n(completed)} من ${n(total)}<br>عناصر راجعتِها</p></div></div>
      <div class="stats"><div class="stat"><div class="stat-icon">${icon('flame')}</div><div><strong>${n(streak())}</strong><small>أيام متتالية</small></div></div><div class="stat"><div class="stat-icon">${icon('target')}</div><div><strong>${state.attempts ? `${n(accuracy)}٪` : '—'}</strong><small>دقة كل محاولاتك</small></div></div><div class="stat"><div class="stat-icon">${icon('mistakes')}</div><div><strong>${n(Object.keys(state.mistakes).length)}</strong><small>أخطاء للمراجعة</small></div></div></div>
      <div class="section-heading"><h2>كل قاعدة، في مكانها</h2>${link('exam', 'عن الامتحان', '', 'arrow')}</div>
      <div class="module-grid">${modules.map(([page, ico, german, title, desc], i) => `<a href="#${page}" class="module-card"><div class="module-top"><span class="module-icon">${icon(ico)}</span>${de(german)}</div><div><h3>${title}</h3><p>${desc}</p></div><div class="module-foot"><span>${n(parts[i][0])} / ${n(parts[i][1])} ${page === 'practice' ? 'صحيحة في آخر محاولة' : 'مُراجَعة'}</span>${icon('arrow')}</div>${bar(...parts[i], title)}</a>`).join('')}</div>
      <div class="home-plan"><div><span class="eyebrow">خُذيها خطوة بخطوة</span><h3>${nextPlan ? ar(nextPlan.title) : 'اكتملت خطوات خطتك'}</h3><p>${n(state.plan.filter(id => T.plan.flatMap(d => d.items).some(x => x.id === id)).length)} من ${n(T.plan.flatMap(d => d.items).length)} خطوة في خطة اليومين</p></div>${link('plan', 'افتحي خطتك', 'btn secondary', 'plan')}</div>
      <div class="section-heading"><h2>قبل أن تتدرّبي</h2></div><div class="two-col"><div class="note"><strong>${de('1, 2 oder 3 richtige Antworten')}</strong>قد تكون الخيارات الثلاثة صحيحة. احكمي على كل خيار بمفرده.</div><div class="note"><strong>للمراجعة الأخيرة</strong>١٢ قاعدة في الورقة الذهبية.${link('golden', 'افتحي الورقة', 'back-link', 'golden')}</div></div>`;
  }
  function exam() {
    return heading('كيف يعمل الامتحان؟', 'اعرفي طريقة التقييم قبل حفظ أي قاعدة.', 'البداية الصحيحة') + `<div class="content-grid">${T.exam.rules.map((r, i) => `<article class="card"><div class="card-title"><span class="step-number">${i + 1}</span></div>${blockDE(r.de, 'stem-de')}<p class="pattern-body">${ar(r.ar)}</p></article>`).join('')}</div><div class="section-heading"><h2>اختيار اللغة والتدريب</h2></div><div class="note">${ar(T.exam.languageTip)}</div><div class="note warning">${ar(T.exam.simulatorNote)}</div><div class="read-action">${link('stems', 'تعرّفي إلى رأس السؤال', 'btn', 'book')}</div>`;
  }
  function stems() {
    return back('patterns') + heading('رأس السؤال هو البداية', 'تعرّفي إلى نوع المطلوب قبل قراءة الخيارات.', de('S1–S7')) + `<div class="content-grid">${T.stems.map(s => `<article class="card" id="item-${s.id}"><div class="card-title"><span class="tag" lang="de" dir="ltr">${s.id}</span><span class="reliability">${s.reliability}</span></div>${s.de.map(x => blockDE(x, 'stem-de')).join('')}<h3>${ar(s.ar)}</h3><p class="muted small">${ar(s.note)}</p>${mark('patterns', s.id)}</article>`).join('')}</div>`;
  }
  function patterns() {
    const verdicts = { yes: '✔ غالباً صحيح', no: '✘ غالباً خطأ', depends: '⚖ حسب القاعدة' };
    const list = T.patterns.filter(p => patternFilter === 'all' || p.verdict === patternFilter);
    return heading('تعرّفي إلى نمط الإجابة', 'الكلمات تعطي إشارة؛ القاعدة والاستثناء يحسمان الإجابة.', de('W1–W21'), link('stems', 'رأس السؤال S1–S7', 'btn secondary', 'book')) +
      `<article class="card nur-card" id="nur-highlight"><span class="nur-word" lang="de" dir="ltr">nur</span><h2>«فقط» ليست خطأ تلقائياً</h2><p>هل تلغي الحذر أو تمنح حقاً مطلقاً؟ غالباً خطأ. هل تؤكد منعاً أو شرط سلامة؟ قد تكون صحيحة.</p><p>${de('Nur Zeit baut Alkohol ab.')} <span class="good">✔</span></p></article><p class="muted small" style="margin-bottom:18px">الأنماط وسائل للفهم. اقرئي السياق والاستثناء قبل اختيار الإجابة.</p><div class="filters" aria-label="تصفية الأنماط">${[['all', 'كل الأنماط'], ['yes', '✔ غالباً صحيح'], ['no', '✘ غالباً خطأ'], ['depends', '⚖ حسب القاعدة']].map(([value, label]) => `<button class="filter ${patternFilter === value ? 'active' : ''}" aria-pressed="${patternFilter === value}" data-action="pattern-filter" data-value="${value}">${label}</button>`).join('')}</div>
      <div class="content-grid">${list.map(p => `<article class="card" id="item-${p.id}"><div class="card-title"><div><span class="tag" lang="de" dir="ltr">${p.id}</span><h2>${p.ar_title}</h2></div><div><span class="badge ${p.verdict}">${verdicts[p.verdict]}</span><div class="reliability">الموثوقية: ${p.reliability}</div></div></div><div class="pattern-words">${p.de.map(x => de(x)).join('')}</div><p class="pattern-body">${ar(p.ar_why)}</p>${p.exceptions.length ? `<div class="pattern-exceptions"><h3>انتبهي إلى الاستثناء</h3>${p.exceptions.map(e => `<div class="exception">${blockDE(e.de)}<p>${ar(e.ar)}</p></div>`).join('')}</div>` : '<p class="muted small">لا استثناء إضافياً مذكوراً في المواصفات لهذا النمط.</p>'}<div class="examples">${p.examples.map(e => `<div class="example"><span class="${e.correct ? 'good' : 'bad'}" aria-label="${e.correct ? 'صحيح' : 'خطأ'}">${e.correct ? '✔' : '✘'}</span><div>${blockDE(e.de)}<p>${ar(e.ar)}</p></div></div>`).join('')}</div>${mark('patterns', p.id)}</article>`).join('')}</div>`;
  }
  function vorfahrt() {
    return heading('من يمر أولاً؟', 'رتّبي المرجعيات، ثم افحصي اتجاه كل مركبة.', de('Vorfahrt & Vorrang')) + `<div class="hierarchy">${T.vorfahrt.hierarchy.map((x, i) => `<div><span class="step-number">${i + 1}</span>${de(x)}</div>`).join('')}</div><div class="two-col"><article class="card"><h2>القواعد التي تحتاجينها</h2>${T.vorfahrt.rules.map(r => `<div class="rule">${blockDE(r.de)}<p>${ar(r.ar)}</p></div>`).join('')}${mark('vorfahrt', 'rules')}</article><div class="stack"><article class="card solver"><span class="eyebrow">احتفظي بهذا الترتيب</span><h2>حلّي التقاطع في ٥ خطوات</h2>${T.vorfahrt.steps.map((x, i) => `<div class="solver-step"><span class="step-number">${i + 1}</span><div>${blockDE(x.de)}<p>${ar(x.ar)}</p></div></div>`).join('')}</article><div class="note warning">لا تفرضي الأولوية. إذا تجاهلها الآخر، تنازلي عنها عند الحاجة لتفادي الخطر.</div></div></div><div class="section-heading"><h2>تصوّري الموقف، ثم حلّيه</h2></div><p class="muted small">أعلى الرسم هو الشمال. السهم الصغير في مقدمة السيارة يبين اتجاه قدومها؛ المسار الأبيض يوضح مقصدها. الرسوم تعليمية مبسطة.</p><div class="scenario-grid">${T.vorfahrt.scenarios.map(s => `<article class="card scenario-card" id="item-${s.id}"><h3>${s.title}</h3><div class="crossing" role="img" aria-label="${h(s.cars.map(c => c.ar).join(' '))}">${s.svg}</div><div>${s.cars.map(c => `<div class="car-key">${blockDE(c.de)}<p>${c.ar}</p></div>`).join('')}</div><button class="btn secondary full" data-action="scenario" data-id="${s.id}" aria-expanded="false" aria-controls="answer-${s.id}">أظهري الترتيب${icon('arrow')}</button><div class="scenario-answer" id="answer-${s.id}" hidden><div class="order" lang="de" dir="ltr">${s.order.join(' → ')}</div><p>${ar(s.explain_ar)}</p></div></article>`).join('')}</div>`;
  }
  function calculator() {
    return `<section class="calculator" aria-labelledby="calc-title"><span class="eyebrow">احسبي وافهمي العلاقة</span><h2 id="calc-title">مسافة التوقف</h2><p class="muted small">صيغ تدريب تقريبية؛ السرعة ${de('v')} بالكيلومتر في الساعة.</p><div class="calc-input"><label for="calc-speed">السرعة</label><input id="calc-speed" type="number" min="0" max="300" step="1" value="50" inputmode="decimal" aria-describedby="calc-error"><span lang="de" dir="ltr">km/h</span></div><p id="calc-error" class="error-text" hidden>أدخلي سرعة بين ٠ و٣٠٠ للحساب.</p><div id="calc-results" class="calc-grid" aria-live="polite"></div><p class="muted small" style="margin-top:14px">مضاعفة السرعة: رد الفعل ×٢، والفرملة ×٤.</p></section>`;
  }
  function updateCalculator() {
    const input = $('#calc-speed'); if (!input) return;
    const speed = Number(input.value), valid = input.value.trim() !== '' && Number.isFinite(speed) && speed >= 0 && speed <= 300;
    $('#calc-error').hidden = valid;
    input.setAttribute('aria-invalid', String(!valid));
    if (!valid) { $('#calc-results').innerHTML = ''; return; }
    const reaction = speed / 10 * 3, braking = (speed / 10) ** 2, emergency = braking / 2;
    const rows = [
      ['رد الفعل', reaction, `(${latin(speed)} / 10) × 3 = ${latin(reaction)}`, false],
      ['الفرملة العادية', braking, `(${latin(speed)} / 10)² = ${latin(braking)}`, false],
      ['فرملة الطوارئ', emergency, `(${latin(speed)} / 10)² / 2 = ${latin(emergency)}`, false],
      ['التوقف العادي', reaction + braking, `${latin(reaction)} + ${latin(braking)} = ${latin(reaction + braking)}`, true],
      ['التوقف بفرملة الطوارئ', reaction + emergency, `${latin(reaction)} + ${latin(emergency)} = ${latin(reaction + emergency)}`, true]
    ];
    $('#calc-results').innerHTML = rows.map(([title, value, formula, total]) => `<div class="calc-result ${total ? 'total' : ''}"><p>${title}</p><strong lang="de" dir="ltr">${latin(value)} <small>m</small></strong>${blockDE(formula)}</div>`).join('');
  }
  function numbers() {
    const groups = [...new Set(T.numbers.map(x => x.group))];
    return heading('أرقام تتذكّرين معناها', 'ميّزي بين الحدّ، والتوصية، والصيغة التقريبية.', de('Zahlen & Formeln'), `<button class="btn secondary" data-action="start" data-mode="number">تدريب الأرقام${icon('quiz')}</button>`) + calculator() + `<div class="filters" aria-label="تصفية الأرقام">${['all', ...groups].map(g => `<button class="filter ${numberFilter === g ? 'active' : ''}" aria-pressed="${numberFilter === g}" data-action="number-filter" data-value="${h(g)}">${g === 'all' ? 'كل الأرقام' : g}</button>`).join('')}</div><div class="content-grid">${T.numbers.filter(x => numberFilter === 'all' || x.group === numberFilter).map(x => `<article class="card number-card" id="item-${x.id}"><span class="eyebrow">${x.group}</span>${blockDE(x.de)}<div class="number-value" lang="de" dir="ltr">${h(x.value)} <small>${h(x.unit)}</small></div><p>${ar(x.ar)}</p>${x.note ? `<p class="note-text">${ar(x.note)}</p>` : ''}${mark('numbers', x.id)}</article>`).join('')}</div>`;
  }
  function signs() {
    return heading('الإشارة، ثم المعنى', 'اضغطي على البطاقة لقلبها. فتح المعنى يُسجّل مراجعتها.', de('30 Verkehrszeichen'), `<button class="btn secondary" data-action="start" data-mode="sign">اختبار الإشارات${icon('quiz')}</button>`) + `<div class="sign-grid">${T.signs.map(s => `<button class="sign-card" data-action="sign-flip" data-id="${s.nr}" id="item-sign-${s.nr.replace('.', '-')}" aria-expanded="false" aria-controls="sign-back-${s.nr.replace('.', '-')}"><span class="sign-front"><span class="sign-number" lang="de" dir="ltr">${s.nr}</span><span class="sign-art" role="img" aria-label="${h(s.name_de)}">${s.svg}</span>${de(s.name_de)}<small>اضغطي لاكتشاف المعنى</small></span><span class="sign-back" id="sign-back-${s.nr.replace('.', '-')}" hidden><strong>${s.ar}</strong><span class="small muted">${ar(s.trap_ar)}</span></span></button>`).join('')}</div>`;
  }
  function vocab() {
    const groups = [...new Set(T.vocab.map(x => x.group))];
    if (flash) return flashView();
    const list = T.vocab.map((v, i) => ({ ...v, index: String(i) })).filter(v => vocabGroup === 'all' || v.group === vocabGroup);
    return heading('كل كلمة تُقرّب المعنى', 'اقرئي المصطلح بالألمانية، وافهمي ما يُطلب منك.', de(`${T.vocab.length} Prüfungswörter`)) + `<div class="list-toolbar"><label>المجموعة <select class="select" id="vocab-group">${['all', ...groups].map(g => `<option value="${h(g)}" ${vocabGroup === g ? 'selected' : ''}>${g === 'all' ? 'كل المفردات' : g}</option>`).join('')}</select></label><button class="btn secondary" data-action="flash-start">بطاقات المراجعة${icon('vocab')}</button></div><div class="vocab-list">${list.map(v => `<article class="vocab-row" id="item-vocab-${v.index}">${blockDE(v.de)}<div><p>${v.ar}</p><small>${ar(v.note)}</small></div><button class="known-button ${state.known.includes(v.index) ? 'known' : ''}" data-action="known" data-id="${v.index}" aria-pressed="${state.known.includes(v.index)}" aria-label="${h(`حفظت: ${v.de}`)}">${icon('check')}</button></article>`).join('')}</div>`;
  }
  function flashView() {
    const id = flash.ids[flash.index], v = T.vocab[Number(id)];
    return heading('وقت قصير، كلمة جديدة', 'حاولي تذكّر المعنى، ثم اقلبي البطاقة.', 'بطاقات المفردات', '<button class="btn secondary" data-action="flash-close">قائمة المفردات</button>') + `<div class="flash-area"><p class="flash-counter">${n(flash.index + 1)} / ${n(flash.ids.length)} · ${v.group}</p><button class="flash-card" data-action="flash-flip" aria-label="${flash.flipped ? 'إخفاء المعنى' : 'إظهار معنى المفردة'}" aria-expanded="${flash.flipped}">${de(v.de)}${flash.flipped ? `<span class="ar-answer">${v.ar}</span><p>${ar(v.note)}</p>` : '<p>اضغطي لإظهار المعنى</p>'}</button><div class="flash-controls"><button class="btn secondary" data-action="flash-prev">السابقة</button><button class="btn ${state.known.includes(id) ? 'secondary' : ''}" data-action="flash-known">${state.known.includes(id) ? 'محفوظة ✔' : 'حفظت هذه الكلمة'}</button><button class="btn secondary" data-action="flash-next">التالية${icon('arrow')}</button></div></div>`;
  }
  function practice() {
    if (session) return sessionView();
    const modes = [
      ['quiz', 'quiz', 'تدريب الأسئلة', '٥٠ سؤالاً بأسلوب الامتحان بالألمانية، مع تلميح وشرح بالعربية. اختاري كل الإجابات الصحيحة.', 'ابدئي التدريب'],
      ['mini', 'clock', 'محاكاة مصغّرة', '٢٠ سؤالاً عشوائياً، دون كشف الحل قبل التسليم. يمكنك التجاوز والتعليم والعودة.', 'ابدئي المحاكاة'],
      ['number', 'numbers', 'تدريب الأرقام', '١٥ سؤال إدخال رقمي لتثبيت الصيغ. تقبل الفاصلة العشرية الألمانية أيضاً.', 'احسبي بنفسك'],
      ['sign', 'signs', 'اختبار الإشارات', 'تعرّفي إلى ٣٠ لوحة من الرسم. اختاري المعنى الصحيح بين ثلاثة خيارات.', 'اختبري ذاكرتك']
    ];
    return heading('الفهم يصبح ثقة بالتدريب', 'اقرئي رأس السؤال، ثم افحصي كل خيار بمفرده.', 'مساحة التطبيق', link('mistakes', `أخطائي · ${n(Object.keys(state.mistakes).length)}`, 'btn secondary', 'mistakes')) + `<div class="practice-grid">${modes.map(([mode, ico, title, desc, cta]) => `<article class="card practice-card ${mode === 'quiz' ? 'featured' : ''}"><div class="module-icon">${icon(ico)}</div><h2>${title}</h2><p>${desc}</p><button class="btn ${mode === 'quiz' ? '' : 'secondary'}" data-action="start" data-mode="${mode}">${cta}${icon('arrow')}</button></article>`).join('')}</div><div class="section-heading"><h2>مهم قبل المحاكاة</h2></div><div class="note">${ar(T.exam.miniNote)}</div><div class="note warning">${ar(T.exam.simulatorNote)}</div>`;
  }
  const shuffled = items => { const copy = [...items]; for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; };
  function validItem(item) {
    if (item.kind === 'quiz') return T.quiz.some(q => q.id === item.id);
    if (item.kind === 'sign') return T.signs.some(q => q.nr === item.id);
    if (item.kind === 'number') return /^\d+$/.test(item.id) && Number(item.id) < T.numberDrill.length;
    return false;
  }
  function prepareItem(item) {
    const entry = { kind: item.kind, id: item.id };
    if (item.kind === 'sign') {
      const sign = T.signs.find(s => s.nr === item.id);
      entry.options = shuffled([{ de: sign.name_de, correct: true }, ...shuffled(T.signs.filter(s => s.nr !== item.id)).slice(0, 2).map(s => ({ de: s.name_de, correct: false }))]);
    }
    return entry;
  }
  function start(mode, single = '') {
    let items;
    if (mode === 'mistakes') items = Object.values(state.mistakes).filter(validItem).map(prepareItem);
    else if (mode === 'number') items = T.numberDrill.map((_, i) => ({ kind: 'number', id: String(i) }));
    else if (mode === 'sign') items = shuffled(T.signs.map(s => prepareItem({ kind: 'sign', id: s.nr })));
    else items = (mode === 'mini' ? shuffled(T.quiz).slice(0, T.exam.miniQuestions) : T.quiz).map(q => ({ kind: 'quiz', id: q.id }));
    if (single) items = items.filter(x => `${x.kind}:${x.id}` === single);
    if (!items.length) { toast('لا توجد أخطاء محفوظة للمراجعة.'); return; }
    session = { mode, items, index: 0, answers: {}, checked: {}, flagged: [], finished: false, askSubmit: false, askExit: false };
    flash = null;
    if (currentPage !== 'practice') location.hash = 'practice'; else render();
  }
  function itemData(item) {
    if (item.kind === 'quiz') return T.quiz.find(q => q.id === item.id);
    if (item.kind === 'number') { const x = T.numberDrill[Number(item.id)]; return { ...x, stem_de: x.q_de, stem_ar_hint: x.q_ar, explain_ar: x.explain_ar, topic: 'تدريب الأرقام' }; }
    const s = T.signs.find(s => s.nr === item.id);
    return { stem_de: 'Welche Bedeutung hat dieses Verkehrszeichen?', stem_ar_hint: 'ما معنى هذه الإشارة؟', options: item.options, explain_ar: `${s.ar}. ${s.trap_ar}`, tags: [], topic: 'الإشارات', svg: s.svg, nr: s.nr };
  }
  function parseNumeric(value) {
    const normalized = String(value).trim().replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776)).replace(/[٫,]/g, '.');
    return normalized === '' ? NaN : Number(normalized);
  }
  const hasAnswer = i => session.items[i].kind === 'number' ? Number.isFinite(parseNumeric(session.answers[i])) : Array.isArray(session.answers[i]) && session.answers[i].length > 0;
  function isCorrect(index) {
    const item = session.items[index], q = itemData(item), answer = session.answers[index];
    return item.kind === 'number' ? Number.isFinite(parseNumeric(answer)) && Math.abs(parseNumeric(answer) - q.answer) < 0.000001 : Array.isArray(answer) && q.options.every((option, i) => option.correct === answer.includes(i));
  }
  function recordAnswer(index) {
    if (Object.hasOwn(session.checked, index)) return;
    const correct = isCorrect(index), item = session.items[index], key = `${item.kind}:${item.id}`;
    session.checked[index] = correct;
    state.attempts++;
    if (correct) { state.correct++; delete state.mistakes[key]; }
    else state.mistakes[key] = { kind: item.kind, id: item.id, count: (Number(state.mistakes[key]?.count) || 0) + 1 };
    if (item.kind === 'quiz') state.mastery[item.id] = correct;
    activity(); save();
  }
  function optionList(q, answer, checked, index = session?.index, mini = false) {
    return `<div class="answer-options" role="group" aria-label="خيارات الإجابة">${q.options.map((option, oi) => {
      const selected = (answer || []).includes(oi);
      const cls = checked ? option.correct ? 'correct' : selected ? 'incorrect' : '' : '';
      const label = checked ? option.correct ? selected ? '✔ إجابة صحيحة اخترتِها' : '✔ إجابة صحيحة لم تختاريها' : selected ? '✘ اختيار خاطئ' : 'إجابة غير صحيحة، لم تختاريها' : '';
      return `<label class="answer-option ${cls}"><input type="${q.nr ? 'radio' : 'checkbox'}" name="answer-${index}" value="${oi}" data-option="${oi}" ${selected ? 'checked' : ''} ${checked ? 'disabled' : ''}><span>${de(option.de)}${label ? `<span class="option-label">${label}</span>` : ''}</span></label>`;
    }).join('')}</div>`;
  }
  function sessionView() {
    if (session.finished) return resultView();
    const i = session.index, item = session.items[i], q = itemData(item), mini = session.mode === 'mini';
    const checked = Object.hasOwn(session.checked, i), correct = session.checked[i];
    const title = { quiz: 'تدريب الأسئلة', mini: 'محاكاة مصغّرة', number: 'تدريب الأرقام', sign: 'اختبار الإشارات', mistakes: 'مراجعة أخطائي' }[session.mode];
    const answered = session.items.filter((_, j) => hasAnswer(j)).length;
    return `<div class="session">${heading(title, mini ? 'لا يظهر التصحيح إلا بعد التسليم.' : 'خذي وقتك. تعلّمي من كل اختيار.', 'خطوة بعد خطوة')}<div class="session-top"><span class="small">السؤال ${n(i + 1)} من ${n(session.items.length)}</span><button class="btn ghost small-btn" data-action="exit-session">إنهاء الجولة</button></div>${session.askExit ? `<div class="note warning saved-banner"><strong>إنهاء هذه الجولة؟</strong><p>تُحفظ الأسئلة المصحّحة فقط. اختيارات الجولة غير المسلَّمة لا تُحفظ.</p><div class="question-actions"><button class="btn danger" data-action="confirm-exit">إنهاء الجولة</button><button class="btn secondary" data-action="cancel-exit">متابعة التدريب</button></div></div>` : ''}${bar(mini ? answered : Object.keys(session.checked).length, session.items.length, 'الأسئلة المجابة')}<div class="question-nav" aria-label="اختاري سؤالاً">${session.items.map((_, j) => `<button class="question-dot ${j === i ? 'current' : ''} ${hasAnswer(j) ? 'answered' : ''} ${session.flagged.includes(j) ? 'flagged' : ''} ${session.checked[j] === false ? 'wrong-dot' : ''}" data-action="question-jump" data-index="${j}" aria-label="السؤال ${n(j + 1)}${session.flagged.includes(j) ? '، معلّم للمراجعة' : ''}" ${j === i ? 'aria-current="step"' : ''}>${j + 1}</button>`).join('')}</div><article class="card question-card"><div class="question-meta"><span class="tag" lang="de" dir="ltr">${item.kind === 'quiz' ? `${q.points} Fehlerpunkte` : item.kind === 'number' ? 'Zahl eingeben' : 'Verkehrszeichen'}</span><span class="topic">${q.topic}</span></div><h2 class="question-title" lang="de" dir="ltr">${h(q.stem_de)}</h2><details class="hint"><summary>تلميح بالعربية +</summary><p>${ar(q.stem_ar_hint)}</p></details>${q.svg ? `<div class="sign-quiz-art" role="img" aria-label="إشارة مرورية لاختبار المعنى">${q.svg}</div>` : ''}${item.kind === 'number' ? `<label class="drill-input" for="drill-answer"><input id="drill-answer" inputmode="decimal" type="text" autocomplete="off" placeholder="?" aria-label="الإجابة بالأمتار" value="${h(session.answers[i] ?? '')}" ${checked ? 'disabled' : ''}><span lang="de" dir="ltr">${q.unit}</span></label>` : optionList(q, session.answers[i], checked)}${!mini ? '<p class="muted small" style="margin-top:12px">' + (item.kind === 'quiz' ? 'يمكن أن تكون إجابة أو إجابتان أو الثلاث صحيحة.' : item.kind === 'number' ? 'أدخلي رقماً؛ تقبل الأرقام العربية والفاصلة العشرية.' : 'اختاري معنى واحداً.') + '</p>' : '<p class="muted small" style="margin-top:12px">اختاري كل الإجابات الصحيحة، ولا تضيفي أي إجابة خاطئة.</p>'}${checked ? feedback(q, correct, item) : ''}<div class="question-actions">${mini ? `<button class="btn secondary small-btn" data-action="flag" aria-pressed="${session.flagged.includes(i)}">${icon('flag')}${session.flagged.includes(i) ? 'معلّم للمراجعة' : 'علّمي للمراجعة'}</button>` : checked ? `<button class="btn" data-action="question-next">${i === session.items.length - 1 ? 'نتيجة الجولة' : 'السؤال التالي'}${icon('arrow')}</button>` : '<button class="btn" data-action="check">تحقّقي من الإجابة</button>'}</div></article><div class="question-actions"><button class="btn secondary" data-action="question-prev" ${i === 0 ? 'disabled' : ''}>${icon('back')}السابقة</button>${mini || !checked ? `<button class="btn secondary" data-action="question-next">${i === session.items.length - 1 ? 'مراجعة وتسليم' : mini && hasAnswer(i) ? 'التالية' : 'تجاوز / التالية'}${icon('arrow')}</button>` : ''}</div>${mini ? `<div class="home-plan"><p>أجبتِ عن ${n(answered)} من ${n(session.items.length)} · علّمتِ ${n(session.flagged.length)} للمراجعة.</p><button class="btn" data-action="submit">تسليم المحاكاة</button></div>` : ''}${session.askSubmit ? submitWarning() : ''}</div>`;
  }
  function feedback(q, correct, item) {
    return `<div class="feedback ${correct ? '' : 'wrong'}" role="status"><strong>${correct ? '✔ أحسنتِ، إجابة مكتملة' : `راجعي الفكرة${q.points ? ` · +${n(q.points)} نقاط خطأ` : ''}`}</strong>${item.kind === 'number' ? `<p>الإجابة: ${de(`${latin(q.answer)} ${q.unit}`)}</p>` : ''}<p>${ar(q.explain_ar)}</p>${q.tags?.length ? `<div class="feedback-tags" aria-label="الأنماط المستخدمة">${q.tags.map(tag => `<a href="#${tag.startsWith('S') ? 'stems' : 'patterns'}/${tag}" aria-label="مراجعة النمط ${tag}">${tag}</a>`).join('')}</div>` : ''}</div>`;
  }
  function submitWarning() {
    const count = session.items.filter((_, i) => !hasAnswer(i)).length;
    return `<div class="note warning" id="submit-warning" style="margin-top:22px" role="alert"><strong>${count ? `بقي ${n(count)} سؤالاً بلا إجابة.` : 'انتهت الجولة. هل راجعتِ الجميع؟'}</strong><p>${session.mode === 'mini' ? 'الأسئلة بلا إجابة تُحسب خطأ. يمكنك العودة إلى أي رقم قبل التسليم.' : 'يُحسب المتبقي خطأ عند إنهاء الجولة، ويمكنك العودة إليه الآن.'}</p><div class="question-actions"><button class="btn danger" data-action="finish">تسليم وإظهار النتيجة</button><button class="btn secondary" data-action="cancel-submit">أعود للمراجعة</button></div></div>`;
  }
  function finishSession() {
    session.items.forEach((_, i) => recordAnswer(i));
    session.finished = true; session.askSubmit = false; session.askExit = false;
    render();
  }
  function resultView() {
    const wrong = session.items.map((item, index) => ({ item, index })).filter(x => !session.checked[x.index]);
    const correctCount = session.items.length - wrong.length;
    const quizOnly = session.items.every(x => x.kind === 'quiz');
    const points = quizOnly ? wrong.reduce((sum, x) => sum + itemData(x.item).points, 0) : 0;
    const fives = quizOnly ? wrong.filter(x => itemData(x.item).points === 5).length : 0;
    const passed = points <= T.exam.maxErrors && fives < 2;
    const mini = session.mode === 'mini';
    return `<div class="session">${heading('كل محاولة تعلّمك شيئاً', 'هذه نتيجتك، ومعها فرصة لتثبيت ما تعلّمتِه.', 'نتيجة الجولة')}<div class="result-hero ${mini ? passed ? 'pass' : 'fail' : ''}"><span class="badge ${mini ? passed ? 'yes' : 'no' : 'depends'}">${mini ? passed ? 'اجتزتِ هذه المحاكاة' : 'لم تجتازي هذه المحاكاة' : 'اكتملت الجولة'}</span><div class="result-number" lang="de" dir="ltr">${quizOnly ? points : `${Math.round(correctCount / session.items.length * 100)}%`}</div><h2>${quizOnly ? 'نقاط خطأ · ' + de('Fehlerpunkte') : 'دقة الجولة'}</h2><p>${n(correctCount)} إجابات مكتملة من ${n(session.items.length)}</p>${quizOnly ? `<p>${n(fives)} أخطاء في أسئلة من ٥ نقاط</p>` : ''}${mini && fives >= 2 ? '<p class="bad">خطآن من فئة ٥ نقاط يعنيان الرسوب، ولو كان المجموع ١٠.</p>' : ''}${!mini && quizOnly ? '<p>هذه جولة من بنك التدريب، وليست نتيجة امتحان رسمي.</p>' : ''}<div class="result-buttons"><button class="btn" data-action="repeat-wrong" ${wrong.length ? '' : 'disabled'}>كرّري أخطاء الجولة</button><button class="btn secondary" data-action="session-close">التدريب</button></div></div>${mini ? `<div class="note">${ar(T.exam.miniNote)}</div>` : ''}<div class="section-heading"><h2>راجعي كل الإجابات</h2></div><div class="card">${session.items.map((item, i) => {
      const q = itemData(item), correct = session.checked[i];
      return `<details class="result-review"><summary><span class="${correct ? 'good' : 'bad'}">${correct ? '✔' : '✘'}</span> ${n(i + 1)} · ${de(q.stem_de)}</summary>${item.kind === 'number' ? `<p>إجابتك: ${de(session.answers[i] || '—')} · الصحيح: ${de(`${latin(q.answer)} ${q.unit}`)}</p>` : optionList(q, session.answers[i], true, `result-${i}`)}<p>${ar(q.explain_ar)}</p></details>`;
    }).join('')}</div></div>`;
  }
  function mistakes() {
    const list = Object.entries(state.mistakes);
    return heading('هنا يتحوّل الخطأ إلى فهم', 'تختفي الإجابة من هذه القائمة بعد حلها بشكل صحيح.', 'مراجعة شخصية', list.length ? '<button class="btn" data-action="start" data-mode="mistakes">راجعي كل أخطائي</button>' : '') + (list.length ? `<div class="stack">${list.map(([key, item]) => {
      const q = item.kind === 'sign' ? { stem_de: T.signs.find(s => s.nr === item.id).name_de, topic: 'الإشارات' } : itemData(item);
      return `<article class="mistake-item">${blockDE(q.stem_de)}<small>${q.topic} · عدد الأخطاء: ${n(Number(item.count) || 1)}</small><button class="btn secondary small-btn" data-action="repeat-one" data-key="${h(key)}">حاولي مجدداً${icon('arrow')}</button></article>`;
    }).join('')}</div>` : `<div class="empty">${icon('check')}<h2>لا أخطاء معلّقة الآن</h2><p>الأسئلة التي تحتاج مراجعة ستظهر هنا تلقائياً بعد التصحيح.</p>${link('practice', 'ابدئي جولة تدريب')}</div>`);
  }
  function plan() {
    return heading('يومان، وخطوات واضحة', 'علّمي ما أنجزتِه. خذي استراحاتك وعودي من حيث توقّفتِ.', 'خطة المراجعة') + T.plan.map(day => `<section class="card plan-day"><div class="plan-day-head"><div><span class="eyebrow">${n(day.items.filter(x => state.plan.includes(x.id)).length)} / ${n(day.items.length)} مكتملة</span><h2>${day.title}</h2></div><span class="tag" lang="de" dir="ltr">${day.day === 1 ? '365 min' : '330 min + 10 min'}</span></div>${bar(day.items.filter(x => state.plan.includes(x.id)).length, day.items.length, day.title)}${day.items.map(item => `<div class="plan-item"><input id="plan-${item.id}" type="checkbox" data-plan="${item.id}" ${state.plan.includes(item.id) ? 'checked' : ''}><label for="plan-${item.id}"><span>${ar(item.title)}</span><small>${n(item.minutes)} دقيقة${item.finalReview ? ' · مراجعة أخيرة قبل الامتحان' : ''}</small></label><a class="icon-button" href="#${item.page}" aria-label="${h(`افتحي: ${item.title}`)}">${icon('arrow')}</a>${item.official ? `<div class="note warning">${ar(T.exam.simulatorNote)}<p>نفّذي هذه الخطوة في تطبيق مدرسة القيادة، ثم علّميها هنا.</p></div>` : ''}</div>`).join('')}</section>`).join('');
  }
  function golden() {
    return heading('الورقة الذهبية', 'اقرئي بهدوء. تذكّري القاعدة، وانتبهِي للاستثناء.', 'قبل الامتحان بـ١٠ دقائق', `<button class="btn secondary print-button" data-action="print">طباعة${icon('print')}</button>`) + `<div class="golden-grid">${T.golden.map(x => `<article class="golden-card">${blockDE(x.de)}<p>${ar(x.ar)}</p></article>`).join('')}</div>`;
  }
  function render({ scroll = true, focus = true } = {}) {
    const pages = { home, exam, stems, patterns, vorfahrt, numbers, signs, vocab, practice, mistakes, plan, golden };
    main.innerHTML = pages[currentPage]();
    document.title = `${pageNames[currentPage]} · Theorie B`;
    renderNav();
    if (currentPage === 'numbers') updateCalculator();
    const qNav = $('.question-nav', main), qDot = qNav && $('.question-dot.current', qNav);
    if (qDot) qNav.scrollLeft += qDot.getBoundingClientRect().left - qNav.getBoundingClientRect().left - (qNav.clientWidth - qDot.offsetWidth) / 2;
    if (scroll) window.scrollTo({ top: 0, behavior: 'instant' });
    if (focus) main.focus({ preventScroll: true });
    if (pendingHighlight) {
      const target = document.getElementById(pendingHighlight); pendingHighlight = null;
      if (target) { target.classList.add('highlight'); target.scrollIntoView({ block: 'center' }); setTimeout(() => target.classList.remove('highlight'), 3000); }
    }
    $('#save-status').textContent = storageOK ? 'يُحفظ تقدمك على هذا الجهاز' : 'الحفظ غير متاح؛ تقدم هذه الجلسة يبقى حتى إغلاقها';
  }
  function route() {
    const [page, id] = location.hash.replace(/^#/, '').split('/');
    if (page === 'main') return;
    currentPage = Object.hasOwn(pageNames, page) ? page : 'home';
    if (currentPage !== 'vocab') flash = null;
    if (id) {
      if (currentPage === 'patterns') patternFilter = 'all';
      if (currentPage === 'numbers') numberFilter = 'all';
      if (currentPage === 'vocab') { vocabGroup = 'all'; flash = null; }
      pendingHighlight = `item-${id}`;
    }
    closeSearch();
    const dialog = $('#more-dialog'); if (dialog.open) dialog.close();
    render();
  }
  const searchIndex = [
    ...T.patterns.map(x => ({ page: 'patterns', id: x.id, title: x.de.join(' · '), ar: x.ar_title, search: [x.id, ...x.de, x.ar_title, x.ar_why, ...x.exceptions.flatMap(e => [e.de, e.ar])].join(' '), type: 'نمط' })),
    ...T.stems.map(x => ({ page: 'stems', id: x.id, title: x.de.join(' · '), ar: x.ar, search: [x.id, ...x.de, x.ar, x.note].join(' '), type: 'رأس السؤال' })),
    ...T.vocab.map((x, i) => ({ page: 'vocab', id: `vocab-${i}`, title: x.de, ar: x.ar, search: [x.de, x.ar, x.note].join(' '), type: 'مفردة' })),
    ...T.signs.map(x => ({ page: 'signs', id: `sign-${x.nr.replace('.', '-')}`, title: `${x.nr} · ${x.name_de}`, ar: x.ar, search: [x.nr, x.name_de, x.ar, x.trap_ar].join(' '), type: 'إشارة' })),
    ...T.numbers.map(x => ({ page: 'numbers', id: x.id, title: x.de, ar: x.ar, search: [x.de, x.value, x.unit, x.ar, x.note].join(' '), type: 'رقم / قاعدة' }))
  ];
  const normalize = text => String(text).toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, '').replace(/ß/g, 'ss').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي');
  function search() {
    const value = $('#global-search').value.trim(), container = $('#search-results');
    if (!value) { closeSearch(); return; }
    const words = normalize(value).split(/\s+/);
    searchHits = searchIndex.filter(x => words.every(word => normalize(x.search).includes(word)));
    container.hidden = false;
    container.innerHTML = `<p class="muted small" role="status">${searchHits.length ? `${n(searchHits.length)} نتيجة · تُعرض أول ${n(Math.min(30, searchHits.length))}` : 'لا نتائج. جرّبي كلمة أقصر بالعربية أو الألمانية.'}</p>${searchHits.slice(0, 30).map((x, i) => `<button class="search-result" data-action="search-go" data-index="${i}"><span>${de(x.title)}<small>${ar(x.ar)}</small></span><span class="result-type">${x.type}</span></button>`).join('')}`;
  }
  function closeSearch() { $('#search-results').hidden = true; }
  function refreshInPlace() { const y = window.scrollY; render({ scroll: false, focus: false }); window.scrollTo({ top: y, behavior: 'instant' }); }
  function toggleKnown(id) {
    if (state.known.includes(id)) state.known = state.known.filter(x => x !== id);
    else { state.known.push(id); activity(); }
    save();
  }
  function askSubmit() {
    session.askSubmit = true; session.askExit = false; render({ scroll: false });
    $('#submit-warning').scrollIntoView({ block: 'center' });
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button || button.disabled) return;
    const { action, id, value, mode, index, section, key } = button.dataset;
    if (action === 'more') { $('#more-dialog').showModal(); return; }
    if (action === 'review') {
      if (reviewed(section, id)) state.reviewed[section] = state.reviewed[section].filter(x => x !== id);
      else { (state.reviewed[section] ||= []).push(id); activity(); }
      save(); const done = reviewed(section, id);
      button.classList.toggle('is-done', done); button.setAttribute('aria-pressed', String(done));
      button.innerHTML = icon('check') + `<span>${done ? 'تمت المراجعة' : 'حدّدي كمُراجَعة'}</span>`;
      if (done) toast('خطوة أخرى ثبتت. تقدّمك محفوظ.');
    }
    if (action === 'pattern-filter') { patternFilter = value; refreshInPlace(); }
    if (action === 'number-filter') { numberFilter = value; refreshInPlace(); }
    if (action === 'scenario') {
      const answer = $(`#answer-${id}`), show = answer.hidden;
      answer.hidden = !show; button.setAttribute('aria-expanded', String(show));
      button.innerHTML = (show ? 'إخفاء الترتيب' : 'أظهري الترتيب') + icon('arrow');
      if (show) addReview('vorfahrt', id);
    }
    if (action === 'sign-flip') {
      const answer = $('.sign-back', button), show = answer.hidden;
      answer.hidden = !show; button.setAttribute('aria-expanded', String(show));
      $('small', button).textContent = show ? 'اضغطي لإخفاء المعنى' : 'اضغطي لاكتشاف المعنى';
      if (show) addReview('signs', id);
    }
    if (action === 'known') { toggleKnown(id); button.classList.toggle('known', state.known.includes(id)); button.setAttribute('aria-pressed', String(state.known.includes(id))); }
    if (action === 'flash-start') { flash = { ids: shuffled(T.vocab.map((v, i) => ({ v, i })).filter(x => vocabGroup === 'all' || x.v.group === vocabGroup).map(x => String(x.i))), index: 0, flipped: false }; render(); }
    if (action === 'flash-close') { flash = null; render(); }
    if (action === 'flash-flip') { flash.flipped = !flash.flipped; render({ scroll: false }); }
    if (action === 'flash-prev' || action === 'flash-next') { flash.index = (flash.index + (action === 'flash-next' ? 1 : -1) + flash.ids.length) % flash.ids.length; flash.flipped = false; render({ scroll: false }); }
    if (action === 'flash-known') { const flashId = flash.ids[flash.index]; toggleKnown(flashId); render({ scroll: false }); toast(state.known.includes(flashId) ? 'كلمة جديدة أصبحت أوضح.' : 'أُعيدت إلى المفردات للمراجعة.'); }
    if (action === 'start') start(mode);
    if (action === 'repeat-one') start('mistakes', key);
    if (action === 'search-go') {
      const result = searchHits[Number(index)]; $('#global-search').value = ''; closeSearch();
      const hash = `#${result.page}/${result.id}`;
      if (location.hash === hash) route(); else location.hash = hash;
    }
    if (action === 'print') window.print();
    if (!session) return;
    if (action === 'check') {
      if (!hasAnswer(session.index)) { toast(session.items[session.index].kind === 'number' ? 'أدخلي رقماً صالحاً أولاً.' : 'اختاري إجابة واحدة على الأقل.'); return; }
      recordAnswer(session.index); render({ scroll: false });
      if (session.checked[session.index]) toast('أحسنتِ، فهمٌ يثبت خطوة بخطوة.');
    }
    if (action === 'question-jump') { session.index = Number(index); session.askSubmit = false; render(); }
    if (action === 'question-prev' && session.index > 0) { session.index--; session.askSubmit = false; render(); }
    if (action === 'question-next') {
      session.askSubmit = false;
      if (session.index < session.items.length - 1) { session.index++; render(); }
      else if (Object.keys(session.checked).length === session.items.length) finishSession();
      else askSubmit();
    }
    if (action === 'flag') { const i = session.index; session.flagged = session.flagged.includes(i) ? session.flagged.filter(x => x !== i) : [...session.flagged, i]; refreshInPlace(); }
    if (action === 'submit') askSubmit();
    if (action === 'cancel-submit') { session.askSubmit = false; refreshInPlace(); }
    if (action === 'finish') finishSession();
    if (action === 'exit-session') { session.askExit = true; session.askSubmit = false; render(); }
    if (action === 'cancel-exit') { session.askExit = false; render(); }
    if (action === 'session-close' || action === 'confirm-exit') { session = null; render(); }
    if (action === 'repeat-wrong') {
      const items = session.items.filter((_, i) => !session.checked[i]);
      if (items.length) { session = { mode: 'mistakes', items: items.map(prepareItem), index: 0, answers: {}, checked: {}, flagged: [], finished: false, askSubmit: false, askExit: false }; render(); }
    }
  });
  document.addEventListener('change', event => {
    const input = event.target;
    if (input.matches('[data-plan]')) {
      const id = input.dataset.plan;
      if (input.checked) { if (!state.plan.includes(id)) state.plan.push(id); activity(); } else state.plan = state.plan.filter(x => x !== id);
      save(); refreshInPlace();
      const target = document.getElementById(`plan-${id}`); target?.focus({ preventScroll: true });
    }
    if (input.matches('[data-option]') && session && !Object.hasOwn(session.checked, session.index)) {
      session.answers[session.index] = [...main.querySelectorAll('.question-card [data-option]:checked')].map(x => Number(x.value));
      // Preserve focused inputs and the page position while updating the navigation state.
      const dots = main.querySelectorAll('.question-dot'); dots[session.index]?.classList.toggle('answered', hasAnswer(session.index));
      if (session.mode === 'mini') {
        const answered = session.items.filter((_, i) => hasAnswer(i)).length;
        const meter = $('.session > .progress-bar');
        meter?.setAttribute('aria-valuenow', String(answered));
        if (meter) $('span', meter).style.width = `${answered / session.items.length * 100}%`;
        const summary = $('.session > .home-plan > p');
        if (summary) summary.textContent = `أجبتِ عن ${n(answered)} من ${n(session.items.length)} · علّمتِ ${n(session.flagged.length)} للمراجعة.`;
      }
    }
    if (input.id === 'vocab-group') { vocabGroup = input.value; refreshInPlace(); $('#vocab-group').focus({ preventScroll: true }); }
  });
  document.addEventListener('input', event => {
    if (event.target.id === 'calc-speed') updateCalculator();
    if (event.target.id === 'global-search') { clearTimeout(searchTimer); searchTimer = setTimeout(search, 120); }
    if (event.target.id === 'drill-answer' && session) session.answers[session.index] = event.target.value;
  });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); $('#global-search').focus(); }
    if (event.key === 'Escape') closeSearch();
    if (event.target.id === 'drill-answer' && event.key === 'Enter') { event.preventDefault(); $('[data-action="check"]')?.click(); }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.search-wrap')) closeSearch(); });
  $('#global-search').addEventListener('focus', () => { if ($('#global-search').value.trim()) search(); });
  $('#theme-toggle').addEventListener('click', () => { state.theme = { auto: 'light', light: 'dark', dark: 'auto' }[state.theme]; save(); theme(); });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', theme);
  $('#search-icon').innerHTML = icon('search');
  $('#close-more').innerHTML = icon('close');
  $('#close-more').addEventListener('click', () => $('#more-dialog').close());
  $('#more-dialog').addEventListener('click', event => { if (event.target === $('#more-dialog')) { const box = event.target.getBoundingClientRect(); if (event.clientY < box.top || event.clientX < box.left || event.clientX > box.right) event.target.close(); } });
    $('#more-links').innerHTML = [['signs', 'signs'], ['vocab', 'vocab'], ['plan', 'plan'], ['golden', 'golden'], ['mistakes', 'mistakes'], ['exam', 'info'], ['stems', 'book']].map(([page, ico]) => `<a class="more-link" href="#${page}">${icon(ico)}${pageNames[page]}</a>`).join('');
    $('#more-links').addEventListener('click', event => { if (event.target.closest('a')) $('#more-dialog').close(); });
  let offlineReady = false;
  function connection() {
    const el = $('#connection');
    $('span', el).textContent = !navigator.onLine ? 'دون اتصال' : offlineReady ? 'متاحة دون اتصال' : 'جاهزة للتعلّم';
    el.title = !navigator.onLine ? 'أنتِ الآن دون اتصال' : offlineReady ? 'حُفظت ملفات التطبيق للعمل دون اتصال' : 'التطبيق جاهز';
  }
  window.addEventListener('online', connection); window.addEventListener('offline', connection);
  window.addEventListener('hashchange', route);
  theme(); connection(); route();
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(() => { offlineReady = true; connection(); }).catch(() => { offlineReady = false; connection(); });
    });
  }
})();
