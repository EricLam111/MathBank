/* MathBank 界面：路由、课程页、练习引擎、题库、错题本、统计 */
(function () {
  'use strict';
  var MB = window.MB;
  var LESSONS = window.LESSONS || [];
  var QUESTIONS = window.QUESTIONS || [];
  var app = document.getElementById('app');

  var byId = {}, lessonById = {};
  QUESTIONS.forEach(function (q) { byId[q.id] = q; });
  LESSONS.forEach(function (t) { lessonById[t.id] = t; });

  var DIFF = { 1: '基础', 2: '进阶', 3: '难点' };
  var TYPE = { numeric: '计算/填空', choice: '选择', self: '证明·自评' };

  /* ---------- 小工具 ---------- */
  function h(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function renderMath(el) {
    if (typeof window.renderMathInElement !== 'function') return;
    try {
      window.renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false,
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'option', 'code']
      });
    } catch (e) { /* 渲染失败不影响功能 */ }
  }
  function paint(html) {
    app.innerHTML = html;
    renderMath(app);
  }
  function topicOf(q) { return lessonById[q.topic] || { title: '未分类', id: q.topic }; }
  function qsOfTopic(tid) { return QUESTIONS.filter(function (q) { return q.topic === tid; }); }
  function qsOfSection(tid, sid) {
    return QUESTIONS.filter(function (q) { return q.topic === tid && q.section === sid; });
  }
  function diffChip(d) { return '<span class="chip d' + d + '">' + DIFF[d] + '</span>'; }

  /* 三维场景索引（在 data/scenes.js 里定义，和 visual.html 共用） */
  var SCENES = window.SCENES || [];
  function sceneFor(topic, section) {
    var loose = null;
    for (var i = 0; i < SCENES.length; i++) {
      var s = SCENES[i];
      if (s.topic !== topic) continue;
      if (s.section === section) return s;
      if (!loose) loose = s;
    }
    return loose;
  }
  function sceneChip(topic, section, label, qid) {
    var s = qid && SCENES.find(function (item) { return item.questionIds && item.questionIds.indexOf(qid) !== -1; });
    s = s || sceneFor(topic, section);
    if (!s) return '';
    var exact = s.section === section || (qid && s.questionIds && s.questionIds.indexOf(qid) !== -1);
    return '<a class="chip" href="visual.html#' + s.id + '">' + h(label || '看 3D 演示') + (exact ? '' : '（本板块）') + '</a>';
  }
  function typeChip(t) { return '<span class="chip type">' + TYPE[t] + '</span>'; }
  function letter(i) { return String.fromCharCode(65 + i); }
  function pct(a, b) { return b ? Math.round(100 * a / b) : 0; }

  /* ---------- 路由 ---------- */
  function parseHash() {
    var raw = (location.hash || '#/').replace(/^#/, '');
    var anchor = '', ai = raw.indexOf('#');
    if (ai >= 0) { anchor = raw.slice(ai + 1); raw = raw.slice(0, ai); }
    var qi = raw.indexOf('?'), query = {}, path = raw;
    if (qi >= 0) {
      path = raw.slice(0, qi);
      raw.slice(qi + 1).split('&').forEach(function (kv) {
        if (!kv) return;
        var p = kv.split('=');
        query[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');
      });
    }
    return { parts: path.split('/').filter(Boolean), query: query, anchor: anchor };
  }

  function route() {
    var r = parseHash();
    var p = r.parts;
    if (!p.length) return homeView();
    if (p[0] === 'learn') return lessonView(p[1], r.anchor);
    if (p[0] === 'practice') return practiceView();
    if (p[0] === 'q') return singleView(p[1]);
    if (p[0] === 'bank') return bankView(r.query);
    if (p[0] === 'wrong') return wrongView();
    if (p[0] === 'stats') return statsView();
    return homeView();
  }

  function markNav() {
    var path = parseHash().parts[0] || '';
    var map = { '': '/', learn: '/', practice: '/', q: '/bank', bank: '/bank', wrong: '/wrong', stats: '/stats' };
    var want = map[path] || '/';
    Array.prototype.forEach.call(document.querySelectorAll('#nav a'), function (a) {
      a.classList.toggle('active', a.getAttribute('data-route') === want);
    });
  }

  /* ---------- 首页 ---------- */
  function totals() {
    var attempted = 0, mastered = 0, wrong = 0;
    QUESTIONS.forEach(function (q) {
      var r = MB.store.rec(q.id);
      if (r.attempts > 0) attempted++;
      if (MB.store.isMastered(q.id)) mastered++;
      if (MB.store.needsReview(q.id)) wrong++;
    });
    return { total: QUESTIONS.length, attempted: attempted, mastered: mastered, wrong: wrong };
  }

  function homeView() {
    var s = totals();
    var rows = LESSONS.map(function (t) {
      var qs = qsOfTopic(t.id);
      var done = qs.filter(function (q) { return MB.store.rec(q.id).attempts > 0; }).length;
      var m = qs.filter(function (q) { return MB.store.isMastered(q.id); }).length;
      return { t: t, n: qs.length, done: done, m: m };
    });

    /* 推荐：优先错题最多的板块，其次最没碰过的板块 */
    var rec = null;
    rows.forEach(function (r) {
      var w = qsOfTopic(r.t.id).filter(function (q) { return MB.store.needsReview(q.id); }).length;
      var score = w * 10 + (r.n - r.done);
      if (!rec || score > rec.score) rec = { score: score, r: r, w: w };
    });

    var html = '';
    html += '<h1>数学分析刷题台</h1>';
    html += '<p class="lede">每道题都标出它考的知识点，答完立刻给出逐步解答。课程页讲解每一步，并直接链到对应的练习题。</p>';

    html += '<div class="card"><div class="row" style="gap:26px">';
    html += '<div><div class="small muted">题库</div><div style="font-size:22px;font-weight:700">' + s.total + ' 题</div></div>';
    html += '<div><div class="small muted">做过</div><div style="font-size:22px;font-weight:700">' + s.attempted + '</div></div>';
    html += '<div><div class="small muted">已掌握（连对两次）</div><div style="font-size:22px;font-weight:700">' + s.mastered + '</div></div>';
    html += '<div><div class="small muted">待复习</div><div style="font-size:22px;font-weight:700">' + s.wrong + '</div></div>';
    html += '</div>';
    html += '<div class="bar"><i style="width:' + pct(s.mastered, s.total) + '%"></i></div>';
    html += '</div>';

    if (rec) {
      html += '<div class="card" style="border-color:var(--accent)">';
      html += '<div class="box-t small muted">今天从这里开始</div>';
      html += '<h3 style="margin:4px 0 6px">' + h(rec.r.t.title) + '</h3>';
      html += '<p class="small muted" style="margin:0 0 12px">' +
        (rec.w > 0 ? '你在这个板块有 ' + rec.w + ' 道待复习的题。' : '还没做过这个板块的题。') + '</p>';
      html += '<div class="row">';
      html += '<button class="primary" data-act="start" data-title="' + h(rec.r.t.title) + '" data-ids="' +
        qsOfTopic(rec.r.t.id).map(function (q) { return q.id; }).join(',') + '">开始练习（' + rec.r.n + ' 题）</button>';
      html += '<a class="btn" href="#/learn/' + rec.r.t.id + '">先看讲解</a>';
      var sc0 = sceneFor(rec.r.t.id);
      if (sc0) html += '<a class="btn" href="visual.html#' + sc0.id + '">看 3D</a>';
      html += '</div></div>';
    }

    html += '<h2>课程板块</h2><div class="grid">';
    rows.forEach(function (r) {
      html += '<a class="tcard" href="#/learn/' + r.t.id + '">';
      html += '<h3>' + h(r.t.title) + '</h3>';
      html += '<p>' + h(r.t.subtitle || '') + '</p>';
      html += '<div class="bar"><i style="width:' + pct(r.m, r.n) + '%"></i></div>';
      html += '<p class="small muted" style="margin-top:8px">' + r.t.sections.length + ' 讲 · ' + r.n + ' 题 · 已掌握 ' + r.m + '/' + r.n + '</p>';
      html += '</a>';
    });
    html += '</div>';
    paint(html);
  }

  /* ---------- 课程页 ---------- */
  function lessonView(tid, anchor) {
    var t = lessonById[tid];
    if (!t) return paint('<h1>没找到这个板块</h1><p><a href="#/">回首页</a></p>');

    var html = '';
    html += '<div class="crumb"><a href="#/">首页</a> / 板块 ' + t.n + '</div>';
    html += '<h1>' + h(t.title) + '</h1>';
    html += '<p class="lede">' + (t.intro || '') + '</p>';

    html += '<div class="lesson-toc">';
    t.sections.forEach(function (s, i) {
      html += '<a class="chip ghost" href="#/learn/' + t.id + '#' + s.id + '">' + (i + 1) + '. ' + h(s.title) + '</a>';
    });
    html += '<button class="primary" data-act="start" data-title="' + h(t.title) + '" data-ids="' +
      qsOfTopic(t.id).map(function (q) { return q.id; }).join(',') + '">练整个板块</button>';
    html += '</div>';

    t.sections.forEach(function (s, si) {
      html += '<div class="section" id="' + s.id + '">';
      html += '<h2>' + (si + 1) + '. ' + h(s.title) + '</h2>';
      html += sceneChip(t.id, s.id, '看 3D 演示');
      html += '<ol class="steps">';
      s.steps.forEach(function (st) { html += '<li>' + st + '</li>'; });
      html += '</ol>';

      if (s.example) {
        html += '<div class="box ex"><div class="box-t">' + h(s.example.title || '例题') + '</div>' + s.example.body + '</div>';
      }
      if (s.pitfalls && s.pitfalls.length) {
        html += '<div class="box warn"><div class="box-t">常见陷阱</div><ul class="tight">';
        s.pitfalls.forEach(function (p) { html += '<li>' + p + '</li>'; });
        html += '</ul></div>';
      }

      var qs = qsOfSection(t.id, s.id);
      if (qs.length) {
        html += '<div class="box-t small muted" style="margin-top:14px">这一讲的配套练习</div><div class="exchips">';
        qs.forEach(function (q, i) {
          var r = MB.store.rec(q.id);
          var mark = r.attempts === 0 ? '' : (MB.store.isMastered(q.id) ? ' ✓掌握' : (r.last ? ' ·上次对' : ' ·上次错'));
          html += '<a class="chip" href="#/q/' + q.id + '">第 ' + (i + 1) + ' 题' + h(mark) + '</a>';
        });
        html += '<button class="tiny" data-act="start" data-title="' + h(s.title) + '" data-ids="' +
          qs.map(function (q) { return q.id; }).join(',') + '">连做这一讲的 ' + qs.length + ' 题</button>';
        html += '</div>';
      }
      html += '</div>';
    });

    html += '<div class="card" style="margin-top:26px"><div class="spread">';
    html += '<div><b>' + h(t.title) + '</b> 共 ' + qsOfTopic(t.id).length + ' 题</div>';
    html += '<button class="primary" data-act="start" data-title="' + h(t.title) + '" data-ids="' +
      qsOfTopic(t.id).map(function (q) { return q.id; }).join(',') + '">开始刷这个板块</button>';
    html += '</div></div>';

    paint(html);
    if (anchor) {
      var el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ---------- 练习引擎 ---------- */
  var S = null;

  function startSession(ids, title) {
    if (!ids || !ids.length) return;
    S = { ids: ids.slice(), i: 0, title: title || '练习', revealed: false, checked: null, picked: null, hint: 0, right: 0, done: 0 };
    location.hash = '#/practice';
  }

  function practiceView() {
    if (!S) {
      return paint('<h1>还没开始练习</h1><p class="lede">从首页或课程页选一个板块开始。</p><p><a class="btn primary" href="#/">回首页</a></p>');
    }
    if (S.i >= S.ids.length) return practiceDone();

    var q = byId[S.ids[S.i]];
    var t = topicOf(q);

    var html = '';
    html += '<div class="practice-head">';
    html += '<div class="row"><span class="progress-pill">第 ' + (S.i + 1) + ' / ' + S.ids.length + ' 题</span>' +
      typeChip(q.type) + diffChip(q.difficulty) + '</div>';
    html += '<a class="chip ghost" href="#/">退出</a>';
    html += '</div>';

    html += '<div class="card">';
    html += '<div class="row" style="margin-bottom:12px">';
    html += '<a class="chip kp" href="#/learn/' + t.id + (q.section ? '#' + q.section : '') + '">知识点：' + h(q.kp) + '</a>';
    html += sceneChip(q.topic, q.section, '看 3D 演示', q.id);
    html += '<a class="chip ghost" href="#/learn/' + t.id + '">' + h(t.title) + '</a>';
    html += '</div>';
    html += '<div class="qprompt">' + q.prompt + '</div>';
    html += '<div class="answer-area">' + answerArea(q) + '</div>';
    html += '<div id="hintbox"></div>';
    html += '<div class="actions" id="actions">' + actionsArea(q) + '</div>';
    html += '<div id="fb"></div>';
    html += '</div>';

    paint(html);
    var inp = document.getElementById('ans');
    if (inp && q.type === 'numeric') inp.focus();
  }

  function answerArea(q) {
    if (q.type === 'choice') {
      return '<div id="choices">' + q.choices.map(function (c, i) {
        return '<button type="button" class="choice" data-act="pick" data-i="' + i + '"><span class="k">' + letter(i) + '</span>' + c + '</button>';
      }).join('') + '</div>';
    }
    if (q.type === 'self') {
      return '<textarea id="ans" placeholder="先自己写完整（可选，不参与自动判分），再点下面看标准解答对照"></textarea>' +
        '<p class="small muted" style="margin:8px 0 0">这是证明/说明题：没有唯一数字答案，所以用「对照解答 → 自评」来判。</p>';
    }
    return '<input id="ans" type="text" autocomplete="off" spellcheck="false" placeholder="' + h(q.placeholder || '直接写答案：1/2、sqrt(3)、pi^2/6、e …') + '">' +
      '<p class="small muted" style="margin:8px 0 0">写法：分数 <code>1/2</code>、根号 <code>sqrt(3)</code> 或 <code>√3</code>、幂 <code>2^3</code> 或 <code>2**3</code>、常数 <code>pi</code> <code>e</code>、上标字符 <code>π²/6</code>；也可以写文字如「发散」「不存在」。</p>';
  }

  function actionsArea(q) {
    if (q.type === 'self') {
      return '<button class="primary" data-act="reveal">看标准解答</button>' +
        '<button data-act="hint">提示</button>' +
        '<button data-act="skip">跳过</button>';
    }
    return '<button class="primary" data-act="check">检查答案</button>' +
      '<button data-act="hint">提示</button>' +
      '<button data-act="skip">跳过并看解答</button>';
  }

  function setActions(html) { var el = document.getElementById('actions'); if (el) el.innerHTML = html; }
  function setFb(html) {
    var el = document.getElementById('fb');
    if (el) { el.innerHTML = html; renderMath(el); }
  }

  function solutionHTML(q, showAnswer) {
    var html = '';
    if (showAnswer && q.ans) {
      html += '<div class="box"><div class="box-t">标准答案</div><div>' + q.ans + '</div></div>';
    }
    html += '<div class="box-t small muted" style="margin-top:14px">逐步解答</div>';
    html += '<ol class="steps">';
    q.steps.forEach(function (s) { html += '<li>' + s + '</li>'; });
    html += '</ol>';
    if (q.why) html += '<div class="box"><div class="box-t">为什么考这个（知识点）</div><div>' + q.why + '</div></div>';
    if (q.trap) html += '<div class="box warn"><div class="box-t">容易错在哪</div><div>' + q.trap + '</div></div>';
    html += '<div class="row" style="margin-top:14px">';
    html += '<a class="chip" href="#/learn/' + q.topic + (q.section ? '#' + q.section : '') + '">去看这一讲的完整讲解 →</a>';
    html += sceneChip(q.topic, q.section, '这步看不懂？看 3D', q.id);
    html += '</div>';
    return html;
  }

  function doPick(i) {
    if (S.checked) return;
    S.picked = i;
    Array.prototype.forEach.call(document.querySelectorAll('#choices .choice'), function (b, k) {
      b.classList.toggle('sel', k === i);
    });
  }

  function doCheck() {
    if (!S || S.checked) return;
    var q = byId[S.ids[S.i]];
    var raw = null;
    if (q.type === 'choice') {
      if (S.picked == null) return setActions(actionsArea(q).replace('检查答案', '先选一个选项再检查'));
      raw = S.picked;
    } else if (q.type === 'numeric') {
      raw = (document.getElementById('ans') || {}).value || '';
    } else { return; }

    var res = MB.check(q, raw);
    S.checked = res;
    MB.store.record(q.id, !!res.ok, typeof raw === 'string' ? raw : (q.choices ? q.choices[raw] : ''));

    if (q.type === 'choice') {
      Array.prototype.forEach.call(document.querySelectorAll('#choices .choice'), function (b, k) {
        b.classList.remove('sel');
        if (k === q.answer) b.classList.add('ok');
        else if (k === S.picked && !res.ok) b.classList.add('bad');
        b.disabled = true;
      });
    } else {
      var inp = document.getElementById('ans');
      if (inp) inp.disabled = true;
    }

    var okClass = res.ok ? 'ok' : 'bad';
    var verdict;
    if (res.ok) verdict = '✔ 答对了';
    else if (res.kind === 'parse') verdict = '✘ 我看不懂你写的算式';
    else verdict = '✘ 答错了';

    var html = '<div class="feedback ' + okClass + '">';
    html += '<div class="verdict">' + verdict + '</div>';
    if (!res.ok) {
      if (res.kind === 'parse') {
        html += '<p class="small" style="margin:0 0 10px">解析器说：' + h(res.error) + '。换个写法试试（例如 <code>1/2</code>、<code>sqrt(3)</code>、<code>pi^2/6</code>）。</p>';
      } else if (res.kind === 'number') {
        html += '<p class="small" style="margin:0 0 10px">你给出的数值约 ' + h(res.got.toPrecision(8)) + '，与标准答案不一致。</p>';
      } else if (res.error) {
        html += '<p class="small" style="margin:0 0 10px">' + h(res.error) + '</p>';
      }
      html += '<div class="actions" style="margin:0 0 6px"><button data-act="retry">再试一次</button></div>';
    }
    html += solutionHTML(q, true);
    html += '</div>';
    setFb(html);

    if (res.ok) S.right++;
    S.done++;
    setActions('<button class="primary" data-act="next">' + (S.i + 1 < S.ids.length ? '下一题 →' : '看本次小结 →') + '</button>');
  }

  function doSelf(ok) {
    var q = byId[S.ids[S.i]];
    MB.store.record(q.id, ok, '');
    S.done++;
    if (ok) S.right++;
    var html = '<div class="feedback ' + (ok ? 'ok' : 'bad') + '">';
    html += '<div class="verdict">' + (ok ? '✔ 记录下来：这题你会' : '✘ 记录下来：这题要再看') + '</div>';
    if (!ok) html += '<p class="small" style="margin:0 0 8px">没关系，这类题会进「错题本」，之后重做一次就记住了。</p>';
    html += solutionHTML(q, true);
    html += '</div>';
    setFb(html);
    setActions('<button class="primary" data-act="next">' + (S.i + 1 < S.ids.length ? '下一题 →' : '看本次小结 →') + '</button>');
  }

  function doReveal() {
    var q = byId[S.ids[S.i]];
    S.revealed = true;
    var html = '<div class="feedback">';
    html += '<div class="verdict" style="color:var(--accent)">对照下面每一步，给自己打分</div>';
    html += solutionHTML(q, true);
    html += '</div>';
    setFb(html);
    setActions('<button class="primary" data-act="self-ok">我独立做对了</button>' +
      '<button data-act="self-bad">做错了 / 没做出来</button>');
  }

  function doHint() {
    var q = byId[S.ids[S.i]];
    if (!q.hints || !q.hints.length) return;
    S.hint = Math.min(S.hint + 1, q.hints.length);
    var box = document.getElementById('hintbox');
    var html = '<div class="box warn" style="margin-top:14px"><div class="box-t">提示 ' + S.hint + ' / ' + q.hints.length + '</div>';
    for (var i = 0; i < S.hint; i++) html += '<div style="margin:4px 0">' + q.hints[i] + '</div>';
    html += '</div>';
    if (box) { box.innerHTML = html; renderMath(box); }
  }

  function doSkip() {
    if (S.checked) return;
    var q = byId[S.ids[S.i]];
    MB.store.record(q.id, false, '（跳过）');
    S.checked = { ok: false, kind: 'skip' };
    S.done++;
    if (q.type === 'choice') {
      Array.prototype.forEach.call(document.querySelectorAll('#choices .choice'), function (b, k) {
        b.classList.remove('sel');
        if (k === q.answer) b.classList.add('ok');
        b.disabled = true;
      });
    } else { var inp = document.getElementById('ans'); if (inp) inp.disabled = true; }
    var html = '<div class="feedback bad"><div class="verdict">✘ 已跳过（记入错题本）</div>' + solutionHTML(doSkipQ_ans(q), true) + '</div>';
    setFb(html);
    setActions('<button class="primary" data-act="next">' + (S.i + 1 < S.ids.length ? '下一题 →' : '看本次小结 →') + '</button>');
  }
  function doSkipQ_ans(q) { return q; }

  function doRetry() {
    S.checked = null;
    var q = byId[S.ids[S.i]];
    if (q.type === 'choice') {
      S.picked = null;
      Array.prototype.forEach.call(document.querySelectorAll('#choices .choice'), function (b) {
        b.classList.remove('sel', 'ok', 'bad');
        b.disabled = false;
      });
    } else {
      var inp = document.getElementById('ans');
      if (inp) { inp.disabled = false; inp.focus(); inp.select(); }
    }
    setFb('');
    setActions(actionsArea(q));
  }

  function doNext() {
    S.i++;
    S.revealed = false; S.checked = null; S.picked = null; S.hint = 0;
    practiceView();
  }

  function practiceDone() {
    var total = S.done, right = S.right;
    var html = '<h1>本次小结</h1>';
    html += '<div class="card"><div class="row" style="gap:26px">';
    html += '<div><div class="small muted">做了</div><div style="font-size:22px;font-weight:700">' + total + ' 题</div></div>';
    html += '<div><div class="small muted">对了</div><div style="font-size:22px;font-weight:700">' + right + '</div></div>';
    html += '<div><div class="small muted">正确率</div><div style="font-size:22px;font-weight:700">' + pct(right, total) + '%</div></div>';
    html += '</div></div>';
    html += '<div class="card"><p class="small muted" style="margin:0 0 12px">错题会自动进错题本，连对两次才算掌握。</p>';
    html += '<div class="row"><a class="btn" href="#/wrong">去错题本</a><a class="btn" href="#/stats">看统计</a>' +
      '<a class="btn primary" href="#/">回首页</a></div></div>';
    S = null;
    paint(html);
  }

  /* ---------- 单题页（从题库/课程点进来） ---------- */
  function singleView(qid) {
    var q = byId[qid];
    if (!q) return paint('<h1>没找到这道题</h1><p><a href="#/bank">回题库</a></p>');
    startSession([qid], '单题：' + q.kp);
  }

  /* ---------- 题库 ---------- */
  function bankView(query) {
    var tf = query.t || 'all', df = query.d || 'all';
    var html = '<h1>题库</h1><p class="lede">' + QUESTIONS.length + ' 道题，全部标了知识点。点标题进入单题练习。</p>';

    html += '<div class="filters">';
    html += '<a class="btn' + (tf === 'all' ? ' primary' : '') + '" href="#/bank">全部</a>';
    LESSONS.forEach(function (t) {
      html += '<a class="btn' + (tf === t.id ? ' primary' : '') + '" href="#/bank?t=' + t.id + '">' + h(t.title) + '</a>';
    });
    html += '</div>';
    html += '<div class="card">';

    var list = QUESTIONS.filter(function (q) {
      if (tf !== 'all' && q.topic !== tf) return false;
      if (df !== 'all' && String(q.difficulty) !== df) return false;
      return true;
    });
    if (!list.length) html += '<div class="empty">这个筛选下没有题。</div>';
    list.forEach(function (q, i) {
      var r = MB.store.rec(q.id);
      var status = r.attempts === 0 ? '<span class="chip ghost">未做</span>'
        : (MB.store.isMastered(q.id) ? '<span class="chip d1">已掌握</span>'
          : (r.last ? '<span class="chip d2">上次对</span>' : '<span class="chip d3">上次错</span>'));
      html += '<div class="qrow"><div class="qt">';
      html += '<a href="#/q/' + q.id + '"><b>' + q.id + '</b>　' + q.prompt + '</a>';
      html += '<div class="qmeta">' + status + diffChip(q.difficulty) + typeChip(q.type) +
        '<span class="chip kp">' + h(q.kp) + '</span>' +
        '<span class="chip ghost">' + h(topicOf(q).title) + '</span></div>';
      html += '</div></div>';
    });
    html += '</div>';
    paint(html);
  }

  /* ---------- 错题本 ---------- */
  function wrongView() {
    var list = QUESTIONS.filter(function (q) { return MB.store.needsReview(q.id); });
    var html = '<h1>错题本</h1>';
    html += '<p class="lede">规则：做错过、且还没连续做对两次的题都留在这里。</p>';
    if (!list.length) {
      html += '<div class="card"><div class="empty">空的。要不去 <a href="#/bank">题库</a> 做几题？</div></div>';
      return paint(html);
    }
    html += '<div class="row" style="margin-bottom:16px"><button class="primary" data-act="start" data-title="错题重做" data-ids="' +
      list.map(function (q) { return q.id; }).join(',') + '">全部重做（' + list.length + ' 题）</button></div>';
    html += '<div class="card">';
    list.forEach(function (q) {
      var r = MB.store.rec(q.id);
      html += '<div class="qrow"><div class="qt">';
      html += '<a href="#/q/' + q.id + '"><b>' + q.id + '</b>　' + q.prompt + '</a>';
      html += '<div class="qmeta"><span class="chip d3">错 ' + r.wrong + ' 次</span>' +
        '<span class="chip kp">' + h(q.kp) + '</span>' +
        '<span class="chip ghost">' + h(topicOf(q).title) + '</span></div>';
      if (r.answer) html += '<div class="small muted" style="margin-top:6px">上次你答：' + h(r.answer) + '</div>';
      html += '</div></div>';
    });
    html += '</div>';
    paint(html);
  }

  /* ---------- 统计 ---------- */
  function statsView() {
    var s = totals();
    var html = '<h1>统计</h1>';
    html += '<div class="card"><div class="row" style="gap:26px">';
    html += '<div><div class="small muted">总题数</div><div style="font-size:22px;font-weight:700">' + s.total + '</div></div>';
    html += '<div><div class="small muted">做过</div><div style="font-size:22px;font-weight:700">' + s.attempted + '</div></div>';
    html += '<div><div class="small muted">已掌握</div><div style="font-size:22px;font-weight:700">' + s.mastered + '</div></div>';
    html += '<div><div class="small muted">待复习</div><div style="font-size:22px;font-weight:700">' + s.wrong + '</div></div>';
    html += '</div></div>';

    html += '<h2>按板块</h2><div class="card"><table><thead><tr><th>板块</th><th>题数</th><th>做过</th><th>掌握</th><th>正确率</th></tr></thead><tbody>';
    LESSONS.forEach(function (t) {
      var qs = qsOfTopic(t.id);
      var attempts = 0, correct = 0, done = 0, m = 0;
      qs.forEach(function (q) {
        var r = MB.store.rec(q.id);
        attempts += r.attempts; correct += r.correct;
        if (r.attempts > 0) done++;
        if (MB.store.isMastered(q.id)) m++;
      });
      html += '<tr><td><a href="#/learn/' + t.id + '">' + h(t.title) + '</a></td>' +
        '<td class="num">' + qs.length + '</td><td class="num">' + done + '</td>' +
        '<td class="num">' + m + '</td><td class="num">' + (attempts ? pct(correct, attempts) + '%' : '—') + '</td></tr>';
    });
    html += '</tbody></table></div>';

    html += '<h2>按知识点</h2><div class="card"><table><thead><tr><th>知识点</th><th>题数</th><th>做过</th><th>正确率</th></tr></thead><tbody>';
    var kpMap = {};
    QUESTIONS.forEach(function (q) {
      var key = q.kp;
      if (!kpMap[key]) kpMap[key] = { n: 0, done: 0, attempts: 0, correct: 0, topic: q.topic, section: q.section };
      var o = kpMap[key], r = MB.store.rec(q.id);
      o.n++; if (r.attempts > 0) o.done++;
      o.attempts += r.attempts; o.correct += r.correct;
    });
    Object.keys(kpMap).forEach(function (k) {
      var o = kpMap[k];
      html += '<tr><td><a href="#/learn/' + o.topic + (o.section ? '#' + o.section : '') + '">' + h(k) + '</a></td>' +
        '<td class="num">' + o.n + '</td><td class="num">' + o.done + '</td>' +
        '<td class="num">' + (o.attempts ? pct(o.correct, o.attempts) + '%' : '—') + '</td></tr>';
    });
    html += '</tbody></table></div>';

    html += '<div class="card"><div class="spread"><div class="small muted">进度存在本浏览器的 localStorage 里，换浏览器就没了。</div>' +
      '<button data-act="reset">清空全部进度</button></div></div>';
    paint(html);
  }

  /* ---------- 事件 ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!el) return;
    var act = el.getAttribute('data-act');
    if (act === 'pick') return doPick(Number(el.getAttribute('data-i')));
    if (act === 'check') return doCheck();
    if (act === 'retry') return doRetry();
    if (act === 'next') return doNext();
    if (act === 'hint') return doHint();
    if (act === 'skip') return doSkip();
    if (act === 'reveal') return doReveal();
    if (act === 'self-ok') return doSelf(true);
    if (act === 'self-bad') return doSelf(false);
    if (act === 'reset') {
      if (window.confirm('清空所有做题记录？这个操作不能撤销。')) { MB.store.reset(); route(); }
      return;
    }
    if (act === 'start') {
      var ids = (el.getAttribute('data-ids') || '').split(',').filter(Boolean);
      return startSession(ids, el.getAttribute('data-title') || '练习');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'textarea') return;
    if (!S) return;
    if (S.checked) { e.preventDefault(); doNext(); }
    else if (tag === 'input') { e.preventDefault(); doCheck(); }
  });

  window.addEventListener('hashchange', function () { route(); markNav(); });

  route();
  markNav();
})();
