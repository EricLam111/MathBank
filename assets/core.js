/* MathBank 核心：数学表达式求值、答案判分、进度存储
 * 不依赖任何第三方库，不使用 eval。 */
(function () {
  'use strict';
  var MB = (window.MB = window.MB || {});

  /* ================= 1. 表达式解析（递归下降） ================= */
  var FUNCS = {
    sqrt: Math.sqrt, abs: Math.abs, exp: Math.exp,
    ln: Math.log, log: Math.log10, lg: Math.log10,
    sin: Math.sin, cos: Math.cos, tan: Math.tan,
    asin: Math.asin, acos: Math.acos, atan: Math.atan,
    sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
    floor: Math.floor, ceil: Math.ceil, round: Math.round
  };
  var CONSTS = { pi: Math.PI, e: Math.E };

  var SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';

  /* 从 s[i]=='{' 开始读一个花括号组，返回 {inner, end} */
  function readGroup(s, i) {
    if (s[i] !== '{') return null;
    var depth = 0;
    for (var j = i; j < s.length; j++) {
      if (s[j] === '{') depth++;
      else if (s[j] === '}') {
        depth--;
        if (depth === 0) return { inner: s.slice(i + 1, j), end: j + 1 };
      }
    }
    return { inner: s.slice(i + 1), end: s.length };
  }

  /* 把常见 LaTeX 片段翻成可解析的文本 */
  function convertLatex(s) {
    var out = '', i = 0;
    var simple = {
      '\\pi': 'pi', '\\cdot': '*', '\\times': '*', '\\div': '/', '\\infty': 'inf',
      '\\left': '', '\\right': '', '\\,': '', '\\;': '', '\\!': '', '\\ ': '', '\\(': '', '\\)': ''
    };
    while (i < s.length) {
      if (s.substr(i, 5) === '\\frac') {
        var a = readGroup(s, i + 5);
        if (a) {
          var b = readGroup(s, a.end);
          if (b) { out += '((' + convertLatex(a.inner) + ')/(' + convertLatex(b.inner) + '))'; i = b.end; continue; }
        }
      }
      if (s.substr(i, 5) === '\\sqrt') {
        var c = readGroup(s, i + 5);
        if (c) { out += 'sqrt(' + convertLatex(c.inner) + ')'; i = c.end; continue; }
      }
      var hit = null;
      for (var k in simple) { if (s.substr(i, k.length) === k) { hit = k; break; } }
      if (hit) { out += simple[hit]; i += hit.length; continue; }
      out += s[i]; i++;
    }
    return out;
  }

  function normalizeInput(text) {
    var t = String(text == null ? '' : text).trim();
    if (!t) return '';
    /* 全角 → 半角 */
    t = t.replace(/[\uFF01-\uFF5E]/g, function (c) {
      return String.fromCharCode(c.charCodeAt(0) - 0xFEE0);
    }).replace(/\u3000/g, ' ');
    /* 根号：√3 → sqrt(3) */
    t = t.replace(/√\s*\(/g, 'sqrt(').replace(/√\s*([0-9]+(?:\.[0-9]+)?)/g, 'sqrt($1)');
    t = convertLatex(t);
    /* 上标字符：x² → x^2 */
    t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, function (m) {
      var d = '';
      for (var i = 0; i < m.length; i++) d += SUP.indexOf(m[i]);
      return '^' + d;
    });
    t = t.replace(/[×·⋅]/g, '*').replace(/÷/g, '/')
      .replace(/[−–—]/g, '-')
      .replace(/π/g, 'pi').replace(/∞/g, 'inf')
      .replace(/\*\*/g, '^');
    return t.replace(/\s+/g, '');
  }

  function tokenize(s) {
    var toks = [], i = 0;
    while (i < s.length) {
      var c = s[i];
      if ((c >= '0' && c <= '9') || c === '.') {
        var j = i;
        while (j < s.length && ((s[j] >= '0' && s[j] <= '9') || s[j] === '.')) j++;
        var raw = s.slice(i, j);
        if ((raw.match(/\./g) || []).length > 1) throw new Error('数字写法有问题：' + raw);
        toks.push({ t: 'num', v: parseFloat(raw) });
        i = j; continue;
      }
      if (/[A-Za-z]/.test(c)) {
        var j2 = i;
        while (j2 < s.length && /[A-Za-z]/.test(s[j2])) j2++;
        toks.push({ t: 'id', v: s.slice(i, j2).toLowerCase() });
        i = j2; continue;
      }
      if ('+-*/^(),'.indexOf(c) >= 0) { toks.push({ t: c }); i++; continue; }
      throw new Error('看不懂这个字符：' + c);
    }
    return toks;
  }

  function parse(toks) {
    var p = 0;
    function peek() { return toks[p]; }
    function eat() { return toks[p++]; }

    function expr() {
      var node = term();
      for (;;) {
        var tk = peek();
        if (tk && (tk.t === '+' || tk.t === '-')) { eat(); node = { op: tk.t, a: node, b: term() }; }
        else break;
      }
      return node;
    }
    function startsFactor(tk) { return !!tk && (tk.t === 'num' || tk.t === 'id' || tk.t === '('); }
    function term() {
      var node = factor();
      for (;;) {
        var tk = peek();
        if (tk && (tk.t === '*' || tk.t === '/')) { eat(); node = { op: tk.t, a: node, b: factor() }; }
        else if (startsFactor(tk)) { node = { op: '*', a: node, b: factor() }; } /* 隐式乘法 2pi、3(1+2) */
        else break;
      }
      return node;
    }
    function factor() {
      var tk = peek();
      if (tk && tk.t === '-') { eat(); return { op: 'neg', a: factor() }; }
      if (tk && tk.t === '+') { eat(); return factor(); }
      return power();
    }
    function power() {
      var base = atom();
      if (peek() && peek().t === '^') { eat(); return { op: '^', a: base, b: factor() }; }
      return base;
    }
    function atom() {
      var tk = eat();
      if (!tk) throw new Error('算式不完整');
      if (tk.t === 'num') return { op: 'num', v: tk.v };
      if (tk.t === 'id') {
        if (peek() && peek().t === '(') {
          eat();
          var arg = expr();
          var close = eat();
          if (!close || close.t !== ')') throw new Error('括号没配对');
          if (!FUNCS[tk.v]) throw new Error('不支持函数 ' + tk.v + '（可用 sqrt、abs、exp、ln、log、sin、cos、tan…）');
          return { op: 'fn', name: tk.v, a: arg };
        }
        if (Object.prototype.hasOwnProperty.call(CONSTS, tk.v)) return { op: 'num', v: CONSTS[tk.v] };
        throw new Error('看不懂符号 ' + tk.v + '（常数只认 pi 和 e）');
      }
      if (tk.t === '(') {
        var e = expr();
        var c = eat();
        if (!c || c.t !== ')') throw new Error('括号没配对');
        return e;
      }
      throw new Error('算式里有不认识的东西');
    }

    var node = expr();
    if (p < toks.length) throw new Error('算式没写完');
    return node;
  }

  function evalNode(n) {
    switch (n.op) {
      case 'num': return n.v;
      case 'neg': return -evalNode(n.a);
      case '+': return evalNode(n.a) + evalNode(n.b);
      case '-': return evalNode(n.a) - evalNode(n.b);
      case '*': return evalNode(n.a) * evalNode(n.b);
      case '/': return evalNode(n.a) / evalNode(n.b);
      case '^': return Math.pow(evalNode(n.a), evalNode(n.b));
      case 'fn': return FUNCS[n.name](evalNode(n.a));
      default: throw new Error('内部错误：未知运算');
    }
  }

  function evaluate(text) {
    var s = normalizeInput(text);
    if (!s) throw new Error('还没写答案');
    return evalNode(parse(tokenize(s)));
  }

  function tryEvaluate(text) {
    try {
      var v = evaluate(text);
      if (typeof v !== 'number' || !isFinite(v)) return { ok: false, error: '结果不是有限实数' };
      return { ok: true, value: v };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  /* ================= 2. 判分 ================= */
  function normText(s) {
    return String(s == null ? '' : s)
      .replace(/[\s\u3000]/g, '')
      .replace(/[$\\{}]/g, '')
      .replace(/[，。、；：！？,.;:!?"'“”‘’`]/g, '')
      .replace(/[（）()]/g, '')
      .replace(/×/g, '*')
      .toLowerCase();
  }

  function expectedNumbers(q) {
    var vals = Array.isArray(q.value) ? q.value : [q.value];
    var out = [];
    for (var i = 0; i < vals.length; i++) {
      var v = vals[i];
      if (typeof v === 'number') { out.push(v); continue; }
      if (v == null) continue;
      var r = tryEvaluate(String(v));
      if (r.ok) out.push(r.value);
    }
    return out;
  }

  function checkAnswer(q, raw) {
    if (q.type === 'choice') {
      var idx = Number(raw);
      return { ok: idx === q.answer, kind: 'choice' };
    }
    if (q.type === 'self') return { ok: null, kind: 'self' };

    var text = normText(raw);
    if (!text) return { ok: false, kind: 'empty', error: '还没写答案' };

    var accepts = (q.accept || []).map(normText);
    if (accepts.indexOf(text) >= 0) return { ok: true, kind: 'text' };

    var r = tryEvaluate(raw);
    if (!r.ok) return { ok: false, kind: 'parse', error: r.error };

    var exps = expectedNumbers(q);
    if (!exps.length) return { ok: false, kind: 'nokey', error: '这道题的标准答案不是数值' };

    var tol = q.tol == null ? 1e-3 : q.tol;
    var hit = false;
    for (var i = 0; i < exps.length; i++) {
      if (Math.abs(r.value - exps[i]) <= tol * Math.max(1, Math.abs(exps[i]))) { hit = true; break; }
    }
    return { ok: hit, kind: 'number', got: r.value, exp: exps[0] };
  }

  /* ================= 3. 进度存储 ================= */
  var KEY = 'mathbank.progress.v1';
  var cache = null;

  function readAll() {
    if (cache) return cache;
    try { cache = JSON.parse(window.localStorage.getItem(KEY) || '{}') || {}; }
    catch (e) { cache = {}; }
    return cache;
  }
  function persist() {
    try { window.localStorage.setItem(KEY, JSON.stringify(readAll())); }
    catch (e) { /* 隐私模式之类，静默失败 */ }
  }
  function blank() { return { attempts: 0, correct: 0, streak: 0, last: null, wrong: 0, answer: '', seen: 0 }; }
  function rec(qid) {
    var all = readAll();
    return all[qid] || blank();
  }
  function record(qid, ok, rawAnswer) {
    var all = readAll();
    var r = all[qid] || (all[qid] = blank());
    r.attempts += 1;
    r.last = !!ok;
    r.seen = Date.now();
    if (rawAnswer != null) r.answer = String(rawAnswer).slice(0, 240);
    if (ok) { r.correct += 1; r.streak += 1; }
    else { r.streak = 0; r.wrong += 1; }
    persist();
    return r;
  }
  function isMastered(qid) { return rec(qid).streak >= 2; }        /* 连对两次算掌握 */
  function needsReview(qid) { var r = rec(qid); return r.wrong > 0 && r.streak < 2; }
  function reset() { cache = {}; persist(); }

  MB.math = { evaluate: evaluate, tryEvaluate: tryEvaluate, normalize: normalizeInput };
  MB.check = checkAnswer;
  MB.normText = normText;
  MB.store = {
    rec: rec, record: record, isMastered: isMastered, needsReview: needsReview, reset: reset,
    all: readAll
  };
})();
