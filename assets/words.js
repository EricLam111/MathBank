/* 背单词：自己往词库里塞词，然后**看着单词照着打**，无限循环重复，靠手指记忆背。
 * 规则：题面直接把单词摆出来 → 你照打一遍 → 打对自动进下一题，打错立刻标出哪个字母错、再来一遍。
 *      所有词轮着来，一轮走完自动重排下一轮；打对 5 次标记「已打熟」。 */
(function () {
  'use strict';

  var KEY = 'mathbank.words.v1';
  var MASTER = 5;                 /* 打对几次算打熟 */
  var app = document.getElementById('wordsapp');
  var S = load();
  var Q = null;
  var msg = { text: '', cls: '' };

  /* ================= 存储 ================= */
  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return { words: [] };
      var o = JSON.parse(raw);
      if (!o || !Array.isArray(o.words)) return { words: [] };
      o.words.forEach(function (w) {
        w.attempts = w.attempts || 0;
        w.correct = w.correct || 0;
        w.wrong = w.wrong || 0;
        w.streak = w.streak || 0;
        w.lastSeen = w.lastSeen || 0;
      });
      return o;
    } catch (e) { return { words: [] }; }
  }
  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  }
  function uid() { return 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function byId(id) {
    for (var i = 0; i < S.words.length; i++) if (S.words[i].id === id) return S.words[i];
    return null;
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function norm(x) {
    return String(x).toLowerCase().trim()
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/\s+/g, ' ');
  }
  function sameWord(a, b) { return norm(a) === norm(b); }
  function isMastered(w) { return w.correct >= MASTER; }

  /* ================= 自动中文释义 ================= */
  var GLOSS = window.GLOSSARY || {};
  var translating = false;
  var autoStatus = '';

  /* 先查内置数学词表（准、离线），命中就不用联网 */
  function glossaryLookup(word) {
    var k = String(word).toLowerCase().trim().replace(/\s+/g, ' ');
    if (GLOSS[k]) return GLOSS[k];
    var base = k.replace(/ies$/, 'y').replace(/(es|s)$/, '');
    if (base !== k && GLOSS[base]) return GLOSS[base];
    return null;
  }

  /* 在线翻译结果的清洗：过滤掉「原样返回英文」「一整句」「乱码」 */
  function cleanMT(t, word) {
    if (!t) return null;
    var s = String(t).trim().replace(/^[.．。、,，:：;；\s]+/, '').replace(/\s+/g, '');
    if (!s) return null;
    if (!/[\u4e00-\u9fff]/.test(s)) return null;
    if (s.length > 20) return null;
    if (s.toLowerCase() === String(word).toLowerCase()) return null;
    return s;
  }

  /* 带超时的 JSON 请求（离线/被墙时快速失败，不卡住页面） */
  function fetchJSON(url, ms) {
    return new Promise(function (resolve, reject) {
      var done = false;
      var ctrl = window.AbortController ? new window.AbortController() : null;
      var timer = window.setTimeout(function () {
        if (done) return;
        done = true;
        if (ctrl) { try { ctrl.abort(); } catch (e) {} }
        reject(new Error('timeout'));
      }, ms || 8000);
      window.fetch(url, ctrl ? { signal: ctrl.signal } : {}).then(function (r) {
        return r.json();
      }).then(function (j) {
        if (done) return;
        done = true; window.clearTimeout(timer); resolve(j);
      }).catch(function (e) {
        if (done) return;
        done = true; window.clearTimeout(timer); reject(e);
      });
    });
  }

  /* 查不到就联网翻译（MyMemory，免费且允许跨域）；结果会被写回词条缓存 */
  function translateWord(word) {
    var hit = glossaryLookup(word);
    if (hit) return Promise.resolve({ zh: hit, src: 'dict' });
    var url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(word) + '&langpair=en%7Czh-CN';
    return fetchJSON(url).then(function (j) {

      var t = j && j.responseData && j.responseData.translatedText;
      var clean = cleanMT(t, word);
      return clean ? { zh: clean, src: 'auto' } : null;
    }).catch(function () { return null; });
  }

  function srcBadge(w) {
    if (!w.zh) return '';
    if (w.zhSrc === 'dict') return '<span class="src dict">词典</span>';
    if (w.zhSrc === 'auto') return '<span class="src auto">自动</span>';
    return '<span class="src manual">自填</span>';
  }

  function zhCell(w) {
    if (!w.zh) return '<span class="muted">' + (w.zhTried ? '未查到' : '待翻译') + '</span>';
    return esc(w.zh) + srcBadge(w);
  }

  function setAutoStatus(t) {
    autoStatus = t;
    var el = document.getElementById('autostat');
    if (el) el.textContent = t;
  }

  /* 重绘但保住正在输入的内容和焦点 */
  function safeRender() {
    var el = document.getElementById('wans');
    var val = el ? el.value : '';
    var focused = el && document.activeElement === el;
    render();
    var el2 = document.getElementById('wans');
    if (el2) {
      if (val) el2.value = val;
      if (focused) focusInput();
    }
  }

  /* 把所有缺中文的词补上：先查词表，再联网翻译；结果写回 localStorage 缓存 */
  function autoFill() {
    if (translating) return;
    var todo = S.words.filter(function (w) { return !w.zh; });
    if (!todo.length) {
      setAutoStatus(S.words.length ? '所有词都有中文了 ✓' : '词库是空的');
      return;
    }
    translating = true;
    var i = 0, filled = 0, failed = 0;
    function step() {
      if (i >= todo.length) {
        translating = false;
        save();
        setAutoStatus('翻译完成：成功 ' + filled + ' 个' +
          (failed ? '，没查到 ' + failed + ' 个（可以点词条上的“释义”手填）' : ''));
        safeRender();
        return;
      }
      var w = todo[i++];
      setAutoStatus('正在翻译 ' + i + '/' + todo.length + '：' + w.en);
      translateWord(w.en).then(function (res) {
        if (res && res.zh) {
          w.zh = res.zh;
          w.zhSrc = res.src;
          delete w.zhTried;
          filled++;
          save();
          /* 正在考的就是这个词：直接把中文贴上去，不打断打字 */
          if (Q && Q.cur && Q.cur.id === w.id) {
            var row = document.querySelector('.prompt .word-row');
            if (row && !row.querySelector('.zh')) {
              var sp = document.createElement('span');
              sp.className = 'zh';
              sp.textContent = res.zh;
              row.appendChild(sp);
            }
          }
        } else {
          w.zhTried = Date.now();
          failed++;
          save();
        }
        window.setTimeout(step, 220);
      });
    }
    step();
  }

  /* ================= 队列 ================= */
  function refill() {
    var ids = [];
    for (var i = 0; i < S.words.length; i++) {
      var w = S.words[i];
      if (Q.mode === 'weak' && isMastered(w)) continue;
      ids.push(w.id);
    }
    Q.queue = shuffle(ids);
    Q.round++;
    return Q.queue.length;
  }

  function pick() {
    Q.typed = ''; Q.wrong = 0;
    for (var guard = 0; guard < 10000; guard++) {
      if (!Q.queue.length) {
        if (!refill()) { Q.cur = null; return; }
      }
      var id = Q.queue.shift();
      var w = byId(id);
      if (w && (Q.mode === 'all' || !isMastered(w))) { Q.cur = w; return; }
    }
    Q.cur = null;
  }

  function startQueue() {
    if (!Q) Q = { queue: [], round: 0, cur: null, typed: '', wrong: 0, session: { asked: 0, right: 0 }, mode: 'all' };
    Q.queue = []; Q.round = 0;
    pick();
  }

  function enqueueNew(ids) {
    if (!ids || !ids.length) return;
    if (!Q) { startQueue(); return; }
    var copy = ids.slice();
    shuffle(copy);
    copy.forEach(function (id) {
      Q.queue.splice(Math.floor(Math.random() * (Q.queue.length + 1)), 0, id);
    });
    if (!Q.cur) pick();
  }

  /* ================= 答题 ================= */
  function submit() {
    var w = Q && Q.cur;
    if (!w) return;
    var input = document.getElementById('wans');
    var typed = (input ? input.value : '').trim();
    if (!typed) { focusInput(); return; }

    if (sameWord(typed, w.en)) {
      w.attempts++; w.correct++; w.streak++; w.lastSeen = Date.now();
      save();
      Q.session.asked++; Q.session.right++;
      Q.typed = ''; Q.wrong = 0;
      Q.phase = 'ok';
      render();
      window.setTimeout(function () {
        if (Q && Q.phase === 'ok') { pick(); Q.phase = 'ask'; render(); focusInput(); }
      }, 420);
      return;
    }

    /* 打错：只提示错在哪，不计入“打对”，让你立刻重来 */
    w.attempts++; w.wrong++; w.lastSeen = Date.now();
    save();
    Q.session.asked++;
    Q.wrong++;
    Q.typed = typed;
    Q.phase = 'bad';
    render();
    focusInput();
  }

  function skip() {
    if (!Q || !Q.cur) return;
    Q.queue.push(Q.cur.id);     /* 放到队尾，本轮还会再见到 */
    pick(); Q.phase = 'ask';
    render(); focusInput();
  }

  function focusInput() {
    var el = document.getElementById('wans');
    if (!el) return;
    el.focus();
    el.select();
  }

  function setMode(m) {
    if (!Q) startQueue();
    Q.mode = m;
    Q.queue = [];
    pick(); Q.phase = 'ask';
    render(); focusInput();
  }

  /* ================= 解析与增删 ================= */
  function parseLine(line) {
    var s = String(line || '').trim();
    if (!s) return null;
    s = s.replace(/^\d+\s*[.)、:]\s*/, '');
    var parts = s.split(/\t|,|，|;|；|\s{2,}/);
    if (parts.length >= 2 && parts[0].trim()) {
      return { en: parts[0].trim(), zh: parts.slice(1).join(' ').trim() };
    }
    var i = s.search(/[\u4e00-\u9fff]/);
    if (i > 0) return { en: s.slice(0, i).trim(), zh: s.slice(i).trim() };
    if (i === 0) return null;
    return { en: s, zh: '' };
  }

  function addFromTextarea() {
    var ta = document.getElementById('wadd');
    if (!ta) return;
    var lines = ta.value.split(/\r?\n/);
    var seen = {};
    S.words.forEach(function (w) { seen[w.en.toLowerCase()] = true; });
    var added = 0, dup = 0, newIds = [];
    lines.forEach(function (line) {
      var p = parseLine(line);
      if (!p) return;
      var key = p.en.toLowerCase();
      if (seen[key]) { dup++; return; }
      seen[key] = true;
      var id = uid();
      S.words.push({
        id: id, en: p.en, zh: p.zh,
        attempts: 0, correct: 0, wrong: 0, streak: 0, lastSeen: 0, created: Date.now()
      });
      newIds.push(id);
      added++;
    });
    if (added) {
      save();
      ta.value = '';
      msg = { text: '添加了 ' + added + ' 个词' + (dup ? '，跳过重复 ' + dup + ' 个' : '') + '，已排进循环队列', cls: 'ok' };
      enqueueNew(newIds);
    autoFill();
    } else {
      msg = { text: dup ? ('这 ' + dup + ' 个词已经在库里了') : '没读到单词，检查一下格式', cls: 'bad' };
    }
    render(); focusInput();
  }

  function addSample() {
    var sample = [
      ['analysis', '分析；解析'], ['limit', '极限'], ['sequence', '数列'],
      ['series', '级数'], ['converge', '收敛'], ['diverge', '发散'],
      ['continuous', '连续的'], ['differentiable', '可导的'], ['derivative', '导数'],
      ['integral', '积分'], ['bounded', '有界的'], ['monotone', '单调的'],
      ['theorem', '定理'], ['lemma', '引理'], ['corollary', '推论'],
      ['interval', '区间'], ['neighborhood', '邻域'], ['accumulation point', '聚点'],
      ['supremum', '上确界'], ['infimum', '下确界']
    ];
    var seen = {};
    S.words.forEach(function (w) { seen[w.en.toLowerCase()] = true; });
    var newIds = [];
    sample.forEach(function (p) {
      if (seen[p[0]]) return;
      seen[p[0]] = true;
      var id = uid();
      S.words.push({ id: id, en: p[0], zh: p[1], attempts: 0, correct: 0, wrong: 0, streak: 0, lastSeen: 0, created: Date.now() });
      newIds.push(id);
    });
    save();
    msg = {
      text: newIds.length ? ('已载入 ' + newIds.length + ' 个示例词（数学分析常用词）') : '示例词都已经在库里了',
      cls: newIds.length ? 'ok' : 'bad'
    };
    enqueueNew(newIds);
    autoFill();
    render(); focusInput();
  }

  function removeWord(id) {
    S.words = S.words.filter(function (w) { return w.id !== id; });
    if (Q) {
      Q.queue = Q.queue.filter(function (x) { return x !== id; });
      if (Q.cur && Q.cur.id === id) { Q.cur = null; pick(); }
    }
    save();
    render(); focusInput();
  }

  function editWord(id) {
    var w = byId(id);
    if (!w) return;
    var zh = window.prompt('给 ' + w.en + ' 写个释义（留空也可以）', w.zh || '');
    if (zh === null) return;
    w.zh = zh.trim();
    w.zhSrc = 'manual';
    delete w.zhTried;
    save();
    render(); focusInput();
  }

  function exportJSON() {
    try {
      var blob = new Blob([JSON.stringify({ words: S.words }, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'words.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      msg = { text: '已导出 words.json', cls: 'ok' };
    } catch (e) {
      msg = { text: '导出失败：' + e.message, cls: 'bad' };
    }
    render();
  }

  /* ================= 渲染 ================= */
  function stat(k, v) {
    return '<div><div class="k">' + esc(k) + '</div><div class="v">' + esc(v) + '</div></div>';
  }

  function letterHTML(typed, answer) {
    var t = String(typed || ''), a = String(answer || '');
    var n = Math.max(t.length, a.length);
    var out = '<div class="letters">';
    for (var i = 0; i < n; i++) {
      var tc = t[i] || '';
      var ac = a[i] || '';
      var cls = tc && tc.toLowerCase() === ac.toLowerCase() ? 'hit' : (tc ? 'miss' : '');
      out += '<span class="' + cls + '">' + (tc ? esc(tc) : '·') + '</span>';
    }
    return out + '</div>';
  }

  function quizHTML() {
    if (!S.words.length) {
      return '<div class="quiz"><div class="empty-bank">' +
        '<div style="font-size:16px;font-weight:600;color:var(--ink)">词库还是空的</div>' +
        '<p style="margin:8px 0 0">把你的单词贴进下面的输入框（一行一个），然后就在这里一遍遍照着打。</p>' +
        '<button class="primary" data-act="sample">先载入 20 个示例词试试</button>' +
        '</div></div>';
    }

    var w = Q && Q.cur;
    if (!w) {
      return '<div class="quiz"><div class="empty-bank">' +
        '<div style="font-size:16px;font-weight:600;color:var(--ink)">这一批都打熟了</div>' +
        '<p style="margin:8px 0 0">「只练待巩固」模式下没有待练的词了，切回全部循环继续磨。</p>' +
        '<button class="primary" data-act="mode" data-mode="all">切回全部循环</button>' +
        '</div></div>';
    }

    var html = '<div class="quiz">';
    html += '<div class="quiz-top">';
    html += '<div class="quiz-round">第 ' + Q.round + ' 轮 · 队列还剩 ' + Q.queue.length + ' 词' +
      (Q.session.asked ? ' · 本轮已打 ' + Q.session.asked + ' 遍' : '') + '</div>';
    html += '<div class="mode-toggle">' +
      '<button data-act="mode" data-mode="all"' + (Q.mode === 'all' ? ' class="on"' : '') + '>全部循环</button>' +
      '<button data-act="mode" data-mode="weak"' + (Q.mode === 'weak' ? ' class="on"' : '') + '>只练没打熟的</button>' +
      '</div></div>';

    /* 题面：把单词本身摆出来，照着打 */
    html += '<div class="prompt">';
    html += '<div class="word-row"><span class="word">' + esc(w.en) + '</span>' +
      (w.zh
        ? '<span class="zh">' + esc(w.zh) + '</span>' + srcBadge(w)
        : '<span class="zh zh-missing">' + (translating ? '（正在翻译…）' : (w.zhTried ? '（没查到中文，可点“释义”手填）' : '（等待翻译）')) + '</span>') +
      '</div>';
    html += '<div class="meta">' + w.en.replace(/[^A-Za-z]/g, '').length + ' 个字母 · 已打对 ' + w.correct + ' 次' +
      (w.streak ? ' · 连对 ' + w.streak : '') + ' · 目标 ' + MASTER + ' 次</div>';
    html += '</div>';


    if (Q.phase === 'bad' && Q.typed) {
      html += letterHTML(Q.typed, w.en);
    }

    if (Q.phase === 'ok') {
      html += '<div class="verdict ok">✔ 打对了　<b>' + esc(w.en) + '</b>' +
        '<br><span style="font-size:13px">这是第 ' + w.correct + ' 次打对' +
        (w.correct >= MASTER ? '（已打熟 ✓）' : '，还差 ' + (MASTER - w.correct) + ' 次') + '</span></div>';
    } else {
      if (Q.phase === 'bad') {
        html += '<div class="hintline">标红的字母错了，整词重打一遍。</div>';
      }
      html += '<div class="answer-row"><input id="wans" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"' +
        ' value="" placeholder="照着上面打一遍，回车下一题">' +
        '<button class="primary" data-act="submit">打好了</button>' +
        '<button data-act="skip">跳过</button></div>';
    }

    html += '</div>';
    return html;
  }

  function bankHTML() {
    var total = S.words.length;
    var mastered = S.words.filter(isMastered).length;
    var typedTimes = 0;
    S.words.forEach(function (w) { typedTimes += w.correct; });

    var html = '<div class="wstat">' +
      stat('词库', total) + stat('已打熟', mastered) + stat('待巩固', total - mastered) +
      stat('累计打对', typedTimes) + stat('轮次', Q ? Q.round : 0) +
      '</div>';

    html += '<div class="bank-head"><h2>词库管理</h2><div class="row">' +
      '<button data-act="fill">补全缺失的中文</button>' +
      '<button data-act="export">导出 JSON</button>' +
      '<button data-act="wipe">清空词库</button></div></div>' +
      '<div class="autostat" id="autostat">' + esc(autoStatus) + '</div>';

    html += '<div class="card addbox">' +
      '<textarea id="wadd" placeholder="一行一个词，直接粘贴多行也行：&#10;derivative 导数&#10;sequence,数列&#10;converge"></textarea>' +
      '<div class="addrow"><button class="primary" data-act="add">添加到词库</button>' +
      '<span class="hint">格式：<code>word</code>、<code>word 中文</code>、<code>word,中文</code>；<code>Enter</code> 直接添加，<code>Shift+Enter</code> 换行。</span></div>' +
      '<div class="addmsg ' + esc(msg.cls) + '">' + esc(msg.text) + '</div>' +
      '</div>';

    if (total) {
      html += '<div class="card"><table class="wtable"><thead><tr>' +
        '<th>单词</th><th>释义</th><th>打对</th><th class="hide-sm">打错</th><th class="hide-sm">连对</th><th></th>' +
        '</tr></thead><tbody>';
      S.words.forEach(function (w) {
        var pct = Math.min(100, Math.round(100 * w.correct / MASTER));
        html += '<tr>' +
          '<td class="en">' + esc(w.en) + '</td>' +
          '<td class="zh">' + zhCell(w) + '</td>' +
          '<td class="num"><span class="streak-dots">' + bar(pct) + '</span> ' + w.correct + '</td>' +
          '<td class="num hide-sm">' + w.wrong + '</td>' +
          '<td class="num hide-sm">' + w.streak + '</td>' +
          '<td class="num"><button data-act="edit" data-id="' + w.id + '">释义</button> ' +
          '<button data-act="del" data-id="' + w.id + '">删</button></td>' +
          '</tr>';
      });
      html += '</tbody></table></div>';
    }
    return html;
  }

  function bar(pct) {
    var on = Math.round(pct / 100 * 5);
    var out = '';
    for (var i = 0; i < 5; i++) out += '<i' + (i < on ? ' class="on"' : '') + '></i>';
    return out;
  }

  function render() {
    app.innerHTML = quizHTML() + bankHTML();
    document.title = S.words.length ? ('背单词 · ' + S.words.length + ' 词') : '背单词 · 照着打循环练习';
  }

  /* ================= 事件 ================= */
  app.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var t = e.target;
    if (t && t.id === 'wadd') { if (e.shiftKey) return; e.preventDefault(); addFromTextarea(); return; }
    if (t && t.id === 'wans') { e.preventDefault(); submit(); return; }
  });

  app.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!el) return;
    var act = el.getAttribute('data-act');
    if (act === 'submit') return submit();
    if (act === 'skip') return skip();
    if (act === 'add') return addFromTextarea();
    if (act === 'sample') return addSample();
    if (act === 'fill') return autoFill();
    if (act === 'mode') return setMode(el.getAttribute('data-mode'));
    if (act === 'edit') return editWord(el.getAttribute('data-id'));
    if (act === 'del') return removeWord(el.getAttribute('data-id'));
    if (act === 'export') return exportJSON();
    if (act === 'wipe') {
      if (window.confirm('清空整个词库？这个操作不能撤销。')) {
        S = { words: [] }; save(); Q = null;
        msg = { text: '词库已清空', cls: 'bad' };
        startQueue(); render();
      }
      return;
    }
  });

  /* ================= 启动 ================= */
  startQueue();
  Q.phase = 'ask';
  render();
  focusInput();
  autoFill();
})();
